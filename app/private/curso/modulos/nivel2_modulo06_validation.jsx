import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Para que sirve Data Validation", content: [
    { type: "text", value: "Cuando compartes un Workbook o construyes una herramienta para otros, no puedes controlar que escriben en cada celda. Data Validation establece reglas que restringen la entrada: solo numeros dentro de un rango, solo fechas, solo valores de una lista. Se accede desde Data > Data Validation." },
  ]},
  { title: "Drop-down Lists — lo mas usado", content: [
    { type: "key_points", items: [
      { title: "Como crear una", text: "Selecciona la celda o rango > Data > Data Validation > Allow: List. En Source escribe las opciones separadas por comas: Pendiente,En proceso,Completado. O selecciona un rango de celdas que contiene las opciones." },
      { title: "Ventaja de usar un rango", text: "Si las opciones cambian frecuentemente, es mejor que apunten a un rango en otra hoja. Asi cambias la lista en un solo lugar y todas las celdas se actualizan." },
      { title: "Con Named Range", text: "Si el rango tiene nombre (Define Name), puedes escribir =NombreDelRango en Source. Mas limpio y mas facil de mantener." },
    ]},
  ]},
  { title: "Validaciones numericas y de fecha", content: [
    { type: "definition_list", items: [
      { term: "Whole Number", def: "Solo acepta numeros enteros. Puedes definir: between 1 and 100, greater than 0, etc." },
      { term: "Decimal", def: "Acepta numeros con decimales dentro del rango que definas." },
      { term: "Date", def: "Solo acepta fechas dentro de un rango valido. Ejemplo: entre hoy y un ano en el futuro." },
      { term: "Text Length", def: "Limita el largo del texto. Ejemplo: codigos de exactamente 8 caracteres, o comentarios de maximo 200 caracteres." },
    ]},
  ]},
  { title: "Input Message y Error Alert", content: [
    { type: "definition_list", items: [
      { term: "Input Message", def: "Tooltip que aparece cuando el usuario selecciona la celda. Ideal para dar instrucciones: 'Selecciona el estatus del pedido'. Se configura en la pestana Input Message de Data Validation." },
      { term: "Error Alert — Stop", def: "No permite la entrada invalida. El usuario no puede continuar hasta que ingrese un valor valido. Es el mas seguro." },
      { term: "Error Alert — Warning", def: "Advierte pero permite la entrada. El usuario puede ignorar la advertencia e ingresar un valor invalido." },
      { term: "Error Alert — Information", def: "Solo informa. No impide nada. Util cuando quieres sugerir sin restringir." },
    ]},
  ]},
  { title: "Circulos de validacion y auditoria", content: [
    { type: "key_points", items: [
      { title: "Circle Invalid Data", text: "Data > Data Validation > Circle Invalid Data. Muestra circulos rojos alrededor de celdas que no cumplen las reglas. Muy util para auditar datos que ya existian antes de agregar las reglas." },
      { title: "Cuando usarlo", text: "Despues de importar datos o recibir un archivo de alguien mas. Aplica las reglas de validacion y luego Circle Invalid Data para ver que datos no cumplen." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 6 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Data Validation</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Controla que se ingresa en cada celda: Drop-down Lists, restricciones numericas, mensajes de error.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas crear listas desplegables, restricciones de entrada y mensajes de validacion para controlar la calidad de datos.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["Drop-down Lists son lo mas usado. Apuntalas a un rango o Named Range para facil mantenimiento.", "Error Alert tipo Stop es el mas seguro: no permite entrada invalida.", "Input Message da instrucciones al usuario cuando selecciona la celda.", "Circle Invalid Data audita datos existentes contra las reglas de validacion.", "Data Validation no protege contra Paste. Si alguien pega valores, puede saltarse las reglas."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Funciones de fecha</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Named Ranges</span>
      </div>
    </div>
  );
}
