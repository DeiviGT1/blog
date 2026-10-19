import json
import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, send_from_directory, redirect, request, jsonify

trabajo_a_bp = Blueprint('trabajo_a', __name__)

TRABAJO_A_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'trabajo_a')
TABLA = 'trabajo_a_estado'
ESTADOS = {None, 'aplique', 'entrevista', 'descartada', 'contratada'}

logger = logging.getLogger(__name__)


def _noindex(resp):
    resp.headers['X-Robots-Tag'] = 'noindex, nofollow'
    return resp


def _job_ids():
    with open(os.path.join(TRABAJO_A_DIR, 'jobs.json'), encoding='utf-8') as f:
        return {j['id'] for j in json.load(f)['jobs']}


@trabajo_a_bp.route('/trabajo-a')
def trabajo_a_redirect():
    return redirect('/trabajo-a/', code=301)


@trabajo_a_bp.route('/trabajo-a/')
def trabajo_a_index():
    resp = send_from_directory(TRABAJO_A_DIR, 'index.html')
    resp.headers['Cache-Control'] = 'no-cache'
    return _noindex(resp)


@trabajo_a_bp.route('/trabajo-a/jobs.json')
def trabajo_a_jobs():
    resp = send_from_directory(TRABAJO_A_DIR, 'jobs.json')
    resp.headers['Cache-Control'] = 'no-cache'
    return _noindex(resp)


# Primera versión (6 oct 2026): guardaba lo aplicado solo en el navegador.
@trabajo_a_bp.route('/trabajo-a/legacy')
def trabajo_a_legacy_redirect():
    return redirect('/trabajo-a/legacy/', code=301)


@trabajo_a_bp.route('/trabajo-a/legacy/')
def trabajo_a_legacy():
    return _noindex(send_from_directory(os.path.join(TRABAJO_A_DIR, 'legacy'), 'index.html'))


# --- Estado compartido (Supabase, tabla trabajo_a_estado) ---

@trabajo_a_bp.route('/trabajo-a/api/estado', methods=['GET'])
def trabajo_a_estado_get():
    from app.python.supabase_client import get_admin_client
    try:
        rows = get_admin_client().table(TABLA).select('job_id, estado, nota, updated_at').execute().data
    except Exception:
        logger.exception('trabajo-a: no se pudo leer el estado')
        return _noindex(jsonify({'error': 'No se pudo cargar el estado.'})), 503
    resp = jsonify({r['job_id']: {k: r[k] for k in ('estado', 'nota', 'updated_at')} for r in rows})
    resp.headers['Cache-Control'] = 'no-store'
    return _noindex(resp)


@trabajo_a_bp.route('/trabajo-a/api/estado', methods=['POST'])
def trabajo_a_estado_post():
    from app.python.supabase_client import get_admin_client
    body = request.get_json(silent=True) or {}
    job_id = body.get('job_id')
    estado = body.get('estado') or None
    nota = str(body.get('nota') or '').strip()[:1000] or None
    if job_id not in _job_ids() or estado not in ESTADOS:
        return _noindex(jsonify({'error': 'Datos inválidos.'})), 400
    row = {'job_id': job_id, 'estado': estado, 'nota': nota,
           'updated_at': datetime.now(timezone.utc).isoformat()}
    try:
        get_admin_client().table(TABLA).upsert(row).execute()
    except Exception:
        logger.exception('trabajo-a: no se pudo guardar el estado')
        return _noindex(jsonify({'error': 'No se pudo guardar.'})), 503
    return _noindex(jsonify(row))
