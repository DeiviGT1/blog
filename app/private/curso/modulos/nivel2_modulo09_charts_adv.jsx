import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Combo Charts — dos tipos en uno", content: [
    { type: "text", value: "Cuando necesitas mostrar dos metricas con escalas diferentes en el mismo grafico. Ejemplo: barras para volumen de ventas y una linea para el precio promedio." },
    { type: "key_points", items: [
      { title: "Como crear", text: "Insert > Combo Chart. O selecciona un Chart existente, clic derecho en una serie > Change Series Chart Type. Cada serie puede tener su propio tipo (Column, Line, Area)." },
      { title: "Cuando usarlo", text: "Cuando tienes metricas relacionadas pero con unidades o escalas diferentes. Revenue (en miles) + Growth Rate (en %). Units Sold + Average Price." },
    ]},
  ]},
  { title: "Secondary Axis", content: [
    { type: "text", value: "Cuando las dos metricas tienen escalas muy diferentes, necesitas un segundo eje Y a la derecha." },
    { type: "key_points", items: [
      { title: "Como activar", text: "Selecciona una serie en el Chart > Format Data Series > Plot Series On: Secondary Axis. Aparece un segundo eje a la derecha con su propia escala." },
      { title: "Cuidado", text: "Si no se etiquetan bien los ejes, el lector puede confundir que escala corresponde a que serie. Siempre agrega titulos de eje claros con unidades." },
    ]},
  ]},
  { title: "Sparklines — mini graficos en celdas", content: [
    { type: "definition_list", items: [
      { term: "Que son", def: "Mini graficos dentro de una celda que muestran la tendencia de un rango. Insert > Sparklines: Line, Column, Win/Loss." },
      { term: "Ejemplo", def: "Al lado de cada vendedor, una Sparkline que muestra su tendencia de ventas de los ultimos 12 meses. No reemplazan un Chart completo pero dan contexto visual inmediato." },
      { term: "Configuracion", def: "Sparkline Design tab permite cambiar tipo, color, marcar puntos altos/bajos, y ajustar el eje para comparar entre diferentes Sparklines." },
    ]},
  ]},
  { title: "Trendlines — lineas de tendencia", content: [
    { type: "definition_list", items: [
      { term: "Como agregar", def: "Clic derecho sobre una serie en un Chart > Add Trendline. Tipos: Linear (la mas comun), Exponential, Moving Average." },
      { term: "Linear", def: "Linea recta que muestra la direccion general. Util para saber si los datos suben, bajan o se mantienen." },
      { term: "Moving Average", def: "Suaviza fluctuaciones para ver la tendencia subyacente. Especifica el periodo (3, 6, 12 meses, etc.)." },
      { term: "Display Equation", def: "Muestra la formula matematica de la tendencia en el Chart. Display R-squared muestra que tan bien se ajusta la linea a los datos." },
    ]},
  ]},
  { title: "Diseno profesional avanzado", content: [
    { type: "key_points", items: [
      { title: "Eliminar ruido visual", text: "Quita gridlines excesivas, legends redundantes, bordes innecesarios. Cada elemento debe justificar su presencia." },
      { title: "Color con proposito", text: "Un color para destacar la serie principal, gris para el contexto. No uses un color diferente para cada serie sin razon." },
      { title: "Titulos que concluyen", text: "'Ventas crecieron 23% en Q4' es mejor que 'Ventas Q1-Q4'. El titulo debe decir la conclusion, no solo describir los datos." },
      { title: "El test de 5 segundos", text: "Si alguien no puede entender tu grafico en 5 segundos, tiene demasiada informacion, es el tipo incorrecto, o falta un titulo claro." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 9 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Charts avanzados</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Combo Charts, Secondary Axis, Sparklines, Trendlines. Visualizaciones que cuentan una historia.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas crear visualizaciones sofisticadas con Combo Charts, Secondary Axis, Sparklines y Trendlines.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave</div>
        {["Combo Charts combinan dos tipos (Column + Line) para metricas con escalas diferentes.", "Secondary Axis agrega un segundo eje Y. Siempre etiqueta ambos ejes con unidades.", "Sparklines dan contexto de tendencia dentro de una celda. Insert > Sparklines.", "Trendlines muestran la direccion general. Linear para tendencia, Moving Average para suavizar.", "Titulos que concluyen, colores con proposito, y el test de 5 segundos."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: PivotTables desde cero</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente nivel: Nivel 3 — Avanzado</span>
      </div>
    </div>
  );
}
