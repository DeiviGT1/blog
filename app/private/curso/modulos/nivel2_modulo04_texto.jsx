import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Por que importan las funciones de texto", content: [
    { type: "text", value: "Los datos del mundo real vienen sucios: nombres con espacios extra, codigos que necesitas partir, columnas que necesitas combinar. Las funciones de texto resuelven todo esto sin editar celda por celda." },
  ]},
  { title: "Extraer partes de texto: LEFT, RIGHT, MID", content: [
    { type: "definition_list", items: [
      { term: "LEFT(text, num_chars)", def: "Extrae caracteres desde la izquierda. =LEFT(\"INV-2025-0034\", 3) devuelve \"INV\"." },
      { term: "RIGHT(text, num_chars)", def: "Extrae desde la derecha. =RIGHT(\"INV-2025-0034\", 4) devuelve \"0034\"." },
      { term: "MID(text, start, num_chars)", def: "Extrae desde cualquier posicion. =MID(\"INV-2025-0034\", 5, 4) devuelve \"2025\". Start es la posicion del primer caracter a extraer." },
    ]},
  ]},
  { title: "Longitud y busqueda: LEN, FIND, SEARCH", content: [
    { type: "definition_list", items: [
      { term: "LEN(text)", def: "Cuantos caracteres tiene un texto. =LEN(\"Excel\") devuelve 5. Util para validar longitud de codigos." },
      { term: "FIND(find_text, within_text)", def: "Posicion donde aparece un texto dentro de otro. Case-sensitive. =FIND(\"@\", \"user@email.com\") devuelve 5." },
      { term: "SEARCH(find_text, within_text)", def: "Igual que FIND pero no distingue mayusculas/minusculas. Acepta wildcards." },
    ]},
    { type: "text", value: "Combinados con MID y LEFT permiten extraer cualquier parte de un texto dinamicamente. Ejemplo: =LEFT(A1, FIND(\"@\", A1)-1) extrae el usuario de un email." },
  ]},
  { title: "Combinar texto: CONCAT, TEXTJOIN", content: [
    { type: "definition_list", items: [
      { term: "CONCAT(text1, text2, ...)", def: "Une textos. =CONCAT(A1, \" \", B1) une nombre y apellido con espacio. Tambien funciona el operador &: =A1&\" \"&B1." },
      { term: "TEXTJOIN(delimiter, ignore_empty, range)", def: "Une un rango con separador. =TEXTJOIN(\", \", TRUE, A2:A10) combina todos los valores separados por coma. Mucho mas poderosa que CONCAT para rangos." },
    ]},
  ]},
  { title: "Limpiar y transformar: TRIM, CLEAN, UPPER, LOWER, PROPER", content: [
    { type: "definition_list", items: [
      { term: "TRIM(text)", def: "Elimina espacios extra: deja solo un espacio entre palabras. Indispensable al importar datos externos." },
      { term: "CLEAN(text)", def: "Elimina caracteres no imprimibles (line breaks, tabs). Usa TRIM despues de CLEAN: =TRIM(CLEAN(A1))." },
      { term: "UPPER / LOWER / PROPER", def: "UPPER: todo mayusculas. LOWER: todo minusculas. PROPER: primera letra de cada palabra en mayuscula. Ideal para estandarizar nombres." },
    ]},
  ]},
  { title: "TEXT — formatear valores como texto", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=TEXT(value, format_text). Convierte un valor a texto con formato especifico." },
      { term: "Fechas", def: "=TEXT(A1, \"DD/MM/YYYY\") o =TEXT(A1, \"MMM-YYYY\") para \"Mar-2025\"." },
      { term: "Numeros", def: "=TEXT(A1, \"#,##0.00\") para formato con miles y 2 decimales." },
      { term: "Combinado con texto", def: "=\"Fecha: \"&TEXT(A1, \"DD-MMM-YYYY\") genera \"Fecha: 15-Mar-2025\"." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>NIVEL 2 — INTERMEDIO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 4 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Funciones de texto</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Manipula, limpia y transforma datos de texto con LEFT, RIGHT, MID, TRIM, CONCAT, TEXTJOIN y mas.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas extraer, combinar, limpiar y transformar datos de texto usando las funciones mas importantes de Excel.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este modulo</div>
        {["LEFT, RIGHT, MID para extraer partes de texto. LEN y FIND para saber longitud y posicion.", "TRIM y CLEAN son lo primero que aplicas cuando recibes datos externos. Siempre.", "TEXTJOIN es mas poderosa que CONCAT para unir rangos con separador.", "UPPER, LOWER, PROPER para estandarizar texto sin editar celda por celda.", "TEXT convierte numeros y fechas a texto formateado. Esencial para combinar con otros textos."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: SUMIF, SUMIFS, COUNTIF, COUNTIFS</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Funciones de fecha</span>
      </div>
    </div>
  );
}
