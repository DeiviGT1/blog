import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "Nombrado de Sheets", content: [
    { type: "text", value: "El nombre de cada Sheet debe decirte qué hay adentro sin abrirla. La mayoría de archivos tienen hojas llamadas Sheet1, Sheet2, Sheet3." },
    { type: "key_points", items: [
      { title: "Buenos nombres", text: "Cortos, descriptivos, sin caracteres especiales: \"Data\", \"Summary\", \"Inputs\", \"Jan_2025\", \"Sales_Raw\", \"Dashboard\"." },
      { title: "Malos nombres", text: "\"Sheet1\", \"Hoja 1 - copia\", \"datos finales v2 FINAL\". Si necesitas explicar qué hay, el nombre está mal." },
      { title: "Reglas prácticas", text: "Sin espacios innecesarios (usa _ o CamelCase), sin caracteres especiales, máximo 20-25 caracteres." },
    ]},
  ]},
  { title: "Orden de Sheets dentro del Workbook", content: [
    { type: "text", value: "El orden debe seguir un flujo lógico de izquierda a derecha." },
    { type: "key_points", items: [
      { title: "Primera hoja: resumen o índice", text: "En archivos complejos (5+ hojas), la primera hoja debería ser un resumen, índice con hipervínculos, o Dashboard." },
      { title: "Flujo lógico", text: "Datos crudos > análisis/cálculos > presentación/output. El lector sigue el flujo: de dónde vienen los datos > qué se hizo > cuál es el resultado." },
      { title: "Hojas auxiliares al final", text: "Tablas de referencia, parámetros, lookups van al final. Accesibles pero no protagónicas." },
    ]},
  ]},
  { title: "Nombrado de Workbooks", content: [
    { type: "key_points", items: [
      { title: "Convención consistente", text: "Elige una estructura y mantenla: Proyecto_Nombre_AAAA-MM.xlsx, o Report_Sales_Q1_2025.xlsx." },
      { title: "Lo que nunca debes hacer", text: "Nunca: \"Libro1.xlsx\", \"reporte final (2).xlsx\", \"v1 final definitivo CORREGIDO.xlsx\". Para versiones, usa fechas o números secuenciales." },
      { title: "Sin caracteres problemáticos", text: "Evita acentos, ñ, y caracteres especiales. Pueden causar problemas al compartir o subir a SharePoint." },
    ]},
  ]},
  { title: "Color de Sheet Tabs", content: [
    { type: "key_points", items: [
      { title: "Cómo usarlo", text: "Clic derecho en tab > Tab Color. Agrupa hojas por función: datos en azul, cálculos en verde, resumen en naranja, auxiliares en gris." },
      { title: "El criterio", text: "Máximo 3-4 colores. Si usas 10, el efecto visual se pierde. El color agrupa categorías, no decora." },
    ]},
  ]},
  { title: "Organización de carpetas", content: [
    { type: "text", value: "Aunque está fuera de Excel, la organización de archivos en carpetas es parte del trabajo profesional." },
    { type: "key_points", items: [
      { title: "Estructura sugerida", text: "Una carpeta por proyecto. Dentro: Data (fuentes), Analysis (workbooks de trabajo), Output (entregables finales)." },
      { title: "Regla simple", text: "Si alguien nuevo tuviera que encontrar un archivo, ¿podría en menos de 30 segundos? Si no, reorganiza." },
    ]},
  ]},
];

const Render = ({ sections }) => {
  const [openSection, setOpenSection] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sections.map((section, si) => {
        const isOpen = openSection === si;
        return (
          <div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}`, transition: "all 0.2s" }}>
            <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600], transition: "all 0.2s" }}>{si + 1}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{section.title}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 16px 16px 56px" }}>
                {section.content.map((block, bi) => {
                  if (block.type === "text") return <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>{block.value}</p>;
                  if (block.type === "definition_list") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((it, di) => (<div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}><div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{it.term}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{it.def}</div></div>))}</div>);
                  if (block.type === "key_points") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((it, ki) => (<div key={ki} style={{ borderLeft: `2px solid ${V[200]}`, paddingLeft: 14 }}><div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>{it.title}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{it.text}</div></div>))}</div>);
                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Module() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800] }}>NIVEL 0 — OBLIGATORIO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 5 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Nombrado y orden de archivos</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Hábitos de organización que escalan cuando manejas múltiples archivos y hojas en tu trabajo.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que adoptes hábitos de organización que escalan cuando manejas muchos archivos y hojas.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este módulo</div>
        {["Nombra cada Sheet descriptivamente: \"Data\", \"Summary\", \"Inputs\". Nunca dejes \"Sheet1\".","Ordena hojas de izquierda a derecha: datos > análisis > resultados > auxiliares.","Convenciones consistentes para nombres de archivo. Nunca \"v1 final definitivo CORREGIDO\".","Colores de tab agrupan hojas por función. Máximo 3-4 colores.","Organiza carpetas: Data, Analysis, Output. Un archivo debe encontrarse en menos de 30 segundos."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Formato con propósito</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Mentalidad — Pensar en Tables</span>
      </div>
    </div>
  );
}
