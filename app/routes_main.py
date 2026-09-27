# app/routes_main.py

import os


def register_routes(app):
    # --- Supabase / curso config ---
    app.config["SUPABASE_URL"]          = os.getenv("SUPABASE_URL", "")
    app.config["SUPABASE_ANON_KEY"]     = os.getenv("SUPABASE_ANON_KEY", "")
    app.config["SUPABASE_SERVICE_ROLE_KEY"] = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    app.config["ADMIN_EMAIL"]           = os.getenv("ADMIN_EMAIL", "")

    # --- Registrar blueprints ---
    from .routes.main import main_bp
    from .routes.openai_routes import openai_bp
    from .routes.playlists_routes import playlists_bp
    from .routes.dashboard_routes import dashboard_bp
    from .routes.blogpost_routes import blogpost_bp
    from .routes.articles_routes import articles_bp
    # SOS Queue y su login (auth_routes) están deshabilitados: requieren Redis.
    # from .routes.sosqueue_routes import sos_bp
    # from .routes.auth_routes import auth_bp
    from .routes.curso_routes import curso_bp
    from .routes.brisa_sites_routes import brisa_sites_bp
    from .routes.meper_routes import meper_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(openai_bp)
    app.register_blueprint(playlists_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(blogpost_bp)
    app.register_blueprint(articles_bp)
    # app.register_blueprint(sos_bp)
    # app.register_blueprint(auth_bp)
    app.register_blueprint(curso_bp)
    app.register_blueprint(brisa_sites_bp)
    app.register_blueprint(meper_bp)
