import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Cuando usar un Chart",
    content: [
      { type: "text", value: "Un Chart existe para responder una pregunta visual: como se comparan estos valores? cual es la tendencia? que proporcion tiene cada categoria? Si tu Chart no responde una pregunta clara, probablemente no lo necesitas o elegiste el tipo incorrecto." },
      { type: "text", value: "La regla: elige el Chart que responda tu pregunta de la forma mas clara posible. Un Chart mal elegido confunde mas que una tabla de numeros." },
    ]
  },
  {
    title: "Los 4 tipos basicos",
    content: [
      { type: "text", value: "Cada tipo de Chart existe para un proposito especifico. Elegir el correcto es la decision mas importante." },
      { type: "definition_list", items: [
        { term: "Column Chart (barras verticales)", def: "Para comparar valores entre categorias. Ejemplo: ventas por region, gastos por departamento, produccion por mes. El mas versatil y el mas usado. Usa este cuando tengas duda." },
        { term: "Bar Chart (barras horizontales)", def: "Igual que Column pero horizontal. Usalo cuando los nombres de las categorias son largos y no caben debajo de barras verticales. Ejemplo: ventas por nombre de producto." },
        { term: "Line Chart (lineas)", def: "Para mostrar tendencias en el tiempo u otra secuencia continua. Ejemplo: ventas mensuales, crecimiento trimestral, temperatura diaria. El eje X generalmente representa tiempo (dias, meses, anos) u otra variable secuencial." },
        { term: "Pie Chart (circular)", def: "Para mostrar la proporcion de cada parte respecto al total. Ejemplo: distribucion de gastos por categoria. Solo usalo cuando tengas pocas categorias (maximo 5-6). Con mas categorias se vuelve ilegible." },
      ]},
    ]
  },
  {
    title: "Como crear un Chart",
    content: [
      { type: "text", value: "El proceso es simple: seleccionar datos, insertar Chart, personalizar. Excel hace la mayor parte del trabajo." },
      { type: "key_points", items: [
        { title: "Selecciona los datos correctos", text: "Incluye los encabezados en la seleccion. Excel los usa como etiquetas automaticamente. Selecciona solo las columnas relevantes — no toda la tabla si no la necesitas completa." },
        { title: "Insert > Charts", text: "El menu Insert muestra los tipos recomendados basados en tus datos. Excel 365 tiene un boton 'Recommended Charts' que sugiere el tipo mas adecuado segun la estructura de tus datos." },
        { title: "Alt+F1", text: "Crea un Chart instantaneo en la misma hoja con los datos seleccionados. La forma mas rapida de crear un grafico." },
        { title: "F11", text: "Crea el Chart en una hoja nueva dedicada. Util cuando el grafico es importante y merece su propio espacio." },
      ]},
    ]
  },
  {
    title: "Chart Elements",
    content: [
      { type: "text", value: "Los elementos del grafico controlan que informacion se muestra y como. Cada uno tiene un proposito." },
      { type: "definition_list", items: [
        { term: "Chart Title", def: "Siempre debe ser descriptivo. 'Chart 1' no dice nada. 'Ventas por Region Q1 2025' dice exactamente lo que muestra. Un buen titulo hace que el grafico se entienda sin explicacion." },
        { term: "Axis Labels", def: "Etiquetas que explican que representa cada eje. Eje X = categorias o tiempo. Eje Y = valores. Incluye unidades si es relevante (USD, unidades, %)." },
        { term: "Legend", def: "Solo necesaria si hay mas de una serie de datos. Si solo hay una serie, la leyenda es redundante — eliminala para un look mas limpio." },
        { term: "Data Labels", def: "Los valores numericos sobre cada barra o punto. Utiles cuando el numero exacto importa, pero pueden saturar si hay muchos datos. Usarlos con criterio." },
        { term: "Gridlines", def: "Las lineas de fondo que ayudan a estimar valores. Las horizontales suelen ser utiles, las verticales rara vez lo son. Quitarlas da un look mas limpio." },
      ]},
      { type: "text", value: "Para agregar o quitar elementos: clic en el Chart > boton '+' (Chart Elements) que aparece a la derecha. Desde ahi activas/desactivas cada elemento con un checkbox." },
    ]
  },
  {
    title: "Diseno profesional",
    content: [
      { type: "text", value: "Un Chart profesional se ve limpio, comunica una idea clara, y no necesita explicacion. Estos principios te llevan ahi." },
      { type: "key_points", items: [
        { title: "Sin efectos 3D", text: "Nunca. Los efectos 3D distorsionan la lectura de valores y hacen que el grafico se vea amateur. Siempre usa graficos planos (2D)." },
        { title: "Chart Styles", text: "Chart Design > Chart Styles ofrece estilos predefinidos. Elige uno limpio y despues personaliza. Es mas rapido que disenar desde cero." },
        { title: "Colores consistentes", text: "Usa una paleta limitada. Si tu reporte tiene 3 graficos, los colores deben ser consistentes entre todos. No uses un color diferente en cada grafico sin razon." },
        { title: "Fondo limpio", text: "El area del Chart debe tener fondo blanco o transparente. Nunca fondos con patron o colores fuertes que compitan con los datos." },
        { title: "El test de 5 segundos", text: "Si alguien no puede entender tu grafico en 5 segundos, probablemente tiene demasiada informacion, el tipo es incorrecto, o falta un titulo claro." },
      ]},
    ]
  },
  {
    title: "Mover y reutilizar Charts",
    content: [
      { type: "text", value: "Los Charts de Excel son objetos que puedes mover, redimensionar y reutilizar fuera de Excel." },
      { type: "definition_list", items: [
        { term: "Mover dentro de la hoja", def: "Arrastra el Chart a la posicion deseada. Mantiene el vinculo con los datos." },
        { term: "Move Chart (mover a otra hoja)", def: "Clic derecho en el Chart > Move Chart. Puedes moverlo a una hoja nueva dedicada (Chart Sheet) o a otra hoja existente." },
        { term: "Redimensionar", def: "Arrastra las esquinas o bordes del Chart. Usa Alt mientras arrastras para alinear con los bordes de las celdas." },
        { term: "Copiar a PowerPoint o Word", def: "Ctrl+C en el Chart y Ctrl+V en PowerPoint/Word. El grafico se pega con vinculo a los datos de Excel. Si actualizas los datos, el grafico en PowerPoint se puede actualizar tambien." },
      ]},
    ]
  },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>NIVEL 1 — BASICO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 7 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Charts simples</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Crea graficos claros y profesionales que comuniquen la informacion correcta al publico correcto.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas crear Charts claros y profesionales eligiendo el tipo correcto, configurando los elementos necesarios, y aplicando un diseno limpio.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((section, si) => {
          const isOpen = openSection === si;
          return (
            <div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}`, transition: "all 0.2s" }}>
              <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600], transition: "all 0.2s" }}>{si + 1}</div>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{section.title}</span>
                <span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span>
              </div>
              {isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{section.content.map((block, bi) => renderBlock(block, bi))}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este modulo</div>
        {["Column para comparar, Line para tendencias, Pie para proporciones (max 5-6 categorias).", "Incluye encabezados en la seleccion. Excel los usa como etiquetas automaticamente.", "Alt+F1 crea un Chart instantaneo. F11 lo crea en una hoja nueva dedicada.", "Titulo descriptivo siempre. Sin efectos 3D nunca. Colores consistentes.", "Si no se entiende en 5 segundos, tiene demasiada informacion o es el tipo incorrecto."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Sort and Filter</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente nivel: Nivel 2 — Intermedio</span>
      </div>
    </div>
  );
}
