"""/closet — app de armario. Páginas estáticas + API JSON.

Identidad: la misma sesión de Supabase del curso (session["curso_user_id"]).
Acceso por invitación (closet_members). Datos con la service role key y
RLS sin políticas, igual que el curso; cada consulta filtra por el usuario
de la sesión. Las fotos van al bucket privado "closet" y se sirven con URL
firmada de una hora.
"""
import io
import os
import uuid
import json
import logging
import functools
from datetime import date

from flask import Blueprint, send_from_directory, redirect, request, jsonify, session, current_app

closet_bp = Blueprint('closet', __name__)
logger = logging.getLogger(__name__)

CLOSET_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'closet')
BUCKET = 'closet'
MAX_PHOTO = 1_500_000      # bytes; el navegador ya la redujo a ~720 px
MAX_DOC = 300_000          # bytes del estado serializado
ALLOWED_CATS = {'top', 'bottom', 'shoes', 'layer'}
ITEM_FIELDS = {'name', 'formality', 'warmth', 'removed', 'last_worn', 'wear_count', 'material'}


def _noindex(resp):
    resp.headers['X-Robots-Tag'] = 'noindex, nofollow'
    resp.headers['Cache-Control'] = 'no-cache'
    return resp


@closet_bp.route('/closet')
def closet_redirect():
    return redirect('/closet/', code=301)


@closet_bp.route('/closet/')
def closet_index():
    return _noindex(send_from_directory(CLOSET_DIR, 'index.html'))


@closet_bp.route('/closet/<path:filename>')
def closet_file(filename):
    if filename.startswith('api/'):
        return jsonify(error='no existe'), 404
    return _noindex(send_from_directory(CLOSET_DIR, filename))


# ── Helpers ──────────────────────────────────────────────────────────────────

def _sb():
    from app.python.supabase_client import get_admin_client
    return get_admin_client()


def _same_origin():
    """Toda escritura debe venir de la propia página (defensa CSRF)."""
    origin = request.headers.get('Origin') or request.headers.get('Referer') or ''
    return request.host in origin


def _member_for(user_id, email):
    """Fila de closet_members del usuario, enlazándola por correo la primera vez."""
    sb = _sb()
    email = (email or '').strip().lower()
    row = sb.table('closet_members').select('*').eq('user_id', user_id).maybe_single().execute()
    row = row.data if row else None
    if not row and email:
        by_mail = sb.table('closet_members').select('*').eq('email', email).maybe_single().execute()
        by_mail = by_mail.data if by_mail else None
        admin_email = (current_app.config.get('ADMIN_EMAIL') or '').strip().lower()
        if not by_mail and admin_email and email == admin_email:
            by_mail = {'email': email, 'is_admin': True, 'display_name': session.get('curso_username') or ''}
        if by_mail:
            by_mail = {**by_mail, 'user_id': user_id}
            sb.table('closet_members').upsert(by_mail, on_conflict='email').execute()
            row = by_mail
    if row:
        sb.table('closet_members').update({'last_seen_at': 'now()'}).eq('email', row['email']).execute()
    return row


def require_member(f):
    @functools.wraps(f)
    def inner(*a, **kw):
        uid = session.get('curso_user_id')
        if not uid:
            return jsonify(error='sin sesión'), 401
        if request.method != 'GET' and not _same_origin():
            return jsonify(error='origen no permitido'), 403
        if request.method != 'GET' and request.content_type and 'multipart' not in request.content_type and not request.is_json:
            return jsonify(error='solo JSON'), 415
        member = session.get('closet_member')
        if not member:
            member = _member_for(uid, session.get('curso_email'))
            if not member:
                return jsonify(error='sin invitación'), 403
            session['closet_member'] = {'email': member['email'], 'is_admin': bool(member.get('is_admin'))}
        request.closet_user = uid
        request.closet_member = session['closet_member']
        return f(*a, **kw)
    return inner


def _item_out(row):
    photo = row.get('photo_path') or ''
    return {
        'id': row['id'], 'type': row['type'], 'cat': row['cat'], 'name': row['name'],
        'color': row.get('color') or {}, 'material': row.get('material') or '',
        'formality': row['formality'], 'warmth': row['warmth'], 'removed': row.get('removed', False),
        'last_worn': row.get('last_worn'), 'wear_count': row.get('wear_count', 0),
        'photo': photo[len('static:'):] if photo.startswith('static:') else (f'/closet/api/photo/{row["id"]}' if photo else None),
    }


# ── Sesión ───────────────────────────────────────────────────────────────────

@closet_bp.route('/closet/api/me')
def api_me():
    uid = session.get('curso_user_id')
    if not uid:
        return jsonify(user=None), 401
    member = session.get('closet_member') or _member_for(uid, session.get('curso_email'))
    if not member:
        return jsonify(user={'email': session.get('curso_email')}, member=False), 403
    session['closet_member'] = {'email': member['email'], 'is_admin': bool(member.get('is_admin'))}
    return jsonify(user={'id': uid, 'email': session.get('curso_email'), 'name': session.get('curso_username') or member.get('display_name') or ''},
                   member=True, admin=bool(member.get('is_admin')))


@closet_bp.route('/closet/api/login', methods=['POST'])
def api_login():
    if not _same_origin() or not request.is_json:
        return jsonify(error='petición inválida'), 400
    data = request.get_json(silent=True) or {}
    email = str(data.get('email', '')).strip()[:200]
    password = str(data.get('password', ''))[:200]
    if not email or not password:
        return jsonify(error='Escribe correo y contraseña.'), 400
    try:
        from app.python.supabase_client import sign_in
        from app.routes.curso_routes import _after_auth
        resp = sign_in(email, password)
        _after_auth(resp.user, resp.session.access_token)
    except Exception as e:  # noqa: BLE001
        msg = str(e).lower()
        if 'invalid' in msg:
            return jsonify(error='Correo o contraseña incorrectos.'), 401
        if 'not confirmed' in msg:
            return jsonify(error='Confirma tu correo primero (revisa la bandeja).'), 401
        logger.warning('closet login: %s', e)
        return jsonify(error='No se pudo iniciar sesión. Intenta de nuevo.'), 502
    session.pop('closet_member', None)
    return api_me()


@closet_bp.route('/closet/api/register', methods=['POST'])
def api_register():
    """Solo correos invitados pueden crear cuenta desde aquí."""
    if not _same_origin() or not request.is_json:
        return jsonify(error='petición inválida'), 400
    data = request.get_json(silent=True) or {}
    email = str(data.get('email', '')).strip().lower()[:200]
    password = str(data.get('password', ''))[:200]
    name = str(data.get('name', '')).strip()[:60]
    if not email or len(password) < 8:
        return jsonify(error='Correo y una contraseña de al menos 8 caracteres.'), 400
    inv = _sb().table('closet_members').select('email').eq('email', email).maybe_single().execute()
    admin_email = (current_app.config.get('ADMIN_EMAIL') or '').strip().lower()
    if not (inv and inv.data) and email != admin_email:
        return jsonify(error='Este correo no tiene invitación.'), 403
    try:
        from app.python.supabase_client import sign_up
        base = os.getenv('BASE_URL', '').rstrip('/') or request.host_url.rstrip('/')
        sign_up(email, password, name or email.split('@')[0], redirect_to=f'{base}/closet/')
    except Exception as e:  # noqa: BLE001
        logger.warning('closet register: %s', e)
        return jsonify(error='No se pudo crear la cuenta. Intenta de nuevo.'), 502
    return jsonify(ok=True, message='Te mandamos un enlace al correo para confirmar la cuenta.')


@closet_bp.route('/closet/api/logout', methods=['POST'])
def api_logout():
    if not _same_origin():
        return jsonify(error='origen no permitido'), 403
    for k in list(session.keys()):
        if k.startswith('curso_') or k.startswith('closet_'):
            session.pop(k)
    return jsonify(ok=True)


@closet_bp.route('/closet/api/invite', methods=['POST'])
@require_member
def api_invite():
    if not request.closet_member.get('is_admin'):
        return jsonify(error='solo el admin'), 403
    data = request.get_json(silent=True) or {}
    email = str(data.get('email', '')).strip().lower()[:200]
    if '@' not in email:
        return jsonify(error='Correo inválido.'), 400
    _sb().table('closet_members').upsert({'email': email, 'invited_by': request.closet_member['email'],
                                          'display_name': str(data.get('name', '')).strip()[:60]}, on_conflict='email').execute()
    return jsonify(ok=True)


# ── Estado y prendas ─────────────────────────────────────────────────────────

@closet_bp.route('/closet/api/state', methods=['GET'])
@require_member
def api_state_get():
    sb = _sb()
    st = sb.table('closet_state').select('doc, updated_at').eq('user_id', request.closet_user).maybe_single().execute()
    items = sb.table('closet_items').select('*').eq('owner_id', request.closet_user).order('created_at').execute()
    return jsonify(doc=(st.data or {}).get('doc') if st else None, updated_at=(st.data or {}).get('updated_at') if st else None,
                   items=[_item_out(r) for r in (items.data or [])])


@closet_bp.route('/closet/api/state', methods=['PUT'])
@require_member
def api_state_put():
    raw = request.get_data()
    if len(raw) > MAX_DOC:
        return jsonify(error='estado demasiado grande'), 413
    doc = request.get_json(silent=True)
    if not isinstance(doc, dict):
        return jsonify(error='JSON inválido'), 400
    doc.pop('added', None)  # las prendas propias viven en closet_items
    _sb().table('closet_state').upsert({'user_id': request.closet_user, 'doc': doc, 'updated_at': 'now()'}).execute()
    return jsonify(ok=True)


@closet_bp.route('/closet/api/items', methods=['POST'])
@require_member
def api_item_create():
    if request.content_type and 'multipart' in request.content_type:
        meta = json.loads(request.form.get('item') or '{}')
        photo = request.files.get('photo')
    else:
        meta = request.get_json(silent=True) or {}
        photo = None
    cat = meta.get('cat')
    if cat not in ALLOWED_CATS or not meta.get('type') or not meta.get('name'):
        return jsonify(error='prenda incompleta'), 400
    item_id = str(uuid.uuid4())
    photo_path = None
    if photo is not None:
        data = photo.read(MAX_PHOTO + 1)
        if len(data) > MAX_PHOTO:
            return jsonify(error='la foto pesa demasiado'), 413
        if not (data[:3] == b'\xff\xd8\xff' or data[:8] == b'\x89PNG\r\n\x1a\n' or data[:4] == b'RIFF'):
            return jsonify(error='la foto no es una imagen válida'), 415
        ctype = 'image/jpeg' if data[:3] == b'\xff\xd8\xff' else 'image/png' if data[:4] == b'\x89PNG' else 'image/webp'
        photo_path = f'{request.closet_user}/{item_id}.{ctype.split("/")[1]}'
        _sb().storage.from_(BUCKET).upload(photo_path, data, {'content-type': ctype, 'cache-control': '31536000'})
    elif str(meta.get('sample_photo', '')).startswith('img/'):
        photo_path = 'static:' + str(meta['sample_photo'])[:80]
    row = {
        'id': item_id, 'owner_id': request.closet_user,
        'type': str(meta['type'])[:30], 'cat': cat, 'name': str(meta['name'])[:80],
        'color': meta.get('color') if isinstance(meta.get('color'), dict) else {},
        'material': str(meta.get('material', ''))[:40],
        'formality': int(meta.get('formality', 2)), 'warmth': int(meta.get('warmth', 2)),
        'photo_path': photo_path,
    }
    res = _sb().table('closet_items').insert(row).execute()
    return jsonify(item=_item_out(res.data[0]))


@closet_bp.route('/closet/api/items/<item_id>', methods=['PATCH'])
@require_member
def api_item_patch(item_id):
    try:
        uuid.UUID(item_id)
    except ValueError:
        return jsonify(error='id inválido'), 400
    data = request.get_json(silent=True) or {}
    patch = {k: v for k, v in data.items() if k in ITEM_FIELDS}
    if 'name' in patch:
        patch['name'] = str(patch['name'])[:80]
    if 'last_worn' in patch and patch['last_worn'] == 'today':
        patch['last_worn'] = date.today().isoformat()
    if not patch:
        return jsonify(error='nada que cambiar'), 400
    res = _sb().table('closet_items').update(patch).eq('id', item_id).eq('owner_id', request.closet_user).execute()
    if not res.data:
        return jsonify(error='no existe'), 404
    return jsonify(item=_item_out(res.data[0]))


@closet_bp.route('/closet/api/photo/<item_id>')
@require_member
def api_photo(item_id):
    try:
        uuid.UUID(item_id)
    except ValueError:
        return jsonify(error='id inválido'), 400
    row = _sb().table('closet_items').select('photo_path').eq('id', item_id).eq('owner_id', request.closet_user).maybe_single().execute()
    path = (row.data or {}).get('photo_path') if row else None
    if not path or path.startswith('static:'):
        return jsonify(error='sin foto'), 404
    signed = _sb().storage.from_(BUCKET).create_signed_url(path, 3600)
    url = signed.get('signedURL') or signed.get('signedUrl')
    if not url:
        return jsonify(error='no se pudo firmar'), 502
    resp = redirect(url, code=302)
    resp.headers['Cache-Control'] = 'private, max-age=3000'
    return resp
