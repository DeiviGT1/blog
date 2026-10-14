import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "La regla de oro", content: [
    { type: "text", value: "Si el formato no ayuda a entender los datos, sobra. Excel no es Word ni PowerPoint. El objetivo es claridad, no estética. Cada decisión de formato debería responder: ¿esto ayuda al lector a entender la información más rápido?" },
  ]},
  { title: "Number Formats", content: [
    { type: "text", value: "Una celda tiene dos capas: el valor real (lo que contiene) y el formato (cómo se muestra). Una celda puede contener 0.156 y mostrar \"16%\" o \"$0.16\" dependiendo del Number Format." },
    { type: "definition_list", items: [
      { term: "General", def: "Sin formato. Excel decide cómo mostrarlo. Es el default." },
      { term: "Number", def: "Decimales y separador de miles. #,##0 para enteros, #,##0.00 para dos decimales." },
      { term: "Currency / Accounting", def: "Agrega símbolo de moneda. Accounting alinea símbolos y muestra negativos entre paréntesis." },
      { term: "Percentage", def: "Multiplica por 100 y agrega %. Si la celda contiene 0.15, muestra 15%. Si escribes 15 y aplicas %, muestra 1500%." },
      { term: "Date / Time", def: "Controla cómo se muestra una fecha. El valor interno no cambia: DD/MM/YYYY, MMM-YY, etc." },
      { term: "Text", def: "Trata todo como texto. Útil para códigos con ceros a la izquierda (001234)." },
      { term: "Custom", def: "Formatos personalizados: #,##0 para miles sin decimales, 0.0% para un decimal en porcentajes." },
    ]},
    { type: "key_points", items: [
      { title: "El error clásico", text: "Confundir formato con contenido. Si una celda muestra \"$1,000\" pero escribiste el texto \"$1,000\" en vez del número 1000 con formato Currency, Excel no puede calcular. Siempre ingresa el valor limpio." },
    ]},
  ]},
  { title: "Formato visual que sí aporta", content: [
    { type: "key_points", items: [
      { title: "Bold para encabezados", text: "Diferencia visualmente los encabezados del resto. Solo encabezados y títulos de sección." },
      { title: "Borders para separar secciones", text: "Bordes finos entre datos y resumen. No pongas bordes en todas las celdas — satura la vista." },
      { title: "Colores de fondo sutiles", text: "Gris claro para inputs, azul pálido para encabezados. Máximo 2-3 colores, nunca chillones." },
      { title: "Alignment", text: "Texto a la izquierda, números a la derecha, encabezados centrados. Consistente con los defaults de Excel." },
    ]},
  ]},
  { title: "Lo que nunca deberías hacer", content: [
    { type: "definition_list", items: [
      { term: "Merge Cells en datos", def: "Rompe Sort, Filter, PivotTables y Copy/Paste. El error más destructivo. Solo se justifica en títulos fuera de la tabla." },
      { term: "Tamaños de fuente aleatorios", def: "5 tamaños distintos sin lógica = el lector no sabe qué es importante. Usa 2 máximo." },
      { term: "Colores como único indicador", def: "Si \"rojo = urgente\" pero no hay texto que lo diga, alguien con daltonismo no puede leer la hoja." },
      { term: "Texto en diagonal", def: "Difícil de leer, no aporta. Si el encabezado es largo, haz la columna más ancha." },
      { term: "Bordes decorativos excesivos", def: "Bordes gruesos, dobles líneas, colores en bordes. Saturan la vista sin aportar." },
    ]},
  ]},
  { title: "Herramientas de formato rápido", content: [
    { type: "key_points", items: [
      { title: "Format Painter", text: "Selecciona celda con formato deseado > Home > Format Painter (icono de brocha). Double-click en el icono para aplicar a múltiples rangos. Alternativa: Ctrl+C > seleccionar destino > Ctrl+Alt+V > Formats." },
      { title: "Cell Styles", text: "Home > Cell Styles. Estilos predefinidos para encabezados, inputs, cálculos. Mantiene consistencia en archivos grandes." },
      { title: "Conditional Formatting (preview)", text: "Formato automático según reglas. Se profundiza en Nivel 1. Aquí solo como concepto." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 4 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Formato con propósito</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>El formato existe para comunicar información, no para decorar. Aprende a usarlo con criterio profesional.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que entiendas que el formato existe para comunicar, no para decorar, y que lo apliques con criterio profesional.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este módulo</div>
        {["El formato comunica, no decora. Si no ayuda a entender los datos, sobra.","Number Format controla cómo se muestra un valor, no lo que contiene. Nunca confundas formato con contenido.","Merge Cells en datos es el error más destructivo. Nunca lo hagas.","Máximo 2-3 colores, 2 tamaños de fuente, bordes solo donde aporten.","Format Painter y Cell Styles mantienen consistencia visual."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Estructura y organización de datos</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Nombrado y orden de archivos</span>
      </div>
    </div>
  );
}
