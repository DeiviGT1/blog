# app/python/openai/spotify.py
# Acceso a la API de Spotify con Client Credentials (sin login del usuario):
# suficiente para /search, que es lo único que necesita Sonic Surprise.

import os
import base64
import logging
import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "e68285acd05e49bb9134e5bcc2622778")
CLIENT_SECRET = os.getenv("SPOTIFY_API_KEY")

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_URL = "https://api.spotify.com/v1"


def get_app_token():
    """Return an Authorization header dict, or None if Spotify is not configured."""
    if not CLIENT_SECRET:
        return None
    creds = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    try:
        resp = requests.post(
            SPOTIFY_TOKEN_URL,
            data={"grant_type": "client_credentials"},
            headers={"Authorization": f"Basic {creds}"},
            timeout=10,
        )
        resp.raise_for_status()
        return {"Authorization": f"Bearer {resp.json()['access_token']}"}
    except Exception as exc:  # credenciales inválidas, red caída, etc.
        logger.warning("Spotify token request failed: %s", exc)
        return None


def search_song(header, song_name):
    try:
        resp = requests.get(
            f"{SPOTIFY_API_URL}/search",
            headers=header,
            params={"q": song_name, "type": "track", "limit": 1},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        logger.warning("Spotify search failed for %r: %s", song_name, exc)
        return {}
