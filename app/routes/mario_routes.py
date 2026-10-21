import os

from flask import Blueprint, send_from_directory, redirect

mario_bp = Blueprint('mario', __name__)

MARIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mario')


@mario_bp.route('/mario')
def mario_redirect():
    return redirect('/mario/', code=301)


@mario_bp.route('/mario/')
def mario_index():
    return send_from_directory(MARIO_DIR, 'index.html')


@mario_bp.route('/mario/<path:filename>')
def mario_file(filename):
    return send_from_directory(MARIO_DIR, filename)
