import os

from flask import Blueprint, send_from_directory, redirect

closet_bp = Blueprint('closet', __name__)

CLOSET_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'closet')


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
    return _noindex(send_from_directory(CLOSET_DIR, filename))
