import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "El cambio de mentalidad", content: [
    { type: "text", value: "Excel no es un lienzo libre donde escribes lo que quieras donde quieras. Es un motor de datos que funciona con reglas. Si tus datos están bien estructurados, Excel hace el trabajo pesado. Si están mal, vas a pelear con cada fórmula, cada filtro y cada gráfico." },
    { type: "text", value: "Este módulo consolida todo lo que aprendiste en el Nivel 0 en un conjunto de principios que deberías aplicar siempre." },
  ]},
  { title: "Los 10 principios del buen usuario de Excel", content: [
    { type: "definition_list", items: [
      { term: "1 — Tus datos son una Table. Siempre.", def: "Usa Ctrl+T. Se expande automáticamente, tiene filtros y funciona mejor con cada herramienta." },
      { term: "2 — Una fila, un registro. Sin excepciones.", def: "Cada fila = un elemento. Nunca mezcles dos registros en una fila." },
      { term: "3 — Una columna, un campo. Sin mezclar.", def: "Cada columna = un tipo de dato. Nombre y apellido son dos columnas, no una." },
      { term: "4 — Nunca uses Merge Cells en datos.", def: "Rompe Sort, Filter, PivotTables y Copy/Paste. Solo para títulos decorativos fuera de la tabla." },
      { term: "5 — Los encabezados son sagrados.", def: "Únicos, claros, descriptivos y en una sola fila." },
      { term: "6 — Separa datos de cálculos de presentación.", def: "Datos crudos en una zona, cálculos en otra, presentación en otra. Nunca los mezcles." },
      { term: "7 — Nombra tus Sheets y archivos con lógica.", def: "El nombre dice qué hay adentro. Si necesitas explicarlo, está mal." },
      { term: "8 — El formato comunica, no decora.", def: "Bold para encabezados, Number Format para valores, colores sutiles para diferenciar zonas." },
      { term: "9 — Aprende los atajos que usas todos los días.", def: "15 atajos internalizados ahorran más que 50 memorizados a medias." },
      { term: "10 — Si lo haces más de dos veces, hay una forma más rápida.", def: "Fórmulas, Fill Handle, Ctrl+D, Filter, PivotTables. Excel tiene herramientas para todo lo repetitivo." },
    ]},
  ]},
  { title: "Diagnóstico visual: señales de una hoja mal construida", content: [
    { type: "text", value: "Un usuario que domina estos principios puede mirar cualquier hoja y diagnosticar qué está mal inmediatamente." },
    { type: "definition_list", items: [
      { term: "Celdas combinadas por todas partes", def: "Alguien priorizó cómo se ve sobre cómo funciona. Solución: quitar Merge, separar datos correctamente." },
      { term: "Datos que empiezan en F15", def: "No hay razón para empezar lejos de A1. Confunde PivotTables, macros y otros usuarios." },
      { term: "Totales mezclados con datos", def: "Una fila de totales dentro de la tabla contamina análisis. Mover fuera o usar fórmula separada." },
      { term: "Hojas llamadas Sheet1 a Sheet5", def: "Nadie sabe qué hay en cada una. Renombrar toma 30 segundos y ahorra horas." },
      { term: "Colores por todas partes sin lógica", def: "Formato decorativo que no comunica. Simplificar a 2-3 colores con propósito." },
    ]},
  ]},
  { title: "Cierre del Nivel 0", content: [
    { type: "text", value: "Con estos 6 módulos tienes la base mental y operativa para abordar cualquier nivel posterior. No sabes fórmulas todavía, pero sabes pensar, navegar y organizar como un profesional." },
    { type: "text", value: "Lo que ganaste: conoces la interfaz, navegas con atajos, estructuras datos como Table, aplicas formato con propósito, organizas archivos profesionalmente, y piensas en Excel como un motor de datos." },
    { type: "text", value: "A partir del Nivel 1, cada concepto nuevo se construye sobre esta base. Si algo no funciona como esperas, la respuesta probablemente está aquí." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 6 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Mentalidad — Pensar en Tables</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>El cambio de mentalidad que separa a un usuario que pelea con Excel de uno que lo aprovecha al máximo.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que cambies la forma en que piensas sobre Excel: no es un lienzo libre, es un motor de datos con reglas.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este módulo</div>
        {["Excel es un motor de datos con reglas, no un lienzo libre. Respeta la estructura y funcionará para ti.","Los 10 principios no son sugerencias: son la diferencia entre un archivo que funciona y uno que da problemas.","Si puedes diagnosticar qué está mal con solo ver una hoja, ya piensas como profesional.","Todo lo que viene después depende de que estos fundamentos estén sólidos.","Si algo no funciona en niveles posteriores, la respuesta probablemente está en el Nivel 0."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Nombrado y orden de archivos</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Has completado el Nivel 0</span>
      </div>
    </div>
  );
}
