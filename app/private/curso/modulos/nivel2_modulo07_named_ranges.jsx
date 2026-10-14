import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "El problema que resuelven", content: [
    { type: "text", value: "La formula =SUMIFS(D2:D5000, A2:A5000, \"Norte\", C2:C5000, \">1000\") funciona, pero no dice nada sobre que son esos rangos. Con Named Ranges la misma formula se convierte en =SUMIFS(Sales, Region, \"Norte\", Amount, \">1000\"). Legible, clara, profesional." },
  ]},
  { title: "Como crear un Named Range", content: [
    { type: "key_points", items: [
      { title: "Forma rapida: Name Box", text: "Selecciona el rango, haz clic en el Name Box (a la izquierda de la Formula Bar) y escribe el nombre. Enter. Listo." },
      { title: "Forma completa: Define Name", text: "Formulas > Define Name. Permite agregar Scope (Workbook o Sheet especifica) y un comentario descriptivo." },
      { title: "Desde una Table", text: "Cuando conviertes datos a Table (Ctrl+T), Excel crea nombres estructurados automaticamente. Si la Table se llama Sales, puedes referenciar Sales[Region], Sales[Amount], etc." },
    ]},
  ]},
  { title: "Name Manager", content: [
    { type: "text", value: "Formulas > Name Manager es la herramienta central para gestionar todos los nombres de un Workbook. Desde aqui puedes ver, editar, eliminar y verificar a que rango apunta cada nombre." },
    { type: "key_points", items: [
      { title: "Ver todos los nombres", text: "Lista completa con nombre, valor actual, rango al que apunta y scope. Util para auditar un archivo heredado." },
      { title: "Editar rangos", text: "Si tu tabla crecio, puedes actualizar el rango aqui. Con Tables esto es automatico." },
      { title: "Eliminar huerfanos", text: "Nombres que apuntan a rangos que ya no existen (#REF!). Limpialos regularmente." },
    ]},
  ]},
  { title: "Uso en formulas, Data Validation y mas", content: [
    { type: "definition_list", items: [
      { term: "En formulas", def: "=SUM(Sales) en vez de =SUM(D2:D5000). Mas legible y se actualiza si el rango cambia." },
      { term: "En Data Validation", def: "Source de una lista desplegable: =StatusList en vez de =$H$2:$H$5. Mas limpio." },
      { term: "En Conditional Formatting", def: "Las reglas pueden referenciar Named Ranges para ser mas claras." },
      { term: "En Charts", def: "Los rangos de datos de un Chart pueden apuntar a Named Ranges. Si los datos crecen, solo actualizas el nombre." },
    ]},
  ]},
  { title: "Convenciones de nombrado", content: [
    { type: "key_points", items: [
      { title: "Sin espacios", text: "Usa guion bajo o camelCase: Sales_Norte o SalesNorte, no 'ventas del norte'." },
      { title: "No usar nombres de celda", text: "No llames un rango 'A1' o 'R1C1'. Excel se confunde." },
      { title: "Descriptivos", text: "El nombre debe decir que contiene: ProductPrices, EmployeeList, TaxRate. No x, temp, data1." },
      { title: "Documentar", text: "En Name Manager, usa el campo Comments para describir nombres importantes. Tu yo del futuro lo agradecera." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 7 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Named Ranges</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Dale nombre a tus rangos para formulas mas legibles y archivos mas faciles de mantener.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas crear, gestionar y usar Named Ranges en formulas, Data Validation y Charts para un trabajo mas profesional.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["Name Box es la forma mas rapida: selecciona, escribe nombre, Enter.", "Name Manager (Formulas tab) para ver, editar y limpiar todos los nombres.", "Las Tables crean nombres estructurados automaticos: Table1[Column].", "Usa Named Ranges en formulas, Data Validation, Conditional Formatting y Charts.", "Nombres descriptivos, sin espacios, y documentados con Comments."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Data Validation</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: PivotTables desde cero</span>
      </div>
    </div>
  );
}
