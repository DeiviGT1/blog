import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [{ title: "Que es la certificacion MOS", content: [{ type: "definition_list", items: [{ term: "Definicion", def: "Microsoft Office Specialist: certificacion oficial que valida competencias en Excel. Reconocida globalmente." }, { term: "Niveles", def: "MOS Associate (funcionalidad intermedia) y MOS Expert (avanzada incluyendo macros y analisis)." }, { term: "Valor", def: "Diferenciador en el CV. Valida objetivamente lo que sabes hacer." }] }] }, { title: "Estructura del examen", content: [{ type: "definition_list", items: [{ term: "Formato", def: "Examen practico en Excel real. No hay preguntas de opcion multiple. Tareas que debes completar." }, { term: "Ejemplo", def: "Crea PivotTable que muestre ventas por trimestre, agrega Calculated Field para margen, aplica Slicer por region." }, { term: "Tiempo", def: "Generalmente 50 minutos para completar todos los proyectos." }] }] }, { title: "Dominios del examen Associate", content: [{ type: "definition_list", items: [{ term: "Manage Worksheets", def: "Crear, navegar, formatear, configurar Workbooks y Worksheets." }, { term: "Manage Data", def: "Ingresar, formatear, ordenar, filtrar datos en celdas y rangos." }, { term: "Tables", def: "Crear Tables, modificar, ordenar, filtrar datos tabulares." }, { term: "Formulas and Functions", def: "SUM, IF, VLOOKUP y funciones intermedias." }, { term: "Charts", def: "Crear, modificar, formatear graficos." }] }] }, { title: "Dominios del examen Expert", content: [{ type: "definition_list", items: [{ term: "Workbook Options", def: "Templates, proteccion, macros, opciones avanzadas." }, { term: "Advanced Data", def: "Validacion avanzada, funciones de texto, formato condicional con formulas." }, { term: "Advanced Formulas", def: "Funciones anidadas, XLOOKUP, INDEX+MATCH, Named Ranges, macros basicas." }, { term: "Advanced Charts and Tables", def: "PivotTables avanzadas, Calculated Fields, PivotCharts." }] }] }, { title: "Estrategia de preparacion", content: [{ type: "definition_list", items: [{ term: "Cobertura del curso", def: "Si completaste Niveles 0-3, cubres 90% del Associate y 70% del Expert." }, { term: "Practicar formato de examen", def: "Tareas con tiempo limite. Haz 3+ simulacros completos antes del examen real." }, { term: "Errores comunes", def: "No terminar (tiempo), no leer bien la tarea, no verificar resultados." }, { term: "Logistica", def: "Centro Pearson VUE o en linea. Costo ~$100-150 USD. Resultado inmediato." }] }] }];
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>NIVEL 4 — EXCEL PRO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 6 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Preparacion certificacion MOS</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Microsoft Office Specialist: estructura del examen, dominios y estrategia.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que conozcas la estructura del examen MOS y puedas prepararte estrategicamente.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["MOS Associate para nivel intermedio. MOS Expert para avanzado.", "Examen 100% practico: tareas reales en Excel, no opcion multiple.", "Niveles 0-3 de este curso cubren 90% del Associate.", "Haz 3+ simulacros con tiempo para prepararte.", "Resultado inmediato. Certificado digital para LinkedIn y CV."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Power Query avanzado</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Curso completado</span>
      </div>
    </div>
  );
}
