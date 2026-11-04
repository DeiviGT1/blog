import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, send_from_directory, redirect, request, jsonify

custodia_bp = Blueprint('custodia', __name__)
logger = logging.getLogger(__name__)

CUSTODIA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'custodia')
TABLA = 'custodia_asignacion'
LADOS = ('a', 'b', 'c')


def _noindex(resp):
    resp.headers['X-Robots-Tag'] = 'noindex'
    resp.headers['Cache-Control'] = 'no-store'
    return resp


def _caso(valor):
    valor = str(valor or '').strip().lower()
    return valor if 1 <= len(valor) <= 40 and valor.replace('-', '').isalnum() else None


@custodia_bp.route('/custodia')
def custodia_redirect():
    return redirect('/custodia/', code=301)


@custodia_bp.route('/custodia/')
def custodia_index():
    return send_from_directory(CUSTODIA_DIR, 'index.html')


@custodia_bp.route('/custodia/api/estado', methods=['GET'])
def custodia_estado_get():
    """Devuelve {artista: lado} del caso."""
    from app.python.supabase_client import get_admin_client
    caso = _caso(request.args.get('caso'))
    if not caso:
        return _noindex(jsonify({'error': 'Caso inválido.'})), 400
    try:
        rows = get_admin_client().table(TABLA).select('artista, lado').eq('caso', caso).execute().data
    except Exception:
        logger.exception('custodia: no se pudo leer el estado')
        return _noindex(jsonify({'error': 'No se pudo cargar.'})), 503
    return _noindex(jsonify({r['artista']: r['lado'] for r in rows}))


@custodia_bp.route('/custodia/api/estado', methods=['POST'])
def custodia_estado_post():
    """Asigna un artista ({caso, artista, lado}); lado '-' lo deja sin decidir.
    {caso, reiniciar: true} borra todo el caso."""
    from app.python.supabase_client import get_admin_client
    body = request.get_json(silent=True) or {}
    caso = _caso(body.get('caso'))
    if not caso:
        return _noindex(jsonify({'error': 'Caso inválido.'})), 400
    sb = get_admin_client()
    try:
        if body.get('reiniciar') is True:
            sb.table(TABLA).delete().eq('caso', caso).execute()
            return _noindex(jsonify({'ok': True}))
        artista = str(body.get('artista') or '').strip()[:80]
        lado = body.get('lado')
        if not artista or lado not in LADOS + ('-',):
            return _noindex(jsonify({'error': 'Datos inválidos.'})), 400
        if lado == '-':
            sb.table(TABLA).delete().eq('caso', caso).eq('artista', artista).execute()
        else:
            sb.table(TABLA).upsert({'caso': caso, 'artista': artista, 'lado': lado,
                                    'updated_at': datetime.now(timezone.utc).isoformat()}).execute()
    except Exception:
        logger.exception('custodia: no se pudo guardar')
        return _noindex(jsonify({'error': 'No se pudo guardar.'})), 503
    return _noindex(jsonify({'ok': True}))


@custodia_bp.route('/custodia/<path:filename>')
def custodia_file(filename):
    return send_from_directory(CUSTODIA_DIR, filename)
