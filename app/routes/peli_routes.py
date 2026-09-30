import os
from flask import Blueprint, send_from_directory, redirect

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
