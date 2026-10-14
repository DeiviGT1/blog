import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "El problema que resuelven", content: [
    { type: "text", value: "Tienes una tabla con codigos de producto y necesitas traer el nombre o precio desde otra tabla. O una lista de empleados y necesitas su departamento desde un maestro de personal. Copiar y pegar manualmente no es opcion con 5,000 filas. Las funciones de busqueda automatizan esto." },
  ]},
  { title: "VLOOKUP — la clasica", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]). Busca un valor en la primera columna de un rango y devuelve un valor de otra columna en la misma fila." },
      { term: "Ejemplo", def: "=VLOOKUP(A2, Products!A:D, 3, FALSE). Busca el valor de A2 en la primera columna de Products y devuelve el valor de la tercera columna. FALSE = busqueda exacta." },
      { term: "Argumento critico", def: "El cuarto argumento casi siempre debe ser FALSE (busqueda exacta). TRUE hace busqueda aproximada y es fuente de errores silenciosos." },
    ]},
  ]},
  { title: "Limitaciones reales de VLOOKUP", content: [
    { type: "definition_list", items: [
      { term: "Solo busca en la primera columna", def: "No puede buscar en una columna que no sea la primera del rango. No puede buscar hacia la izquierda." },
      { term: "col_index_num es un numero fijo", def: "Si insertas una columna en la tabla de origen, la formula se rompe sin avisar porque el numero de columna cambia." },
      { term: "Solo primera coincidencia", def: "Siempre toma la primera fila que coincide. No puede buscar de abajo hacia arriba." },
      { term: "Sin valor por defecto nativo", def: "Si no encuentra el valor, devuelve #N/A. Hay que envolver en IFERROR para manejar esto." },
    ]},
  ]},
  { title: "XLOOKUP — la evolucion en Excel 365", content: [
    { type: "text", value: "XLOOKUP resuelve todas las limitaciones de VLOOKUP. Es mas flexible, mas legible y mas segura." },
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])." },
      { term: "Busca en cualquier direccion", def: "La columna de busqueda y la de retorno son independientes. Puede buscar a la izquierda, derecha, en cualquier posicion." },
      { term: "Sin numero de columna", def: "Usa un rango de retorno directo en vez de un numero. Si insertas columnas, la formula no se rompe." },
      { term: "Valor por defecto nativo", def: "El cuarto argumento define que devolver si no encuentra el valor. Sin necesidad de IFERROR." },
      { term: "Ejemplo", def: "=XLOOKUP(A2, Products[Code], Products[Name], \"No encontrado\"). Busca el codigo, devuelve el nombre, y si no existe muestra \"No encontrado\"." },
    ]},
  ]},
  { title: "Cuando usar cada una", content: [
    { type: "key_points", items: [
      { title: "Excel 365: usa XLOOKUP siempre", text: "Es superior en todo: mas legible, mas flexible, mas segura. No hay razon para usar VLOOKUP en trabajo nuevo si tienes 365." },
      { title: "Compatibilidad: VLOOKUP", text: "Si colaboras con personas que tienen versiones antiguas de Excel, VLOOKUP funciona en todas. XLOOKUP solo en 365." },
      { title: "Archivos existentes: entiende VLOOKUP", text: "Millones de archivos usan VLOOKUP. Necesitas poder leerla y modificarla aunque no la uses para trabajo nuevo." },
    ]},
  ]},
  { title: "Manejo de errores", content: [
    { type: "definition_list", items: [
      { term: "VLOOKUP + IFERROR", def: "=IFERROR(VLOOKUP(...), \"No encontrado\"). La forma clasica de manejar #N/A." },
      { term: "XLOOKUP nativo", def: "=XLOOKUP(A2, rango, retorno, \"No encontrado\"). El cuarto argumento ya maneja el caso. Mas limpio." },
      { term: "Siempre anticipar", def: "Siempre preguntate: que pasa si el valor que busco no existe en la tabla? Si no lo anticipas, tu hoja muestra #N/A al usuario." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 1 de 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>VLOOKUP y XLOOKUP</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Busca y trae datos de una tabla a otra. VLOOKUP clasica y XLOOKUP de Excel 365.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que domines VLOOKUP y XLOOKUP, entiendas sus diferencias, y sepas cuando usar cada una.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["VLOOKUP busca en la primera columna y devuelve de otra. FALSE para busqueda exacta siempre.", "XLOOKUP no tiene restriccion de direccion, no usa numero de columna, y tiene valor por defecto nativo.", "En Excel 365, usa XLOOKUP para trabajo nuevo. Entiende VLOOKUP para archivos existentes.", "Siempre anticipa el caso de 'no encontrado': IFERROR con VLOOKUP, cuarto argumento con XLOOKUP.", "VLOOKUP con col_index_num fijo se rompe si insertas columnas. XLOOKUP no tiene este problema."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Nivel 3 — Avanzado</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: INDEX + MATCH</span>
      </div>
    </div>
  );
}
