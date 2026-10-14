# app/python/supabase_client.py
import os
import secrets
import hashlib
import base64
import urllib.parse
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


def get_client() -> Client:
    """Public client — uses anon key. Good for user-scoped auth operations."""
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


def get_admin_client() -> Client:
    """Service-role client — bypasses RLS. Use only in trusted server-side code."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


# ── Auth helpers ────────────────────────────────────────────────────────────

def sign_up(email: str, password: str, username: str):
    sb = get_client()
    return sb.auth.sign_up({
        "email": email,
        "password": password,
        "options": {"data": {"username": username}},
    })


def sign_in(email: str, password: str):
    sb = get_client()
    return sb.auth.sign_in_with_password({"email": email, "password": password})


def get_user_from_token(access_token: str):
    """Validate a JWT and return the Supabase user, or None if invalid."""
    try:
        sb = get_client()
        response = sb.auth.get_user(access_token)
        return response.user
    except Exception:
        return None


def send_password_reset(email: str, redirect_to: str):
    """Send a password-reset email via Supabase."""
    sb = get_client()
    sb.auth.reset_password_for_email(email, {"redirect_to": redirect_to})


def update_user_password(access_token: str, new_password: str):
    """Update the password for the user identified by access_token."""
    sb = get_client()
    sb.auth.set_session(access_token, "")   # attach token to this client instance
    sb.auth.update_user({"password": new_password})


def verify_email_otp(email: str, token: str):
    """Verify a signup OTP code. Returns auth response with user + session."""
    sb = get_client()
    return sb.auth.verify_otp({"email": email, "token": token, "type": "signup"})


def resend_confirmation(email: str):
    """Resend the signup confirmation email."""
    sb = get_client()
    sb.auth.resend({"type": "signup", "email": email})


def generate_pkce_pair() -> tuple[str, str]:
    """Return (code_verifier, code_challenge) for PKCE OAuth flow."""
    code_verifier = base64.urlsafe_b64encode(
        secrets.token_bytes(32)
    ).rstrip(b"=").decode("ascii")
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode("ascii")).digest()
    ).rstrip(b"=").decode("ascii")
    return code_verifier, code_challenge


def google_oauth_url(redirect_to: str, code_challenge: str) -> str:
    """Build the Supabase Google OAuth URL with PKCE challenge."""
    params = urllib.parse.urlencode({
        "provider": "google",
        "redirect_to": redirect_to,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    })
    return f"{SUPABASE_URL}/auth/v1/authorize?{params}"


# ── Profile helpers (use admin client for server-side access) ────────────────

def get_profile(user_id: str) -> dict | None:
    sb = get_admin_client()
    result = sb.table("curso_profiles").select("*").eq("id", user_id).maybe_single().execute()
    return result.data if result else None


def create_or_update_profile(user_id: str, email: str, username: str,
                              is_admin: bool = False, is_approved: bool = False):
    sb = get_admin_client()
    sb.table("curso_profiles").upsert({
        "id": user_id,
        "email": email,
        "username": username,
        "is_admin": is_admin,
        "is_approved": is_approved,
    }).execute()


def update_formula_lang(user_id: str, lang: str):
    """Update the user's preferred formula language ('es' or 'en')."""
    if lang not in ("es", "en"):
        lang = "es"
    sb = get_admin_client()
    sb.table("curso_profiles").update({"formula_lang": lang}).eq("id", user_id).execute()


def get_formula_lang(user_id: str) -> str:
    """Return the user's preferred formula language, defaulting to 'es'."""
    try:
        profile = get_profile(user_id)
        if profile and profile.get("formula_lang") in ("es", "en"):
            return profile["formula_lang"]
    except Exception:
        pass
    return "es"


def approve_user(user_id: str):
    sb = get_admin_client()
    sb.table("curso_profiles").update({"is_approved": True}).eq("id", user_id).execute()


def set_admin(user_id: str, value: bool = True):
    sb = get_admin_client()
    sb.table("curso_profiles").update({"is_admin": value}).eq("id", user_id).execute()


def get_all_profiles() -> list:
    sb = get_admin_client()
    result = sb.table("curso_profiles").select("*").order("created_at", desc=True).execute()
    return result.data or []


# ── Module permission helpers ────────────────────────────────────────────────

def get_user_permissions(user_id: str) -> set:
    """Return a set of enabled module_ids for a user."""
    sb = get_admin_client()
    result = (
        sb.table("curso_module_permissions")
        .select("module_id")
        .eq("user_id", user_id)
        .eq("enabled", True)
        .execute()
    )
    return {row["module_id"] for row in (result.data or [])}


def get_all_permissions_for_user(user_id: str) -> list:
    sb = get_admin_client()
    result = (
        sb.table("curso_module_permissions")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return result.data or []


def set_module_permission(user_id: str, module_id: str, enabled: bool,
                          granted_by: str | None = None):
    sb = get_admin_client()
    sb.table("curso_module_permissions").upsert(
        {
            "user_id": user_id,
            "module_id": module_id,
            "enabled": enabled,
            "granted_by": granted_by,
        },
        on_conflict="user_id,module_id",
    ).execute()


def bulk_set_level_permissions(user_id: str, module_ids: list[str],
                               enabled: bool, granted_by: str | None = None):
    sb = get_admin_client()
    rows = [
        {"user_id": user_id, "module_id": mid,
         "enabled": enabled, "granted_by": granted_by}
        for mid in module_ids
    ]
    sb.table("curso_module_permissions").upsert(
        rows, on_conflict="user_id,module_id"
    ).execute()


# ── Submission helpers ────────────────────────────────────────────────────────

def create_submission(user_id: str, module_id: str,
                      file_path: str, original_filename: str,
                      auto_result: dict | None = None):
    sb = get_admin_client()
    row = {
        "user_id": user_id,
        "module_id": module_id,
        "file_path": file_path,
        "original_filename": original_filename,
    }
    if auto_result is not None:
        import datetime
        row.update({
            "auto_score": auto_result.get("score"),
            "auto_result": auto_result,
            "graded_at": datetime.datetime.utcnow().isoformat(),
        })
    result = sb.table("curso_submissions").insert(row).execute()
    return result.data


def get_submission(submission_id: str) -> dict | None:
    sb = get_admin_client()
    result = (
        sb.table("curso_submissions")
        .select("*")
        .eq("id", submission_id)
        .limit(1)
        .execute()
    )
    return (result.data or [None])[0]


def get_user_submissions(user_id: str) -> list:
    sb = get_admin_client()
    result = (
        sb.table("curso_submissions")
        .select("*")
        .eq("user_id", user_id)
        .order("uploaded_at", desc=True)
        .execute()
    )
    return result.data or []


def get_all_submissions() -> list:
    sb = get_admin_client()
    # Use explicit FK hint because submissions has two FKs to profiles
    result = (
        sb.table("curso_submissions")
        .select("*, profiles:curso_profiles!curso_submissions_user_id_fkey(email, username)")
        .order("uploaded_at", desc=True)
        .execute()
    )
    return result.data or []


def update_submission_review(submission_id: str, grade: str,
                              feedback: str, reviewed_by: str):
    sb = get_admin_client()
    import datetime
    sb.table("curso_submissions").update({
        "grade": grade,
        "feedback": feedback,
        "reviewed": True,
        "reviewed_by": reviewed_by,
        "reviewed_at": datetime.datetime.utcnow().isoformat(),
    }).eq("id", submission_id).execute()


# ── Storage helpers ───────────────────────────────────────────────────────────

STORAGE_BUCKET = "course-submissions"


def upload_submission_file(user_id: str, module_id: str,
                           filename: str, file_bytes: bytes) -> str:
    """Upload file to Supabase Storage. Returns the storage path."""
    import datetime
    ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_name = filename.replace(" ", "_")
    path = f"{user_id}/{module_id}/{ts}_{safe_name}"
    sb = get_admin_client()
    sb.storage.from_(STORAGE_BUCKET).upload(
        path,
        file_bytes,
        {"content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
    )
    return path


def get_submission_download_url(file_path: str) -> str:
    sb = get_admin_client()
    result = sb.storage.from_(STORAGE_BUCKET).create_signed_url(file_path, 3600)
    return result.get("signedURL", "")


# ── Purchase helpers ─────────────────────────────────────────────────────────

def create_purchase(user_id: str, product: str, amount_cents: int,
                    stripe_session_id: str) -> dict:
    sb = get_admin_client()
    result = sb.table("curso_purchases").insert({
        "user_id": user_id,
        "product": product,
        "amount_cents": amount_cents,
        "currency": "usd",
        "stripe_session_id": stripe_session_id,
        "status": "pending",
    }).execute()
    return result.data[0] if result.data else {}


def complete_purchase(stripe_session_id: str,
                      stripe_payment_intent: str) -> dict | None:
    """Mark a pending purchase as completed. Returns the updated row or None."""
    import datetime
    sb = get_admin_client()
    result = (
        sb.table("curso_purchases")
        .update({
            "status": "completed",
            "stripe_payment_intent": stripe_payment_intent,
            "completed_at": datetime.datetime.utcnow().isoformat(),
        })
        .eq("stripe_session_id", stripe_session_id)
        .eq("status", "pending")
        .execute()
    )
    return result.data[0] if result.data else None


def get_user_purchases(user_id: str) -> list:
    """Return all completed purchases for a user."""
    try:
        sb = get_admin_client()
        result = (
            sb.table("curso_purchases")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "completed")
            .order("completed_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception:
        # Table may not exist yet — don't break auth flow
        return []


def get_all_purchases() -> list:
    """Admin: list all purchases with user info."""
    try:
        sb = get_admin_client()
        result = (
            sb.table("curso_purchases")
            .select("*, profiles:curso_profiles!curso_purchases_user_id_fkey(email, username)")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception:
        return []
