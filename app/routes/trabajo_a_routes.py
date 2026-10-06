import os

from flask import Blueprint, send_from_directory, redirect

trabajo_a_bp = Blueprint('trabajo_a', __name__)

TRABAJO_A_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'trabajo_a')


@trabajo_a_bp.route('/trabajo-a')
def trabajo_a_redirect():
    return redirect('/trabajo-a/', code=301)


@trabajo_a_bp.route('/trabajo-a/')
def trabajo_a_index():
    resp = send_from_directory(TRABAJO_A_DIR, 'index.html')
    resp.headers['X-Robots-Tag'] = 'noindex, nofollow'
    return resp
