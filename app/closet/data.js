/* Armario de ejemplo. En la versión real cada prenda es una foto tuya;
   mientras tanto son fotos de producto con licencia libre (img/CREDITOS.md).
   Si falta la foto, la app muestra la silueta del mismo color. */
window.CLOSET_DATA = (() => {
  // family: cómo combina el color. neutral va con todo.
  // f / p / fp: forma femenina, plural, femenina plural (solo los que concuerdan).
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

  // g: género del nombre. en: cómo se busca en tiendas de EE. UU.
  const S = {
    camiseta: { shape: 'g-camiseta', cat: 'top',    label: 'Camiseta', g: 'f',  en: 't-shirt' },
    polo:     { shape: 'g-polo',     cat: 'top',    label: 'Polo',     g: 'm',  en: 'polo shirt' },
    camisa:   { shape: 'g-camisa',   cat: 'top',    label: 'Camisa',   g: 'f',  en: 'shirt' },
    sueter:   { shape: 'g-sueter',   cat: 'layer',  label: 'Suéter',   g: 'm',  en: 'sweater' },
    chaqueta: { shape: 'g-chaqueta', cat: 'layer',  label: 'Chaqueta', g: 'f',  en: 'jacket' },
    blazer:   { shape: 'g-blazer',   cat: 'layer',  label: 'Blazer',   g: 'm',  en: 'blazer' },
    pantalon: { shape: 'g-pantalon', cat: 'bottom', label: 'Pantalón', g: 'm',  en: 'pants' },
    short:    { shape: 'g-short',    cat: 'bottom', label: 'Short',    g: 'm',  en: 'shorts' },
    tenis:    { shape: 'g-tenis',    cat: 'shoes',  label: 'Tenis',    g: 'p',  en: 'sneakers' },
    mocasin:  { shape: 'g-mocasin',  cat: 'shoes',  label: 'Mocasín',  g: 'm',  en: 'loafers' },
    bota:     { shape: 'g-bota',     cat: 'shoes',  label: 'Botas',    g: 'fp', en: 'boots' },
  };
  const colorName = (c, g) => (g === 'f' && c.f) || (g === 'p' && c.p) || (g === 'fp' && c.fp) || c.name;
  const itemName = (s, c) => `${s.label} ${colorName(c, s.g)}`;

  // Cada prenda lleva su id fijo: la foto se llama igual (img/<id>.png).
  const item = (id, type, color, o = {}) => {
    return {
      id, type, ...S[type],
      color: C[color],
      name: o.name || itemName(S[type], C[color]),
      q: o.q || `${color} ${S[type].en}`,
      photo: `img/${id}.png`,
      formality: o.formality ?? 2,   // 1 playa … 5 traje
      warmth: o.warmth ?? 2,         // 1 calor … 5 abrigo
      lastWorn: o.lastWorn ?? null,  // días desde la última vez
      wearCount: o.wearCount ?? 0,
      material: o.material || '',
      ghost: !!o.ghost,
    };
  };

  const items = [
    // arriba
    item('i1',  'camiseta', 'blanco',  { formality: 1, warmth: 1, lastWorn: 2, wearCount: 31, material: 'algodón' }),
    item('i2',  'camiseta', 'negro',   { formality: 2, warmth: 1, lastWorn: 5, wearCount: 24, material: 'algodón' }),
    item('i4',  'camiseta', 'gris',    { formality: 1, warmth: 1, lastWorn: 1, wearCount: 18 }),
    item('i7',  'camisa',   'blanco',  { name: 'Camisa blanca de lino', formality: 3, warmth: 1, lastWorn: 9, wearCount: 15, material: 'lino' }),
    item('i10', 'camisa',   'cafe',    { name: 'Camisa de cuadros café', formality: 2, warmth: 2, lastWorn: 60, wearCount: 2, material: 'franela' }),
    // abajo
    item('i11', 'pantalon', 'indigo',  { name: 'Jean índigo', formality: 2, warmth: 2, lastWorn: 1, wearCount: 40, material: 'denim' }),
    item('i12', 'pantalon', 'negro',   { name: 'Jean negro', formality: 3, warmth: 2, lastWorn: 6, wearCount: 19, material: 'denim' }),
    item('i16', 'short',    'caqui',   { formality: 1, warmth: 1, lastWorn: 8, wearCount: 14 }),
    // zapatos
    item('i18', 'tenis',    'blanco',  { formality: 2, warmth: 1, lastWorn: 1, wearCount: 52, material: 'cuero' }),
    item('i19', 'tenis',    'negro',   { formality: 2, warmth: 1, lastWorn: 12, wearCount: 9 }),
    item('i20', 'mocasin',  'cafe',    { formality: 4, warmth: 1, lastWorn: 4, wearCount: 20, material: 'ante' }),
    item('i21', 'bota',     'cafe',    { formality: 3, warmth: 3, lastWorn: 90, wearCount: 3, material: 'cuero' }),
    // capas
    item('i22', 'chaqueta', 'denimcl', { name: 'Chaqueta denim', formality: 2, warmth: 3, lastWorn: 25, wearCount: 7 }),
    item('i23', 'blazer',   'marino',  { formality: 4, warmth: 3, lastWorn: 10, wearCount: 9, material: 'lana' }),
    item('i24', 'chaqueta', 'negro',   { name: 'Bomber negra', formality: 2, warmth: 3, lastWorn: 40, wearCount: 5 }),
  ];

  // Prendas que NO tienes. Comprar mide cuántos outfits nuevos abre cada una.
  const catalog = [
    item('c28', 'camiseta', 'crudo',   { ghost: true, q: 'off white t-shirt', formality: 2, warmth: 1 }),
    item('c30', 'mocasin',  'negro',   { ghost: true, q: 'black loafers', formality: 4, warmth: 1 }),
    item('c31', 'chaqueta', 'cafe',    { ghost: true, name: 'Chaqueta de cuero café', q: 'brown leather jacket', formality: 3, warmth: 3 }),
    item('c34', 'camisa',   'oliva',   { ghost: true, q: 'olive green shirt', formality: 3, warmth: 2 }),
    item('c36', 'bota',     'negro',   { ghost: true, q: 'black chelsea boots', formality: 3, warmth: 3 }),
  ];

  // Dónde comprar: marcas con tienda física en cada mall y su buscador online
  // ({q} = término). Se llena desde los directorios oficiales (ver STORES).
  const STORES = window.CLOSET_STORES || { malls: [], brands: {} };
  const malls = [
    { id: 'any', name: 'Cualquier tienda', brands: Object.keys(STORES.brands) },
    ...STORES.malls,
  ];
  const brands = STORES.brands;

  const occasions = [
    { id: 'casual',  label: 'Casual',  formality: [1, 3] },
    { id: 'oficina', label: 'Oficina', formality: [3, 4] },
    { id: 'salida',  label: 'Salida',  formality: [2, 4] },
    { id: 'cita',    label: 'Cita',    formality: [3, 4] },
    { id: 'deporte', label: 'Deporte', formality: [1, 1] },
  ];

  // "hoy" se reemplaza por el clima real (Open-Meteo) en la versión final.
  const weathers = [
    { id: 'hoy',    label: 'Hoy, 29°', temp: 29, rain: false, desc: '29° y sol', phrase: 'hoy, con 29° y sol' },
    { id: 'fresco', label: 'Fresco',   temp: 17, rain: false, desc: 'fresco',    phrase: 'un día fresco' },
    { id: 'frio',   label: 'Frío',     temp: 8,  rain: false, desc: 'frío',      phrase: 'un día frío' },
    { id: 'lluvia', label: 'Lluvia',   temp: 22, rain: true,  desc: 'lluvia',    phrase: 'un día de lluvia' },
  ];

  return { items, catalog, malls, brands, occasions, weathers, colors: C, shapes: S, itemName, colorName };
})();
