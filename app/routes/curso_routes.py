# app/routes/curso_routes.py
import os
import re
import uuid
import json
import logging
import functools
from flask import (
    Blueprint, render_template, request, redirect,
    url_for, session, flash, abort, send_from_directory, current_app,
    jsonify,
)
from werkzeug.utils import secure_filename
import stripe

curso_bp = Blueprint("curso", __name__, url_prefix="/curso")
logger = logging.getLogger(__name__)

# ── Course module registry ────────────────────────────────────────────────────

LEVELS = {
    "nivel0": {
        "level_num": 0,
        "title": "Nivel 0 — Fundamentos",
        "short": "Fundamentos",
        "color": "#7B1D32",
        "accent": "#F9EAED",
        "modules": [
            {"id": "nivel0_modulo01_interfaz",   "title": "La interfaz de Excel 365"},
            {"id": "nivel0_modulo02_shortcuts",   "title": "Atajos esenciales"},
            {"id": "nivel0_modulo03_estructura",  "title": "Estructura de datos"},
            {"id": "nivel0_modulo04_formato",     "title": "Formato y presentación"},
            {"id": "nivel0_modulo05_nombrado",    "title": "Nombrado y organización"},
            {"id": "nivel0_modulo06_mentalidad",  "title": "Mentalidad Excel"},
        ],
        "xlsx": ["nivel0_ejemplos.xlsx", "nivel0_practica.xlsx"],
    },
    "nivel1": {
        "level_num": 1,
        "title": "Nivel 1 — Básico",
        "short": "Básico",
        "color": "#1565C0",
        "accent": "#E3F2FD",
        "modules": [
            {"id": "nivel1_modulo01_tipos_datos", "title": "Tipos de datos"},
            {"id": "nivel1_modulo02_formulas",    "title": "Fórmulas y operadores"},
            {"id": "nivel1_modulo03_references",  "title": "Referencias"},
            {"id": "nivel1_modulo04_funciones",   "title": "Funciones esenciales"},
            {"id": "nivel1_modulo05_conditional", "title": "Formato condicional"},
            {"id": "nivel1_modulo06_sort_filter", "title": "Ordenar y filtrar"},
            {"id": "nivel1_modulo07_charts",      "title": "Gráficos básicos"},
        ],
        "xlsx": ["nivel1_ejemplos.xlsx", "nivel1_practica.xlsx"],
    },
    "nivel2": {
        "level_num": 2,
        "title": "Nivel 2 — Intermedio",
        "short": "Intermedio",
        "color": "#2E7D32",
        "accent": "#E8F5E9",
        "modules": [
            {"id": "nivel2_modulo01_absolute_refs",  "title": "Referencias absolutas y mixtas"},
            {"id": "nivel2_modulo02_condicionales",  "title": "Funciones condicionales"},
            {"id": "nivel2_modulo03_sumifs",         "title": "SUMIFS y agregación"},
            {"id": "nivel2_modulo04_texto",          "title": "Funciones de texto"},
            {"id": "nivel2_modulo05_fechas",         "title": "Funciones de fecha"},
            {"id": "nivel2_modulo06_validation",     "title": "Validación de datos"},
            {"id": "nivel2_modulo07_named_ranges",   "title": "Rangos nombrados"},
            {"id": "nivel2_modulo08_pivottables",    "title": "Tablas dinámicas"},
            {"id": "nivel2_modulo09_charts_adv",     "title": "Gráficos avanzados"},
        ],
        "xlsx": ["nivel2_ejemplos.xlsx", "nivel2_practica.xlsx"],
    },
    "nivel3": {
        "level_num": 3,
        "title": "Nivel 3 — Avanzado",
        "short": "Avanzado",
        "color": "#E65100",
        "accent": "#FFF3E0",
        "modules": [
            {"id": "nivel3_modulo01_xlookup",        "title": "XLOOKUP"},
            {"id": "nivel3_modulo02_index_match",    "title": "INDEX / MATCH"},
            {"id": "nivel3_modulo03_dynamic_arrays", "title": "Arrays dinámicos"},
            {"id": "nivel3_modulo04_pivot_adv",      "title": "Tablas dinámicas avanzadas"},
            {"id": "nivel3_modulo05_power_query",    "title": "Power Query"},
            {"id": "nivel3_modulo06_dashboards",     "title": "Dashboards"},
            {"id": "nivel3_modulo07_proteccion",     "title": "Protección y seguridad"},
            {"id": "nivel3_modulo08_colaboracion",   "title": "Colaboración en Excel"},
        ],
        "xlsx": ["nivel3_ejemplos.xlsx", "nivel3_practica.xlsx"],
    },
    "nivel4": {
        "level_num": 4,
        "title": "Nivel 4 — Excel Pro",
        "short": "Excel Pro",
        "color": "#4A148C",
        "accent": "#F3E5F5",
        "modules": [
            {"id": "nivel4_modulo01_macros",          "title": "Macros"},
            {"id": "nivel4_modulo02_vba",             "title": "VBA básico"},
            {"id": "nivel4_modulo03_power_pivot",     "title": "Power Pivot"},
            {"id": "nivel4_modulo04_fuentes_externas","title": "Fuentes de datos externas"},
            {"id": "nivel4_modulo05_pq_avanzado",     "title": "Power Query avanzado"},
            {"id": "nivel4_modulo06_certificacion",   "title": "Certificación"},
        ],
        "xlsx": ["nivel4_ejemplos.xlsx", "nivel4_practica.xlsx"],
    },
}

ALL_MODULE_IDS = {
    m["id"]
    for lv in LEVELS.values()
    for m in lv["modules"]
}

MODULE_LOOKUP = {
    m["id"]: {**m, "level_key": lk, **{k: v for k, v in lv.items() if k != "modules"}}
    for lk, lv in LEVELS.items()
    for m in lv["modules"]
}


# ── Pricing configuration ────────────────────────────────────────────────────

PRICING = {
    "nivel1": {
        "amount": 1500,
        "price_display": "$15",
        "label": "Nivel 1 — Básico",
        "short": "Básico",
        "color": "#1565C0",
        "module_count": len(LEVELS["nivel1"]["modules"]),
        "description": "Tipos de datos, fórmulas, referencias, funciones esenciales, formato condicional, filtros y gráficos.",
        "levels": ["nivel1"],
    },
    "nivel2": {
        "amount": 2000,
        "price_display": "$20",
        "label": "Nivel 2 — Intermedio",
        "short": "Intermedio",
        "color": "#2E7D32",
        "module_count": len(LEVELS["nivel2"]["modules"]),
        "description": "Referencias absolutas, condicionales, SUMIFS, texto, fechas, validación, rangos nombrados, tablas dinámicas y gráficos avanzados.",
        "levels": ["nivel2"],
    },
    "nivel3": {
        "amount": 2000,
        "price_display": "$20",
        "label": "Nivel 3 — Avanzado",
        "short": "Avanzado",
        "color": "#E65100",
        "module_count": len(LEVELS["nivel3"]["modules"]),
        "description": "XLOOKUP, INDEX/MATCH, arrays dinámicos, tablas dinámicas avanzadas, Power Query, dashboards, protección y colaboración.",
        "levels": ["nivel3"],
    },
    "nivel4": {
        "amount": 2500,
        "price_display": "$25",
        "label": "Nivel 4 — Excel Pro",
        "short": "Excel Pro",
        "color": "#4A148C",
        "module_count": len(LEVELS["nivel4"]["modules"]),
        "description": "Macros, VBA, Power Pivot, fuentes externas, Power Query avanzado y preparación para certificación.",
        "levels": ["nivel4"],
    },
    "bundle": {
        "amount": 6000,
        "price_display": "$60",
        "label": "Curso Completo",
        "short": "Todo incluido",
        "color": "#1a1a2e",
        "module_count": sum(len(LEVELS[f"nivel{i}"]["modules"]) for i in range(1, 5)),
        "description": "Acceso a los 4 niveles (30 módulos), archivos de práctica y revisión de entregas. Ahorra $20 vs comprar por separado.",
        "levels": ["nivel1", "nivel2", "nivel3", "nivel4"],
        "savings": "$20",
    },
}


# ── Stripe setup ─────────────────────────────────────────────────────────────

def _init_stripe():
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


def _get_purchased_levels(user_id: str) -> set:
    """Return set of level keys the user has access to (free + purchased)."""
    from app.python.supabase_client import get_user_purchases
    purchases = get_user_purchases(user_id)
    levels = {"nivel0"}  # Always free
    for p in purchases:
        product = p["product"]
        if product == "bundle":
            levels.update(["nivel1", "nivel2", "nivel3", "nivel4"])
        elif product in LEVELS:
            levels.add(product)
    return levels


def _unlock_levels_for_user(user_id: str, level_keys: list):
    """Enable all modules for the given levels."""
    from app.python.supabase_client import bulk_set_level_permissions
    for lk in level_keys:
        if lk in LEVELS:
            mids = [m["id"] for m in LEVELS[lk]["modules"]]
            bulk_set_level_permissions(user_id, mids, True, None)


# ── Input validation helpers ──────────────────────────────────────────────────

def _valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(str(value))
        return True
    except (ValueError, AttributeError):
        return False


# ── Auth decorators ───────────────────────────────────────────────────────────

def require_login(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("curso_user_id"):
            flash("Inicia sesión para continuar.", "warning")
            return redirect(url_for("curso.login"))
        return f(*args, **kwargs)
    return decorated


def require_approved(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("curso_user_id"):
            return redirect(url_for("curso.login"))
        if not session.get("curso_is_admin") and not session.get("curso_is_approved"):
            return redirect(url_for("curso.pending"))
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("curso_is_admin"):
            abort(403)
        return f(*args, **kwargs)
    return decorated


# ── Session helpers ───────────────────────────────────────────────────────────

def _save_session(user_id, email, username, is_admin, is_approved, access_token):
    session["curso_user_id"]     = user_id
    session["curso_email"]       = email
    session["curso_username"]    = username
    session["curso_is_admin"]    = is_admin
    session["curso_is_approved"] = is_approved
    session["curso_access_token"]= access_token
    # Cache formula language preference so we don't hit DB on every download
    try:
        from app.python.supabase_client import get_formula_lang
        session["curso_formula_lang"] = get_formula_lang(user_id)
    except Exception:
        session["curso_formula_lang"] = "es"


def _clear_session():
    for key in list(session.keys()):
        if key.startswith("curso_"):
            session.pop(key)


def _after_auth(user, access_token):
    """Called after any successful auth (email or OAuth). Sets up session.
    Auto-approves all users and ensures nivel 0 is unlocked (free tier)."""
    from app.python.supabase_client import (
        get_profile, create_or_update_profile, approve_user,
        set_admin, get_all_permissions_for_user, bulk_set_level_permissions,
    )
    user_id  = user.id
    email    = user.email
    username = (user.user_metadata or {}).get("username") or \
               (user.user_metadata or {}).get("full_name") or \
               email.split("@")[0]

    profile = get_profile(user_id)

    admin_email = current_app.config.get("ADMIN_EMAIL", "")
    is_admin    = email == admin_email or (profile and profile.get("is_admin", False))
    # Auto-approve all users — payment model replaces manual admin gating
    is_approved = True

    if not profile:
        create_or_update_profile(user_id, email, username, is_admin, is_approved)
    else:
        if not profile.get("is_approved"):
            approve_user(user_id)
        if is_admin and not profile.get("is_admin"):
            set_admin(user_id, True)

    # Only create permissions for modules that have NO record at all.
    # Modules with a record (even disabled) were set by admin — don't override.
    all_perms = get_all_permissions_for_user(user_id)
    modules_with_record = {p["module_id"] for p in all_perms}

    nivel0_mids = [m["id"] for m in LEVELS["nivel0"]["modules"]]
    nivel0_new = [mid for mid in nivel0_mids if mid not in modules_with_record]
    if nivel0_new:
        bulk_set_level_permissions(user_id, nivel0_new, True, None)

    purchased = _get_purchased_levels(user_id)
    for lk in purchased:
        if lk != "nivel0":
            lk_mids = [m["id"] for m in LEVELS[lk]["modules"]]
            lk_new = [mid for mid in lk_mids if mid not in modules_with_record]
            if lk_new:
                bulk_set_level_permissions(user_id, lk_new, True, None)

    _save_session(user_id, email, username, is_admin, is_approved, access_token)
    return True  # Always approved


# ── JSX transformer ───────────────────────────────────────────────────────────

def _transform_jsx(raw: str) -> str:
    """
    Prepare a JSX module file for in-browser rendering via Babel standalone.
    - Strips ES module imports (React hooks come from the global React object)
    - Removes 'export default'
    - Appends the ReactDOM render call
    """
    lines = raw.splitlines()
    out   = []
    react_identifiers = set()

    for line in lines:
        stripped = line.strip()
        # Collect React named imports → expose from global React
        if re.match(r"^import\s*\{", stripped) and ('"react"' in stripped or "'react'" in stripped):
            match = re.search(r"\{([^}]+)\}", stripped)
            if match:
                identifiers = [i.strip() for i in match.group(1).split(",")]
                react_identifiers.update(identifiers)
            continue  # skip the import line
        # Skip other import lines
        if re.match(r"^import\b", stripped):
            continue
        # Remove 'export default'
        line = re.sub(r"^export\s+default\s+", "", line)
        out.append(line)

    result = "\n".join(out)

    # Prepend destructured React globals
    if react_identifiers:
        ids = ", ".join(sorted(react_identifiers))
        result = f"const {{ {ids} }} = React;\n\n" + result

    # Append render
    result += "\nReactDOM.createRoot(document.getElementById('react-root')).render(<Module />);\n"
    return result


# ── Public routes ─────────────────────────────────────────────────────────────

@curso_bp.route("/")
def landing():
    if session.get("curso_user_id"):
        return redirect(url_for("curso.dashboard"))
    return render_template("curso/landing.html", levels=LEVELS)


@curso_bp.route("/login", methods=["GET", "POST"])
def login():
    if session.get("curso_user_id"):
        return redirect(url_for("curso.dashboard"))

    if request.method == "POST":
        email    = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        try:
            from app.python.supabase_client import sign_in
            resp = sign_in(email, password)
            approved = _after_auth(resp.user, resp.session.access_token)
            if approved:
                return redirect(url_for("curso.dashboard"))
            return redirect(url_for("curso.pending"))
        except Exception as e:
            msg = str(e).lower()
            if "invalid login credentials" in msg or "invalid_credentials" in msg:
                flash("Correo o contraseña incorrectos.", "error")
            elif "email not confirmed" in msg:
                flash("Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.", "error")
            elif "too many requests" in msg:
                flash("Demasiados intentos. Espera unos minutos e intenta de nuevo.", "error")
            else:
                flash("No se pudo iniciar sesión. Intenta de nuevo.", "error")

    return render_template("curso/login.html")


@curso_bp.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        if not email:
            flash("Ingresa tu correo electrónico.", "error")
            return render_template("curso/forgot_password.html")
        try:
            from app.python.supabase_client import send_password_reset
            base_url = os.getenv("BASE_URL", "").rstrip("/")
            reset_url = f"{base_url}/curso/auth/reset-callback" if base_url \
                        else url_for("curso.reset_callback", _external=True)
            send_password_reset(email, reset_url)
        except Exception:
            pass  # Don't reveal whether the email exists
        flash("Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña.", "success")
        return redirect(url_for("curso.login"))
    return render_template("curso/forgot_password.html")


@curso_bp.route("/auth/reset-callback")
def reset_callback():
    """Supabase redirects here after the user clicks the reset link in their email."""
    code = request.args.get("code")
    if not code:
        flash("Enlace de recuperación inválido o expirado.", "error")
        return redirect(url_for("curso.login"))
    # Store code in session and send user to the form
    session["curso_reset_code"] = code
    return redirect(url_for("curso.reset_password"))


@curso_bp.route("/reset-password", methods=["GET", "POST"])
def reset_password():
    code = session.get("curso_reset_code")
    if not code:
        flash("Enlace de recuperación inválido o expirado.", "error")
        return redirect(url_for("curso.login"))

    if request.method == "POST":
        password = request.form.get("password", "")
        confirm  = request.form.get("confirm", "")
        if len(password) < 8:
            flash("La contraseña debe tener al menos 8 caracteres.", "error")
            return render_template("curso/reset_password.html")
        if password != confirm:
            flash("Las contraseñas no coinciden.", "error")
            return render_template("curso/reset_password.html")
        try:
            from app.python.supabase_client import get_client, update_user_password
            sb   = get_client()
            resp = sb.auth.exchange_code_for_session({"auth_code": code})
            update_user_password(resp.session.access_token, password)
            session.pop("curso_reset_code", None)
            flash("¡Contraseña actualizada! Ya puedes iniciar sesión.", "success")
            return redirect(url_for("curso.login"))
        except Exception as e:
            flash("El enlace expiró o ya fue usado. Solicita uno nuevo.", "error")
            session.pop("curso_reset_code", None)
            return redirect(url_for("curso.forgot_password"))

    return render_template("curso/reset_password.html")


@curso_bp.route("/register", methods=["GET", "POST"])
def register():
    if session.get("curso_user_id"):
        return redirect(url_for("curso.dashboard"))

    if request.method == "POST":
        email    = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        username = request.form.get("username", "").strip()
        confirm  = request.form.get("confirm", "")

        if password != confirm:
            flash("Las contraseñas no coinciden.", "error")
            return render_template("curso/register.html")
        if len(password) < 8:
            flash("La contraseña debe tener al menos 8 caracteres.", "error")
            return render_template("curso/register.html")
        try:
            from app.python.supabase_client import sign_up
            sign_up(email, password, username)
            # Store credentials for post-verification login
            session["curso_verify_email"]    = email
            session["curso_verify_password"] = password
            return redirect(url_for("curso.verify_email"))
        except Exception as e:
            msg = str(e)
            if "already registered" in msg or "already exists" in msg:
                flash("Este correo ya esta registrado.", "error")
            else:
                flash(f"Error al crear la cuenta: {msg}", "error")

    return render_template("curso/register.html")


@curso_bp.route("/verify-email", methods=["GET", "POST"])
def verify_email():
    email = session.get("curso_verify_email")
    if not email:
        return redirect(url_for("curso.register"))

    if request.method == "POST":
        token = request.form.get("token", "").strip()
        if not token:
            flash("Ingresa el codigo de verificacion.", "error")
            return render_template("curso/verify_email.html", email=email)
        try:
            from app.python.supabase_client import verify_email_otp
            resp = verify_email_otp(email, token)
            # OTP verified — user is now confirmed, sign them in
            password = session.pop("curso_verify_password", "")
            session.pop("curso_verify_email", None)
            if resp.user and resp.session:
                _after_auth(resp.user, resp.session.access_token)
                flash("¡Cuenta verificada! El Nivel 0 ya esta desbloqueado.", "success")
                return redirect(url_for("curso.dashboard"))
            # Fallback: sign in with password if OTP didn't return session
            from app.python.supabase_client import sign_in
            login_resp = sign_in(email, password)
            _after_auth(login_resp.user, login_resp.session.access_token)
            flash("¡Cuenta verificada! El Nivel 0 ya esta desbloqueado.", "success")
            return redirect(url_for("curso.dashboard"))
        except Exception as e:
            msg = str(e).lower()
            if "expired" in msg or "invalid" in msg:
                flash("Codigo incorrecto o expirado. Revisa tu correo e intenta de nuevo.", "error")
            else:
                flash("No se pudo verificar el codigo. Intenta de nuevo.", "error")
            return render_template("curso/verify_email.html", email=email)

    return render_template("curso/verify_email.html", email=email)


@curso_bp.route("/verify-email/resend", methods=["POST"])
def resend_verification():
    email = session.get("curso_verify_email")
    if not email:
        return redirect(url_for("curso.register"))
    try:
        from app.python.supabase_client import resend_confirmation
        resend_confirmation(email)
        flash("Codigo reenviado. Revisa tu correo.", "success")
    except Exception:
        flash("No se pudo reenviar. Espera unos minutos e intenta de nuevo.", "error")
    return redirect(url_for("curso.verify_email"))


@curso_bp.route("/auth/google")
def auth_google():
    from app.python.supabase_client import generate_pkce_pair, google_oauth_url
    code_verifier, code_challenge = generate_pkce_pair()
    session["curso_pkce_verifier"] = code_verifier
    base_url = os.getenv("BASE_URL", "").rstrip("/")
    callback = f"{base_url}/curso/auth/callback" if base_url else url_for("curso.auth_callback", _external=True)
    return redirect(google_oauth_url(callback, code_challenge))


@curso_bp.route("/auth/callback")
def auth_callback():
    """
    Handles PKCE code exchange after Google OAuth redirect.
    """
    code = request.args.get("code")
    if code:
        code_verifier = session.pop("curso_pkce_verifier", None)
        try:
            from app.python.supabase_client import get_client
            sb   = get_client()
            resp = sb.auth.exchange_code_for_session({
                "auth_code": code,
                "code_verifier": code_verifier,
            })
            approved = _after_auth(resp.user, resp.session.access_token)
            if approved:
                return redirect(url_for("curso.dashboard"))
            return redirect(url_for("curso.pending"))
        except Exception as e:
            flash(f"Error de autenticación: {e}", "error")
            return redirect(url_for("curso.login"))

    # Fallback — token in URL hash (implicit flow), handled by JS
    return render_template("curso/auth_callback.html")


@curso_bp.route("/auth/session", methods=["POST"])
def auth_session():
    """Receives access_token from the browser JS client (implicit OAuth flow)."""
    data         = request.get_json(silent=True) or {}
    access_token = data.get("access_token", "")
    if not access_token:
        return {"ok": False, "error": "no token"}, 400
    from app.python.supabase_client import get_user_from_token
    user = get_user_from_token(access_token)
    if not user:
        return {"ok": False, "error": "invalid token"}, 401
    approved = _after_auth(user, access_token)
    return {"ok": True, "approved": approved}


@curso_bp.route("/logout")
def logout():
    _clear_session()
    return redirect(url_for("curso.landing"))


@curso_bp.route("/pending")
@require_login
def pending():
    if session.get("curso_is_approved") or session.get("curso_is_admin"):
        return redirect(url_for("curso.dashboard"))
    return render_template("curso/pending.html")


# ── Student routes ────────────────────────────────────────────────────────────

@curso_bp.route("/dashboard")
@require_approved
def dashboard():
    from app.python.supabase_client import get_user_permissions, get_user_submissions
    user_id    = session["curso_user_id"]
    is_admin   = session.get("curso_is_admin", False)
    enabled    = get_user_permissions(user_id) if not is_admin else ALL_MODULE_IDS
    submissions = get_user_submissions(user_id)
    submitted_modules = {s["module_id"] for s in submissions}
    purchased  = {"nivel0", "nivel1", "nivel2", "nivel3", "nivel4"} if is_admin \
                 else _get_purchased_levels(user_id)
    # Treat a level as unlocked if the admin granted any module in it
    for lk, lv in LEVELS.items():
        if any(m["id"] in enabled for m in lv["modules"]):
            purchased.add(lk)
    return render_template(
        "curso/dashboard.html",
        levels=LEVELS,
        enabled_modules=enabled,
        submitted_modules=submitted_modules,
        purchased_levels=purchased,
        is_admin=is_admin,
        pricing=PRICING,
    )


@curso_bp.route("/modulo/<module_id>")
@require_approved
def modulo(module_id):
    if module_id not in MODULE_LOOKUP:
        abort(404)

    # Check permission
    is_admin = session.get("curso_is_admin", False)
    from app.python.supabase_client import get_user_permissions
    enabled = ALL_MODULE_IDS if is_admin else get_user_permissions(session["curso_user_id"])
    if not is_admin and module_id not in enabled:
        flash("No tienes acceso a este módulo.", "warning")
        return redirect(url_for("curso.dashboard"))

    # Load and transform JSX
    jsx_path = os.path.join(
        current_app.root_path, "static", "curso", "modulos", f"{module_id}.jsx"
    )
    if not os.path.exists(jsx_path):
        abort(404)
    with open(jsx_path, "r", encoding="utf-8") as f:
        raw_jsx = f.read()

    transformed = _transform_jsx(raw_jsx)
    meta        = MODULE_LOOKUP[module_id]
    level_key   = meta["level_key"]
    level_data  = LEVELS[level_key]

    # Previous / next module navigation
    all_in_level = [m["id"] for m in level_data["modules"]]
    idx          = all_in_level.index(module_id)
    prev_mod     = all_in_level[idx - 1] if idx > 0 else None
    next_mod     = all_in_level[idx + 1] if idx < len(all_in_level) - 1 else None

    return render_template(
        "curso/modulo.html",
        module_id=module_id,
        meta=meta,
        level_data=level_data,
        level_module_ids=all_in_level,
        jsx_content=transformed,
        prev_mod=prev_mod,
        next_mod=next_mod,
        enabled_modules=enabled,
    )


@curso_bp.route("/keepalive")
def keepalive():
    """Vercel Cron: una consulta ligera diaria para que Supabase (plan gratis)
    no pause el proyecto por inactividad."""
    secret = os.getenv("CRON_SECRET", "")
    if secret and request.headers.get("Authorization") != f"Bearer {secret}":
        abort(401)
    try:
        from app.python.supabase_client import get_admin_client
        get_admin_client().table("curso_profiles").select("id").limit(1).execute()
        return jsonify(ok=True)
    except Exception as e:
        logger.error("keepalive falló: %s", e)
        return jsonify(ok=False), 500


@curso_bp.route("/descargar/<filename>")
@require_approved
def descargar(filename):
    """
    Generate and serve an Excel file on-the-fly in the user's preferred
    formula language (es/en).  Filename format: nivelX_ejemplos.xlsx
    or nivelX_practica.xlsx.  Falls back to static files for anything
    that doesn't match the known pattern.
    """
    import re as _re
    m = _re.match(r"^(nivel\d)_(ejemplos|practica)\.xlsx$", filename, _re.IGNORECASE)
    if m:
        level_key = m.group(1).lower()
        file_type = m.group(2).lower()
        from app.python.supabase_client import get_formula_lang
        from app.python.excel_generator import generate_excel
        lang = get_formula_lang(session["curso_user_id"])
        try:
            xlsx_bytes = generate_excel(level_key, file_type, lang)
        except ValueError:
            abort(404)
        from flask import Response
        lang_suffix = "_ES" if lang == "es" else "_EN"
        download_name = f"{level_key}_{file_type}{lang_suffix}.xlsx"
        return Response(
            xlsx_bytes,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )
    # Fallback: serve pre-existing static file
    safe = secure_filename(filename)
    directory = os.path.join(current_app.root_path, "static", "curso", "archivos")
    return send_from_directory(directory, safe, as_attachment=True)


@curso_bp.route("/perfil", methods=["GET", "POST"])
@require_login
def perfil():
    """User profile settings — formula language preference."""
    from app.python.supabase_client import get_formula_lang, update_formula_lang, get_profile
    user_id = session["curso_user_id"]
    if request.method == "POST":
        lang = request.form.get("formula_lang", "es")
        if lang not in ("es", "en"):
            lang = "es"
        update_formula_lang(user_id, lang)
        session["curso_formula_lang"] = lang
        flash("Preferencias guardadas correctamente.", "success")
        return redirect(url_for("curso.perfil"))
    lang = session.get("curso_formula_lang") or get_formula_lang(user_id)
    profile = get_profile(user_id) or {}
    return render_template("curso/perfil.html",
                           formula_lang=lang,
                           profile=profile)


@curso_bp.route("/submit/<module_id>", methods=["POST"])
@require_approved
def submit(module_id):
    # Accept both regular module IDs and level-practice IDs (e.g. nivel0_practica)
    is_practica = module_id.endswith("_practica")
    if is_practica:
        level_prefix = module_id[: -len("_practica")]
        if level_prefix not in LEVELS:
            abort(404)
    elif module_id not in MODULE_LOOKUP:
        abort(404)

    # Determine where to redirect after submit
    back_url = url_for("curso.dashboard") if is_practica else url_for("curso.modulo", module_id=module_id)

    file = request.files.get("file")
    if not file or file.filename == "":
        flash("Selecciona un archivo.", "error")
        return redirect(back_url)

    filename = secure_filename(file.filename)
    ext      = os.path.splitext(filename)[1].lower()
    if ext not in (".xlsx", ".xls", ".xlsm"):
        flash("Solo se aceptan archivos Excel (.xlsx, .xls, .xlsm).", "error")
        return redirect(back_url)

    MAX_BYTES = 10 * 1024 * 1024  # 10 MB
    file_bytes = file.read()
    if len(file_bytes) > MAX_BYTES:
        flash("El archivo supera el límite de 10 MB.", "error")
        return redirect(back_url)

    try:
        from app.python.supabase_client import upload_submission_file, create_submission
        user_id   = session["curso_user_id"]
        path      = upload_submission_file(user_id, module_id, filename, file_bytes)
        create_submission(user_id, module_id, path, filename)
        flash("¡Entrega enviada correctamente!", "success")
    except Exception as e:
        flash(f"Error al subir el archivo: {e}", "error")

    return redirect(back_url)


# ── Payment routes ────────────────────────────────────────────────────────────

@curso_bp.route("/pricing")
def pricing():
    """Public pricing page showing all plans."""
    user_id   = session.get("curso_user_id")
    purchased = _get_purchased_levels(user_id) if user_id else {"nivel0"}
    return render_template(
        "curso/pricing.html",
        pricing=PRICING,
        levels=LEVELS,
        purchased_levels=purchased,
        is_logged_in=bool(user_id),
        stripe_pub_key=os.getenv("STRIPE_PUBLISHABLE_KEY", ""),
    )


@curso_bp.route("/checkout/<product_id>", methods=["POST"])
@require_approved
def checkout(product_id):
    """Create a Stripe Checkout session and redirect the user."""
    if product_id not in PRICING:
        abort(400)

    _init_stripe()
    user_id = session["curso_user_id"]
    email   = session.get("curso_email", "")
    plan    = PRICING[product_id]

    # Don't allow purchasing already-owned levels
    purchased = _get_purchased_levels(user_id)
    if product_id != "bundle" and product_id in purchased:
        flash("Ya tienes acceso a este nivel.", "info")
        return redirect(url_for("curso.dashboard"))
    if product_id == "bundle" and all(
        f"nivel{i}" in purchased for i in range(1, 5)
    ):
        flash("Ya tienes acceso a todos los niveles.", "info")
        return redirect(url_for("curso.dashboard"))

    base_url = os.getenv("BASE_URL", "").rstrip("/")
    success  = f"{base_url}/curso/checkout/success?session_id={{CHECKOUT_SESSION_ID}}" \
               if base_url else url_for("curso.checkout_success", _external=True) + "?session_id={CHECKOUT_SESSION_ID}"
    cancel   = f"{base_url}/curso/pricing" if base_url \
               else url_for("curso.pricing", _external=True)

    try:
        from app.python.supabase_client import create_purchase
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=email,
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": plan["amount"],
                    "product_data": {
                        "name": plan["label"],
                        "description": plan["description"],
                    },
                },
                "quantity": 1,
            }],
            metadata={
                "user_id": user_id,
                "product": product_id,
            },
            success_url=success,
            cancel_url=cancel,
        )
        # Record pending purchase
        create_purchase(user_id, product_id, plan["amount"], checkout_session.id)
        return redirect(checkout_session.url, code=303)

    except stripe.error.StripeError as e:
        logger.error("Stripe checkout error: %s", e)
        flash("Error al iniciar el pago. Intenta de nuevo.", "error")
        return redirect(url_for("curso.pricing"))


@curso_bp.route("/checkout/success")
@require_approved
def checkout_success():
    """Landing page after successful Stripe payment."""
    stripe_session_id = request.args.get("session_id", "")
    return render_template("curso/checkout_success.html", session_id=stripe_session_id)


@curso_bp.route("/webhook/stripe", methods=["POST"])
def stripe_webhook():
    """Stripe webhook — processes completed payments and unlocks modules."""
    _init_stripe()
    payload   = request.get_data()
    sig       = request.headers.get("Stripe-Signature", "")
    secret    = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    # Verify signature
    try:
        event = stripe.Webhook.construct_event(payload, sig, secret)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.warning("Stripe webhook signature failed: %s", e)
        abort(400)

    # Only handle completed checkout sessions
    if event["type"] == "checkout.session.completed":
        sess     = event["data"]["object"]
        meta     = sess.metadata or {}
        user_id  = meta.get("user_id") if isinstance(meta, dict) else getattr(meta, "user_id", None)
        product  = meta.get("product") if isinstance(meta, dict) else getattr(meta, "product", None)
        sess_id  = sess.id if hasattr(sess, "id") else sess.get("id", "")
        pi       = sess.payment_intent if hasattr(sess, "payment_intent") else sess.get("payment_intent", "")

        if user_id and product and product in PRICING:
            from app.python.supabase_client import complete_purchase
            purchase = complete_purchase(sess_id, pi)
            if purchase:
                # Unlock the purchased level modules
                level_keys = PRICING[product]["levels"]
                _unlock_levels_for_user(user_id, level_keys)
                logger.info("Payment OK: user=%s product=%s", user_id, product)
            else:
                logger.warning("Purchase not found or already completed: session=%s", sess_id)
        else:
            logger.warning("Webhook missing metadata: session=%s", sess_id)

    return jsonify({"status": "ok"}), 200


# ── Admin routes ──────────────────────────────────────────────────────────────

@curso_bp.route("/admin")
@require_admin
def admin_index():
    from app.python.supabase_client import get_all_profiles, get_all_submissions
    profiles    = get_all_profiles()
    submissions = get_all_submissions()
    pending     = [p for p in profiles if not p["is_approved"] and not p["is_admin"]]
    return render_template(
        "curso/admin/index.html",
        profiles=profiles,
        submissions=submissions,
        pending=pending,
        levels=LEVELS,
    )


@curso_bp.route("/admin/usuarios")
@require_admin
def admin_usuarios():
    from app.python.supabase_client import get_all_profiles
    profiles = get_all_profiles()
    return render_template("curso/admin/usuarios.html", profiles=profiles, levels=LEVELS)


@curso_bp.route("/admin/usuarios/<user_id>/aprobar", methods=["POST"])
@require_admin
def admin_aprobar(user_id):
    if not _valid_uuid(user_id):
        abort(400)
    from app.python.supabase_client import approve_user
    approve_user(user_id)
    flash("Usuario aprobado.", "success")
    return redirect(url_for("curso.admin_usuarios"))


@curso_bp.route("/admin/usuarios/<user_id>/revocar", methods=["POST"])
@require_admin
def admin_revocar(user_id):
    if not _valid_uuid(user_id):
        abort(400)
    # Prevent admin from revoking themselves
    if user_id == session.get("curso_user_id"):
        flash("No puedes revocarte a ti mismo.", "error")
        return redirect(url_for("curso.admin_usuarios"))
    from app.python.supabase_client import get_admin_client
    get_admin_client().table("curso_profiles").update({"is_approved": False}).eq("id", user_id).execute()
    flash("Acceso revocado.", "success")
    return redirect(url_for("curso.admin_usuarios"))


@curso_bp.route("/admin/usuarios/<user_id>/modulos", methods=["GET", "POST"])
@require_admin
def admin_modulos_usuario(user_id):
    if not _valid_uuid(user_id):
        abort(400)
    from app.python.supabase_client import (
        get_profile, get_all_permissions_for_user,
        set_module_permission, bulk_set_level_permissions,
    )

    if request.method == "POST":
        action     = request.form.get("action")  # "toggle", "enable_level", "disable_level"
        admin_id   = session["curso_user_id"]

        if action == "toggle":
            mod_id  = request.form.get("module_id")
            if mod_id not in MODULE_LOOKUP:
                abort(400)
            enabled = request.form.get("enabled") == "true"
            set_module_permission(user_id, mod_id, enabled, admin_id)

        elif action in ("enable_level", "disable_level"):
            level_key = request.form.get("level_key")
            if level_key not in LEVELS:
                abort(400)
            enabled   = action == "enable_level"
            mids      = [m["id"] for m in LEVELS[level_key]["modules"]]
            bulk_set_level_permissions(user_id, mids, enabled, admin_id)

        flash("Permisos actualizados.", "success")
        return redirect(url_for("curso.admin_modulos_usuario", user_id=user_id))

    profile     = get_profile(user_id)
    perms       = get_all_permissions_for_user(user_id)
    perm_map    = {p["module_id"]: p["enabled"] for p in perms}
    return render_template(
        "curso/admin/modulos_usuario.html",
        profile=profile,
        levels=LEVELS,
        perm_map=perm_map,
        user_id=user_id,
    )


@curso_bp.route("/admin/entregas")
@require_admin
def admin_entregas():
    from app.python.supabase_client import get_all_submissions, get_submission_download_url
    submissions = get_all_submissions()
    return render_template(
        "curso/admin/entregas.html",
        submissions=submissions,
        get_download_url=get_submission_download_url,
        levels=LEVELS,
        module_lookup=MODULE_LOOKUP,
    )


@curso_bp.route("/admin/entregas/<sub_id>/revisar", methods=["POST"])
@require_admin
def admin_revisar_entrega(sub_id):
    if not _valid_uuid(sub_id):
        abort(400)
    from app.python.supabase_client import update_submission_review
    grade    = request.form.get("grade", "").strip()[:50]       # cap length
    feedback = request.form.get("feedback", "").strip()[:2000]  # cap length
    update_submission_review(sub_id, grade, feedback, session["curso_user_id"])
    flash("Revisión guardada.", "success")
    return redirect(url_for("curso.admin_entregas"))


@curso_bp.route("/admin/ventas")
@require_admin
def admin_ventas():
    from app.python.supabase_client import get_all_purchases
    purchases = get_all_purchases()
    return render_template(
        "curso/admin/ventas.html",
        purchases=purchases,
        pricing=PRICING,
    )
