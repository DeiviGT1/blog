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
        "title_en": "Level 0 — Fundamentals",
        "short_en": "Fundamentals",
        "short": "Fundamentos",
        "color": "#7B1D32",
        "accent": "#F9EAED",
        "modules": [
            {"id": "nivel0_modulo01_interfaz",   "title": "La interfaz de Excel 365", "title_en": "The Excel 365 interface"},
            {"id": "nivel0_modulo02_shortcuts",   "title": "Atajos esenciales", "title_en": "Essential shortcuts"},
            {"id": "nivel0_modulo03_estructura",  "title": "Estructura de datos", "title_en": "Data structure"},
            {"id": "nivel0_modulo04_formato",     "title": "Formato y presentación", "title_en": "Formatting and presentation"},
            {"id": "nivel0_modulo05_nombrado",    "title": "Nombrado y organización", "title_en": "Naming and organization"},
            {"id": "nivel0_modulo06_mentalidad",  "title": "Mentalidad Excel", "title_en": "The Excel mindset"},
        ],
        "xlsx": ["nivel0_ejemplos.xlsx", "nivel0_practica.xlsx"],
    },
    "nivel1": {
        "level_num": 1,
        "title": "Nivel 1 — Básico",
        "title_en": "Level 1 — Basic",
        "short_en": "Basic",
        "short": "Básico",
        "color": "#1565C0",
        "accent": "#E3F2FD",
        "modules": [
            {"id": "nivel1_modulo01_tipos_datos", "title": "Tipos de datos", "title_en": "Data types"},
            {"id": "nivel1_modulo02_formulas",    "title": "Fórmulas y operadores", "title_en": "Formulas and operators"},
            {"id": "nivel1_modulo03_references",  "title": "Referencias", "title_en": "References"},
            {"id": "nivel1_modulo04_funciones",   "title": "Funciones esenciales", "title_en": "Essential functions"},
            {"id": "nivel1_modulo05_conditional", "title": "Formato condicional", "title_en": "Conditional formatting"},
            {"id": "nivel1_modulo06_sort_filter", "title": "Ordenar y filtrar", "title_en": "Sort and filter"},
            {"id": "nivel1_modulo07_charts",      "title": "Gráficos básicos", "title_en": "Basic charts"},
        ],
        "xlsx": ["nivel1_ejemplos.xlsx", "nivel1_practica.xlsx"],
    },
    "nivel2": {
        "level_num": 2,
        "title": "Nivel 2 — Intermedio",
        "title_en": "Level 2 — Intermediate",
        "short_en": "Intermediate",
        "short": "Intermedio",
        "color": "#2E7D32",
        "accent": "#E8F5E9",
        "modules": [
            {"id": "nivel2_modulo01_absolute_refs",  "title": "Referencias absolutas y mixtas", "title_en": "Absolute and mixed references"},
            {"id": "nivel2_modulo02_condicionales",  "title": "Funciones condicionales", "title_en": "Conditional functions"},
            {"id": "nivel2_modulo03_sumifs",         "title": "SUMIFS y agregación", "title_en": "SUMIFS and aggregation"},
            {"id": "nivel2_modulo04_texto",          "title": "Funciones de texto", "title_en": "Text functions"},
            {"id": "nivel2_modulo05_fechas",         "title": "Funciones de fecha", "title_en": "Date functions"},
            {"id": "nivel2_modulo06_validation",     "title": "Validación de datos", "title_en": "Data validation"},
            {"id": "nivel2_modulo07_named_ranges",   "title": "Rangos nombrados", "title_en": "Named ranges"},
            {"id": "nivel2_modulo08_pivottables",    "title": "Tablas dinámicas", "title_en": "PivotTables"},
            {"id": "nivel2_modulo09_charts_adv",     "title": "Gráficos avanzados", "title_en": "Advanced charts"},
        ],
        "xlsx": ["nivel2_ejemplos.xlsx", "nivel2_practica.xlsx"],
    },
    "nivel3": {
        "level_num": 3,
        "title": "Nivel 3 — Avanzado",
        "title_en": "Level 3 — Advanced",
        "short_en": "Advanced",
        "short": "Avanzado",
        "color": "#E65100",
        "accent": "#FFF3E0",
        "modules": [
            {"id": "nivel3_modulo01_xlookup",        "title": "XLOOKUP", "title_en": "XLOOKUP"},
            {"id": "nivel3_modulo02_index_match",    "title": "INDEX / MATCH", "title_en": "INDEX / MATCH"},
            {"id": "nivel3_modulo03_dynamic_arrays", "title": "Arrays dinámicos", "title_en": "Dynamic arrays"},
            {"id": "nivel3_modulo04_pivot_adv",      "title": "Tablas dinámicas avanzadas", "title_en": "Advanced PivotTables"},
            {"id": "nivel3_modulo05_power_query",    "title": "Power Query", "title_en": "Power Query"},
            {"id": "nivel3_modulo06_dashboards",     "title": "Dashboards", "title_en": "Dashboards"},
            {"id": "nivel3_modulo07_proteccion",     "title": "Protección y seguridad", "title_en": "Protection and security"},
            {"id": "nivel3_modulo08_colaboracion",   "title": "Colaboración en Excel", "title_en": "Collaborating in Excel"},
        ],
        "xlsx": ["nivel3_ejemplos.xlsx", "nivel3_practica.xlsx"],
    },
    "nivel4": {
        "level_num": 4,
        "title": "Nivel 4 — Excel Pro",
        "title_en": "Level 4 — Excel Pro",
        "short_en": "Excel Pro",
        "short": "Excel Pro",
        "color": "#4A148C",
        "accent": "#F3E5F5",
        "modules": [
            {"id": "nivel4_modulo01_macros",          "title": "Macros", "title_en": "Macros"},
            {"id": "nivel4_modulo02_vba",             "title": "VBA básico", "title_en": "VBA basics"},
            {"id": "nivel4_modulo03_power_pivot",     "title": "Power Pivot", "title_en": "Power Pivot"},
            {"id": "nivel4_modulo04_fuentes_externas","title": "Fuentes de datos externas", "title_en": "External data sources"},
            {"id": "nivel4_modulo05_pq_avanzado",     "title": "Power Query avanzado", "title_en": "Advanced Power Query"},
            {"id": "nivel4_modulo06_certificacion",   "title": "Certificación", "title_en": "Certification"},
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


# ── UI language (es/en) ───────────────────────────────────────────────────────
# Vive en session["ui_lang"] (sin prefijo curso_ para que sobreviva al logout).
# Se cambia con /curso/idioma/<code> o con ?lang=en en cualquier URL del curso.

UI_LANGS = ("es", "en")


def get_lang() -> str:
    lang = session.get("ui_lang")
    return lang if lang in UI_LANGS else "es"


def tr(es: str, en: str) -> str:
    """Devuelve el texto en el idioma activo."""
    return en if get_lang() == "en" else es


def loc(obj, key):
    """Campo localizado de un dict: usa key_en si el idioma es inglés y existe."""
    if get_lang() == "en" and obj.get(f"{key}_en"):
        return obj[f"{key}_en"]
    return obj.get(key)


@curso_bp.before_request
def _lang_from_query():
    lang = request.args.get("lang")
    if lang in UI_LANGS:
        session["ui_lang"] = lang


@curso_bp.context_processor
def _inject_i18n():
    return {"lang": get_lang(), "t": tr, "loc": loc}


@curso_bp.route("/idioma/<code>")
def set_lang(code):
    if code in UI_LANGS:
        session["ui_lang"] = code
    nxt = request.args.get("next", "")
    # Solo rutas internas del curso (evita open redirect)
    if not nxt.startswith("/curso") or nxt.startswith("//"):
        nxt = url_for("curso.landing")
    return redirect(nxt)


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
        "label_en": "Level 1 — Basic",
        "short_en": "Basic",
        "description_en": "Data types, formulas, references, essential functions, conditional formatting, filters and charts.",
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
        "label_en": "Level 2 — Intermediate",
        "short_en": "Intermediate",
        "description_en": "Absolute references, conditionals, SUMIFS, text, dates, validation, named ranges, PivotTables and advanced charts.",
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
        "label_en": "Level 3 — Advanced",
        "short_en": "Advanced",
        "description_en": "XLOOKUP, INDEX/MATCH, dynamic arrays, advanced PivotTables, Power Query, dashboards, protection and collaboration.",
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
        "label_en": "Level 4 — Excel Pro",
        "short_en": "Excel Pro",
        "description_en": "Macros, VBA, Power Pivot, external sources, advanced Power Query and certification prep.",
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
        "label_en": "Full Course",
        "short_en": "All inclusive",
        "description_en": "Access to all 4 levels (30 modules), practice files and assignment reviews. Save $20 vs buying separately.",
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


def _accessible_levels(user_id: str) -> set:
    """Niveles que el usuario puede usar: comprados, gratis o con algún módulo
    habilitado por el admin. El admin los ve todos."""
    if session.get("curso_is_admin"):
        return set(LEVELS)
    from app.python.supabase_client import get_user_permissions
    enabled = get_user_permissions(user_id)
    levels = _get_purchased_levels(user_id)
    levels |= {lk for lk, lv in LEVELS.items() if any(m["id"] in enabled for m in lv["modules"])}
    return levels


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
            flash(tr("Inicia sesión para continuar.", "Log in to continue."), "warning")
            return redirect(url_for("curso.login"))
        return f(*args, **kwargs)
    return decorated


PROFILE_RECHECK_SECONDS = 600


def _refresh_profile(force: bool = False) -> bool:
    """Vuelve a leer el perfil de la base cada 10 min (o siempre con force):
    un usuario revocado o un admin degradado pierde el acceso sin esperar a que
    cierre sesión. Devuelve False si la sesión ya no es válida."""
    import time
    now = int(time.time())
    if not force and now - session.get("curso_checked_at", 0) < PROFILE_RECHECK_SECONDS:
        return True
    try:
        from app.python.supabase_client import get_profile
        profile = get_profile(session["curso_user_id"])
    except Exception:
        logger.exception("No se pudo revalidar el perfil")
        return not force  # si la base falla, no se tumba a todos; el admin sí se exige
    if not profile:
        _clear_session()
        return False
    session["curso_is_admin"]    = bool(profile.get("is_admin"))
    session["curso_is_approved"] = bool(profile.get("is_approved"))
    session["curso_checked_at"]  = now
    return True


def require_approved(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("curso_user_id") or not _refresh_profile():
            return redirect(url_for("curso.login"))
        if not session.get("curso_is_admin") and not session.get("curso_is_approved"):
            return redirect(url_for("curso.pending"))
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("curso_user_id") or not _refresh_profile(force=True) \
                or not session.get("curso_is_admin"):
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
    session["curso_checked_at"]  = 0
    session.permanent = True  # expira (PERMANENT_SESSION_LIFETIME), no vive para siempre
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
    email    = user.email or ""
    username = (user.user_metadata or {}).get("username") or \
               (user.user_metadata or {}).get("full_name") or \
               (email.split("@")[0] if email else "estudiante")

    profile = get_profile(user_id)

    admin_email = (current_app.config.get("ADMIN_EMAIL") or "").strip().lower()
    # El correo de admin solo cuenta si está confirmado (base compartida con otras apps)
    is_admin    = bool(admin_email and email.lower() == admin_email and getattr(user, "email_confirmed_at", None)) \
                  or bool(profile and profile.get("is_admin", False))

    if not profile:
        # Cuentas nuevas quedan aprobadas: el pago reemplaza la aprobación manual
        is_approved = True
        create_or_update_profile(user_id, email, username, is_admin, is_approved)
    else:
        # Si el admin revocó el acceso, se respeta (antes se re-aprobaba en cada login)
        is_approved = bool(profile.get("is_approved")) or is_admin
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
    return is_approved


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
                flash(tr("Correo o contraseña incorrectos.", "Incorrect email or password."), "error")
            elif "email not confirmed" in msg:
                flash(tr("Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.", "You need to confirm your email before logging in. Check your inbox."), "error")
            elif "too many requests" in msg:
                flash(tr("Demasiados intentos. Espera unos minutos e intenta de nuevo.", "Too many attempts. Wait a few minutes and try again."), "error")
            else:
                flash(tr("No se pudo iniciar sesión. Intenta de nuevo.", "Could not log in. Please try again."), "error")

    return render_template("curso/login.html")


@curso_bp.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        if not email:
            flash(tr("Ingresa tu correo electrónico.", "Enter your email address."), "error")
            return render_template("curso/forgot_password.html")
        try:
            from app.python.supabase_client import send_password_reset
            base_url = os.getenv("BASE_URL", "").rstrip("/")
            reset_url = f"{base_url}/curso/auth/reset-callback" if base_url \
                        else url_for("curso.reset_callback", _external=True)
            send_password_reset(email, reset_url)
        except Exception:
            pass  # Don't reveal whether the email exists
        flash(tr("Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña.", "If that email is registered, you'll receive a link to reset your password."), "success")
        return redirect(url_for("curso.login"))
    if request.args.get("expired"):
        flash(tr("Enlace de recuperación inválido o expirado. Pide uno nuevo.", "Invalid or expired reset link. Request a new one."), "error")
    return render_template("curso/forgot_password.html")


@curso_bp.route("/auth/reset-callback")
def reset_callback():
    """Supabase manda aquí al usuario desde el correo de recuperación. El enlace
    puede traer el token de tres formas, según la configuración de Supabase:
      ?token_hash=…&type=recovery  (plantilla de correo personalizada)
      ?code=…                      (PKCE)
      #access_token=…              (flujo implícito: el hash solo lo ve el navegador)
    """
    from app.python.supabase_client import get_client
    token_hash = request.args.get("token_hash")
    code = request.args.get("code")
    try:
        if token_hash:
            resp = get_client().auth.verify_otp({"token_hash": token_hash, "type": "recovery"})
            session["curso_reset_token"] = resp.session.access_token
            return redirect(url_for("curso.reset_password"))
        if code:
            resp = get_client().auth.exchange_code_for_session({
                "auth_code": code, "code_verifier": session.pop("curso_pkce_verifier", None)})
            session["curso_reset_token"] = resp.session.access_token
            return redirect(url_for("curso.reset_password"))
    except Exception:
        logger.exception("reset_callback: enlace inválido")
        flash(tr("Enlace de recuperación inválido o expirado.", "Invalid or expired reset link."), "error")
        return redirect(url_for("curso.forgot_password"))
    # Sin parámetros: el token viene en el hash → lo lee el navegador
    return render_template("curso/reset_callback.html")


@curso_bp.route("/auth/reset-session", methods=["POST"])
def reset_session():
    """Recibe el access_token de recuperación que el navegador sacó del hash."""
    data  = request.get_json(silent=True) or {}
    token = data.get("access_token", "")
    if data.get("type") != "recovery" or not token:
        return {"ok": False}, 400
    from app.python.supabase_client import get_user_from_token
    if not get_user_from_token(token):
        return {"ok": False}, 401
    session["curso_reset_token"] = token
    return {"ok": True}


@curso_bp.route("/reset-password", methods=["GET", "POST"])
def reset_password():
    token = session.get("curso_reset_token")
    if not token:
        flash(tr("Enlace de recuperación inválido o expirado.", "Invalid or expired reset link."), "error")
        return redirect(url_for("curso.login"))

    if request.method == "POST":
        password = request.form.get("password", "")
        confirm  = request.form.get("confirm", "")
        if len(password) < 8:
            flash(tr("La contraseña debe tener al menos 8 caracteres.", "Password must be at least 8 characters."), "error")
            return render_template("curso/reset_password.html")
        if password != confirm:
            flash(tr("Las contraseñas no coinciden.", "Passwords don't match."), "error")
            return render_template("curso/reset_password.html")
        try:
            from app.python.supabase_client import update_user_password
            update_user_password(token, password)
            session.pop("curso_reset_token", None)
            flash(tr("¡Contraseña actualizada! Ya puedes iniciar sesión.", "Password updated! You can log in now."), "success")
            return redirect(url_for("curso.login"))
        except Exception:
            logger.exception("reset_password falló")
            flash(tr("El enlace expiró o ya fue usado. Solicita uno nuevo.", "The link expired or was already used. Request a new one."), "error")
            session.pop("curso_reset_token", None)
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
            flash(tr("Las contraseñas no coinciden.", "Passwords don't match."), "error")
            return render_template("curso/register.html")
        if len(password) < 8:
            flash(tr("La contraseña debe tener al menos 8 caracteres.", "Password must be at least 8 characters."), "error")
            return render_template("curso/register.html")
        try:
            from app.python.supabase_client import sign_up
            sign_up(email, password, username)
            session["curso_verify_email"] = email
            return redirect(url_for("curso.verify_email"))
        except Exception as e:
            msg = str(e)
            if "already registered" in msg or "already exists" in msg:
                flash(tr("Este correo ya esta registrado.", "This email is already registered."), "error")
            else:
                logger.exception("register falló")
                flash(tr("No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.", "Couldn't create the account. Check your details and try again."), "error")

    return render_template("curso/register.html")


@curso_bp.route("/verify-email", methods=["GET", "POST"])
def verify_email():
    email = session.get("curso_verify_email")
    if not email:
        return redirect(url_for("curso.register"))

    if request.method == "POST":
        token = request.form.get("token", "").strip()
        if not token:
            flash(tr("Ingresa el codigo de verificacion.", "Enter the verification code."), "error")
            return render_template("curso/verify_email.html", email=email)
        try:
            from app.python.supabase_client import verify_email_otp
            resp = verify_email_otp(email, token)
            # OTP verified — user is now confirmed, sign them in
            session.pop("curso_verify_email", None)
            if resp.user and resp.session:
                _after_auth(resp.user, resp.session.access_token)
                flash(tr("¡Cuenta verificada! El Nivel 0 ya esta desbloqueado.", "Account verified! Level 0 is now unlocked."), "success")
                return redirect(url_for("curso.dashboard"))
            flash(tr("¡Cuenta verificada! Inicia sesión para entrar.", "Account verified! Log in to continue."), "success")
            return redirect(url_for("curso.login"))
        except Exception as e:
            msg = str(e).lower()
            if "expired" in msg or "invalid" in msg:
                flash(tr("Codigo incorrecto o expirado. Revisa tu correo e intenta de nuevo.", "Incorrect or expired code. Check your email and try again."), "error")
            else:
                flash(tr("No se pudo verificar el codigo. Intenta de nuevo.", "Could not verify the code. Please try again."), "error")
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
        flash(tr("Codigo reenviado. Revisa tu correo.", "Code resent. Check your email."), "success")
    except Exception:
        flash(tr("No se pudo reenviar. Espera unos minutos e intenta de nuevo.", "Could not resend. Wait a few minutes and try again."), "error")
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
        except Exception:
            logger.exception("auth_callback falló")
            flash(tr("No se pudo iniciar sesión con Google. Intenta de nuevo.", "Couldn't sign in with Google. Please try again."), "error")
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
    # Última entrega de cada práctica (vienen ordenadas de la más reciente a la más vieja)
    latest_practice = {}
    for s in submissions:
        if s["module_id"].endswith("_practica"):
            latest_practice.setdefault(s["module_id"], s)
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
        latest_practice=latest_practice,
        bundle_offer=_bundle_offer(purchased),
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
        flash(tr("No tienes acceso a este módulo.", "You don't have access to this module."), "warning")
        return redirect(url_for("curso.dashboard"))

    # Load and transform JSX
    # Fuera de /static a propósito: el contenido pagado solo sale por esta ruta
    modulos_dir = os.path.join(current_app.root_path, "private", "curso", "modulos")
    jsx_path = os.path.join(modulos_dir, f"{module_id}.jsx")
    if get_lang() == "en":
        en_path = os.path.join(modulos_dir + "_en", f"{module_id}.jsx")
        if os.path.exists(en_path):
            jsx_path = en_path
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
        if level_key not in _accessible_levels(session["curso_user_id"]):
            flash(tr("Este nivel no está desbloqueado en tu cuenta.", "This level isn't unlocked on your account."), "warning")
            return redirect(url_for("curso.pricing"))
        from app.python.supabase_client import get_formula_lang
        if get_lang() == "en":
            # Interfaz en inglés → archivo 100% en inglés (textos y fórmulas)
            from app.python.excel_generator_en import generate_excel
            lang = "en"
        else:
            from app.python.excel_generator import generate_excel
            lang = get_formula_lang(session["curso_user_id"])
        try:
            xlsx_bytes = generate_excel(level_key, file_type, lang)
        except ValueError:
            abort(404)
        from flask import Response
        lang_suffix = "_ES" if lang == "es" else "_EN"
        download_name = f"{level_key}_{file_type}{lang_suffix}.xlsx"
        if get_lang() == "en":
            en_type = "examples" if file_type == "ejemplos" else "practice"
            download_name = f"{level_key.replace('nivel', 'level')}_{en_type}.xlsx"
        return Response(
            xlsx_bytes,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )
    abort(404)


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
        flash(tr("Preferencias guardadas correctamente.", "Preferences saved."), "success")
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

    user_id = session["curso_user_id"]
    if is_practica:
        allowed = level_prefix in _accessible_levels(user_id)
    else:
        from app.python.supabase_client import get_user_permissions
        allowed = session.get("curso_is_admin") or module_id in get_user_permissions(user_id)
    if not allowed:
        flash(tr("Este nivel no está desbloqueado en tu cuenta.", "This level isn't unlocked on your account."), "warning")
        return redirect(url_for("curso.dashboard"))

    file = request.files.get("file")
    if not file or file.filename == "":
        flash(tr("Selecciona un archivo.", "Select a file."), "error")
        return redirect(back_url)

    filename = secure_filename(file.filename)
    ext      = os.path.splitext(filename)[1].lower()
    if ext not in (".xlsx", ".xls", ".xlsm"):
        flash(tr("Solo se aceptan archivos Excel (.xlsx, .xls, .xlsm).", "Only Excel files are accepted (.xlsx, .xls, .xlsm)."), "error")
        return redirect(back_url)

    MAX_BYTES = 4 * 1024 * 1024  # Vercel corta las peticiones a 4.5 MB
    file_bytes = file.read()
    if len(file_bytes) > MAX_BYTES:
        flash(tr("El archivo supera el límite de 4 MB.", "The file exceeds the 4 MB limit."), "error")
        return redirect(back_url)

    # Corrección automática (solo prácticas de nivel). Nunca bloquea la entrega.
    auto_result = None
    if is_practica:
        try:
            from app.python.practice_grader import grade_practice
            auto_result = grade_practice(file_bytes, level_prefix, filename, get_lang())
        except Exception:
            logger.exception("practice_grader falló para %s", module_id)

    try:
        from app.python.supabase_client import upload_submission_file, create_submission
        path      = upload_submission_file(user_id, module_id, filename, file_bytes)
        rows      = create_submission(user_id, module_id, path, filename, auto_result)
    except Exception:
        logger.exception("submit: no se pudo guardar la entrega de %s", user_id)
        flash(tr("No se pudo subir el archivo. Intenta de nuevo.", "Couldn't upload the file. Please try again."), "error")
        return redirect(back_url)

    if auto_result and rows:
        return redirect(url_for("curso.entrega", sub_id=rows[0]["id"]))
    flash(tr("¡Entrega enviada correctamente!", "Assignment submitted!"), "success")
    return redirect(back_url)


@curso_bp.route("/entrega/<sub_id>")
@require_approved
def entrega(sub_id):
    """Resultado de la corrección automática de una práctica."""
    if not _valid_uuid(sub_id):
        abort(404)
    from app.python.supabase_client import get_submission
    sub = get_submission(sub_id)
    if not sub or (sub["user_id"] != session["curso_user_id"] and not session.get("curso_is_admin")):
        abort(404)
    result = sub.get("auto_result")
    if not result:
        return redirect(url_for("curso.dashboard"))
    level_key = sub["module_id"].replace("_practica", "")
    return render_template(
        "curso/entrega.html",
        sub=sub,
        result=result,
        level=LEVELS.get(level_key),
        level_key=level_key,
    )


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
        bundle_offer=_bundle_offer(purchased) if user_id else None,
        is_logged_in=bool(user_id),
        stripe_pub_key=os.getenv("STRIPE_PUBLISHABLE_KEY", ""),
    )


def _bundle_offer(purchased: set) -> dict | None:
    """Precio del curso completo para ESTE usuario: nunca más caro que comprar
    por separado los niveles que le faltan. None si no le conviene."""
    missing = [f"nivel{i}" for i in range(1, 5) if f"nivel{i}" not in purchased]
    separate = sum(PRICING[lk]["amount"] for lk in missing)
    amount = min(PRICING["bundle"]["amount"], separate)
    savings = separate - amount
    if len(missing) < 2 or savings <= 0:
        return None
    return {
        "amount": amount,
        "price_display": f"${amount // 100}",
        "savings": f"${savings // 100}",
        "levels": missing,
    }


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

    from app.python.supabase_client import (
        create_purchase, get_recent_pending_purchases, get_user_purchases,
    )
    # Lo ya comprado. Si la base falla NO se vende (podría cobrar dos veces).
    try:
        get_user_purchases(user_id, strict=True)
        purchased = _get_purchased_levels(user_id)
    except Exception:
        logger.exception("checkout: no se pudo leer compras de %s", user_id)
        flash(tr("Error al iniciar el pago. Intenta de nuevo.", "Couldn't start the payment. Please try again."), "error")
        return redirect(url_for("curso.pricing"))

    if product_id != "bundle" and product_id in purchased:
        flash(tr("Ya tienes acceso a este nivel.", "You already have access to this level."), "info")
        return redirect(url_for("curso.dashboard"))
    amount = plan["amount"]
    if product_id == "bundle":
        if all(f"nivel{i}" in purchased for i in range(1, 5)):
            flash(tr("Ya tienes acceso a todos los niveles.", "You already have access to all levels."), "info")
            return redirect(url_for("curso.dashboard"))
        offer = _bundle_offer(purchased)
        if not offer:
            flash(tr("Te sale mejor comprar por separado los niveles que te faltan.",
                     "It's cheaper to buy the levels you're missing separately."), "info")
            return redirect(url_for("curso.pricing"))
        amount = offer["amount"]

    # Si ya abrió un pago para lo mismo hace poco, se reusa (evita pagar dos veces)
    try:
        for p in get_recent_pending_purchases(user_id, product_id):
            old = stripe.checkout.Session.retrieve(p["stripe_session_id"])
            if old.status == "open" and old.amount_total == amount:
                return redirect(old.url, code=303)
            if old.status == "complete":
                _fulfill_checkout(old)
                flash(tr("Ese pago ya se había completado: ya tienes acceso.",
                         "That payment was already completed: you have access."), "info")
                return redirect(url_for("curso.dashboard"))
    except Exception:
        logger.exception("checkout: no se pudo revisar pagos pendientes")

    base_url = os.getenv("BASE_URL", "").rstrip("/")
    success  = f"{base_url}/curso/checkout/success?session_id={{CHECKOUT_SESSION_ID}}" \
               if base_url else url_for("curso.checkout_success", _external=True) + "?session_id={CHECKOUT_SESSION_ID}"
    cancel   = f"{base_url}/curso/pricing" if base_url \
               else url_for("curso.pricing", _external=True)

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=email,
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount,
                    "product_data": {
                        "name": loc(plan, "label"),
                        "description": loc(plan, "description"),
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
        create_purchase(user_id, product_id, amount, checkout_session.id)
        return redirect(checkout_session.url, code=303)
    except Exception as e:
        logger.error("Stripe checkout error: %s", e)
        flash(tr("Error al iniciar el pago. Intenta de nuevo.", "Couldn't start the payment. Please try again."), "error")
        return redirect(url_for("curso.pricing"))


def _sess_get(obj, key, default=None):
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def _fulfill_checkout(sess) -> bool:
    """Cumple una compra pagada. Idempotente: se puede llamar desde el webhook,
    sus reintentos y la página de éxito sin dar nada dos veces. Si algo falla
    lanza excepción (el webhook devuelve 500 y Stripe reintenta)."""
    meta    = _sess_get(sess, "metadata") or {}
    user_id = _sess_get(meta, "user_id")
    product = _sess_get(meta, "product")
    sess_id = _sess_get(sess, "id", "")
    pi      = _sess_get(sess, "payment_intent") or ""
    if _sess_get(sess, "payment_status") != "paid":
        return False
    if not user_id or product not in PRICING:
        logger.warning("Checkout sin metadata válida: session=%s", sess_id)
        return False

    from app.python.supabase_client import complete_purchase, upsert_completed_purchase
    if not complete_purchase(sess_id, pi):
        # No había fila 'pending' (ya completada o se perdió): se asegura la fila
        upsert_completed_purchase(user_id, product, _sess_get(sess, "amount_total") or 0, sess_id, pi)
    _unlock_levels_for_user(user_id, PRICING[product]["levels"])  # upsert: idempotente
    logger.info("Pago cumplido: user=%s product=%s session=%s", user_id, product, sess_id)
    return True


def _revoke_payment(payment_intent: str):
    """Reembolso o disputa: la compra deja de contar y se cierran los niveles
    que ya no cubre ninguna otra compra."""
    from app.python.supabase_client import (
        set_purchase_status_by_payment_intent, get_user_purchases, bulk_set_level_permissions,
    )
    rows = set_purchase_status_by_payment_intent(payment_intent, "refunded")
    for row in rows:
        user_id = row["user_id"]
        still = _get_purchased_levels(user_id)
        for lk in PRICING.get(row["product"], {}).get("levels", []):
            if lk not in still and lk in LEVELS:
                bulk_set_level_permissions(user_id, [m["id"] for m in LEVELS[lk]["modules"]], False, None)
        logger.warning("Compra revocada: user=%s product=%s pi=%s", user_id, row["product"], payment_intent)


@curso_bp.route("/checkout/success")
@require_approved
def checkout_success():
    """Después de pagar: confirma con Stripe y cumple la compra sin esperar al webhook."""
    stripe_session_id = request.args.get("session_id", "")
    status = "pending"
    if stripe_session_id.startswith("cs_"):
        try:
            _init_stripe()
            sess = stripe.checkout.Session.retrieve(stripe_session_id)
            owner = _sess_get(_sess_get(sess, "metadata") or {}, "user_id")
            if owner == session["curso_user_id"] and _fulfill_checkout(sess):
                status = "paid"
        except Exception:
            logger.exception("checkout_success: no se pudo confirmar %s", stripe_session_id)
    return render_template("curso/checkout_success.html", session_id=stripe_session_id, status=status)


@curso_bp.route("/webhook/stripe", methods=["POST"])
def stripe_webhook():
    """Stripe webhook — cumple pagos y revoca reembolsos/disputas."""
    _init_stripe()
    payload = request.get_data()
    sig     = request.headers.get("Stripe-Signature", "")
    secret  = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    if not secret:
        logger.error("STRIPE_WEBHOOK_SECRET no configurada")
        abort(500)

    try:
        event = stripe.Webhook.construct_event(payload, sig, secret)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.warning("Stripe webhook signature failed: %s", e)
        abort(400)

    etype = event["type"]
    obj   = event["data"]["object"]
    if etype in ("checkout.session.completed", "checkout.session.async_payment_succeeded"):
        _fulfill_checkout(obj)  # si falla → 500 → Stripe reintenta
    elif etype == "charge.refunded":
        if _sess_get(obj, "refunded") and _sess_get(obj, "payment_intent"):
            _revoke_payment(_sess_get(obj, "payment_intent"))
    elif etype == "charge.dispute.created":
        if _sess_get(obj, "payment_intent"):
            _revoke_payment(_sess_get(obj, "payment_intent"))

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
