import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Que es una PivotTable", content: [
    { type: "text", value: "Una herramienta que toma una tabla de datos y te permite resumirla, agruparla y analizarla arrastrando campos sin escribir una sola formula. Lo que harias con decenas de SUMIFS, COUNTIFS y filtros, una PivotTable lo hace en segundos." },
    { type: "text", value: "Es la razon principal por la que la gente dice que 'alguien sabe Excel'. Si dominas PivotTables, puedes analizar cualquier dataset." },
  ]},
  { title: "Requisitos del dato fuente", content: [
    { type: "key_points", items: [
      { title: "Formato tabular", text: "Una fila por registro, encabezados en la primera fila, sin filas en blanco, sin celdas combinadas. Todo lo que aprendiste en el Nivel 0." },
      { title: "Usar Table (Ctrl+T)", text: "Si la fuente es una Table, la PivotTable se ajusta automaticamente cuando los datos crecen. Si es un rango normal, tendras que actualizar el rango manualmente." },
      { title: "Datos limpios", text: "Sin mezcla de tipos en una columna, sin valores inconsistentes (Norte, NORTE, norte deben ser iguales). Limpia primero, analiza despues." },
    ]},
  ]},
  { title: "Como crear una PivotTable", content: [
    { type: "key_points", items: [
      { title: "Paso 1", text: "Ubicarte dentro de tu tabla de datos (cualquier celda)." },
      { title: "Paso 2", text: "Insert > PivotTable. Excel detecta el rango automaticamente." },
      { title: "Paso 3", text: "Elige donde colocarla: New Worksheet (lo mas comun) o Existing Worksheet." },
      { title: "Paso 4", text: "Aparece el panel PivotTable Fields con 4 zonas: Rows, Columns, Values, Filters." },
    ]},
  ]},
  { title: "Las 4 zonas del PivotTable Fields", content: [
    { type: "definition_list", items: [
      { term: "Rows", def: "Que va en cada fila. Arrastra 'Region' aqui y veras una fila por region." },
      { term: "Columns", def: "Que va en cada columna. Arrastra 'Product' aqui y veras una columna por producto. Combinado con Rows crea una matriz." },
      { term: "Values", def: "Que se calcula. Arrastra 'Sales' aqui y veras la suma de ventas. Por defecto: numeros se suman (SUM), texto se cuenta (COUNT)." },
      { term: "Filters", def: "Filtros generales. Arrastra 'Year' aqui y podras filtrar toda la PivotTable por ano desde un dropdown arriba." },
    ]},
    { type: "text", value: "La magia: puedes reconfigurarla en segundos solo arrastrando campos entre zonas. Quieres ver ventas por producto en vez de por region? Arrastra Region fuera y Product a Rows. Listo." },
  ]},
  { title: "Funciones de resumen y Show Values As", content: [
    { type: "definition_list", items: [
      { term: "Cambiar funcion de resumen", def: "Clic derecho en un valor > Summarize Values By > AVERAGE, MAX, MIN, COUNT, etc. No estas limitado a SUM." },
      { term: "% of Grand Total", def: "Show Values As > % of Grand Total. Cada celda muestra su porcentaje del total general." },
      { term: "% of Column Total", def: "Cada celda como porcentaje de su columna. Util para comparar distribuciones." },
      { term: "Running Total", def: "Acumulado progresivo. Util para ver como se acumulan las ventas mes a mes." },
      { term: "Difference From", def: "Diferencia respecto a un elemento base. Util para comparar cada region contra un benchmark." },
    ]},
  ]},
  { title: "Actualizar y mantener", content: [
    { type: "key_points", items: [
      { title: "Refresh", text: "Los datos cambian pero la PivotTable no se actualiza sola. Clic derecho > Refresh, o PivotTable Analyze > Refresh. Si usas Table como fuente, el rango se ajusta automaticamente." },
      { title: "Cambiar Data Source", text: "Si los datos crecieron mas alla del rango original (y no usaste Table), PivotTable Analyze > Change Data Source para actualizar el rango." },
    ]},
  ]},
  { title: "Formato y diseno", content: [
    { type: "definition_list", items: [
      { term: "PivotTable Styles", def: "PivotTable Design tab ofrece estilos predefinidos. Elige uno limpio con bandas de color sutiles." },
      { term: "Report Layout", def: "PivotTable Design > Report Layout. Compact (default), Outline, Tabular. Tabular es el mas parecido a una tabla normal y el mejor para copiar datos." },
      { term: "Subtotals y Grand Totals", def: "Se activan/desactivan desde PivotTable Design. A veces los subtotales sobran y es mejor quitarlos para un look mas limpio." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 8 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>PivotTables desde cero</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>La herramienta mas poderosa de Excel: resume, agrupa y analiza datos arrastrando campos.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas crear PivotTables desde cero, configurar las 4 zonas, cambiar funciones de resumen, y mantenerlas actualizadas.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["Datos limpios en formato tabular son el prerequisito. Sin esto, la PivotTable no funciona bien.", "Las 4 zonas: Rows (filas), Columns (columnas), Values (calculos), Filters (filtros generales).", "Arrastra campos entre zonas para reconfigurar el analisis en segundos.", "Show Values As transforma numeros en porcentajes, acumulados o diferencias.", "Usa Table como fuente para que la PivotTable se ajuste automaticamente cuando los datos crecen."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Named Ranges</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Charts avanzados</span>
      </div>
    </div>
  );
}
