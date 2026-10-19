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

  // ── Estado ──────────────────────────────────────────────────────────────
  const KEY = 'closet.v1';
  const fresh = () => ({
    votes: {}, saved: [], worn: [], wishlist: [], overrides: {}, added: [],
    prefs: { budget: 80, size: 'M', stores: ['Uniqlo', 'Zara'] },
    filters: { occasion: 'casual', weather: 'hoy', withItem: null, neglected: false },
    seed: Math.floor(Math.random() * 1e6),
  });
  let state;
  try { state = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || 'null') }; } catch { state = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  const CAT = { top: 'Arriba', bottom: 'Abajo', shoes: 'Zapatos', layer: 'Capas' };
  const wardrobe = () => [
    ...D.items.map(i => ({ ...i, ...(state.overrides[i.id] || {}) })),
    ...state.added.map(i => ({ ...i, ...(state.overrides[i.id] || {}) })),
  ];
  const wished = () => D.catalog.filter(c => state.wishlist.includes(c.id));
  const feedItems = () => [...wardrobe(), ...wished()];
  const allItemsById = () => Object.fromEntries([...wardrobe(), ...D.catalog].map(i => [i.id, i]));
  const occasion = () => D.occasions.find(o => o.id === state.filters.occasion);
  const weather = () => D.weathers.find(w => w.id === state.filters.weather);

  // ── Toast / sheet ─────────────────────────────────────────────────────
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

  // ── Prenda (silueta o foto) ─────────────────────────────────────────────
  const piece = (it, cls = '') => {
    const wrap = h('div', { class: `piece ${cls} ${it.ghost ? 'ghost' : ''}`, style: `color:${it.color.hex}` });
    if (it.photo) wrap.append(h('img', { src: it.photo, alt: it.name, draggable: 'false' }));
    else wrap.append(svg(it.shape));
    return wrap;
  };

  // Posición de cada prenda en la hoja, como ropa extendida en una cama.
  const LAY = {
    layer:  { x: 2,  y: 2,  w: 56, r: -9 },
    top:    { x: 36, y: 4,  w: 50, r: 5 },
    topSolo:{ x: 10, y: 4,  w: 56, r: -4 },
    bottom: { x: 50, y: 42, w: 46, r: 7 },
    shoes:  { x: 6,  y: 58, w: 40, r: -5 },
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

  // ── Vistas ──────────────────────────────────────────────────────────────
  const app = $('#app');
  let view = 'explorar';
  const views = {};

  function go(v) {
    view = v;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === v));
    app.innerHTML = '';
    app.append(views[v]());
    app.scrollTop = 0;
  }
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => go(t.dataset.view)));

  // Explorar ───────────────────────────────────────────────────────────────
  views.explorar = () => {
    const items = feedItems();
    const byId = allItemsById();
    const outfits = E.build(items, { occasion: occasion(), weather: weather(), withItem: state.filters.withItem,
      neglected: state.filters.neglected, votes: state.votes, seed: state.seed });
    const total = E.countAll(wardrobe(), D.occasions, D.weathers.slice(0, 2), state.votes);
    const dirty = wardrobe().filter(i => i.status === 'sucia').length;
    const w = weather();

    const chip = (label, on, fn, cls = '') => h('button', { class: `chip ${on ? 'on' : ''} ${cls}`, onclick: fn }, label);
    const setF = (k, v) => { state.filters[k] = v; save(); go('explorar'); };
    const withIt = state.filters.withItem ? byId[state.filters.withItem] : null;

    const tickerText = [`${total} outfits posibles con tu armario`, `${w.temp}° y ${w.desc}`,
      dirty ? `${dirty} prendas en la ropa sucia` : 'todo limpio'];
    const ticker = h('div', { class: 'ticker', 'aria-hidden': 'true' },
      h('div', { class: 'ticker-track' }, ...[...tickerText, ...tickerText].map(t => h('span', {}, h('i'), t))));

    const head = h('header', { class: 'head' },
      h('h1', { class: 'display' }, 'Explorar'),
      ticker,
      h('div', { class: 'chips' }, ...D.occasions.map(o => chip(o.label, o.id === state.filters.occasion, () => setF('occasion', o.id)))),
      h('div', { class: 'chips' },
        ...D.weathers.map(x => chip(x.label, x.id === state.filters.weather, () => setF('weather', x.id))),
        chip('Poco usadas', state.filters.neglected, () => setF('neglected', !state.filters.neglected)),
        withIt && chip(`Con ${withIt.name.toLowerCase()}  ×`, true, () => setF('withItem', null), 'with')));

    const feed = h('section', { class: 'feed' });
    let shown = 0;
    const PAGE = 8;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('laid'); io.unobserve(e.target); }
    }), { root: feed, threshold: 0.45 });

    const more = () => {
      outfits.slice(shown, shown + PAGE).forEach(o => { const c = card(o); feed.append(c); io.observe(c); });
      shown += PAGE;
      if (shown < outfits.length) { feed.append(sentinel); moreIo.observe(sentinel); }
    };
    const sentinel = h('div', { class: 'sentinel' });
    const moreIo = new IntersectionObserver(es => { if (es[0].isIntersecting) { moreIo.unobserve(sentinel); sentinel.remove(); more(); } }, { root: feed });

    if (!outfits.length) {
      feed.append(h('div', { class: 'empty' },
        h('p', { class: 'display' }, 'Nada que combine así.'),
        h('p', {}, 'Cambia la ocasión o el clima, o lava algo de la ropa sucia.'),
        h('button', { class: 'btn', onclick: () => go('comprar') }, 'Ver qué te falta')));
    } else more();

    const wrap = h('div', { class: 'view v-explorar' }, head, feed);
    return wrap;
  };

  function card(o) {
    const voted = state.votes[o.key];
    const el = h('article', { class: `card ${voted === 'up' ? 'liked' : ''}` });
    const sheetEl = lay(o);
    const stampSi = h('div', { class: 'stamp si' }, 'Sí');
    const stampNo = h('div', { class: 'stamp no' }, 'No');
    sheetEl.append(stampSi, stampNo);
    const occ = occasion(), w = weather();
    const title = `${occ.label}, ${w.desc}`;
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
    } }, svg('i-puesto'), 'Me lo puse');

    const vote = (v) => {
      state.votes[o.key] = v; save();
      el.classList.add(v === 'up' ? 'fly-right' : 'fly-left');
      if (v === 'up') { stampSi.style.opacity = 1; el.classList.add('liked'); el.addEventListener('animationend', () => el.classList.remove('fly-right'), { once: true }); }
      else el.addEventListener('animationend', () => { el.style.height = el.offsetHeight + 'px'; requestAnimationFrame(() => { el.classList.add('gone'); setTimeout(() => el.remove(), 420); }); }, { once: true });
    };
    swipe(sheetEl, el, stampSi, stampNo, vote);

    el.append(sheetEl,
      h('div', { class: 'meta' },
        h('p', { class: 'why' }, o.reason),
        h('p', { class: 'sub' }, title, ' ', h('span', { class: 'parts' }, o.parts.map(p => p.name.toLowerCase()).join(', ')))),
      h('div', { class: 'acts' },
        h('button', { class: 'act no', 'aria-label': 'No me gusta', onclick: () => vote('down') }, svg('i-no')),
        btnSave, btnWorn,
        h('button', { class: 'act si', 'aria-label': 'Me gusta', onclick: () => vote('up') }, svg('i-si'))));
    return el;
  }

  function swipe(target, cardEl, si, no, onVote) {
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
      if (lock === 'x' && Math.abs(dx) > 100) { target.style.transition = ''; target.style.transform = ''; onVote(dx > 0 ? 'up' : 'down'); }
      else { target.style.transition = ''; target.style.transform = ''; si.style.opacity = 0; no.style.opacity = 0; }
      id = null; lock = null;
    };
    target.addEventListener('pointerup', end); target.addEventListener('pointercancel', end);
  }

  const today = () => new Date().toISOString().slice(0, 10);

  // Armario ────────────────────────────────────────────────────────────────
  let armFilter = 'todo';
  views.armario = () => {
    const items = wardrobe();
    const filters = [['todo', 'Todo'], ['top', 'Arriba'], ['bottom', 'Abajo'], ['shoes', 'Zapatos'], ['layer', 'Capas'], ['sucia', 'Ropa sucia']];
    const list = items.filter(i => armFilter === 'todo' ? true : armFilter === 'sucia' ? i.status === 'sucia' : i.cat === armFilter);
    const grid = h('div', { class: 'grid' }, ...list.map(it => {
      const fig = h('figure', { class: `tile ${it.status !== 'limpia' ? 'off' : ''}`, onclick: () => itemSheet(it) },
        piece(it, 'settled'), h('figcaption', {}, it.name));
      if (it.status !== 'limpia') fig.append(h('span', { class: 'flag' }, it.status === 'sucia' ? 'sucia' : 'prestada'));
      return fig;
    }));
    return h('div', { class: 'view v-armario' },
      h('header', { class: 'head' },
        h('h1', { class: 'display' }, 'Armario', h('small', {}, ` ${items.length}`)),
        h('div', { class: 'chips' }, ...filters.map(([id, l]) => h('button', { class: `chip ${armFilter === id ? 'on' : ''}`, onclick: () => { armFilter = id; go('armario'); } }, l)))),
      grid);
  };

  function itemSheet(it) {
    const ov = state.overrides[it.id] || (state.overrides[it.id] = {});
    const set = (k, v) => { ov[k] = v; save(); };
    const seg = (name, opts, cur, fn) => h('div', { class: 'seg', role: 'group', 'aria-label': name },
      ...opts.map(([v, l]) => h('button', { class: v === cur ? 'on' : '', onclick: e => { fn(v); [...e.currentTarget.parentNode.children].forEach(b => b.classList.toggle('on', b === e.currentTarget)); } }, l)));
    const range = (label, k, lo, hi, cur) => h('label', { class: 'range' }, h('span', {}, label, ' ', h('b', {}, cur)),
      h('input', { type: 'range', min: lo, max: hi, value: cur, oninput: e => { set(k, +e.target.value); e.target.previousSibling.querySelector('b').textContent = e.target.value; } }));
    const big = piece(it, 'settled big');
    const close = sheet(h('div', { class: 'item-sheet' },
      big,
      h('input', { class: 'name', value: it.name, 'aria-label': 'Nombre', onchange: e => set('name', e.target.value) }),
      h('p', { class: 'sub' }, `${it.label}, ${D.colorName(it.color, it.g)}${it.material ? ', ' + it.material : ''}. `,
        it.lastWorn == null ? 'Sin estrenar.' : it.lastWorn === 0 ? 'Puesta hoy.' : `Hace ${it.lastWorn} días, ${it.wearCount} veces.`),
      seg('Estado', [['limpia', 'Limpia'], ['sucia', 'Ropa sucia'], ['prestada', 'Prestada']], it.status, v => set('status', v)),
      range('Formalidad', 'formality', 1, 5, it.formality),
      range('Abrigo', 'warmth', 1, 5, it.warmth),
      h('button', { class: 'btn', onclick: () => { state.filters.withItem = it.id; save(); close(); go('explorar'); } }, 'Ver outfits con esta')));
  }

  // Agregar ────────────────────────────────────────────────────────────────
  views.agregar = () => {
    const wrap = h('div', { class: 'view v-agregar' });
    const input = h('input', { type: 'file', accept: 'image/*', capture: 'environment', hidden: true, onchange: e => { const f = e.target.files[0]; if (f) start(f); } });
    const step1 = h('div', { class: 'add-start' },
      h('h1', { class: 'display' }, 'Nueva prenda'),
      h('p', {}, 'Extiéndela sobre algo liso, con buena luz, y tómale una foto.'),
      h('button', { class: 'btn big-btn', onclick: () => input.click() }, svg('i-camara'), 'Tomar foto'),
      input);
    wrap.append(step1);

    async function start(file) {
      const url = URL.createObjectURL(file);
      const img = new Image(); img.src = url; await img.decode();
      const dataUrl = shrink(img, 640);
      const color = dominant(img);
      wrap.innerHTML = '';
      const photo = h('div', { class: 'cut' }, h('img', { src: dataUrl, alt: '' }));
      const stage = h('div', { class: 'stage' }, h('div', { class: 'bg' }, h('img', { src: dataUrl, alt: '' })), photo);
      const status = h('p', { class: 'status' }, 'Separando la prenda del fondo');
      wrap.append(h('div', { class: 'add-flow' }, stage, status));
      await wait(reduced ? 0 : 900);
      stage.classList.add('peeled');
      await wait(reduced ? 0 : 900);
      status.textContent = 'Mirando colores y tipo';
      const form = h('div', { class: 'add-form' });
      wrap.firstChild.append(form);
      const draft = { color: nearest(color), type: null, formality: 2, warmth: 2, name: '' };
      await wait(reduced ? 0 : 500);
      status.textContent = '';
      const tagline = h('div', { class: 'tags' });
      form.append(tagline);
      const tag = (t) => { const s = h('span', { class: 'tag' }, t); tagline.append(s); return wait(reduced ? 0 : 320); };
      await tag(`Color: ${draft.color.name}`);
      await tag('¿Qué es?');
      const types = Object.entries(D.shapes);
      const pick = h('div', { class: 'chips wrap' }, ...types.map(([id, s]) => h('button', { class: 'chip', onclick: e => {
        draft.type = id; draft.cat = s.cat; draft.shape = s.shape; draft.label = s.label;
        [...pick.children].forEach(c => c.classList.toggle('on', c === e.currentTarget));
        draft.name = D.itemName(s, draft.color); nameI.value = draft.name; rest.hidden = false;
      } }, s.label)));
      const nameI = h('input', { class: 'name', placeholder: 'Nombre', 'aria-label': 'Nombre', oninput: e => draft.name = e.target.value });
      const rest = h('div', { hidden: true },
        nameI,
        h('label', { class: 'range' }, h('span', {}, 'Formalidad ', h('b', {}, '2')), h('input', { type: 'range', min: 1, max: 5, value: 2, oninput: e => { draft.formality = +e.target.value; e.target.previousSibling.querySelector('b').textContent = e.target.value; } })),
        h('label', { class: 'range' }, h('span', {}, 'Abrigo ', h('b', {}, '2')), h('input', { type: 'range', min: 1, max: 5, value: 2, oninput: e => { draft.warmth = +e.target.value; e.target.previousSibling.querySelector('b').textContent = e.target.value; } })),
        h('button', { class: 'btn', onclick: () => {
          state.added.push({ id: 'a' + Date.now(), type: draft.type, cat: draft.cat, shape: draft.shape, label: draft.label, color: draft.color,
            name: draft.name || D.itemName(D.shapes[draft.type], draft.color), formality: draft.formality, warmth: draft.warmth, status: 'limpia', lastWorn: null, wearCount: 0, photo: dataUrl });
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

  // Comprar ────────────────────────────────────────────────────────────────
  views.comprar = () => {
    const items = wardrobe();
    const gaps = E.gaps(items, D.catalog.filter(c => !state.wishlist.includes(c.id)), D.occasions.slice(0, 3), D.weathers.slice(0, 2), state.votes)
      .filter(g => g.unlocks > 0).slice(0, 8);
    const total = E.countAll(items, D.occasions, D.weathers.slice(0, 2), state.votes);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });

    const rows = gaps.map(g => {
      const num = h('b', { class: 'num', 'data-n': g.unlocks }, reduced ? g.unlocks : '0');
      const prods = (D.products[g.item.id] || []).filter(p => p.price <= state.prefs.budget * 2.5);
      const detail = h('div', { class: 'detail', hidden: true },
        h('p', { class: 'sub' }, `Talla ${state.prefs.size}, hasta $${state.prefs.budget}. Precios de ejemplo.`),
        ...prods.map(p => h('div', { class: `prod ${p.price > state.prefs.budget ? 'over' : ''}` },
          h('span', { class: 'store' }, p.store), h('span', { class: 'pname' }, p.name), h('span', { class: 'price' }, `$${p.price.toFixed(0)}`))),
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
    const prefs = h('div', { class: 'prefs' },
      h('h2', { class: 'display' }, 'Tus medidas'),
      h('label', { class: 'range' }, h('span', {}, 'Presupuesto por prenda ', h('b', {}, '$' + state.prefs.budget)),
        h('input', { type: 'range', min: 20, max: 300, step: 10, value: state.prefs.budget, oninput: e => { state.prefs.budget = +e.target.value; e.target.previousSibling.querySelector('b').textContent = '$' + e.target.value; }, onchange: () => { save(); go('comprar'); } })),
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Talla' }, ...['S', 'M', 'L', 'XL'].map(s => h('button', { class: s === state.prefs.size ? 'on' : '', onclick: () => { state.prefs.size = s; save(); go('comprar'); } }, s))));

    return h('div', { class: 'view v-comprar' },
      h('header', { class: 'head' },
        h('h1', { class: 'display' }, 'Comprar'),
        h('p', { class: 'lead' }, `Con lo que tienes se arman ${total} outfits. Esto es lo que más sumaría:`)),
      h('div', { class: 'gaps' }, ...rows),
      wl.length ? h('div', { class: 'wish' },
        h('h2', { class: 'display' }, 'Tu lista'),
        ...wl.map(it => h('div', { class: 'wish-row' }, piece(it, 'settled'), h('span', {}, it.name),
          h('button', { class: 'mini', onclick: () => { state.wishlist = state.wishlist.filter(x => x !== it.id); if (state.filters.withItem === it.id) state.filters.withItem = null; save(); go('comprar'); } }, 'Quitar'),
          h('button', { class: 'mini on', onclick: () => {
            state.wishlist = state.wishlist.filter(x => x !== it.id);
            state.added.push({ ...it, id: 'a' + Date.now(), ghost: false, status: 'limpia', lastWorn: null, wearCount: 0 });
            if (state.filters.withItem === it.id) state.filters.withItem = null;
            save(); toast('Ya está en tu armario'); go('comprar');
          } }, 'La compré')))) : null,
      prefs);
  };

  function count(el) {
    const n = +el.dataset.n; const t0 = performance.now(); const dur = 900;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // Guardados ──────────────────────────────────────────────────────────────
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
      saved.length ? h('div', { class: 'minis' }, ...saved.map(o => h('div', { class: 'mini-wrap' }, mini(o)))) :
        h('div', { class: 'empty small' }, h('p', {}, 'Lo que guardes en Explorar aparece aquí.')),
      h('h2', { class: 'display' }, 'Te pusiste'),
      worn.length ? h('div', { class: 'worn' }, ...worn.map(x => h('div', { class: 'worn-row' }, mini(x.o), h('span', {}, fmt(x.date), h('br'), h('small', {}, x.o.parts.map(p => p.name.toLowerCase()).join(', ')))))) :
        h('div', { class: 'empty small' }, h('p', {}, 'Marca "Me lo puse" y aquí queda la fecha.')),
      h('h2', { class: 'display' }, 'Casi nunca te pones'),
      h('div', { class: 'never' }, ...never.map(it => h('button', { class: 'never-row', onclick: () => { state.filters.withItem = it.id; state.filters.neglected = false; save(); go('explorar'); } },
        piece(it, 'settled'), h('span', {}, it.name, h('br'), h('small', {}, it.lastWorn == null ? 'Sin estrenar' : `Hace ${it.lastWorn} días`))))));
  };

  go('explorar');
})();
