import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Formulas anidadas", content: [
    { type: "text", value: "Anidar es poner una funcion dentro de otra. Trabaja de adentro hacia afuera: resuelve la interior, verifica, y envuelve con la siguiente capa. Ejemplo: =IFERROR(XLOOKUP(A2, Data[ID], Data[Name]), \"Pendiente\")." },
  ]},
  { title: "Depurar formulas complejas", content: [
    { type: "definition_list", items: [
      { term: "Evaluate Formula", def: "Formulas > Evaluate Formula. Paso a paso como Excel resuelve cada parte." },
      { term: "F9 para fragmentos", def: "Selecciona parte de la formula y presiona F9. Muestra ese fragmento resuelto." },
      { term: "Columnas auxiliares", def: "Si es muy compleja, dividela en pasos intermedios." },
    ]},
  ]},
  { title: "FILTER", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=FILTER(array, include, if_empty). Devuelve filas que cumplen condicion." },
      { term: "Ejemplo", def: "=FILTER(A2:D100, B2:B100=\"Activo\", \"Sin resultados\")." },
      { term: "Multiples condiciones", def: "* funciona como AND, + funciona como OR entre condiciones." },
    ]},
  ]},
  { title: "SORT y UNIQUE", content: [
    { type: "definition_list", items: [
      { term: "SORT", def: "=SORT(array, sort_index, sort_order). -1 = descendente." },
      { term: "UNIQUE", def: "=UNIQUE(array). Valores unicos eliminando duplicados." },
      { term: "Combinar", def: "=SORT(FILTER(data, cond), col, -1). Filtra y ordena encadenando." },
    ]},
  ]},
  { title: "SEQUENCE y operador spill (#)", content: [
    { type: "definition_list", items: [
      { term: "SEQUENCE", def: "=SEQUENCE(rows, cols, start, step). Genera secuencia." },
      { term: "Operador #", def: "A1# referencia todo el resultado derramado de un Dynamic Array." },
      { term: "Solo Excel 365", def: "Dynamic Arrays derraman automaticamente a celdas adyacentes." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 3 de 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Formulas anidadas y Dynamic Arrays</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Combina funciones complejas y domina FILTER, SORT, UNIQUE, SEQUENCE de Excel 365.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas construir formulas anidadas paso a paso y usar Dynamic Arrays para analisis flexible.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"\u25BE"}</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["De adentro hacia afuera para anidamiento. Verifica cada capa.", "Evaluate Formula y F9 para depurar formulas complejas.", "FILTER devuelve filas por condicion. * = AND, + = OR.", "SORT ordena, UNIQUE elimina duplicados. Se encadenan.", "Operador # referencia el resultado completo de un Dynamic Array."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: INDEX + MATCH</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: PivotTables avanzadas</span>
      </div>
    </div>
  );
}
