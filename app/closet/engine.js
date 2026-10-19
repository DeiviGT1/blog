/* Motor de combinación. Reglas puras, sin IA: filtra lo imposible y puntúa
   lo posible. En la versión final vive en Python (closet_engine.py) y la IA
   solo elige entre lo que este motor ya aprobó. */
window.CLOSET_ENGINE = (() => {
  // Pares de familias de color: negativo choca, positivo suma.
  const PAIRS = {
    'cafe|negro': -3, 'marino|negro': -1.5, 'calido|vino': -2, 'oliva|vino': -1,
    'denim|denim': -2.5, 'azul|denim': -0.5, 'calido|calido': -1.5, 'vino|vino': -2,
    'oliva|oliva': -1.5, 'cafe|cafe': -1, 'tierra|tierra': -1,
    'marino|tierra': 1.5, 'oliva|neutral': 0.5, 'cafe|oliva': 1, 'denim|neutral': 0.5,
    'vino|neutral': 1, 'marino|neutral': 0.5, 'cafe|tierra': 1, 'cafe|marino': 1,
    'azul|tierra': 1, 'oliva|tierra': 0.5, 'calido|marino': 1, 'azul|marino': 0.5,
  };
  const pairKey = (a, b) => [a, b].sort().join('|');
  const pair = (a, b) => {
    if (a === 'neutral' && b === 'neutral') return 0;
    return PAIRS[pairKey(a, b)] ?? 0;
  };

  const seeded = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const keyOf = (parts) => parts.map(p => p.id).sort().join('+');

  function climate(w) {
    if (w.temp >= 26) return { layer: 'no',   maxWarmth: 2, minLayer: 0 };
    if (w.temp >= 20) return { layer: 'opt',  maxWarmth: 3, minLayer: 2 };
    if (w.temp >= 12) return { layer: 'yes',  maxWarmth: 4, minLayer: 3 };
    return               { layer: 'yes',  maxWarmth: 5, minLayer: 4 };
  }

  function isValid(parts, occ, w) {
    const c = climate(w);
    const layer = parts.find(p => p.cat === 'layer');
    const top = parts.find(p => p.cat === 'top');
    const bottom = parts.find(p => p.cat === 'bottom');
    const shoes = parts.find(p => p.cat === 'shoes');
    if (!top || !bottom || !shoes) return false;
    if (c.layer === 'no' && layer) return false;
    if (c.layer === 'yes' && !layer) return false;
    if (layer && layer.warmth < c.minLayer) return false;
    if (parts.some(p => p.warmth > c.maxWarmth)) return false;
    if (w.rain && (shoes.material === 'ante' || bottom.type === 'short')) return false;
    if (bottom.type === 'short' && (w.temp < 24 || occ.formality[1] > 2)) return false;
    if (occ.id === 'deporte') return parts.every(p => p.formality === 1) && shoes.type === 'tenis';
    const [lo, hi] = occ.formality;
    const fs = parts.map(p => p.formality);
    // Ninguna prenda por encima de la ocasión ni más de un punto por debajo,
    // y el salto entre la más formal y la menos formal nunca pasa de 2.
    if (fs.some(f => f < lo - 1 || f > hi)) return false;
    if (Math.max(...fs) - Math.min(...fs) > 2) return false;
    const avg = fs.reduce((s, f) => s + f, 0) / fs.length;
    return avg >= lo - 0.5 && avg <= hi + 0.5;
  }

  function colorScore(parts) {
    let s = 0;
    for (let i = 0; i < parts.length; i++)
      for (let j = i + 1; j < parts.length; j++)
        s += pair(parts[i].color.family, parts[j].color.family);
    return s;
  }

  function noveltyScore(parts) {
    return parts.reduce((s, p) => {
      if (p.ghost) return s + 1;
      if (p.lastWorn == null) return s + 2;
      if (p.lastWorn >= 30) return s + 1.5;
      if (p.lastWorn >= 14) return s + 1;
      if (p.lastWorn <= 2) return s - 1.5;
      return s;
    }, 0);
  }

  // Lo aprendido de los 👍/👎: pares de prendas que ya votaste.
  function learnedScore(parts, votes, outfitsByKey) {
    let s = 0;
    const ids = parts.map(p => p.id);
    for (const [key, v] of Object.entries(votes)) {
      const voted = key.split('+');
      const shared = voted.filter(id => ids.includes(id)).length;
      if (shared >= 2) s += (v === 'up' ? 0.6 : -0.9) * (shared - 1);
    }
    return s;
  }

  function reason(parts, occ, w, colorS, novS) {
    const names = parts.map(p => p.color.name);
    const fams = parts.map(p => p.color.family);
    const best = (() => {
      let b = null;
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const v = pair(fams[i], fams[j]);
        if (v > 0 && (!b || v > b.v)) b = { v, a: names[i], c: names[j] };
      }
      return b;
    })();
    const old = parts.filter(p => !p.ghost && (p.lastWorn == null || p.lastWorn >= 30))[0];
    const ghost = parts.find(p => p.ghost);
    if (ghost) return `Con ${ghost.name.toLowerCase()} este outfit sería nuevo.`;
    if (old) return old.lastWorn == null
      ? `${old.name} todavía está sin estrenar.`
      : `${old.name} lleva ${old.lastWorn} días guardada.`;
    if (best) return `El ${best.a} y el ${best.c} se llevan bien.`;
    if (fams.every(f => f === 'neutral' || f === 'negro')) return 'Todo neutro: no falla.';
    if (w.temp >= 26) return 'Hace calor: liviano y sin capas.';
    if (occ.id === 'oficina') return 'Formal sin pasarse.';
    return 'Combina sin esfuerzo.';
  }

  function build(items, opts) {
    const { occasion, weather, withItem = null, neglected = false, votes = {}, seed = 7, limit = 400 } = opts;
    const pool = items;
    const by = cat => pool.filter(i => i.cat === cat);
    const layers = [null, ...by('layer')];
    const rnd = seeded(seed);
    const out = [];
    const seen = new Set();
    for (const top of by('top')) for (const bottom of by('bottom')) for (const shoes of by('shoes')) for (const layer of layers) {
      const parts = layer ? [layer, top, bottom, shoes] : [top, bottom, shoes];
      if (withItem && !parts.some(p => p.id === withItem)) continue;
      if (neglected && !parts.some(p => !p.ghost && (p.lastWorn == null || p.lastWorn >= 30))) continue;
      if (!isValid(parts, occasion, weather)) continue;
      const key = keyOf(parts);
      if (seen.has(key) || votes[key] === 'down') continue;
      seen.add(key);
      const cs = colorScore(parts), ns = noveltyScore(parts), ls = learnedScore(parts, votes);
      const score = cs * 1.4 + ns + ls + (votes[key] === 'up' ? 3 : 0) + rnd() * 1.2;
      out.push({ key, parts, score, reason: reason(parts, occasion, weather, cs, ns) });
    }
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, limit);
  }

  function countAll(items, occasions, weathers, votes) {
    const keys = new Set();
    for (const occasion of occasions) for (const weather of weathers)
      build(items, { occasion, weather, votes, limit: 5000 }).forEach(o => keys.add(o.key));
    return keys.size;
  }

  // Cuántos outfits nuevos que COMBINAN BIEN abre cada prenda del catálogo
  // (solo los de puntaje alto, sin contar variantes de capa por separado).
  function gaps(items, catalog, occasions, weathers, votes) {
    return catalog.map(g => {
      const keys = new Set();
      for (const occasion of occasions) for (const weather of weathers)
        build([...items, g], { occasion, weather, withItem: g.id, votes, seed: 1, limit: 5000 })
          .forEach(o => { if (o.score >= 2.5) keys.add(keyOf(o.parts.filter(p => p.cat !== 'layer'))); });
      return { item: g, unlocks: keys.size };
    }).sort((a, b) => b.unlocks - a.unlocks);
  }

  return { build, gaps, countAll, isValid, keyOf, climate };
})();
