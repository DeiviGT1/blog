import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [{ title: "Co-authoring", content: [{ type: "definition_list", items: [{ term: "Requisitos", def: "OneDrive/SharePoint + .xlsx + AutoSave." }, { term: "Visuales", def: "Cursores de otros con colores. Cambios en tiempo real." }, { term: "Conflictos", def: "Excel notifica si dos editan la misma celda." }] }] }, { title: "Comments y Notes", content: [{ type: "definition_list", items: [{ term: "Comments", def: "Hilos con @menciones. Se pueden marcar como resueltos con el boton Resolve." }, { term: "Notes", def: "Anotaciones simples en celdas (sin hilo de conversacion). Son las notas clasicas amarillas." }, { term: "Diferencia", def: "Comments para discusion. Notes para documentacion." }] }] }, { title: "Version History", content: [{ type: "text", value: "File > Info > Version History. Todas las versiones con fecha y autor. Restaurar cualquiera. Elimina v1, v2, FINAL." }] }, { title: "Documentacion interna", content: [{ type: "definition_list", items: [{ term: "Hoja README", def: "Explica que hace el archivo, fuentes, ultima actualizacion." }, { term: "Notes en formulas", def: "Explica logica compleja. Tu yo futuro lo agradecera." }, { term: "Nombrado consistente", def: "Named Ranges, Sheets, archivos con convencion clara." }] }] }, { title: "Templates y cierre", content: [{ type: "definition_list", items: [{ term: "Templates .xltx", def: "Save As > Excel Template. Crea copias sin modificar original." }, { term: "Antes de enviar", def: "Sin errores, Filters limpios, cursor en A1." }, { term: "Detalle profesional", def: "Cursor en A1 de primera hoja. Se nota." }] }] }];
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 8 de 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Colaboracion y buenas practicas</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Co-authoring, Comments, Version History, Templates y documentacion profesional.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que trabajes en entornos colaborativos de forma profesional.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["Co-authoring: OneDrive/SharePoint + .xlsx + AutoSave.", "Comments para discusion. Notes para documentacion.", "Version History elimina archivos v1, v2, FINAL.", "Hoja README en todo archivo profesional.", "Antes de enviar: sin errores, Filters limpios, cursor en A1."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Proteccion y auditoria</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente nivel: Nivel 4 — Excel Pro</span>
      </div>
    </div>
  );
}
