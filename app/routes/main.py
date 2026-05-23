# app/routes/main.py
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify, Response

main_bp = Blueprint('main', __name__)

@main_bp.route('/ping')
def ping():
    return jsonify({"status": "ok"}), 200

@main_bp.route('/robots.txt')
def robots():
    txt = """User-agent: *
Allow: /
Disallow: /login
Disallow: /logout
Disallow: /brisa-sites/admin
Disallow: /curso/admin
Disallow: /dashboard_index
Disallow: /meper

Sitemap: https://www.josedavidgt.com/sitemap.xml
"""
    return Response(txt, mimetype='text/plain')

@main_bp.route('/sitemap.xml')
def sitemap():
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.josedavidgt.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/articles/ia-mercado-laboral</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/restaurantes/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/barberias/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/botanicas/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/tabaquerias/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/tiendas/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/brisa-sites/galerias/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/blogpost</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.josedavidgt.com/curso</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>"""
    return Response(xml, mimetype='application/xml')

@main_bp.route('/')
def index():
    # Supabase OAuth may redirect here with ?code=... instead of /curso/auth/callback
    code = request.args.get("code")
    if code:
        code_verifier = session.pop("curso_pkce_verifier", None)
        if not code_verifier:
            flash("Error de autenticación. Intenta de nuevo.", "error")
            return redirect(url_for("curso.login"))
        try:
            from app.python.supabase_client import get_client
            sb   = get_client()
            resp = sb.auth.exchange_code_for_session({
                "auth_code": code,
                "code_verifier": code_verifier,
            })
            # Import _after_auth from curso routes
            from app.routes.curso_routes import _after_auth
            _after_auth(resp.user, resp.session.access_token)
            return redirect(url_for("curso.dashboard"))
        except Exception as e:
            flash(f"Error de autenticación: {e}", "error")
            return redirect(url_for("curso.login"))
    return render_template('main/index.html')

@main_bp.route('/hf')
def hf():
    return render_template('main/hf.html')