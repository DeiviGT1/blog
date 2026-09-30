(function () {
  const C = window.SALIMOS || {};

  // Mueve un elemento a un punto aleatorio de la pantalla, siempre visible.
  function huir(el) {
    const pad = 12;
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!el.classList.contains("huyendo") && el.classList.contains("opcion")) {
      // deja un hueco del mismo alto para que la lista no salte
      const hueco = document.createElement("div");
      hueco.style.height = h + "px";
      el.parentNode.insertBefore(hueco, el);
    }
    el.classList.add("huyendo");
    el.style.left = pad + Math.random() * Math.max(0, window.innerWidth - w - pad * 2) + "px";
    el.style.top  = pad + Math.random() * Math.max(0, window.innerHeight - h - pad * 2) + "px";
  }
  function escurridizo(el, cb) {
    el.addEventListener("mouseenter", function () { huir(el); cb && cb(); });
    el.addEventListener("touchstart", function (e) { e.preventDefault(); huir(el); cb && cb(); }, { passive: false });
    el.addEventListener("click", function (e) { e.preventDefault(); huir(el); cb && cb(); });
  }

  // ---------- Página 1 ----------
  const no = document.getElementById("no");
  const si = document.getElementById("si");
  if (no && si) {
    const para = document.getElementById("para");
    if (para && C.para) para.textContent = "Para " + C.para;
    const excusas = C.excusas || ["No"];
    let huidas = 0;
    escurridizo(no, function () {
      huidas++;
      no.textContent = excusas[Math.min(huidas, excusas.length - 1)];
      no.style.transform = "scale(" + Math.max(0.45, 1 - huidas * 0.1) + ")";   // el NO se encoge
      si.style.transform = "scale(" + Math.min(1.25, 1 + huidas * 0.04) + ")";  // el SÍ crece un poco
    });
    si.addEventListener("click", function () {
      no.remove();                       // que no quede el NO suelto por la pantalla
      document.getElementById("inicio").hidden = true;
      document.getElementById("elegir").hidden = false;
    });
  }

  // ---------- Página 2 ----------
  const opciones = document.getElementById("opciones");
  if (opciones) {
    const elegir = document.getElementById("elegir");
    const cita = document.getElementById("cita");
    const confirmar = document.getElementById("confirmar");
    const aviso = document.getElementById("aviso");

    // La correcta y los señuelos, en orden aleatorio
    const lista = (C.senuelos || []).map(function (p) { return { titulo: p.titulo, poster: p.poster, real: false }; });
    if (C.pelicula) lista.splice(Math.floor(Math.random() * (lista.length + 1)), 0, { titulo: C.pelicula.titulo, poster: C.pelicula.poster, real: true });

    lista.forEach(function (item) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcion";
      const img = document.createElement("img");
      img.className = "poster";
      img.src = item.poster || "";
      img.alt = "";
      img.draggable = false;
      const txt = document.createElement("span");
      txt.textContent = item.titulo;
      b.appendChild(img);
      b.appendChild(txt);
      if (item.real) {
        b.addEventListener("click", function () {
          document.getElementById("c-titulo").textContent = item.titulo;
          const cp = document.getElementById("c-poster");
          cp.src = item.poster || "";
          cp.hidden = !item.poster;
          document.getElementById("c-fecha").textContent = C.fecha || "";
          document.getElementById("c-hora").textContent = C.hora || "";
          document.getElementById("c-lugar").textContent = C.lugar || "";
          document.querySelectorAll(".opcion.huyendo").forEach(function (el) { el.remove(); });
          elegir.hidden = true;
          cita.hidden = false;
        });
      } else {
        escurridizo(b);
      }
      opciones.appendChild(b);
    });

    // Confirmar: te avisa a ti por correo; ella solo ve el mensaje.
    confirmar.addEventListener("click", function () {
      confirmar.disabled = true;
      confirmar.textContent = "Confirmado";
      aviso.textContent = "Correo de confirmación enviado a " + (C.de || "Jose") + ".";
      aviso.hidden = false;

      if (!C.web3forms_key) return; // mockup: sin clave no envía nada
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: C.web3forms_key,
          subject: "🎬 Dijo que sí: " + C.pelicula.titulo,
          from_name: "¿Vemos una película?",
          pelicula: C.pelicula.titulo,
          fecha: C.fecha, hora: C.hora, lugar: C.lugar,
          para: C.para || "",
          cuando: new Date().toLocaleString("es-CO"),
        }),
      }).catch(function () {});
    });
  }
})();
