/* Closet — prototipo navegable. Estado en localStorage; sin servidor aún. */
(() => {
  const D = window.CLOSET_DATA, E = window.CLOSET_ENGINE;
  const $ = (s, r = document) => r.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (v != null && v !== false) el.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(k));
    return el;
  };
  const svg = (id, cls = '') => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = `<use href="#${id}"/>`;
    return s;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => matchMedia('(min-width: 900px)').matches;

  // ── Estado ──────────────────────────────────────────────────────────────
  const KEY = 'closet.v2';
  const fresh = () => ({
    votes: {}, saved: [], worn: [], wishlist: [], overrides: {}, added: [],
    prefs: { size: 'M', mall: 'any', brands: [] },
    filters: { occasion: 'casual', weather: 'hoy', withItem: null, neglected: false },
    seed: Math.floor(Math.random() * 1e6),
  });
  let state;
  try { state = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || 'null') }; } catch { state = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  const wardrobe = () => [...D.items, ...state.added]
    .map(i => ({ ...i, ...(state.overrides[i.id] || {}) }))
    .filter(i => !i.removed);
  const wished = () => D.catalog.filter(c => state.wishlist.includes(c.id));
  const feedItems = () => [...wardrobe(), ...wished()];
  const allItemsById = () => Object.fromEntries([...wardrobe(), ...D.catalog].map(i => [i.id, i]));
  const occasion = () => D.occasions.find(o => o.id === state.filters.occasion);
  const weather = () => D.weathers.find(w => w.id === state.filters.weather);
  const today = () => new Date().toISOString().slice(0, 10);

  // ── Toast / hoja ─────────────────────────────────────────────────────
  let toastT;
  const toast = (msg) => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200);
  };
  const sheet = (content) => {
    const root = $('#sheet-root');
    root.innerHTML = '';
    const close = () => { root.firstChild?.classList.remove('on'); setTimeout(() => root.innerHTML = '', 260); };
    const el = h('div', { class: 'sheet-wrap', onclick: e => { if (e.target === el) close(); } },
      h('div', { class: 'sheet', role: 'dialog' },
        h('button', { class: 'sheet-x', 'aria-label': 'Cerrar', onclick: close }, svg('i-cerrar')),
        content));
    root.append(el);
    requestAnimationFrame(() => el.classList.add('on'));
    return close;
  };

  // ── Prenda (foto o silueta de respaldo) ─────────────────────────────────
  const piece = (it, cls = '') => {
    const wrap = h('div', { class: `piece ${cls} ${it.ghost ? 'ghost' : ''}`, style: `color:${it.color.hex}` });
    const fallback = () => { wrap.innerHTML = ''; wrap.classList.add('vec'); wrap.append(svg(it.shape)); };
    if (it.photo) {
      const img = h('img', { class: 'ph', src: it.photo, alt: it.name, draggable: 'false', loading: 'lazy' });
      img.addEventListener('error', fallback, { once: true });
      wrap.append(img, h('i', { class: 'sh' }));
    } else fallback();
    return wrap;
  };

  // Posición de cada prenda en la hoja, como ropa extendida sobre una mesa.
  const LAY = {
    layer:   { x: 0,  y: 2,  w: 54, r: -7 },
    top:     { x: 38, y: 3,  w: 50, r: 5 },
    topSolo: { x: 10, y: 4,  w: 54, r: -4 },
    bottom:  { x: 54, y: 40, w: 40, r: 6 },
    shoes:   { x: 5,  y: 62, w: 40, r: -4 },
  };
  const lay = (outfit, cls = '') => {
    const el = h('div', { class: `lay ${cls}` });
    const hasLayer = outfit.parts.some(p => p.cat === 'layer');
    outfit.parts.forEach((p, i) => {
      const pos = p.cat === 'top' && !hasLayer ? LAY.topSolo : LAY[p.cat];
      const pc = piece(p);
      pc.style.cssText += `;left:${pos.x}%;top:${pos.y}%;width:${pos.w}%;--r:${pos.r}deg;--i:${i};--dx:${(i % 2 ? 1 : -1) * 30}px`;
      pc.addEventListener('animationend', () => pc.classList.add('settled'), { once: true });
      if (reduced) pc.classList.add('settled');
      el.append(pc);
    });
    return el;
  };

  // ── Navegación ──────────────────────────────────────────────────────────
  const app = $('#app');
  const views = {};
  function go(v) {
    document.querySelectorAll('[data-view]').forEach(t => t.classList.toggle('on', t.dataset.view === v));
    app.innerHTML = '';
    app.append(views[v]());
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('[data-view]').forEach(t => t.addEventListener('click', () => go(t.dataset.view)));

  const chip = (label, on, fn, cls = '') => h('button', { class: `chip ${on ? 'on' : ''} ${cls}`, onclick: fn }, label);
  const emph = (text, em) => h('span', {}, text, h('em', {}, em));

  // ── Explorar ────────────────────────────────────────────────────────────
  views.explorar = () => {
    const items = feedItems();
    const byId = allItemsById();
    const occ = occasion(), w = weather();
    const outfits = E.build(items, { occasion: occ, weather: w, withItem: state.filters.withItem,
      neglected: state.filters.neglected, votes: state.votes, seed: state.seed });
    const total = E.countAll(wardrobe(), D.occasions, D.weathers.slice(0, 2), state.votes);
    const setF = (k, v) => { state.filters[k] = v; save(); go('explorar'); };
    const withIt = state.filters.withItem ? byId[state.filters.withItem] : null;

    const title = withIt
      ? h('h1', { class: 'display' }, 'Con ', h('em', {}, withIt.name.toLowerCase()), ` para ${w.phrase}.`)
      : h('h1', { class: 'display' }, `${occ.label} para `, h('em', {}, w.phrase), '.');

    const head = h('header', { class: 'head' },
      title,
      h('p', { class: 'count' }, h('b', { 'data-n': total }, reduced ? total : '0'), ` outfits posibles con lo que tienes`),
      h('div', { class: 'chips' }, ...D.occasions.map(o => chip(o.label, o.id === state.filters.occasion, () => setF('occasion', o.id)))),
      h('div', { class: 'chips' },
        ...D.weathers.map(x => chip(x.label, x.id === state.filters.weather, () => setF('weather', x.id))),
        chip('Poco usadas', state.filters.neglected, () => setF('neglected', !state.filters.neglected)),
        withIt && chip(`Con ${withIt.name.toLowerCase()}  ×`, true, () => setF('withItem', null), 'with')));
    requestAnimationFrame(() => count(head.querySelector('.count b')));

    const feed = h('section', { class: 'feed' });
    const PAGE = desktop() ? 12 : 8;
    let shown = 0;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('laid'); io.unobserve(e.target); }
    }), { threshold: 0.35 });
    const sentinel = h('div', { class: 'sentinel' });
    const moreIo = new IntersectionObserver(es => { if (es[0].isIntersecting) { moreIo.unobserve(sentinel); sentinel.remove(); more(); } });
    const more = () => {
      outfits.slice(shown, shown + PAGE).forEach(o => { const c = card(o); feed.append(c); io.observe(c); });
      shown += PAGE;
      if (shown < outfits.length) { feed.append(sentinel); moreIo.observe(sentinel); }
    };

    if (!outfits.length) {
      feed.append(h('div', { class: 'empty' },
        h('p', { class: 'display' }, 'Nada que combine así.'),
        h('p', {}, 'Cambia la ocasión o el clima.'),
        h('button', { class: 'btn', onclick: () => go('comprar') }, 'Ver qué te falta')));
    } else more();

    return h('div', { class: 'view v-explorar' }, head, feed);
  };

  function card(o) {
    const voted = state.votes[o.key];
    const el = h('article', { class: `card ${voted === 'up' ? 'liked' : ''}` });
    const sheetEl = lay(o);
    const stampSi = h('div', { class: 'stamp si' }, 'Sí');
    const stampNo = h('div', { class: 'stamp no' }, 'No');
    sheetEl.append(stampSi, stampNo);
    const isSaved = state.saved.includes(o.key);
    const worn = state.worn.find(x => x.key === o.key);

    const btnSave = h('button', { class: `act ${isSaved ? 'on' : ''}`, 'aria-label': 'Guardar', onclick: () => {
      const i = state.saved.indexOf(o.key);
      if (i >= 0) { state.saved.splice(i, 1); btnSave.classList.remove('on'); toast('Quitado de guardados'); }
      else { state.saved.push(o.key); btnSave.classList.add('on'); toast('Guardado'); }
      save();
    } }, svg('i-guardar'));
    const btnWorn = h('button', { class: `act wide ${worn ? 'on' : ''}`, onclick: () => {
      if (state.worn.some(x => x.key === o.key && x.date === today())) return toast('Ya está anotado para hoy');
      state.worn.unshift({ key: o.key, date: today() });
      o.parts.forEach(p => { if (!p.ghost) { const ov = state.overrides[p.id] || {}; ov.lastWorn = 0; ov.wearCount = (p.wearCount || 0) + 1; state.overrides[p.id] = ov; } });
      save(); btnWorn.classList.add('on'); toast('Anotado para hoy');
    } }, svg('i-explorar'), 'Me lo puse');

    const vote = (v) => {
      state.votes[o.key] = v; save();
      el.classList.add(v === 'up' ? 'fly-right' : 'fly-left');
      if (v === 'up') { stampSi.style.opacity = 1; el.classList.add('liked'); el.addEventListener('animationend', () => el.classList.remove('fly-right'), { once: true }); }
      else el.addEventListener('animationend', () => { el.style.height = el.offsetHeight + 'px'; requestAnimationFrame(() => { el.classList.add('gone'); setTimeout(() => el.remove(), 420); }); }, { once: true });
    };
    swipe(sheetEl, stampSi, stampNo, vote);

    el.append(sheetEl,
      h('div', { class: 'meta' },
        h('p', { class: 'why' }, o.reason),
        h('p', { class: 'sub' }, o.parts.map(p => p.name).join(' · ').replace(/ · /g, ', '))),
      h('div', { class: 'acts' },
        h('button', { class: 'act no', 'aria-label': 'No me gusta', onclick: () => vote('down') }, svg('i-no')),
        btnSave, btnWorn,
        h('button', { class: 'act si', 'aria-label': 'Me gusta', onclick: () => vote('up') }, svg('i-si'))));
    return el;
  }

  function swipe(target, si, no, onVote) {
    let x0, y0, dx = 0, lock = null, id = null;
    target.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; dx = 0; lock = null; id = e.pointerId; });
    target.addEventListener('pointermove', e => {
      if (id !== e.pointerId) return;
      dx = e.clientX - x0; const dy = e.clientY - y0;
      if (!lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (lock !== 'x') return;
      target.setPointerCapture(id);
      target.style.transition = 'none';
      target.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      si.style.opacity = Math.min(1, Math.max(0, dx) / 110);
      no.style.opacity = Math.min(1, Math.max(0, -dx) / 110);
    });
    const end = () => {
      if (id == null) return;
      target.style.transition = ''; target.style.transform = '';
      if (lock === 'x' && Math.abs(dx) > 100) onVote(dx > 0 ? 'up' : 'down');
      else { si.style.opacity = 0; no.style.opacity = 0; }
      id = null; lock = null;
    };
    target.addEventListener('pointerup', end); target.addEventListener('pointercancel', end);
  }

  function count(el) {
    if (!el || reduced) return;
    const n = +el.dataset.n; const t0 = performance.now(); const dur = 900;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // ── Armario ─────────────────────────────────────────────────────────────
  let armFilter = 'todo';
  views.armario = () => {
    const items = wardrobe();
    const filters = [['todo', 'Todo'], ['top', 'Arriba'], ['bottom', 'Abajo'], ['shoes', 'Zapatos'], ['layer', 'Capas']];
    const list = items.filter(i => armFilter === 'todo' || i.cat === armFilter);
    return h('div', { class: 'view v-armario' },
      h('header', { class: 'head' },
        h('h1', { class: 'display' }, 'Armario', h('small', {}, ` ${items.length}`)),
        h('div', { class: 'chips' }, ...filters.map(([id, l]) => chip(l, armFilter === id, () => { armFilter = id; go('armario'); })))),
      h('div', { class: 'grid' }, ...list.map(it =>
        h('figure', { class: 'tile', onclick: () => itemSheet(it) }, piece(it, 'settled'), h('figcaption', {}, it.name)))));
  };

  function itemSheet(it) {
    const ov = state.overrides[it.id] || (state.overrides[it.id] = {});
    const set = (k, v) => { ov[k] = v; save(); };
    const range = (label, k, lo, hi, cur) => h('label', { class: 'range' }, h('span', {}, label, ' ', h('b', {}, cur)),
      h('input', { type: 'range', min: lo, max: hi, value: cur, oninput: e => { set(k, +e.target.value); e.target.previousSibling.querySelector('b').textContent = e.target.value; } }));
    const close = sheet(h('div', { class: 'item-sheet' },
      piece(it, 'settled big'),
      h('input', { class: 'name', value: it.name, 'aria-label': 'Nombre', onchange: e => set('name', e.target.value) }),
      h('p', { class: 'sub' }, `${it.label}, ${D.colorName(it.color, it.g)}${it.material ? ', ' + it.material : ''}. `,
        it.lastWorn == null ? 'Sin estrenar.' : it.lastWorn === 0 ? 'Puesta hoy.' : `Hace ${it.lastWorn} días, ${it.wearCount} veces.`),
      range('Formalidad', 'formality', 1, 5, it.formality),
      range('Abrigo', 'warmth', 1, 5, it.warmth),
      h('button', { class: 'btn', onclick: () => { state.filters.withItem = it.id; save(); close(); go('explorar'); } }, 'Ver outfits con esta'),
      h('button', { class: 'btn ghost-btn', onclick: () => { set('removed', true); close(); toast('Quitada del armario'); go('armario'); } }, 'Quitar del armario')));
  }

  // ── Agregar ─────────────────────────────────────────────────────────────
  views.agregar = () => {
    const wrap = h('div', { class: 'view v-agregar' });
    const onFile = e => { const f = e.target.files[0]; if (f) start(f); };
    const cam = h('input', { type: 'file', accept: 'image/*', capture: 'environment', hidden: true, onchange: onFile });
    const gal = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: onFile });
    const start1 = h('div', { class: 'add-start',
      ondragover: e => { e.preventDefault(); start1.classList.add('over'); },
      ondragleave: () => start1.classList.remove('over'),
      ondrop: e => { e.preventDefault(); start1.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) start(f); } },
      h('h1', { class: 'display' }, 'Nueva ', h('em', {}, 'prenda')),
      h('p', {}, 'Extiéndela sobre algo liso y claro, con buena luz.'),
      h('div', { class: 'add-btns' },
        h('button', { class: 'btn big-btn only-touch', onclick: () => cam.click() }, svg('i-camara'), 'Tomar foto'),
        h('button', { class: 'btn big-btn', onclick: () => gal.click() }, svg('i-galeria'), 'Elegir de la galería')),
      h('p', { class: 'drop-hint only-pointer' }, 'o suelta la imagen aquí'),
      cam, gal);
    wrap.append(start1);

    async function start(file) {
      const url = URL.createObjectURL(file);
      const img = new Image(); img.src = url; await img.decode();
      const dataUrl = shrink(img, 720);
      const color = dominant(img);
      wrap.innerHTML = '';
      const stage = h('div', { class: 'stage' }, h('div', { class: 'bg' }, h('img', { src: dataUrl, alt: '' })), h('div', { class: 'cut' }, h('img', { src: dataUrl, alt: '' })));
      const status = h('p', { class: 'status' }, 'Separando la prenda del fondo');
      const form = h('div', { class: 'add-form' });
      wrap.append(h('div', { class: 'add-flow' }, h('div', {}, stage, status), form));
      await wait(reduced ? 0 : 900);
      stage.classList.add('peeled');
      await wait(reduced ? 0 : 900);
      status.textContent = 'Mirando colores y tipo';
      const draft = { color: nearest(color), type: null, formality: 2, warmth: 2, name: '' };
      await wait(reduced ? 0 : 500);
      status.textContent = '';
      const tagline = h('div', { class: 'tags' });
      form.append(tagline);
      const tag = (t) => { tagline.append(h('span', { class: 'tag' }, t)); return wait(reduced ? 0 : 320); };
      await tag(`Color: ${draft.color.name}`);
      await tag('¿Qué es?');
      const nameI = h('input', { class: 'name', placeholder: 'Nombre', 'aria-label': 'Nombre', oninput: e => draft.name = e.target.value });
      const pick = h('div', { class: 'chips wrap' }, ...Object.entries(D.shapes).map(([id, s]) => chip(s.label, false, e => {
        Object.assign(draft, { type: id, cat: s.cat, shape: s.shape, label: s.label, g: s.g, en: s.en, name: D.itemName(s, draft.color) });
        [...pick.children].forEach(c => c.classList.toggle('on', c === e.currentTarget));
        nameI.value = draft.name; rest.hidden = false;
      })));
      const rangeI = (label, k) => h('label', { class: 'range' }, h('span', {}, label, ' ', h('b', {}, '2')),
        h('input', { type: 'range', min: 1, max: 5, value: 2, oninput: e => { draft[k] = +e.target.value; e.target.previousSibling.querySelector('b').textContent = e.target.value; } }));
      const rest = h('div', { hidden: true }, nameI, rangeI('Formalidad', 'formality'), rangeI('Abrigo', 'warmth'),
        h('button', { class: 'btn', onclick: () => {
          state.added.push({ id: 'a' + Date.now(), type: draft.type, cat: draft.cat, shape: draft.shape, label: draft.label, g: draft.g, en: draft.en,
            color: draft.color, name: draft.name || D.itemName(D.shapes[draft.type], draft.color), q: '', formality: draft.formality, warmth: draft.warmth,
            lastWorn: null, wearCount: 0, photo: dataUrl, material: '' });
          save(); toast('Ya está en tu armario'); armFilter = 'todo'; go('armario');
        } }, 'Guardar en el armario'));
      form.append(pick, rest);
    }
    return wrap;
  };

  const wait = ms => new Promise(r => setTimeout(r, ms));
  function shrink(img, max) {
    const c = document.createElement('canvas'); const k = Math.min(1, max / Math.max(img.width, img.height));
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  }
  // Color dominante del centro de la foto (el fondo suele estar en los bordes).
  function dominant(img) {
    const c = document.createElement('canvas'); c.width = c.height = 40;
    const x = c.getContext('2d'); x.drawImage(img, img.width * .25, img.height * .25, img.width * .5, img.height * .5, 0, 0, 40, 40);
    const d = x.getImageData(0, 0, 40, 40).data; let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    return [r / n, g / n, b / n];
  }
  function nearest([r, g, b]) {
    let best = null, bd = 1e9;
    for (const c of Object.values(D.colors)) {
      const [cr, cg, cb] = [1, 3, 5].map(i => parseInt(c.hex.slice(i, i + 2), 16));
      const d = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
      if (d < bd) { bd = d; best = c; }
    }
    return { ...best, hex: `rgb(${r | 0},${g | 0},${b | 0})` };
  }

  // ── Comprar ─────────────────────────────────────────────────────────────
  views.comprar = () => {
    const items = wardrobe();
    const gaps = E.gaps(items, D.catalog.filter(c => !state.wishlist.includes(c.id)), D.occasions.slice(0, 3), D.weathers.slice(0, 2), state.votes)
      .filter(g => g.unlocks > 0).slice(0, 8);
    const total = E.countAll(items, D.occasions, D.weathers.slice(0, 2), state.votes);
    const mall = D.malls.find(m => m.id === state.prefs.mall) || D.malls[0];
    const mallBrands = mall.brands.map(id => ({ id, ...D.brands[id] })).filter(b => b.name).sort((a, b) => a.name.localeCompare(b.name));
    const picked = state.prefs.brands.filter(id => mall.brands.includes(id));
    const setP = (k, v) => { state.prefs[k] = v; save(); go('comprar'); };

    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });

    const rows = gaps.map(g => {
      const num = h('b', { class: 'num', 'data-n': g.unlocks }, reduced ? g.unlocks : '0');
      // Primero las marcas fuertes en ese tipo de prenda; el resto, al pedirlo.
      const where = mallBrands.filter(b => b.cats.includes(g.item.cat) && (!picked.length || picked.includes(b.id)))
        .sort((a, b) => ((b.strong || []).includes(g.item.type) - (a.strong || []).includes(g.item.type)) || a.name.localeCompare(b.name));
      const LIMIT = 8;
      const link = b => h('a', { class: 'store', href: b.search.replace('{q}', encodeURIComponent(g.item.q)), target: '_blank', rel: 'noopener' }, b.name, svg('i-salir'));
      const stores = h('div', { class: 'stores' }, ...where.slice(0, LIMIT).map(link));
      const moreBtn = where.length > LIMIT && !picked.length ? h('button', { class: 'mini', onclick: () => { stores.append(...where.slice(LIMIT).map(link)); moreBtn.remove(); } }, `Ver las ${where.length}`) : null;
      const detail = h('div', { class: 'detail', hidden: true },
        h('p', { class: 'sub' }, where.length
          ? (mall.id === 'any' ? 'Búscala en' : `En ${mall.name}${mall.outlet ? ' (outlet)' : ''} la tienen`)
          : (mall.id === 'any' ? 'Sin tiendas cargadas todavía.' : `Ninguna de tus marcas en ${mall.name} vende esto.`)),
        stores, moreBtn,
        h('div', { class: 'row-btns' },
          h('button', { class: 'btn ghost-btn', onclick: () => { state.filters.withItem = g.item.id; state.wishlist.push(g.item.id); save(); go('explorar'); } }, 'Probar en outfits'),
          h('button', { class: 'btn', onclick: () => { state.wishlist.push(g.item.id); save(); toast('En tu lista'); go('comprar'); } }, 'Lo quiero')));
      const row = h('div', { class: 'gap' },
        h('button', { class: 'gap-head', onclick: () => { detail.hidden = !detail.hidden; row.classList.toggle('open'); } },
          piece(g.item, 'settled'),
          h('span', { class: 'gap-name' }, g.item.name),
          h('span', { class: 'unlock' }, num, h('small', {}, 'outfits nuevos'))),
        detail);
      io.observe(num);
      return row;
    });

    const wl = wished();
    return h('div', { class: 'view v-comprar' },
      h('header', { class: 'head' },
        h('h1', { class: 'display' }, 'Lo que te ', h('em', {}, 'falta'), '.'),
        h('p', { class: 'lead' }, `Con lo que tienes se arman ${total} outfits. Cada prenda de abajo abre combinaciones que hoy no existen.`),
        h('div', { class: 'chips' }, ...D.malls.map(m => chip(m.name, m.id === mall.id, () => setP('mall', m.id)))),
        mallBrands.length > 1 ? h('div', { class: 'chips brands' }, ...mallBrands.map(b => chip(b.name, picked.includes(b.id), () => {
          const s = new Set(state.prefs.brands); s.has(b.id) ? s.delete(b.id) : s.add(b.id); setP('brands', [...s]);
        }, 'small'))) : null),
      h('div', { class: 'gaps' }, ...rows),
      wl.length ? h('div', { class: 'wish' },
        h('h2', { class: 'display' }, 'Tu lista'),
        ...wl.map(it => h('div', { class: 'wish-row' }, piece(it, 'settled'), h('span', {}, it.name),
          h('button', { class: 'mini', onclick: () => { state.wishlist = state.wishlist.filter(x => x !== it.id); if (state.filters.withItem === it.id) state.filters.withItem = null; save(); go('comprar'); } }, 'Quitar'),
          h('button', { class: 'mini on', onclick: () => {
            state.wishlist = state.wishlist.filter(x => x !== it.id);
            state.added.push({ ...it, id: 'a' + Date.now(), ghost: false, lastWorn: null, wearCount: 0 });
            if (state.filters.withItem === it.id) state.filters.withItem = null;
            save(); toast('Ya está en tu armario'); go('comprar');
          } }, 'La compré')))) : null,
      h('div', { class: 'prefs' },
        h('h2', { class: 'display' }, 'Tu talla'),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Talla' }, ...['S', 'M', 'L', 'XL'].map(s => h('button', { class: s === state.prefs.size ? 'on' : '', onclick: () => setP('size', s) }, s)))));
  };

  // ── Guardados ───────────────────────────────────────────────────────────
  views.guardados = () => {
    const byId = allItemsById();
    const toOutfit = key => { const parts = key.split('+').map(id => byId[id]).filter(Boolean); return parts.length ? { key, parts } : null; };
    const saved = state.saved.map(toOutfit).filter(Boolean);
    const worn = state.worn.slice(0, 14).map(x => ({ ...x, o: toOutfit(x.key) })).filter(x => x.o);
    const never = wardrobe().filter(i => i.lastWorn == null || i.lastWorn >= 60);
    const fmt = d => { const [y, m, dd] = d.split('-'); return `${+dd} de ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][+m - 1]}`; };
    const mini = o => { const l = lay(o, 'mini'); l.classList.add('laid'); return l; };

    return h('div', { class: 'view v-guardados' },
      h('header', { class: 'head' }, h('h1', { class: 'display' }, 'Guardados')),
      saved.length ? h('div', { class: 'minis' }, ...saved.map(o => h('div', { class: 'mini-wrap' }, mini(o), h('p', { class: 'sub' }, o.parts.map(p => p.name).join(', '))))) :
        h('div', { class: 'empty small' }, h('p', {}, 'Lo que guardes en Explorar aparece aquí.')),
      h('h2', { class: 'display' }, 'Te pusiste'),
      worn.length ? h('div', { class: 'worn' }, ...worn.map(x => h('div', { class: 'worn-row' }, mini(x.o), h('span', {}, fmt(x.date), h('br'), h('small', {}, x.o.parts.map(p => p.name).join(', ')))))) :
        h('div', { class: 'empty small' }, h('p', {}, 'Marca "Me lo puse" y aquí queda la fecha.')),
      h('h2', { class: 'display' }, 'Casi nunca te pones'),
      h('div', { class: 'never' }, ...never.map(it => h('button', { class: 'never-row', onclick: () => { state.filters.withItem = it.id; state.filters.neglected = false; save(); go('explorar'); } },
        piece(it, 'settled'), h('span', {}, it.name, h('br'), h('small', {}, it.lastWorn == null ? 'Sin estrenar' : `Hace ${it.lastWorn} días`))))));
  };

  go('explorar');
})();
