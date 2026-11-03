(function () {
  const P = window.CUSTODIA;
  const ART = window.ARTISTAS || [];
  const N = ART.length;
  const CLAVE = "custodia-v5";
  const $ = function (id) { return document.getElementById(id); };

  // ---------- Estado ----------
  // asig: un carácter por artista, en el orden de ARTISTAS: "-" sin decidir, "a", "b" o "c" (compartida)
  let S = null;

  function nuevo() {
    return { asig: "-".repeat(N).split(""), hist: [] };
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) {}
  }
  function cargar() {
    try {
      const s = JSON.parse(localStorage.getItem(CLAVE));
      if (s && s.asig) {
        // si se agregaron artistas después, entran al final sin decidir
        while (s.asig.length < N) s.asig.push("-");
        if (!s.hist || (s.hist.length && typeof s.hist[0] !== "object")) s.hist = [];
        return s;
      }
    } catch (e) {}
    return null;
  }
  function cuenta(k) { return S.asig.filter(function (x) { return x === k; }).length; }

  // Fallo compartido por enlace: ?f=aab-c...
  const f = new URLSearchParams(location.search).get("f");
  if (f && /^[-abc]+$/.test(f)) {
    S = nuevo();
    f.split("").slice(0, N).forEach(function (x, i) { S.asig[i] = x; });
    guardar();
    history.replaceState(null, "", location.pathname);
  } else {
    S = cargar();
  }

  // ---------- Utilidades ----------
  function vibra(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }
  let toastT;
  function aviso(txt) {
    const t = $("toast");
    t.textContent = txt; t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, 1800);
  }
  function mostrar(id) {
    ["portada", "tablero", "sentencia"].forEach(function (p) { $(p).hidden = p !== id; });
    window.scrollTo(0, 0);
  }
  function inicial(n) { return n.replace(/^(El|La|Los|Las)\s+/i, "").charAt(0).toUpperCase(); }
  function copiar(txt, ok) {
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
      .then(function () { aviso(ok); })
      .catch(function () {
        const ta = document.createElement("textarea");
        ta.value = txt; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); aviso(ok); } catch (e) {}
        ta.remove();
      });
  }

  // ---------- Portada ----------
  $("p-a").textContent = P.a.nombre;
  $("p-b").textContent = P.b.nombre;
  $("p-caso").textContent = "Caso n.º " + N + " · " + N + " artistas";
  ["a", "b"].forEach(function (k) {
    $("m-" + k + "-n").textContent = P[k].corto;
    $("g-" + k + "-n").textContent = P[k].nombre;
  });
  if (S && S.asig.some(function (x) { return x !== "-"; })) {
    $("seguir").hidden = false;
    $("abrir").textContent = "Caso nuevo";
  }
  $("abrir").addEventListener("click", function () {
    S = nuevo(); guardar(); tablero();
  });
  $("seguir").addEventListener("click", function () {
    cuenta("-") ? tablero() : sentencia();
  });

  // ---------- Tablero ----------
  const rejilla = $("rejilla");
  const CICLO = { "-": "a", a: "b", b: "c", c: "-" };
  let filtro = "todos", modoMoneda = false;
  // orden alfabético fijo, ignorando artículos
  const ORDEN = ART.map(function (a, i) { return i; }).sort(function (x, y) {
    const k = function (i) { return ART[i].n.replace(/^(El|La|Los|Las)\s+/i, "").toLowerCase(); };
    return k(x).localeCompare(k(y), "es");
  });

  function marcador() {
    const hechos = N - cuenta("-");
    $("m-a").textContent = cuenta("a");
    $("m-b").textContent = cuenta("b");
    $("m-c").textContent = cuenta("c") + " compartidas";
    $("m-pos").textContent = hechos + " / " + N;
    $("m-barra").style.width = (hechos / N * 100) + "%";
    $("x-undo").disabled = !S.hist.length;
  }

  function tile(i) {
    const a = ART[i];
    const t = document.createElement("button");
    t.type = "button";
    t.className = "tile" + (S.asig[i] === "-" ? "" : " " + S.asig[i]);
    t.dataset.i = i;
    if (a.img) t.style.backgroundImage = "url(" + a.img + ")";
    else { const s = document.createElement("span"); s.className = "inicial"; s.textContent = inicial(a.n); t.appendChild(s); }
    const n = document.createElement("span"); n.className = "nom"; n.textContent = a.n;
    const g = document.createElement("span"); g.className = "tag";
    t.appendChild(n); t.appendChild(g);
    etiqueta(t, S.asig[i]);
    return t;
  }
  function etiqueta(t, k) {
    t.querySelector(".tag").textContent = k === "a" ? P.a.corto : k === "b" ? P.b.corto : k === "c" ? "½" : "";
  }

  function pintar() {
    marcador();
    rejilla.innerHTML = "";
    const vis = ORDEN.filter(function (i) { return filtro === "todos" || S.asig[i] === filtro; });
    if (!vis.length) { rejilla.innerHTML = '<p class="vacio mono chico">Nadie por aquí</p>'; return; }
    vis.forEach(function (i) { rejilla.appendChild(tile(i)); });
  }
  function tablero() { mostrar("tablero"); pintar(); }

  function asignar(i, k) {
    const prev = S.asig[i];
    if (prev === k) return;
    S.asig[i] = k;
    S.hist.push({ i: i, prev: prev });
    guardar();
    vibra(k === "-" ? 6 : 14);
    marcador();
    if (k === "a" || k === "b") {
      const m = $("m-" + k);
      m.classList.remove("salta"); void m.offsetWidth; m.classList.add("salta");
    }
    const t = rejilla.querySelector('.tile[data-i="' + i + '"]');
    if (!t) return;
    if (filtro !== "todos") { // ya no pertenece a este filtro: se va
      t.classList.add("sale");
      setTimeout(pintar, 240);
      return;
    }
    t.className = "tile" + (k === "-" ? "" : " " + k);
    etiqueta(t, k);
  }

  rejilla.addEventListener("click", function (e) {
    const t = e.target.closest(".tile");
    if (!t) return;
    const i = +t.dataset.i;
    if (modoMoneda) return moneda(i);
    asignar(i, CICLO[S.asig[i]]);
  });

  $("filtros").addEventListener("click", function (e) {
    const c = e.target.closest(".chip");
    if (!c) return;
    filtro = c.dataset.f;
    document.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x === c); });
    pintar();
    window.scrollTo(0, 0);
  });
  $("f-a").textContent = P.a.nombre;
  $("f-b").textContent = P.b.nombre;

  $("x-undo").addEventListener("click", function () {
    const h = S.hist.pop();
    if (!h) return;
    S.asig[h.i] = h.prev;
    guardar(); vibra(10);
    if ($("tablero").hidden) tablero(); else pintar();
  });

  // Moneda: se activa y el siguiente toque la lanza
  $("cara-a").textContent = P.a.corto;
  $("cara-b").textContent = P.b.corto;
  $("x-moneda").addEventListener("click", function () {
    modoMoneda = !modoMoneda;
    $("x-moneda").classList.toggle("on", modoMoneda);
    if (modoMoneda) aviso("Toque un artista y la moneda decide");
  });
  function moneda(i) {
    modoMoneda = false;
    $("x-moneda").classList.remove("on");
    const k = Math.random() < 0.5 ? "a" : "b";
    const disco = $("disco");
    disco.classList.remove("gira");
    disco.style.setProperty("--vueltas", (1800 + (k === "b" ? 180 : 0)) + "deg");
    $("moneda").hidden = false;
    void disco.offsetWidth;
    disco.classList.add("gira");
    vibra(8);
    setTimeout(function () {
      vibra([20, 40, 20]);
      setTimeout(function () {
        $("moneda").hidden = true;
        disco.classList.remove("gira");
        asignar(i, k);
      }, 550);
    }, 1600);
  }

  $("x-fallo").addEventListener("click", sentencia);
  document.addEventListener("keydown", function (e) {
    if (!$("tablero").hidden && (e.key === "Backspace" || (e.key === "z" && (e.metaKey || e.ctrlKey)))) $("x-undo").click();
  });

  // ---------- Sentencia ----------
  const SIG = { a: "b", b: "c", c: "a" };

  function ytLink(k) {
    const ids = [];
    ART.forEach(function (a, i) { if ((S.asig[i] === k || S.asig[i] === "c") && a.yt) ids.push(a.yt); });
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); const t = ids[i]; ids[i] = ids[j]; ids[j] = t;
    }
    return ids.length ? "https://www.youtube.com/watch_videos?video_ids=" + ids.slice(0, 50).join(",") : null;
  }

  function sentencia() {
    mostrar("sentencia");
    $("s-a").textContent = cuenta("a");
    $("s-b").textContent = cuenta("b");
    const pend = cuenta("-");
    $("s-c").textContent = cuenta("c") + " en custodia compartida" + (pend ? " · " + pend + " sin decidir" : "");
    ["a", "b", "c"].forEach(function (k) {
      const box = $("g-" + k);
      box.innerHTML = "";
      ART.forEach(function (a, i) {
        if (S.asig[i] !== k) return;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ficha";
        const im = document.createElement("i");
        if (a.img) im.style.backgroundImage = "url(" + a.img + ")"; else im.textContent = inicial(a.n);
        b.appendChild(im);
        b.appendChild(document.createTextNode(a.n));
        // tocar una ficha la pasa al siguiente: a → b → compartida → a
        b.addEventListener("click", function () {
          asignar(i, SIG[k]); sentencia();
        });
        box.appendChild(b);
      });
      if (!box.children.length) box.innerHTML = '<span class="vacio">—</span>';
    });
    ["a", "b"].forEach(function (k) {
      const link = ytLink(k), yt = $("yt-" + k);
      if (link) { yt.href = link; yt.removeAttribute("aria-disabled"); }
      else { yt.removeAttribute("href"); yt.setAttribute("aria-disabled", "true"); }
    });
  }

  function lista(k) {
    return ART.filter(function (_, i) { return S.asig[i] === k || S.asig[i] === "c"; })
      .map(function (a) { return a.n; });
  }
  ["a", "b"].forEach(function (k) {
    $("sp-" + k).addEventListener("click", function () {
      const l = lista(k);
      if (!l.length) return aviso("No tiene artistas todavía");
      copiar("Playlist de " + P[k].nombre + ": " + l.join(", "), "Lista copiada");
    });
  });

  $("volver").addEventListener("click", tablero);
  $("enlace").addEventListener("click", function () {
    copiar(location.origin + location.pathname + "?f=" + S.asig.join(""), "Enlace copiado");
  });
  let seguro = false;
  $("reiniciar").addEventListener("click", function () {
    const b = $("reiniciar");
    if (!seguro) {
      seguro = true; b.textContent = "¿Seguro? Toque otra vez";
      setTimeout(function () { seguro = false; b.textContent = "Reiniciar caso"; }, 2500);
      return;
    }
    S = nuevo(); guardar(); seguro = false; b.textContent = "Reiniciar caso";
    tablero();
  });
})();
