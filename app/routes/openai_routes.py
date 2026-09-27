# app/routes/openai_routes.py
import os
import urllib.parse
from flask import Blueprint, render_template, request, redirect, url_for
from ..python.openai.spotify import get_app_token, search_song
from ..python.openai.openaiapi import generar_respuesta

openai_bp = Blueprint('openai', __name__, url_prefix='/openai')

# Recomendaciones de muestra cuando no hay OPENAI_API_KEY configurada.
DEMO_RECOMMENDATIONS = [
    "Cómo Dormiste? - Rels B",
    "A Mí - Rels B",
    "Amorfoda - Bad Bunny",
    "Normal - Feid",
    "Una Vez - Bad Bunny, Mora",
    "Todo de Ti - Rauw Alejandro",
    "Como Tú - Dellafuente",
    "Loco - Beéle",
    "Se Preparó - Ozuna",
    "Traicionera - Sebastián Yatra",
]

_ACCENTS = str.maketrans("ñáéíóúÑÁÉÍÓÚ", "naeiouNAEIOU")


def _clean(text):
    text = text.replace('"', "").translate(_ACCENTS)
    for ch in "¿?¡!.,":
        text = text.replace(ch, "")
    return " ".join(text.split())


def _split_song(text):
    """'Song - Artist' -> (song, artist). Falls back to (text, '')."""
    for sep in (" - ", " – ", " by "):
        if sep in text:
            song, artist = text.split(sep, 1)
            return song.strip(), artist.strip()
    return text.strip(), ""


def _search_link(query):
    return "https://open.spotify.com/search/" + urllib.parse.quote(query)


@openai_bp.route('/')
def openai_index():
    return render_template('projects/openai/sonic_surprise.html',
                           demo_ai=not os.getenv("OPENAI_API_KEY"))


@openai_bp.route("/recommend", methods=["POST"])
def recommend():
    song = (request.form.get("song") or "").strip()
    artist = (request.form.get("artist") or "").strip()
    if not song:
        return redirect(url_for("openai.openai_index"))

    # 1) Lista de canciones: OpenAI si hay clave, si no una muestra fija.
    demo_ai = not os.getenv("OPENAI_API_KEY")
    raw = DEMO_RECOMMENDATIONS if demo_ai else (generar_respuesta(song, artist) or [])
    if not raw:
        raw = DEMO_RECOMMENDATIONS
        demo_ai = True
    cleaned = [_clean(r) for r in raw][:10]

    # 2) Enriquecer con Spotify (client credentials, sin login del usuario).
    token = get_app_token()
    real_songs = []
    for item in cleaned:
        name, by = _split_song(item)
        entry = {"name": name, "artist": by, "url": _search_link(item), "image": ""}
        if token:
            result = search_song(header=token, song_name=item)
            tracks = result.get("tracks", {}).get("items") or []
            if tracks:
                track = tracks[0]
                images = track["album"].get("images") or []
                entry = {
                    "name": track["name"],
                    "artist": track["artists"][0]["name"],
                    "url": track["external_urls"]["spotify"],
                    "image": images[0]["url"] if images else "",
                }
        real_songs.append(entry)

    return render_template("projects/openai/recommendations.html",
                           songs=real_songs, query_song=song, query_artist=artist,
                           demo_ai=demo_ai, demo_spotify=token is None)


# Compatibilidad con el flujo antiguo (login con Spotify): ya no es necesario.
@openai_bp.route("/login", methods=["GET", "POST"])
@openai_bp.route("/callback")
@openai_bp.route("/song_recommendations", methods=["GET", "POST"])
def legacy_redirect():
    return redirect(url_for("openai.openai_index"))
