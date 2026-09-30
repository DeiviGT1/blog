import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from zoneinfo import ZoneInfo

from flask import Blueprint, send_from_directory, redirect, request, jsonify

peli_bp = Blueprint('peli', __name__)

PELI_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'peli')


@peli_bp.route('/peli')
def peli_redirect():
    return redirect('/peli/', code=301)


@peli_bp.route('/peli/')
def peli_index():
    return send_from_directory(PELI_DIR, 'index.html')


@peli_bp.route('/peli/<path:filename>')
def peli_file(filename):
    return send_from_directory(PELI_DIR, filename)


@peli_bp.route('/peli/confirmar', methods=['POST'])
def peli_confirmar():
    """Avisa a Jose por correo. El contenido es fijo: el cliente no puede
    meter texto, así que no sirve para mandar spam a nadie."""
    origin = request.headers.get('Origin', '')
    if 'josedavidgt.com' not in origin and 'localhost' not in origin:
        return jsonify(ok=False), 403
    data = request.get_json(silent=True) or {}
    if data.get('web'):  # honeypot
        return jsonify(ok=True)

    user = os.getenv('EMAIL_USER', '')
    pw = os.getenv('EMAIL_APP_PASSWORD', '')
    to = os.getenv('PELI_NOTIFY_TO', '')
    if not (user and pw and to):
        return jsonify(ok=False, error='sin correo configurado'), 500

    pelicula = str(data.get('pelicula', ''))[:80]
    fecha = str(data.get('fecha', ''))[:80]
    hora = str(data.get('hora', ''))[:40]
    cuando = datetime.now(ZoneInfo('America/Bogota')).strftime('%d/%m/%Y %I:%M %p')

    msg = EmailMessage()
    msg['Subject'] = f'🎬 Dijo que sí: {pelicula}'
    msg['From'] = user
    msg['To'] = to
    msg.set_content(
        f'Confirmó la película.\n\n'
        f'Película: {pelicula}\nFecha: {fecha}\nHora: {hora}\n\n'
        f'Confirmado el {cuando} (hora Colombia).\n'
    )
    try:
        with smtplib.SMTP(os.getenv('SMTP_HOST', 'smtp.gmail.com'),
                          int(os.getenv('SMTP_PORT', '587')), timeout=20) as smtp:
            smtp.starttls()
            smtp.login(user, pw)
            smtp.send_message(msg)
    except Exception as e:  # noqa: BLE001
        return jsonify(ok=False, error=str(e)[:200]), 502
    return jsonify(ok=True)
