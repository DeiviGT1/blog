# app/routes/openai_routes.py
from flask import Blueprint, render_template, request, redirect, session, url_for
from ..python.openai.spotify import (
    app_Authorization as openai_app_Authorization,
    search_song,
    user_Authorization as openai_user_Authorization
)
from ..python.openai.openaiapi import generar_respuesta

openai_bp = Blueprint('openai', __name__, url_prefix='/openai')


def _redirect_uri():
    # Spotify vuelve a /callback (raíz), que es la URI registrada en el dashboard de Spotify.
    return request.url_root.rstrip('/') + "/callback"


@openai_bp.route('/')
def openai_index():
    return render_template('projects/openai/sonic_surprise.html')

@openai_bp.route("/login", methods=["POST", "GET"])
def login():
    auth_url = openai_app_Authorization(_redirect_uri())
    session["spotify"] = auth_url

    session["song"] = request.form.get("song")
    session["artist"] = request.form.get("artist")
    return redirect(auth_url)

# Spotify redirige a /callback (raíz), que antes no existía y devolvía 404.
# main_bp expone esa ruta y delega aquí (ver app/routes/main.py).
@openai_bp.route("/callback")
def callback():
    if "code" not in request.args:
        return redirect(url_for("openai.openai_index"))
    header = openai_user_Authorization(_redirect_uri())
    session["user"] = header
    return redirect(url_for("openai.get_input"))

@openai_bp.route("/song_recommendations", methods=["POST","GET"])
def get_input():
    header = session.get("user")
    song = session.get("song")
    artist = session.get("artist")
    if not header or not song:
        return redirect(url_for("openai.openai_index"))

    real_songs = []
    playlists = generar_respuesta(song, artist)

    lista_nueva = []
    for elemento in playlists:
        elemento_nuevo = elemento.replace("\"", "") \
                                 .replace("ñ", "n") \
                                 .replace("á", "a") \
                                 .replace("é", "e") \
                                 .replace("í", "i") \
                                 .replace("ó", "o") \
                                 .replace("ú", "u") \
                                 .replace("¿", "") \
                                 .replace("?", "") \
                                 .replace("¡", "") \
                                 .replace("!", "") \
                                 .replace(".", "") \
                                 .replace(",", "") \
                                 .replace("  ", " ").strip()
        lista_nueva.append(elemento_nuevo)

    for song in lista_nueva:
        result = search_song(header=header, song_name=song)
        if result.get("tracks", {}).get("items"):
            track = result["tracks"]["items"][0]
            real_songs.append({
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "url": track["external_urls"]["spotify"],
                "image": track["album"]["images"][0]["url"]
            })

    return render_template("projects/openai/recommendations.html", songs=real_songs)
