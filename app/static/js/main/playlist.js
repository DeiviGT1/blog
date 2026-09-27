// app/static/js/playlist.js

document.addEventListener("DOMContentLoaded", function() {
  // Select the element with ID 'playlist-data'
  var playlistDataElement = document.getElementById('playlist-data');
  if (!playlistDataElement) {
    console.error("Element with ID 'playlist-data' not found.");
    return;
  }


  var dataBase64 = playlistDataElement.getAttribute('data-playlist');
  if (!dataBase64) {
    console.error('El atributo data-playlist está vacío');
    return;
  }
  var dataJson;
  try {
    dataJson = atob(dataBase64);
  } catch (e) {
    console.error('Error decodificando Base64:', e);
    return;
  }

  var data;
  try {
    data = JSON.parse(dataJson);
  } catch (e) {
    console.error('Error parseando JSON:', e);
    return;
  }

  if (!data || data.length === 0) {
    console.error('No se encontraron datos de playlists.');
    var playlistContainer = document.getElementById("playlist");
    playlistContainer.innerHTML = "<p>No se encontraron playlists con canciones.</p>";
    return;
  }
  
  var playlistContainer = document.getElementById("playlist");
  var list = document.createElement("ul");

  for (var i = 0; i < data.length; i++) {
    var playlist_name = data[i].playlist_name;
    var playlist_url = data[i].playlist_url;
    var average_popularity = parseFloat(data[i].avg_popularity);

    var Comentario;
    if (average_popularity > 70){
      Comentario = 'Incredible playlist. You have great taste — every song is a gem.';
    } else if (average_popularity > 55){
      Comentario = 'Very good playlist. A mix of styles and rhythms that is easy to enjoy.';
    } else if (average_popularity > 45){
      Comentario = 'Decent playlist. A balance between popular songs and lesser-known ones.';
    } else if (average_popularity > 20){
      Comentario = 'Not very catchy. Some good songs, but others do not land at all.';
    } else {
      Comentario = 'This playlist needs an urgent refresh. Maybe explore other genres.';
    }

    localStorage.setItem('playlistData', dataJson);

    var listItem = document.createElement("li");
    listItem.className = "playlist-item";

    var playlistTitle = document.createElement("h3");
    playlistTitle.textContent = "'" + playlist_name + "' scores " + average_popularity + " / 100";

    var progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress-bar-container";

    var progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = average_popularity + "%";

    var comentarioDiv = document.createElement("div");
    comentarioDiv.className = "comentario-div";

    var comentarioLink = document.createElement("a");
    comentarioLink.setAttribute("href", playlist_url);
    comentarioLink.setAttribute("target", "_blank");
    comentarioLink.setAttribute("rel", "noopener noreferrer");
    comentarioLink.textContent = Comentario + " Open on Spotify ↗";
    comentarioLink.className = "comentario";

    progressBarContainer.appendChild(progressBar);
    comentarioDiv.appendChild(comentarioLink);

    listItem.appendChild(playlistTitle);
    listItem.appendChild(progressBarContainer);
    listItem.appendChild(comentarioDiv);

    list.appendChild(listItem);
  }

  playlistContainer.appendChild(list);
});