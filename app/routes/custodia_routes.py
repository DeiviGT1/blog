import os

from flask import Blueprint, send_from_directory, redirect

custodia_bp = Blueprint('custodia', __name__)

CUSTODIA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'custodia')


@custodia_bp.route('/custodia')
def custodia_redirect():
    return redirect('/custodia/', code=301)


@custodia_bp.route('/custodia/')
def custodia_index():
    return send_from_directory(CUSTODIA_DIR, 'index.html')


@custodia_bp.route('/custodia/<path:filename>')
def custodia_file(filename):
    return send_from_directory(CUSTODIA_DIR, filename)
