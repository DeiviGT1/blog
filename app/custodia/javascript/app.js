(function () {
  const P = window.CUSTODIA;
  const ART = window.ARTISTAS || [];
  const N = ART.length;
  const CLAVE = "custodia-v1";
  const $ = function (id) { return document.getElementById(id); };

  // ---------- Estado ----------
  // asig: un carácter por artista, en el orden de ARTISTAS: "-" sin decidir, "a", "b" o "c" (compartida)
  let S = null;

  function nuevo() {
    const orden = ART.map(function (_, i) { return i; });
    for (let i = orden.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = orden[i]; orden[i] = orden[j]; orden[j] = t;
    }
    return { asig: "-".repeat(N).split(""), orden: orden, hist: [] };
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) {}
  }
  function cargar() {
    try {
      const s = JSON.parse(localStorage.getItem(CLAVE));
      if (s && s.asig) {
        // si se agregaron artistas después, entran al final sin decidir
        while (s.asig.length < N) { s.orden.push(s.asig.length); s.asig.push("-"); }
        return s;
      }
    } catch (e) {}
    return null;
  }
  function pendientes() { return S.orden.filter(function (i) { return S.asig[i] === "-"; }); }
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
    ["portada", "audiencia", "sentencia"].forEach(function (p) { $(p).hidden = p !== id; });
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
    $("d-" + k + "-n").textContent = P[k].nombre;
    $("g-" + k + "-n").textContent = P[k].nombre;
  });
  if (S && S.asig.some(function (x) { return x !== "-"; })) {
    $("seguir").hidden = false;
    $("abrir").textContent = "Caso nuevo";
  }
  $("abrir").addEventListener("click", function () {
    S = nuevo(); guardar(); audiencia();
  });
  $("seguir").addEventListener("click", function () {
    pendientes().length ? audiencia() : sentencia();
  });

  // ---------- Audiencia ----------
  const mesa = $("mesa");
  let carta = null, ocupado = false;

  function crearCarta(i, atras) {
    const a = ART[i];
    const el = document.createElement("div");
    el.className = "carta" + (atras ? " atras" : "");
    const foto = document.createElement("div");
    foto.className = "foto";
    if (a.img) foto.style.backgroundImage = "url(" + a.img + ")";
    else { const s = document.createElement("span"); s.className = "inicial"; s.textContent = inicial(a.n); foto.appendChild(s); }
    const pie = document.createElement("div");
    pie.className = "pie";
    const h = document.createElement("h2"); h.textContent = a.n;
    const ex = document.createElement("span"); ex.className = "mono chico exp";
    ex.textContent = "Exp. " + String(i + 1).padStart(3, "0");
    pie.appendChild(h); pie.appendChild(ex);
    el.appendChild(foto); el.appendChild(pie);
    ["a", "b", "c"].forEach(function (k) {
      const s = document.createElement("div");
      s.className = "sello " + k;
      s.textContent = k === "c" ? "Compartida" : P[k].nombre;
      el.appendChild(s);
    });
    el.dataset.i = i;
    return el;
  }

  function pintar() {
    mesa.innerHTML = "";
    const pend = pendientes();
    const hechos = N - pend.length;
    $("m-a").textContent = cuenta("a");
    $("m-b").textContent = cuenta("b");
    $("m-c").textContent = cuenta("c") + " compartidas";
    $("m-pos").textContent = hechos + " / " + N;
    $("m-barra").style.width = (hechos / N * 100) + "%";
    $("x-undo").disabled = !S.hist.length;
    $("x-luego").disabled = pend.length < 2;
    if (!pend.length) { carta = null; setTimeout(sentencia, 350); return; }
    if (pend[1] !== undefined) mesa.appendChild(crearCarta(pend[1], true));
    carta = crearCarta(pend[0], false);
    carta.classList.add("entra");
    mesa.appendChild(carta);
    arrastre(carta);
  }

  function audiencia() { mostrar("audiencia"); pintar(); }

  function sellos(el, dx, dy) {
    const fa = Math.max(0, Math.min(1, -dx / 110));
    const fb = Math.max(0, Math.min(1, dx / 110));
    const fc = Math.max(0, Math.min(1, -dy / 110)) * (Math.abs(dx) < 70 ? 1 : 0);
    el.querySelector(".sello.a").style.opacity = fa;
    el.querySelector(".sello.b").style.opacity = fb;
    el.querySelector(".sello.c").style.opacity = fc;
    el.classList.toggle("tinta", Math.max(fa, fb, fc) > 0.5);
  }

  function decidir(k) {
    if (!carta || ocupado) return;
    ocupado = true;
    const el = carta, i = +el.dataset.i;
    const dx = k === "a" ? -1 : k === "b" ? 1 : 0;
    sellos(el, dx * 200, k === "c" ? -200 : 0);
    el.style.transition = "transform .45s cubic-bezier(.4,.1,.6,1), opacity .45s";
    el.style.transform = k === "c"
      ? "translate(0, -130%) scale(.9)"
      : "translate(" + dx * 140 + "%, 30px) rotate(" + dx * 22 + "deg)";
    el.style.opacity = "0";
    S.asig[i] = k;
    S.hist.push(i);
    guardar();
    vibra(18);
    if (k !== "c") {
      const m = $("m-" + k);
      m.classList.remove("salta"); void m.offsetWidth; m.classList.add("salta");
    }
    const atras = mesa.querySelector(".carta.atras");
    if (atras) { atras.style.transform = "none"; atras.style.filter = "none"; }
    setTimeout(function () { ocupado = false; pintar(); }, 380);
  }

  function arrastre(el) {
    let x0 = 0, y0 = 0, dx = 0, dy = 0, activo = false;
    el.addEventListener("pointerdown", function (e) {
      if (ocupado) return;
      activo = true; x0 = e.clientX; y0 = e.clientY; dx = dy = 0;
      el.setPointerCapture(e.pointerId);
      el.style.transition = "none";
      el.style.cursor = "grabbing";
    });
    el.addEventListener("pointermove", function (e) {
      if (!activo) return;
      dx = e.clientX - x0; dy = e.clientY - y0;
      el.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + dx / 14 + "deg)";
      sellos(el, dx, dy);
    });
    function suelta() {
      if (!activo) return;
      activo = false;
      el.style.cursor = "";
      if (dx < -110) return decidir("a");
      if (dx > 110) return decidir("b");
      if (dy < -110 && Math.abs(dx) < 70) return decidir("c");
      el.style.transition = "transform .35s cubic-bezier(.3,1.5,.5,1)";
      el.style.transform = "";
      sellos(el, 0, 0);
    }
    el.addEventListener("pointerup", suelta);
    el.addEventListener("pointercancel", suelta);
  }

  $("d-a").addEventListener("click", function () { decidir("a"); });
  $("d-b").addEventListener("click", function () { decidir("b"); });
  $("d-c").addEventListener("click", function () { decidir("c"); });

  $("x-undo").addEventListener("click", function () {
    if (ocupado || !S.hist.length) return;
    const i = S.hist.pop();
    S.asig[i] = "-";
    // vuelve de primera en la pila
    S.orden.splice(S.orden.indexOf(i), 1);
    S.orden.unshift(i);
    guardar(); vibra(10);
    if ($("audiencia").hidden) audiencia(); else pintar();
  });

  $("x-luego").addEventListener("click", function () {
    if (!carta || ocupado) return;
    const i = +carta.dataset.i;
    S.orden.splice(S.orden.indexOf(i), 1);
    S.orden.push(i);
    guardar();
    ocupado = true;
    carta.style.transition = "transform .35s ease, opacity .35s";
    carta.style.transform = "translateY(40px) scale(.85)";
    carta.style.opacity = "0";
    aviso("Queda para el final");
    setTimeout(function () { ocupado = false; pintar(); }, 300);
  });

  // Moneda: que decida el azar
  $("cara-a").textContent = P.a.corto;
  $("cara-b").textContent = P.b.corto;
  $("x-moneda").addEventListener("click", function () {
    if (!carta || ocupado) return;
    const k = Math.random() < 0.5 ? "a" : "b";
    const disco = $("disco");
    disco.classList.remove("gira");
    disco.style.transform = "";
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
        decidir(k);
      }, 550);
    }, 1600);
  });

  $("x-fallo").addEventListener("click", sentencia);

  // Teclado (en computador)
  document.addEventListener("keydown", function (e) {
    if ($("audiencia").hidden) return;
    if (e.key === "ArrowLeft") decidir("a");
    else if (e.key === "ArrowRight") decidir("b");
    else if (e.key === "ArrowUp") decidir("c");
    else if (e.key === "Backspace" || (e.key === "z" && (e.metaKey || e.ctrlKey))) $("x-undo").click();
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
          S.asig[i] = SIG[k]; guardar(); vibra(10); sentencia();
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

  $("volver").addEventListener("click", audiencia);
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
    audiencia();
  });
})();
