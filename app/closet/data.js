/* El armario de Jose: una foto real por prenda (2026-10-24), con el fondo
   quitado y el color corregido usando la misma mesa como referencia.
   El catálogo de Comprar sigue con fotos de producto libres (img/CREDITOS.md).
   Si falta la foto, la app muestra la silueta del mismo color. */
window.CLOSET_DATA = (() => {
  // family: cómo combina el color. neutral va con todo.
  // f / p / fp: forma femenina, plural, femenina plural (solo los que concuerdan).
  const C = {
    blanco:   { hex: '#F4F2EC', name: 'blanco',      f: 'blanca', p: 'blancos', fp: 'blancas', family: 'neutral' },
    crudo:    { hex: '#E9E2D2', name: 'crudo',       f: 'cruda',  p: 'crudos',  fp: 'crudas',  family: 'neutral' },
    negro:    { hex: '#23232A', name: 'negro',       f: 'negra',  p: 'negros',  fp: 'negras',  family: 'negro' },
    gris:     { hex: '#8E9097', name: 'gris',        family: 'neutral' },
    grisclaro:{ hex: '#BCBBBC', name: 'gris claro',  family: 'neutral' },
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
    rosado:   { hex: '#F07C9C', name: 'rosado',      f: 'rosada', p: 'rosados', fp: 'rosadas', family: 'rosa' },
    rosapalo: { hex: '#D9BDB3', name: 'rosa palo',   family: 'rosa' },
    lila:     { hex: '#C3A8B3', name: 'lila',        family: 'rosa' },
    amarillo: { hex: '#EDB74E', name: 'amarillo',    f: 'amarilla', p: 'amarillos', fp: 'amarillas', family: 'calido' },
    terracota:{ hex: '#7C4D47', name: 'terracota',   family: 'calido' },
    topo:     { hex: '#897C77', name: 'topo',        family: 'tierra' },
    salvia:   { hex: '#9EAB8F', name: 'verde salvia', family: 'oliva' },
    acero:    { hex: '#4E5464', name: 'azul acero',  family: 'azul' },
    azulrey:  { hex: '#2B2E8C', name: 'azul rey',    family: 'azul' },
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
    buzo:     { shape: 'g-sueter',   cat: 'layer',  label: 'Buzo',     g: 'm',  en: 'hoodie' },
    jogger:   { shape: 'g-pantalon', cat: 'bottom', label: 'Jogger',   g: 'm',  en: 'joggers' },
  };

  // Formalidad (1 playa … 5 traje) y abrigo (1 calor … 5 abrigo) salen solos
  // del tipo de prenda, el nombre y el material. Nadie los ajusta a mano.
  const BASE = {
    camiseta: [1, 1], polo: [2, 1], camisa: [3, 2], sueter: [3, 4], chaqueta: [2, 3], blazer: [4, 3],
    pantalon: [3, 2], short: [1, 1], tenis: [1, 1], mocasin: [4, 1], bota: [3, 3], buzo: [1, 3], jogger: [1, 2],
  };
  const autoProfile = (type, name = '', material = '') => {
    let [f, w] = BASE[type] || [2, 2];
    const t = `${name} ${material}`.toLowerCase();
    if (/jean|denim/.test(t)) f = type === 'pantalon' ? 2 : f;
    if (/vestir|lana fr|sastre/.test(t)) f = 4;
    if (/chino/.test(t) && type === 'pantalon') f = 3;
    if (/lino/.test(t) && type === 'camisa') { f = 2; w = 1; }
    if (/deportiv|dry|running|correr|gym|entrenar/.test(t)) f = 1;
    if (/estampad|gr[aá]fic|floral|tropical|hawai/.test(t)) f = Math.max(1, f - 1);
    if (/cuero|piel/.test(t) && type === 'chaqueta') f = 3;
    if (/cuero|piel|minimal/.test(t) && type === 'tenis') f = 2;
    if (/manga larga/.test(t)) w = Math.max(w, 2);
    if (/polar|lana|merino/.test(t)) w = Math.max(w, 4);
    if (/medio cierre/.test(t)) { f = 2; w = 3; }
    return { formality: f, warmth: w };
  };
  // Estilo: lo deportivo solo va con lo deportivo (una dry-fit con chino o una
  // polo con short de gym se ve raro). Las de fútbol van con las dos cosas.
  const styleOf = (type, name = '', material = '') => {
    const t = `${name} ${material}`.toLowerCase();
    if (/del dim|colombia/.test(t)) return 'futbol';
    if (/deportiv|dry|running|gym/.test(t) || (type === 'short' && /poliéster|nylon/.test(t))) return 'sport';
    if (['polo', 'camisa', 'blazer', 'mocasin'].includes(type) || /medio cierre/.test(t)) return 'smart';
    if (type === 'pantalon' && !/jean|denim|chino|jogger/.test(t)) return 'smart';
    return 'casual';
  };
  const colorName = (c, g) => (g === 'f' && c.f) || (g === 'p' && c.p) || (g === 'fp' && c.fp) || c.name;
  const itemName = (s, c) => `${s.label} ${colorName(c, s.g)}`;

  // Cada prenda lleva su id fijo: la foto se llama igual (img/<id>.png).
  const item = (id, type, color, o = {}) => {
    return {
      id, type, ...S[type],
      color: o.hex ? { ...C[color], hex: o.hex } : C[color],  // hex medido en la foto
      name: o.name || itemName(S[type], C[color]),
      q: o.q || `${color} ${S[type].en}`,
      photo: `img/${id}.${id.startsWith('c') ? 'png' : 'webp'}`,
      ...autoProfile(type, o.name || '', o.material || ''),
      style: o.style || styleOf(type, o.name || '', o.material || ''),
      loud: /del dim|colombia|big apple/i.test(o.name || ''),  // estampado multicolor
      // días desde la última vez; de la ropa real no se sabe, se asume una semana
      lastWorn: o.lastWorn ?? (o.ghost ? null : 7),
      wearCount: o.wearCount ?? 0,
      material: o.material || '',
      ghost: !!o.ghost,
      tip: o.tip || '',   // talla y corte para Jose (1,64 m, atlético)
    };
  };

  const items = [
    // arriba — camisetas lisas
    item('j1484', 'camiseta',  'blanco',    { name: 'Camiseta blanca básica', material: 'algodón', hex: '#DEDEDE' }),
    item('j1510', 'camiseta',  'blanco',    { name: 'Camiseta blanca básica (2)', material: 'algodón', hex: '#D9DAD9' }),
    item('j1490', 'camiseta',  'grisclaro',      { name: 'Camiseta gris claro jaspeada', material: 'algodón', hex: '#D6D5D5' }),
    item('j1491', 'camiseta',  'negro',     { name: 'Camiseta negra con bolsillo', material: 'algodón', hex: '#2A2A2A' }),
    item('j1497', 'camiseta',  'oliva',     { name: 'Camiseta verde oliva', material: 'algodón', hex: '#5F604E' }),
    item('j1493', 'camiseta',  'terracota', { name: 'Camiseta terracota lavada', material: 'algodón', hex: '#865451' }),
    item('j1495', 'camiseta',  'acero',     { name: 'Camiseta azul pizarra lavada', material: 'algodón', hex: '#575E77' }),
    item('j1502', 'camiseta',  'gris',      { name: 'Camiseta gris', material: 'algodón', hex: '#838685' }),
    item('j1501', 'camiseta',  'rosapalo',  { name: 'Camiseta rosa palo raglan', material: 'algodón', hex: '#B9A9A1' }),
    item('j1487', 'camiseta',  'rosado',    { name: 'Camiseta rosada', material: 'algodón', hex: '#E5718E' }),
    item('j1513', 'camiseta',  'rojo',      { name: 'Camiseta roja waffle', material: 'algodón waffle', hex: '#B11C18' }),
    // arriba — con logo o estampado
    item('j1476', 'camiseta',  'grisclaro',      { name: 'Camiseta gris claro Cîroc', material: 'algodón', hex: '#CCCCCB' }),
    item('j1485', 'camiseta',  'blanco',    { name: 'Camiseta blanca NBA', material: 'algodón', hex: '#D8D8D7' }),
    item('j1489', 'camiseta',  'blanco',    { name: 'Camiseta blanca estampada (oso)', material: 'algodón', hex: '#DFDFDF' }),
    item('j1500', 'camiseta',  'blanco',    { name: 'Camiseta blanca con logo rojo', material: 'algodón', hex: '#DEDDDD' }),
    item('j1508', 'camiseta',  'blanco',    { name: 'Camiseta blanca Outsiders', material: 'algodón', hex: '#DBDBDB' }),
    item('j1511', 'camiseta',  'blanco',    { name: 'Camiseta blanca Red Bull Racing', material: 'algodón', hex: '#DBDBDA' }),
    item('j1486', 'camiseta',  'negro',     { name: 'Camiseta negra estampada Big Apple Roll', material: 'algodón', hex: '#292A29' }),
    item('j1498', 'camiseta',  'caqui',     { name: 'Camiseta caqui Champion', material: 'algodón', hex: '#928163' }),
    item('j1499', 'camiseta',  'gris',   { name: 'Camiseta gris The North Face', material: 'algodón', hex: '#747474' }),
    // arriba — deportivas
    item('j1492', 'camiseta',  'grisclaro',      { name: 'Camiseta deportiva gris claro adidas', material: 'dry', hex: '#BCBBBC' }),
    item('j1494', 'camiseta',  'grisclaro',      { name: 'Camiseta deportiva gris claro Reebok', material: 'dry', hex: '#D7D7D7' }),
    item('j1496', 'camiseta',  'gris',      { name: 'Camiseta deportiva gris', material: 'dry', hex: '#7D7D7C' }),
    item('j1503', 'camiseta',  'negro',     { name: 'Camiseta deportiva negra Reebok', material: 'dry', hex: '#3B3B3B' }),
    item('j1506', 'camiseta',  'gris',   { name: 'Camiseta deportiva gris', material: 'dry', hex: '#676666' }),
    item('j1507', 'camiseta',  'grisosc',   { name: 'Camiseta deportiva gris oscuro (cuello rojo)', material: 'dry', hex: '#585958' }),
    item('j1518', 'camiseta',  'marino',    { name: 'Camiseta deportiva azul marino', material: 'dry', hex: '#3C394B' }),
    // arriba — fútbol
    item('j1488', 'camiseta',  'amarillo',  { name: 'Camiseta Colombia retro', material: 'deportiva', hex: '#C8A145' }),
    item('j1514', 'camiseta',  'blanco',    { name: 'Camiseta Colombia blanca de entrenamiento', material: 'deportiva', hex: '#DADADA' }),
    item('j1504', 'camiseta',  'rojo',      { name: 'Camiseta del DIM roja', material: 'deportiva', hex: '#7B2F2E' }),
    item('j1505', 'camiseta',  'rojo',      { name: 'Camiseta del DIM alterna', material: 'deportiva', hex: '#87444A' }),
    item('j1520', 'camiseta',  'blanco',    { name: 'Camiseta del DIM blanca', material: 'deportiva', hex: '#DAD9D9' }),
    // arriba — manga larga
    item('j1483', 'camiseta',  'negro',   { name: 'Camiseta negra manga larga', material: 'algodón', hex: '#404140' }),
    item('j1512', 'camiseta',  'grisclaro',      { name: 'Camiseta gris claro waffle manga larga', material: 'algodón waffle', hex: '#B5B4B5' }),
    // arriba — polos
    item('j1479', 'polo',      'negro',     { name: 'Polo negra adidas', material: 'poliéster', hex: '#3C3D3C' }),
    item('j1480', 'polo',      'grisosc',   { name: 'Polo gris carbón', material: 'poliéster', hex: '#434443' }),
    item('j1481', 'polo',      'gris',      { name: 'Polo gris Tommy', material: 'piqué', hex: '#8C8B84' }),
    item('j1515', 'polo',      'marino',   { name: 'Polo azul marino Ralph Lauren', material: 'piqué', hex: '#3B3360' }),
    item('j1517', 'polo',      'blanco',    { name: 'Polo blanca Tommy', material: 'piqué', hex: '#D2D2D1' }),
    // arriba — camisas
    item('j1477', 'camisa',    'gris',      { name: 'Camisa gris manga larga', material: 'algodón', hex: '#9E9F9E' }),
    item('j1478', 'camisa',    'lila',      { name: 'Camisa oxford lila', material: 'oxford', hex: '#A19CB1' }),
    item('j1482', 'camisa',    'blanco',    { name: 'Camisa blanca manga larga', material: 'algodón', hex: '#D9D9D8' }),
    item('j1525', 'camisa',    'celeste',   { name: 'Camisa oxford celeste', material: 'oxford', hex: '#A7A59F' }),
    // capas
    item('j1529', 'sueter',    'blanco',    { name: 'Medio cierre blanco', material: 'poliéster', hex: '#D9D9D8' }),
    // abajo
    item('j1519', 'pantalon',  'denimcl',   { name: 'Jean azul claro', material: 'denim', hex: '#9CA8B6' }),
    item('j1516', 'pantalon',  'acero',     { name: 'Pantalón chino azul', material: 'algodón', hex: '#505966' }),
    item('j1526', 'pantalon',  'gris',   { name: 'Pantalón gris', material: 'poliéster', hex: '#858180' }),
    item('j1527', 'pantalon',  'grisclaro',      { name: 'Pantalón gris claro', material: 'poliéster', hex: '#BCB9BD' }),
    item('j1528', 'pantalon',  'blanco',    { name: 'Pantalón blanco', material: 'algodón', hex: '#D8D7D7' }),
    item('j1521', 'short',     'celeste',   { name: 'Short azul medio', material: 'poliéster', hex: '#5A7BA1' }),
    item('j1522', 'short',     'grisosc',    { name: 'Short gris oscuro', material: 'poliéster', hex: '#4F4E4E' }),
    item('j1523', 'short',     'azulrey',   { name: 'Short azul rey Nike', material: 'dry', hex: '#39198F' }),
    item('j1524', 'short',     'negro',     { name: 'Short negro con cierres', material: 'poliéster', hex: '#3B3B3A' }),
  ];

  // Prendas que NO tienes. Comprar mide cuántos outfits buenos abre cada una,
  // cuántas prendas olvidadas revive y si ya tienes algo parecido. Las fotos son
  // prendas tuyas recoloreadas (g-*) o de producto libre (c*).
  const T = {
    pant: 'Talla 29 × 28". Slim tapered, que termine en el tobillo sin arrugarse sobre el zapato.',
    short: 'Talla 29, entrepierna 5–7". Más largo te corta la pierna en la rodilla.',
    top: 'Talla S, corte regular o athletic. Largo 66–69 cm; que la costura caiga en el hueso del hombro.',
    shirt: 'Talla S slim. Que no pase de la mitad de la bragueta si la llevas por fuera.',
  };
  const catalog = [
    item('c41', 'tenis', 'blanco', { ghost: true, name: 'Tenis blancos minimalistas', q: 'white minimalist leather sneakers', material: 'cuero',
      tip: 'Suela delgada, no chunky: la suela gruesa se nota más que la altura que te da.' }),
    item('g-chino-beige',  'pantalon', 'beige',  { ghost: true, name: 'Chino beige',       q: 'beige slim chino pants', material: 'chino', tip: T.pant }),
    item('g-chino-oliva',  'pantalon', 'oliva',  { ghost: true, name: 'Chino verde oliva', q: 'olive slim chino pants', material: 'chino', tip: T.pant }),
    item('g-chino-negro',  'pantalon', 'negro',  { ghost: true, name: 'Chino negro',       q: 'black slim chino pants', material: 'chino', tip: T.pant }),
    item('g-short-caqui',  'short',    'caqui',  { ghost: true, name: 'Short chino caqui', q: 'khaki chino shorts 5 inch', material: 'algodón', tip: T.short }),
    item('g-short-marino', 'short',    'marino', { ghost: true, name: 'Short chino azul marino', q: 'navy chino shorts 5 inch', material: 'algodón', tip: T.short }),
    item('g-polo-crema',   'polo',     'crudo',  { ghost: true, name: 'Polo de punto crema', q: 'cream knit polo shirt', material: 'punto', tip: T.top }),
    item('g-polo-marino',  'polo',     'marino', { ghost: true, name: 'Polo de punto azul marino', q: 'navy knit polo shirt', material: 'punto', tip: T.top }),
    item('g-lino-blanca',  'camisa',   'blanco', { ghost: true, name: 'Camisa de lino blanca', q: 'white linen shirt', material: 'lino', tip: T.shirt }),
    item('g-lino-salvia',  'camisa',   'salvia', { ghost: true, name: 'Camisa de lino verde salvia', q: 'sage green linen shirt', material: 'lino', tip: T.shirt }),
    item('g-tee-crema',    'camiseta', 'crudo',  { ghost: true, name: 'Camiseta crema de buen algodón', q: 'off white heavyweight t-shirt regular fit', material: 'algodón', tip: T.top }),
    item('g-tee-marino',   'camiseta', 'marino', { ghost: true, name: 'Camiseta azul marino', q: 'navy t-shirt regular fit', material: 'algodón', tip: T.top }),
    item('g-sobre-oliva',  'chaqueta', 'oliva',  { ghost: true, name: 'Sobrecamisa oliva', q: 'olive overshirt', material: 'algodón', tip: 'Talla S. Que cierre sin tirar en el pecho y termine en la cadera.' }),
  ];

  // Dónde comprar: marcas con tienda física en cada mall y su buscador online
  // ({q} = término). Se llena desde los directorios oficiales (ver STORES).
  const STORES = window.CLOSET_STORES || { malls: [], brands: {} };
  const malls = [
    { id: 'any', name: 'Cualquier tienda', brands: Object.keys(STORES.brands) },
    ...STORES.malls,
  ];
  const brands = STORES.brands;

  // Formal "pero no tanto": oficina relajada; el centro es casual, salida y deporte.
  const occasions = [
    { id: 'casual',  label: 'Casual',  formality: [1, 2] },
    { id: 'salida',  label: 'Salida',  formality: [1, 3] },
    { id: 'oficina', label: 'Oficina', formality: [2, 3] },
    { id: 'deporte', label: 'Deporte', formality: [1, 1] },
  ];
  // Para qué ocasiones sirve una prenda (lo que muestra la ficha).
  const fitsFor = (it) => occasions.filter(o => it.formality >= o.formality[0] - 1 && it.formality <= o.formality[1] && (o.id !== 'deporte' || it.formality === 1)).map(o => o.label.toLowerCase());

  // "hoy" se reemplaza por el clima real (Open-Meteo) en la versión final.
  const weathers = [
    { id: 'hoy',    label: 'Hoy, 29°', temp: 29, rain: false, desc: '29° y sol', phrase: 'hoy, con 29° y sol' },
    { id: 'fresco', label: 'Fresco',   temp: 17, rain: false, desc: 'fresco',    phrase: 'un día fresco' },
    { id: 'frio',   label: 'Frío',     temp: 8,  rain: false, desc: 'frío',      phrase: 'un día frío' },
    { id: 'lluvia', label: 'Lluvia',   temp: 22, rain: true,  desc: 'lluvia',    phrase: 'un día de lluvia' },
  ];

  return { items, catalog, malls, brands, occasions, weathers, colors: C, shapes: S, itemName, colorName, autoProfile, styleOf, fitsFor };
})();
