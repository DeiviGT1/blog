import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Por que INDEX + MATCH si ya existe XLOOKUP", content: [
    { type: "key_points", items: [
      { title: "Archivos existentes", text: "Millones de archivos corporativos usan INDEX+MATCH. Necesitas poder leerla y modificarla." },
      { title: "Compatibilidad universal", text: "Funciona en cualquier version de Excel. XLOOKUP solo en 365." },
      { title: "Busquedas bidireccionales", text: "INDEX con doble MATCH permite buscar en dos dimensiones (fila + columna) de forma mas intuitiva que XLOOKUP." },
    ]},
  ]},
  { title: "MATCH — encuentra la posicion", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=MATCH(lookup_value, lookup_array, [match_type]). No devuelve un valor sino la posicion (numero de fila o columna)." },
      { term: "Ejemplo", def: "=MATCH(\"Norte\", A2:A100, 0) devuelve el numero de fila dentro del rango donde aparece \"Norte\". El 0 = coincidencia exacta." },
      { term: "Siempre usar 0", def: "El tercer argumento casi siempre debe ser 0 (exacto). 1 y -1 son para busquedas aproximadas que rara vez necesitas." },
    ]},
  ]},
  { title: "INDEX — devuelve valor por posicion", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=INDEX(array, row_num, [column_num]). Devuelve el valor en una posicion especifica de un rango." },
      { term: "Ejemplo", def: "=INDEX(C2:C100, 5) devuelve el quinto valor del rango C2:C100." },
      { term: "Con dos dimensiones", def: "=INDEX(B2:F10, 3, 4) devuelve el valor en la fila 3, columna 4 del rango." },
    ]},
  ]},
  { title: "La combinacion INDEX + MATCH", content: [
    { type: "text", value: "INDEX + MATCH juntas hacen lo que VLOOKUP hace pero sin restricciones. MATCH encuentra la posicion, INDEX devuelve el valor en esa posicion." },
    { type: "definition_list", items: [
      { term: "Formula", def: "=INDEX(C2:C100, MATCH(F1, A2:A100, 0)). Traducido: busca F1 en columna A, dame su posicion, y con esa posicion dame el valor correspondiente de columna C." },
      { term: "Ventaja clave", def: "La columna de retorno (C) puede estar en cualquier direccion respecto a la de busqueda (A). No tiene la limitacion de VLOOKUP." },
      { term: "Ejemplo practico", def: "Buscar el precio de un producto: =INDEX(Prices, MATCH(\"Laptop\", ProductNames, 0)). Si usas Named Ranges, queda muy legible." },
    ]},
  ]},
  { title: "Busqueda bidireccional con doble MATCH", content: [
    { type: "text", value: "INDEX con doble MATCH permite buscar en tablas de doble entrada: encontrar el valor en la interseccion de una fila y una columna especificas." },
    { type: "definition_list", items: [
      { term: "Formula", def: "=INDEX(B2:F10, MATCH(\"Norte\", A2:A10, 0), MATCH(\"Q3\", B1:F1, 0))." },
      { term: "Como funciona", def: "Primer MATCH busca \"Norte\" en las filas y devuelve su posicion. Segundo MATCH busca \"Q3\" en las columnas y devuelve su posicion. INDEX devuelve el valor en esa interseccion." },
      { term: "Caso de uso", def: "Tablas de tarifas, matrices de precios, tablas de horarios. Cualquier tabla donde necesitas buscar por fila Y por columna." },
    ]},
  ]},
  { title: "Comparacion directa", content: [
    { type: "key_points", items: [
      { title: "VLOOKUP", text: "La mas simple pero la mas limitada. Solo busca en primera columna, usa numero de columna fijo." },
      { title: "XLOOKUP", text: "La mas moderna y legible. Sin restricciones de direccion, con valor por defecto nativo. Solo Excel 365." },
      { title: "INDEX + MATCH", text: "La mas flexible y universal. Funciona en cualquier version. Permite busquedas bidireccionales. El estandar corporativo." },
    ]},
  ]},
];
export default function Module() {
  const [openSection, setOpenSection] = useState(0);
  const renderBlock = (block, bi) => {
    if (block.type === "text") return <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>{block.value}</p>;
    if (block.type === "definition_list") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((item, di) => (<div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}><div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{item.term}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.def}</div></div>))}</div>);
    if (block.type === "key_points") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((item, ki) => (<div key={ki} style={{ borderLeft: `2px solid ${V[200]}`, paddingLeft: 14 }}><div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>{item.title}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.text}</div></div>))}</div>);
    return null;
  };
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>NIVEL 3 — AVANZADO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 2 de 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>INDEX + MATCH</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>La combinacion mas flexible para busquedas: sin restricciones, bidireccional, compatible con todo.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que domines INDEX + MATCH para busquedas unidireccionales y bidireccionales, y entiendas cuando usarla vs XLOOKUP.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["MATCH encuentra la posicion. INDEX devuelve el valor en esa posicion. Juntas son poderosas.", "=INDEX(return_range, MATCH(lookup_value, lookup_range, 0)) es la formula base.", "Doble MATCH para busquedas bidireccionales: INDEX(range, MATCH(row), MATCH(col)).", "Funciona en cualquier version de Excel. Es el estandar corporativo.", "Para trabajo nuevo en 365 usa XLOOKUP. Para compatibilidad o bidireccional, INDEX+MATCH."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: VLOOKUP y XLOOKUP</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Formulas anidadas y Dynamic Arrays</span>
      </div>
    </div>
  );
}
