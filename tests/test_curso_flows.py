"""
Flujos del curso con Supabase y Stripe simulados en memoria: acceso al
contenido pagado, entregas, pagos (webhook, página de éxito, reembolsos,
precio del curso completo), sesiones y recuperación de contraseña.

Correr:  SECRET_KEY=test python -m pytest tests/test_curso_flows.py -q
"""
import io
import json
import os
import types

import pytest

os.environ.setdefault("SECRET_KEY", "test")

import app.python.supabase_client as sc  # noqa: E402
from app import create_app  # noqa: E402
from app.routes import curso_routes as cr  # noqa: E402

UID = "11111111-1111-1111-1111-111111111111"
ADMIN = "22222222-2222-2222-2222-222222222222"


class FakeDB:
    def __init__(self):
        self.profiles = {UID: {"id": UID, "is_admin": False, "is_approved": True, "formula_lang": "es"},
                         ADMIN: {"id": ADMIN, "is_admin": True, "is_approved": True, "formula_lang": "es"}}
        self.perms = {}       # (uid, mid) -> enabled
        self.purchases = []   # dicts
        self.subs = []

    # supabase_client API
    def get_profile(self, uid): return self.profiles.get(uid)
    def get_formula_lang(self, uid): return "es"
    def get_user_permissions(self, uid): return {m for (u, m), e in self.perms.items() if u == uid and e}
    def get_all_permissions_for_user(self, uid):
        return [{"module_id": m, "enabled": e} for (u, m), e in self.perms.items() if u == uid]
    def bulk_set_level_permissions(self, uid, mids, enabled, granted_by=None):
        for m in mids:
            self.perms[(uid, m)] = enabled
    def get_user_purchases(self, uid, strict=False):
        return [p for p in self.purchases if p["user_id"] == uid and p["status"] == "completed"]
    def create_purchase(self, uid, product, amount, sid):
        self.purchases.append(dict(user_id=uid, product=product, amount_cents=amount, stripe_session_id=sid,
                                   status="pending", stripe_payment_intent=None, created_at="now"))
    def complete_purchase(self, sid, pi):
        for p in self.purchases:
            if p["stripe_session_id"] == sid and p["status"] == "pending":
                p.update(status="completed", stripe_payment_intent=pi)
                return p
        return None
    def upsert_completed_purchase(self, uid, product, amount, sid, pi):
        for p in self.purchases:
            if p["stripe_session_id"] == sid:
                p.update(status="completed", stripe_payment_intent=pi)
                return
        self.purchases.append(dict(user_id=uid, product=product, amount_cents=amount, stripe_session_id=sid,
                                   status="completed", stripe_payment_intent=pi))
    def get_recent_pending_purchases(self, uid, product, hours=24):
        return [p for p in self.purchases if p["user_id"] == uid and p["product"] == product and p["status"] == "pending"]
    def set_purchase_status_by_payment_intent(self, pi, status):
        out = []
        for p in self.purchases:
            if p["stripe_payment_intent"] == pi and p["status"] == "completed":
                p["status"] = status
                out.append(p)
        return out
    def get_user_submissions(self, uid): return [s for s in self.subs if s["user_id"] == uid]
    def upload_submission_file(self, *a): return "path"
    def create_submission(self, uid, mid, path, fn, auto_result=None):
        row = dict(id="33333333-3333-3333-3333-%012d" % len(self.subs), user_id=uid, module_id=mid,
                   auto_result=auto_result, auto_score=(auto_result or {}).get("score"))
        self.subs.append(row)
        return [row]
    def get_submission(self, sid): return next((s for s in self.subs if s["id"] == sid), None)


@pytest.fixture
def env(monkeypatch):
    db = FakeDB()
    for name in dir(FakeDB):
        if not name.startswith("_") and hasattr(sc, name):
            monkeypatch.setattr(sc, name, getattr(db, name))
    app = create_app()
    app.testing = True
    client = app.test_client()
    db.nivel0 = [m["id"] for m in cr.LEVELS["nivel0"]["modules"]]
    db.bulk_set_level_permissions(UID, db.nivel0, True)
    return types.SimpleNamespace(db=db, c=client, app=app)


def login(c, uid=UID, admin=False):
    with c.session_transaction() as s:
        s.update(curso_user_id=uid, curso_email="a@b.c", curso_username="a",
                 curso_is_admin=admin, curso_is_approved=True, curso_checked_at=0)


# ── Contenido pagado ─────────────────────────────────────────────────────────

def test_paid_content_not_public(env):
    for path in ["/static/curso/modulos/nivel4_modulo01_macros.jsx",
                 "/static/curso/modulos_en/nivel4_modulo02_vba.jsx",
                 "/static/curso/archivos/nivel4_practica.xlsx",
                 "/static/curso/recursos/cheatsheet_nivel4.pdf"]:
        assert env.c.get(path).status_code == 404, path


def test_module_served_only_with_permission(env):
    login(env.c)
    r = env.c.get("/curso/modulo/nivel0_modulo01_interfaz")
    assert r.status_code == 200 and "SECTIONS" in r.get_data(as_text=True)
    r = env.c.get("/curso/modulo/nivel4_modulo01_macros")
    assert r.status_code == 302


def test_download_requires_level(env):
    login(env.c)
    assert env.c.get("/curso/descargar/nivel0_practica.xlsx").status_code == 200
    r = env.c.get("/curso/descargar/nivel4_practica.xlsx")
    assert r.status_code == 302 and "/curso/pricing" in r.headers["Location"]
    assert env.c.get("/curso/descargar/../../run.py").status_code == 404


def test_submit_requires_level(env):
    login(env.c)
    data = {"file": (io.BytesIO(b"x"), "a.xlsx")}
    r = env.c.post("/curso/submit/nivel3_practica", data=data, content_type="multipart/form-data")
    assert r.status_code == 302 and not env.db.subs


# ── Sesiones ─────────────────────────────────────────────────────────────────

def test_revoked_user_and_demoted_admin(env, monkeypatch):
    monkeypatch.setattr(sc, "get_all_submissions", lambda: [])
    login(env.c, ADMIN, admin=True)
    assert env.c.get("/curso/admin/entregas").status_code == 200
    env.db.profiles[ADMIN]["is_admin"] = False  # lo degradan en la base
    assert env.c.get("/curso/admin/entregas").status_code == 403
    login(env.c)
    env.db.profiles[UID]["is_approved"] = False
    r = env.c.get("/curso/dashboard")
    assert r.status_code == 302 and "/curso/pending" in r.headers["Location"]


def test_register_does_not_store_password(env, monkeypatch):
    monkeypatch.setattr(sc, "sign_up", lambda *a: None)
    r = env.c.post("/curso/register", data=dict(email="n@x.com", password="SuperSecret123",
                                               confirm="SuperSecret123", username="n"))
    assert r.status_code == 302
    with env.c.session_transaction() as s:
        assert "SuperSecret123" not in json.dumps(dict(s))


# ── Pagos ────────────────────────────────────────────────────────────────────

def stripe_session(sid="cs_test_1", user=UID, product="nivel2", paid=True, amount=2000):
    return {"id": sid, "metadata": {"user_id": user, "product": product}, "payment_intent": "pi_" + sid,
            "payment_status": "paid" if paid else "unpaid", "amount_total": amount}


def nivel_mids(lk):
    return [m["id"] for m in cr.LEVELS[lk]["modules"]]


def test_fulfill_is_idempotent_and_survives_partial_failure(env, monkeypatch):
    env.db.create_purchase(UID, "nivel2", 2000, "cs_test_1")
    calls = {"n": 0}
    real = env.db.bulk_set_level_permissions

    def flaky(*a, **k):
        calls["n"] += 1
        if calls["n"] == 1:
            raise RuntimeError("supabase blip")
        return real(*a, **k)
    monkeypatch.setattr(sc, "bulk_set_level_permissions", flaky)
    with env.app.test_request_context():
        with pytest.raises(RuntimeError):
            cr._fulfill_checkout(stripe_session())      # 1er intento: falla tras completar la compra
        assert cr._fulfill_checkout(stripe_session())   # reintento de Stripe: desbloquea igual
        assert cr._fulfill_checkout(stripe_session())   # y repetirlo no duplica nada
    assert set(nivel_mids("nivel2")) <= env.db.get_user_permissions(UID)
    assert len(env.db.purchases) == 1


def test_fulfill_without_pending_row_and_unpaid(env):
    with env.app.test_request_context():
        assert cr._fulfill_checkout(stripe_session("cs_lost", product="nivel3", amount=2000))
        assert not cr._fulfill_checkout(stripe_session("cs_unpaid", product="nivel4", paid=False))
    assert set(nivel_mids("nivel3")) <= env.db.get_user_permissions(UID)
    assert not set(nivel_mids("nivel4")) & env.db.get_user_permissions(UID)


def test_webhook_signature_and_refund(env, monkeypatch):
    monkeypatch.delenv("STRIPE_WEBHOOK_SECRET", raising=False)
    assert env.c.post("/curso/webhook/stripe", data=b"{}").status_code == 500
    monkeypatch.setenv("STRIPE_WEBHOOK_SECRET", "whsec_test")
    assert env.c.post("/curso/webhook/stripe", data=b"{}", headers={"Stripe-Signature": "bad"}).status_code == 400

    events = []
    monkeypatch.setattr(cr.stripe.Webhook, "construct_event", lambda p, s, k: events.pop(0))
    events.append({"type": "checkout.session.completed", "data": {"object": stripe_session()}})
    assert env.c.post("/curso/webhook/stripe", data=b"{}").status_code == 200
    assert set(nivel_mids("nivel2")) <= env.db.get_user_permissions(UID)
    events.append({"type": "charge.refunded", "data": {"object": {"refunded": True, "payment_intent": "pi_cs_test_1"}}})
    assert env.c.post("/curso/webhook/stripe", data=b"{}").status_code == 200
    assert not set(nivel_mids("nivel2")) & env.db.get_user_permissions(UID)
    assert env.db.purchases[0]["status"] == "refunded"


def test_success_page_fulfills_only_own_session(env, monkeypatch):
    login(env.c)
    sessions = {"cs_mine": stripe_session("cs_mine"), "cs_other": stripe_session("cs_other", user=ADMIN, product="nivel4")}
    monkeypatch.setattr(cr.stripe.checkout.Session, "retrieve", lambda sid: sessions[sid])
    r = env.c.get("/curso/checkout/success?session_id=cs_mine")
    assert "¡Pago exitoso!" in r.get_data(as_text=True)
    r = env.c.get("/curso/checkout/success?session_id=cs_other")
    assert "confirmando" in r.get_data(as_text=True)
    assert not set(nivel_mids("nivel4")) & env.db.get_user_permissions(ADMIN)


def test_bundle_offer_never_costs_more_than_missing_levels():
    assert cr._bundle_offer({"nivel0"})["amount"] == 6000
    assert cr._bundle_offer({"nivel0", "nivel1"})["amount"] == 6000          # 20+20+25 = 65 → 60
    assert cr._bundle_offer({"nivel0", "nivel1", "nivel2"}) is None          # 20+25 = 45 < 60: no conviene
    assert cr._bundle_offer({"nivel0", "nivel1", "nivel2", "nivel3", "nivel4"}) is None


def test_checkout_reuses_open_session(env, monkeypatch):
    login(env.c)
    env.db.create_purchase(UID, "nivel1", 1500, "cs_open")
    monkeypatch.setattr(cr.stripe.checkout.Session, "retrieve",
                        lambda sid: types.SimpleNamespace(status="open", amount_total=1500, url="https://stripe/cs_open"))
    created = []
    monkeypatch.setattr(cr.stripe.checkout.Session, "create", lambda **k: created.append(k))
    r = env.c.post("/curso/checkout/nivel1")
    assert r.headers["Location"] == "https://stripe/cs_open" and not created


# ── Recuperar contraseña ─────────────────────────────────────────────────────

def test_reset_password_hash_flow(env, monkeypatch):
    assert "access_token" in env.c.get("/curso/auth/reset-callback").get_data(as_text=True)  # página con JS
    monkeypatch.setattr(sc, "get_user_from_token", lambda t: object() if t == "good" else None)
    assert env.c.post("/curso/auth/reset-session", json={"access_token": "bad", "type": "recovery"}).status_code == 401
    assert env.c.post("/curso/auth/reset-session", json={"access_token": "good", "type": "recovery"}).status_code == 200
    changed = []
    monkeypatch.setattr(sc, "update_user_password", lambda tok, pw: changed.append((tok, pw)))
    r = env.c.post("/curso/reset-password", data={"password": "NuevaClave123", "confirm": "NuevaClave123"})
    assert r.status_code == 302 and changed == [("good", "NuevaClave123")]
