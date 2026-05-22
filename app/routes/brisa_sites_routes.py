import os
from flask import Blueprint, send_from_directory, abort

brisa_sites_bp = Blueprint('brisa_sites', __name__)

LANDING_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'brisa-sites-landing')

VERTICALS = {'barberias', 'botanicas', 'galerias', 'restaurantes', 'tabaquerias', 'tiendas'}


@brisa_sites_bp.route('/brisa-sites/')
def brisa_index():
    return send_from_directory(LANDING_DIR, 'index.html')


@brisa_sites_bp.route('/brisa-sites/admin')
@brisa_sites_bp.route('/brisa-sites/admin/')
def brisa_admin():
    return send_from_directory(LANDING_DIR, 'admin.html')


@brisa_sites_bp.route('/brisa-sites/assets/<path:filename>')
def brisa_assets(filename):
    return send_from_directory(os.path.join(LANDING_DIR, 'assets'), filename)


@brisa_sites_bp.route('/brisa-sites/<vertical>/')
def brisa_vertical(vertical):
    if vertical not in VERTICALS:
        abort(404)
    return send_from_directory(os.path.join(LANDING_DIR, vertical), 'index.html')


@brisa_sites_bp.route('/brisa-sites/<vertical>/<path:filename>')
def brisa_vertical_file(vertical, filename):
    if vertical not in VERTICALS:
        abort(404)
    return send_from_directory(os.path.join(LANDING_DIR, vertical), filename)
