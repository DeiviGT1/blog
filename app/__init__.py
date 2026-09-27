# app/__init__.py
import os
from flask import Flask
from dotenv import load_dotenv
from .routes_main import register_routes

def create_app():
    load_dotenv()
    app = Flask(__name__)

    secret = os.getenv("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY no está configurada en las variables de entorno.")
    app.config['SECRET_KEY'] = secret

    # Cookies seguras en producción
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    if os.getenv("FLASK_ENV") == "production":
        app.config['SESSION_COOKIE_SECURE'] = True   # solo HTTPS

    @app.context_processor
    def _inject_globals():
        from datetime import date
        return {"current_year": date.today().year}

    register_routes(app)
    return app