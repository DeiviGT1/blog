/* Armario de ejemplo. En la versión real cada prenda es una foto tuya
   etiquetada por la IA; aquí son siluetas con el color de la prenda. */
window.CLOSET_DATA = (() => {
  // family: cómo combina el color. neutral va con todo.
  // f = forma femenina; p = plural (solo cambian los que concuerdan).
  const C = {
    blanco:   { hex: '#F4F2EC', name: 'blanco',      f: 'blanca', p: 'blancos', fp: 'blancas', family: 'neutral' },
    crudo:    { hex: '#E9E2D2', name: 'crudo',       f: 'cruda',  p: 'crudos',  fp: 'crudas',  family: 'neutral' },
    negro:    { hex: '#23232A', name: 'negro',       f: 'negra',  p: 'negros',  fp: 'negras',  family: 'negro' },
    gris:     { hex: '#8E9097', name: 'gris',        family: 'neutral' },
    grisosc:  { hex: '#4A4D56', name: 'gris oscuro', family: 'neutral' },
    marino:   { hex: '#243352', name: 'azul marino', family: 'marino' },
    celeste:  { hex: '#A9C4DE', name: 'celeste',     family: 'azul' },
    indigo:   { hex: '#3E5278', name: 'índigo',      family: 'denim' },
    denimcl:  { hex: '#7A93B5', name: 'denim claro', family: 'denim' },
    oliva:    { hex: '#6B6F45', name: 'verde oliva', family: 'oliva' },
    caqui:    { hex: '#B7A77E', name: 'caqui',       family: 'tierra' },
    beige:    { hex: '#D3C3A3', name: 'beige',       family: 'tierra' },
    cafe:     { hex: '#6F4A2E', name: 'café',        family: 'cafe' },
    vino:     { hex: '#6E2B3A', name: 'vino',        family: 'vino' },
    mostaza:  { hex: '#C99A2E', name: 'mostaza',     family: 'calido' },
    rojo:     { hex: '#B8342C', name: 'rojo',        f: 'roja',   p: 'rojos',   fp: 'rojas',   family: 'calido' },
  };

  // g: género del nombre (m, f, p = masculino plural, fp = femenino plural).
  const S = {
    camiseta: { shape: 'g-camiseta', cat: 'top',    label: 'Camiseta', g: 'f' },
    polo:     { shape: 'g-polo',     cat: 'top',    label: 'Polo',     g: 'm' },
    camisa:   { shape: 'g-camisa',   cat: 'top',    label: 'Camisa',   g: 'f' },
    sueter:   { shape: 'g-sueter',   cat: 'layer',  label: 'Suéter',   g: 'm' },
    chaqueta: { shape: 'g-chaqueta', cat: 'layer',  label: 'Chaqueta', g: 'f' },
    blazer:   { shape: 'g-blazer',   cat: 'layer',  label: 'Blazer',   g: 'm' },
    pantalon: { shape: 'g-pantalon', cat: 'bottom', label: 'Pantalón', g: 'm' },
    short:    { shape: 'g-short',    cat: 'bottom', label: 'Short',    g: 'm' },
    tenis:    { shape: 'g-tenis',    cat: 'shoes',  label: 'Tenis',    g: 'p' },
    mocasin:  { shape: 'g-mocasin',  cat: 'shoes',  label: 'Mocasín',  g: 'm' },
    bota:     { shape: 'g-bota',     cat: 'shoes',  label: 'Botas',    g: 'fp' },
  };
  const colorName = (c, g) => (g === 'f' && c.f) || (g === 'p' && c.p) || (g === 'fp' && c.fp) || c.name;
  const itemName = (s, c) => `${s.label} ${colorName(c, s.g)}`;

  let n = 0;
  const item = (type, color, o = {}) => ({
    id: 'i' + (++n),
    type, ...S[type],
    color: C[color],
    name: o.name || itemName(S[type], C[color]),
    formality: o.formality ?? 2,   // 1 playa … 5 traje
    warmth: o.warmth ?? 2,         // 1 calor … 5 abrigo
    status: o.status || 'limpia',  // limpia | sucia | prestada
    lastWorn: o.lastWorn ?? null,  // días desde la última vez
    wearCount: o.wearCount ?? 0,
    material: o.material || '',
  });

  const items = [
    // arriba
    item('camiseta', 'blanco',  { formality: 1, warmth: 1, lastWorn: 2, wearCount: 31, material: 'algodón' }),
    item('camiseta', 'negro',   { formality: 2, warmth: 1, lastWorn: 5, wearCount: 24, material: 'algodón' }),
    item('camiseta', 'oliva',   { formality: 1, warmth: 1, lastWorn: 14, wearCount: 9 }),
    item('camiseta', 'gris',    { formality: 1, warmth: 1, status: 'sucia', lastWorn: 1, wearCount: 18 }),
    item('polo',     'marino',  { formality: 3, warmth: 1, lastWorn: 7, wearCount: 12, material: 'piqué' }),
    item('polo',     'blanco',  { formality: 3, warmth: 1, lastWorn: 21, wearCount: 6 }),
    item('camisa',   'blanco',  { name: 'Camisa blanca de lino', formality: 3, warmth: 1, lastWorn: 9, wearCount: 15, material: 'lino' }),
    item('camisa',   'celeste', { formality: 4, warmth: 2, lastWorn: 3, wearCount: 22, material: 'oxford' }),
    item('camisa',   'negro',   { formality: 4, warmth: 2, lastWorn: 30, wearCount: 4 }),
    item('camisa',   'cafe',    { name: 'Camisa de cuadros café', formality: 2, warmth: 2, lastWorn: 60, wearCount: 2, material: 'franela' }),
    // abajo
    item('pantalon', 'indigo',  { name: 'Jean índigo', formality: 2, warmth: 2, lastWorn: 1, wearCount: 40, material: 'denim' }),
    item('pantalon', 'negro',   { name: 'Jean negro', formality: 3, warmth: 2, lastWorn: 6, wearCount: 19, material: 'denim' }),
    item('pantalon', 'oliva',   { name: 'Chino verde oliva', formality: 3, warmth: 2, lastWorn: 11, wearCount: 8 }),
    item('pantalon', 'grisosc', { name: 'Pantalón gris de vestir', formality: 4, warmth: 2, lastWorn: 4, wearCount: 17, material: 'lana fría' }),
    item('pantalon', 'marino',  { name: 'Pantalón azul marino de vestir', formality: 4, warmth: 2, lastWorn: 18, wearCount: 10 }),
    item('short',    'caqui',   { formality: 1, warmth: 1, lastWorn: 8, wearCount: 14 }),
    item('short',    'marino',  { formality: 1, warmth: 1, status: 'sucia', lastWorn: 2, wearCount: 11 }),
    // zapatos
    item('tenis',    'blanco',  { formality: 2, warmth: 1, lastWorn: 1, wearCount: 52, material: 'cuero' }),
    item('tenis',    'negro',   { formality: 2, warmth: 1, lastWorn: 12, wearCount: 9 }),
    item('mocasin',  'cafe',    { formality: 4, warmth: 1, lastWorn: 4, wearCount: 20, material: 'ante' }),
    item('bota',     'cafe',    { formality: 3, warmth: 3, lastWorn: 90, wearCount: 3, material: 'cuero' }),
    // capas
    item('chaqueta', 'denimcl', { name: 'Chaqueta denim', formality: 2, warmth: 3, lastWorn: 25, wearCount: 7 }),
    item('blazer',   'marino',  { formality: 4, warmth: 3, lastWorn: 10, wearCount: 9, material: 'lana' }),
    item('chaqueta', 'negro',   { name: 'Bomber negra', formality: 2, warmth: 3, lastWorn: 40, wearCount: 5 }),
    item('sueter',   'vino',    { name: 'Suéter vino', formality: 3, warmth: 4, lastWorn: 120, wearCount: 2, material: 'lana merino' }),
    item('sueter',   'gris',    { formality: 3, warmth: 4, status: 'prestada', lastWorn: 70, wearCount: 4 }),
  ];

  // Prendas que NO tienes. Comprar mide cuántos outfits nuevos abre cada una.
  const catalog = [
    item('pantalon', 'beige',   { name: 'Pantalón chino beige', formality: 3, warmth: 2 }),
    item('camiseta', 'crudo',   { name: 'Camiseta crudo', formality: 2, warmth: 1 }),
    item('tenis',    'crudo',   { name: 'Tenis crudo', formality: 2, warmth: 1 }),
    item('mocasin',  'negro',   { formality: 4, warmth: 1 }),
    item('chaqueta', 'cafe',    { name: 'Chaqueta de cuero café', formality: 3, warmth: 3 }),
    item('pantalon', 'negro',   { name: 'Pantalón negro de vestir', formality: 4, warmth: 2 }),
    item('blazer',   'grisosc', { formality: 4, warmth: 3 }),
    item('camisa',   'oliva',   { formality: 3, warmth: 2 }),
    item('sueter',   'marino',  { formality: 3, warmth: 4 }),
    item('bota',     'negro',   { formality: 3, warmth: 3 }),
    item('camisa',   'mostaza', { formality: 3, warmth: 2 }),
    item('camiseta', 'rojo',    { formality: 1, warmth: 1 }),
  ].map(i => ({ ...i, id: 'c' + i.id, ghost: true }));

  // Opciones de compra de ejemplo por prenda del catálogo.
  const products = {
    c27: [ { store: 'Uniqlo',        name: 'Chino slim beige',          price: 49.90 },
           { store: 'Zara',          name: 'Pantalón chino stone',      price: 45.90 },
           { store: 'Massimo Dutti', name: 'Chino algodón arena',       price: 79.00 } ],
    c28: [ { store: 'Uniqlo',        name: 'Camiseta Supima crudo',     price: 14.90 },
           { store: 'COS',           name: 'Camiseta algodón ecru',     price: 29.00 } ],
    c29: [ { store: 'Adidas',        name: 'Samba OG cream',            price: 100.00 },
           { store: 'Veja',          name: 'Campo natural',             price: 165.00 } ],
    c30: [ { store: 'Zara',          name: 'Mocasín piel negro',        price: 69.90 },
           { store: 'Massimo Dutti', name: 'Mocasín penny negro',       price: 119.00 } ],
    c31: [ { store: 'Zara',          name: 'Chaqueta efecto piel café', price: 89.90 },
           { store: 'Schott',        name: 'Café racer cuero',          price: 450.00 } ],
    c32: [ { store: 'Uniqlo',        name: 'Smart pants negro',         price: 49.90 },
           { store: 'Zara',          name: 'Pantalón traje negro',      price: 59.90 } ],
    c33: [ { store: 'Zara',          name: 'Blazer gris marengo',       price: 99.90 } ],
    c34: [ { store: 'Uniqlo',        name: 'Camisa lino oliva',         price: 39.90 } ],
    c35: [ { store: 'Uniqlo',        name: 'Suéter merino marino',      price: 49.90 } ],
    c36: [ { store: 'Dr. Martens',   name: 'Chelsea 2976 negra',        price: 170.00 },
           { store: 'Zara',          name: 'Bota chelsea negra',        price: 79.90 } ],
    c37: [ { store: 'Zara',          name: 'Camisa pana mostaza',       price: 45.90 } ],
    c38: [ { store: 'Uniqlo',        name: 'Camiseta U roja',           price: 19.90 } ],
  };

  const occasions = [
    { id: 'casual',  label: 'Casual',  formality: [1, 3] },
    { id: 'oficina', label: 'Oficina', formality: [3, 4] },
    { id: 'salida',  label: 'Salida',  formality: [2, 4] },
    { id: 'cita',    label: 'Cita',    formality: [3, 4] },
    { id: 'deporte', label: 'Deporte', formality: [1, 1] },
  ];

  // "hoy" se reemplaza por el clima real (Open-Meteo) en la versión final.
  const weathers = [
    { id: 'hoy',    label: 'Hoy, 29°', temp: 29, rain: false, desc: 'soleado en Hollywood' },
    { id: 'fresco', label: 'Fresco',   temp: 17, rain: false, desc: 'fresco' },
    { id: 'frio',   label: 'Frío',     temp: 8,  rain: false, desc: 'frío' },
    { id: 'lluvia', label: 'Lluvia',   temp: 22, rain: true,  desc: 'lluvioso' },
  ];

  return { items, catalog, products, occasions, weathers, colors: C, shapes: S, itemName, colorName };
})();
