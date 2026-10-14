import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Que es Conditional Formatting",
    content: [
      { type: "text", value: "Formato que se aplica automaticamente cuando se cumple una condicion. La celda se formatea sola dependiendo de su valor. Esto permite que una tabla de 500 filas 'hable' sin que tengas que revisar fila por fila." },
      { type: "text", value: "Se accede desde Home > Conditional Formatting. Todas las reglas se aplican sobre el rango que tengas seleccionado al momento de crear la regla." },
    ]
  },
  {
    title: "Highlight Cell Rules",
    content: [
      { type: "text", value: "Las reglas mas directas e intuitivas. Resaltan celdas individuales que cumplen una condicion especifica." },
      { type: "definition_list", items: [
        { term: "Greater Than / Less Than", def: "Resalta celdas con valores mayores o menores que un umbral. Ejemplo: resaltar en rojo todas las ventas menores a $1,000." },
        { term: "Between", def: "Resalta celdas con valores dentro de un rango. Ejemplo: resaltar en amarillo montos entre $1,000 y $5,000." },
        { term: "Equal To", def: "Resalta celdas con un valor exacto. Ejemplo: resaltar en verde todas las celdas que digan 'Completado'." },
        { term: "Text That Contains", def: "Resalta celdas que contengan un texto especifico. Ejemplo: resaltar todas las celdas que contengan 'Urgente'." },
        { term: "Duplicate Values", def: "Resalta valores que aparecen mas de una vez en el rango. Muy util para detectar duplicados en listas de IDs, emails o codigos." },
      ]},
    ]
  },
  {
    title: "Top/Bottom Rules",
    content: [
      { type: "text", value: "Resaltan los valores mas altos, mas bajos o que estan por encima/debajo del promedio. Excel los identifica automaticamente sin que tengas que ordenar nada." },
      { type: "definition_list", items: [
        { term: "Top 10 Items", def: "Resalta los 10 valores mas altos (puedes cambiar el numero). Ejemplo: los 5 mejores vendedores." },
        { term: "Top 10%", def: "Resalta el 10% superior de los valores. Util para identificar el segmento top de rendimiento." },
        { term: "Bottom 10 Items", def: "Resalta los valores mas bajos. Ejemplo: los productos con menos ventas." },
        { term: "Above Average", def: "Resalta todos los valores por encima del promedio del rango." },
        { term: "Below Average", def: "Resalta todos los valores por debajo del promedio. Util para identificar bajo rendimiento." },
      ]},
    ]
  },
  {
    title: "Data Bars",
    content: [
      { type: "text", value: "Barras horizontales dentro de cada celda que representan visualmente la magnitud del valor. Es como un mini grafico dentro de la celda." },
      { type: "key_points", items: [
        { title: "Como funcionan", text: "La celda con el valor mas alto tiene la barra mas larga. Las demas se escalan proporcionalmente. Puedes elegir barras solidas o con gradiente, y personalizar el color." },
        { title: "Cuando usarlas", text: "Ideales para comparar rapidamente valores en una columna sin necesidad de un Chart. Ventas por vendedor, puntajes, tiempos de respuesta — cualquier columna numerica." },
        { title: "Configuracion", text: "Home > Conditional Formatting > Data Bars. Elige entre gradiente y solido. Para personalizar: More Rules permite ajustar valores minimo y maximo, y colores." },
      ]},
    ]
  },
  {
    title: "Color Scales",
    content: [
      { type: "text", value: "Degradados de color que van de un extremo al otro. Cada celda recibe un color segun su posicion relativa entre el valor minimo y maximo del rango." },
      { type: "key_points", items: [
        { title: "Escalas de 2 colores", text: "De rojo a verde, de blanco a azul, etc. El valor mas bajo tiene un color, el mas alto otro, y los intermedios tienen mezclas proporcionales." },
        { title: "Escalas de 3 colores", text: "Rojo-amarillo-verde es la mas comun. Rojo para bajo, amarillo para medio, verde para alto. Util para mapas de calor." },
        { title: "Cuando usarlas", text: "Matrices de datos donde quieres ver patrones a simple vista: rendimiento mensual por vendedor, puntajes por departamento, temperaturas por hora. El ojo humano detecta los patrones de color instantaneamente." },
      ]},
    ]
  },
  {
    title: "Gestionar reglas",
    content: [
      { type: "text", value: "Cuando tienes varias reglas sobre el mismo rango, el orden y la gestion importan." },
      { type: "definition_list", items: [
        { term: "Manage Rules", def: "Home > Conditional Formatting > Manage Rules. Muestra todas las reglas activas con su rango, condicion y formato. Desde aqui puedes editar, eliminar y reordenar." },
        { term: "Orden de prioridad", def: "Las reglas se evaluan de arriba a abajo. Si varias se cumplen, todas aplican su formato (se acumulan). La regla mas arriba tiene prioridad si hay conflictos en el mismo atributo. Puedes arrastrar para reordenar." },
        { term: "Stop If True", def: "Si marcas esta opcion en una regla, las reglas siguientes no se evaluan si esta se cumple. Util cuando tienes reglas que podrian entrar en conflicto." },
        { term: "Clear Rules", def: "Home > Conditional Formatting > Clear Rules. Puedes limpiar reglas de la seleccion actual o de toda la hoja. No afecta el formato manual, solo el condicional." },
      ]},
      { type: "text", value: "Nota: en este nivel usamos las reglas predefinidas del menu. Las reglas con formulas personalizadas (que permiten condiciones mucho mas complejas) se ven en niveles posteriores." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 5 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Conditional Formatting basico</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Haz que los datos se destaquen visualmente de forma automatica segun reglas que tu defines.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas aplicar formato condicional con las reglas predefinidas de Excel: Highlight Rules, Top/Bottom, Data Bars y Color Scales.</p>
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
        {["Highlight Cell Rules para resaltar por condiciones: mayor que, menor que, contiene texto, duplicados.", "Top/Bottom Rules para los mejores, peores, o por encima/debajo del promedio.", "Data Bars para mini graficos dentro de las celdas. Comparacion visual instantanea.", "Color Scales para mapas de calor. El ojo detecta patrones de color al instante.", "Manage Rules para editar, eliminar y priorizar reglas cuando tienes varias en el mismo rango."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Funciones esenciales</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Sort and Filter</span>
      </div>
    </div>
  );
}
