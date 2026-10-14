import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "El principio fundamental",
    content: [
      { type: "text", value: "Esta es la regla más importante de todo el curso. Si la internalizas, el 80% de tus problemas con Excel desaparecen antes de empezar." },
      { type: "key_points", items: [
        { title: "Una fila = un registro", text: "Cada fila representa un solo elemento: una venta, un empleado, un producto, una transacción. Nunca pongas información de dos registros distintos en la misma fila." },
        { title: "Una columna = un campo", text: "Cada columna representa un solo tipo de información: nombre, fecha, monto, región, estatus. Nunca mezcles tipos de datos en una misma columna." },
      ]},
      { type: "text", value: "Este principio es lo que permite que Filter, Sort, PivotTables, SUMIFS y prácticamente toda herramienta de análisis funcione correctamente. Cuando los datos no están estructurados así, nada funciona bien." },
    ]
  },
  {
    title: "Errores comunes que debes evitar",
    content: [
      { type: "text", value: "Estos son los errores que se ven constantemente en archivos del mundo real. Cada uno rompe alguna funcionalidad de Excel." },
      { type: "definition_list", items: [
        { term: "Filas en blanco entre datos", def: "Excel interpreta una fila vacía como el fin de la tabla. Sort, Filter y PivotTables dejan de incluir las filas de abajo. Nunca dejes filas vacías dentro de tu rango de datos." },
        { term: "Títulos o notas dentro del rango", def: "Si pones un título en la fila 1 y los datos empiezan en la fila 3, Excel puede confundir qué es dato y qué es decoración. Los títulos van fuera del rango o en otra hoja." },
        { term: "Una fila con dos registros", def: "Una celda que dice \"Juan Pérez - Ventas Norte - $5,000\" debería ser 3 columnas separadas: Nombre, Región, Monto. Una celda, un dato." },
        { term: "Mezclar tipos en una columna", def: "Si una columna de montos tiene \"$1,000\" en una celda y \"Pendiente\" en otra, Excel no puede sumar ni analizar esa columna." },
        { term: "Totales dentro de la tabla", def: "Una fila de totales al final de tus datos hace que PivotTables y SUMIFS la incluyan en sus cálculos. Los totales van fuera de la tabla." },
      ]},
    ]
  },
  {
    title: "Encabezados correctos",
    content: [
      { type: "text", value: "Los encabezados son la primera fila de tu tabla. Errores aquí causan problemas en cascada." },
      { type: "key_points", items: [
        { title: "Cada columna necesita un encabezado", text: "Sin excepciones. Una columna sin encabezado confunde a Filter, PivotTables y a cualquier persona que abra el archivo." },
        { title: "Los encabezados deben ser únicos", text: "Nunca repitas el mismo nombre. Si tienes dos columnas de \"Monto\", nómbralas \"Monto Ventas\" y \"Monto Costos\"." },
        { title: "Una sola fila de encabezados", text: "Nunca uses dos filas. Encabezados multilínea rompen Filter y PivotTables. Usa \"Ventas Q1\", \"Ventas Q2\" en vez de una fila para \"Ventas\" y otra para \"Q1, Q2\"." },
        { title: "Descriptivos y cortos", text: "Buenos: \"Region\", \"Sale Date\", \"Unit Price\". Malos: \"a\", \"columna 3\", \"datos del mes pasado\"." },
      ]},
    ]
  },
  {
    title: "Cómo organizar un Worksheet",
    content: [
      { type: "text", value: "No todo va en la misma zona. Organizar las secciones de tu Worksheet evita confusión y errores." },
      { type: "key_points", items: [
        { title: "Datos crudos", text: "Empiezan en A1. Es la tabla principal. Siempre arriba a la izquierda. Nunca empieces una tabla en F15 sin razón." },
        { title: "Resúmenes y cálculos", text: "Van separados: a la derecha, debajo con espacio, o en otra hoja. No mezcles datos crudos con fórmulas de resumen." },
        { title: "Parámetros o inputs", text: "Variables que el usuario cambia (impuesto, tipo de cambio, fecha de corte) van en una zona diferenciada o en una hoja de \"Inputs\"." },
      ]},
      { type: "text", value: "La idea: cuando alguien abra tu archivo debería entender en 10 segundos dónde están los datos, dónde están los cálculos y qué puede modificar." },
    ]
  },
  {
    title: "Rango de datos vs. Table (Ctrl+T)",
    content: [
      { type: "text", value: "Un rango es cualquier grupo de celdas. Una Table es un rango que Excel reconoce formalmente como estructura de datos. La diferencia es enorme. Para convertir: selecciona cualquier celda dentro de tus datos y presiona Ctrl+T." },
      { type: "definition_list", items: [
        { term: "Se expande automáticamente", def: "Al agregar una fila al final, la Table crece sola. Charts, PivotTables y Named Ranges que apuntan a ella se actualizan." },
        { term: "Filtros integrados", def: "Los menús de Filter aparecen automáticamente en cada encabezado al crear la Table." },
        { term: "Nombres estructurados", def: "En vez de =SUM(C2:C100), escribes =SUM(Table1[Sales]). Más legible y se ajusta al tamaño de la tabla." },
        { term: "Mejor con PivotTables", def: "Cuando la fuente de una PivotTable es una Table, los datos nuevos se incluyen automáticamente al Refresh." },
        { term: "Formato visual consistente", def: "Bandas alternadas que facilitan la lectura. Se puede cambiar desde Table Design." },
      ]},
      { type: "key_points", items: [
        { title: "La recomendación", text: "Convierte tus datos a Table siempre. Es casi siempre la mejor decisión. Las únicas excepciones son tablas muy pequeñas de referencia o compatibilidad con sistemas externos." },
      ]},
    ]
  },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 3 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Estructura y organización de datos</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>La regla más importante de Excel: los datos deben estar estructurados como tabla. Todo lo demás depende de esto.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que entiendas y apliques la estructura correcta de datos para que todas las herramientas de Excel funcionen como deben.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este módulo</div>
        {["Una fila = un registro. Una columna = un campo. Sin excepciones.","Nunca dejes filas en blanco dentro de tu tabla de datos.","Los encabezados deben ser únicos, descriptivos y en una sola fila.","Separa datos crudos de cálculos y de parámetros.","Convierte tus datos a Table (Ctrl+T) siempre. Se expande sola, tiene filtros y funciona mejor con todo."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Navegación y Keyboard Shortcuts</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Formato con propósito</span>
      </div>
    </div>
  );
}
