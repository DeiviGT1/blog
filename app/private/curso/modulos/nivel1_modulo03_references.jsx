import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Que es una Cell Reference",
    content: [
      { type: "text", value: "Cuando escribes =A1 en otra celda, no estas copiando el valor de A1 — estas creando un enlace vivo. Si A1 cambia, tu formula se actualiza automaticamente. Las referencias son la razon por la que Excel es poderoso: construyes una logica una vez y se mantiene actualizada siempre." },
      { type: "text", value: "Una referencia es simplemente la direccion de una celda: la letra de la columna y el numero de la fila. A1, B5, Z100 son referencias. Cuando las usas en formulas, Excel va a esa celda, toma su valor, y lo usa en el calculo." },
    ]
  },
  {
    title: "Relative References: el comportamiento por defecto",
    content: [
      { type: "text", value: "Cuando copias una formula de una celda a otra, las referencias se ajustan automaticamente. Esto se llama Relative Reference y es el comportamiento por defecto de Excel." },
      { type: "key_points", items: [
        { title: "Como funciona", text: "Si escribes =A1+B1 en C1 y copias esa formula a C2, se convierte automaticamente en =A2+B2. Excel no copia 'A1+B1' literalmente — copia la instruccion 'la celda 2 columnas a mi izquierda + la celda 1 columna a mi izquierda'. Como C2 esta una fila debajo de C1, las referencias bajan una fila." },
        { title: "Por que es util", text: "Esto significa que puedes escribir una formula una vez y copiarla a cientos de filas, y cada fila calcula con sus propios datos. No necesitas escribir una formula diferente para cada fila." },
        { title: "Ejemplo practico", text: "Una tabla con columna A = Precio, columna B = Cantidad, columna C = Total. En C2 escribes =A2*B2. Copias C2 hacia abajo hasta C100. Cada fila calcula su propio total porque las referencias se ajustan automaticamente." },
      ]},
    ]
  },
  {
    title: "El Fill Handle",
    content: [
      { type: "text", value: "El Fill Handle es el cuadrado pequeno en la esquina inferior derecha de una celda seleccionada. Es la herramienta principal para copiar formulas aprovechando las Relative References." },
      { type: "definition_list", items: [
        { term: "Arrastrar hacia abajo", def: "Copia la formula a las filas inferiores, ajustando las referencias de fila. Cada fila calcula con sus propios datos." },
        { term: "Arrastrar hacia la derecha", def: "Copia la formula a las columnas siguientes, ajustando las referencias de columna." },
        { term: "Double-clic en Fill Handle", def: "La forma mas rapida: si la columna adyacente tiene datos, el double-clic rellena automaticamente hasta donde haya datos al lado. Funciona para cientos o miles de filas en un instante." },
        { term: "Ctrl+D como alternativa", def: "Selecciona el rango desde la celda con la formula hasta donde quieres rellenar, y presiona Ctrl+D. Rellena hacia abajo sin necesidad de arrastrar." },
      ]},
    ]
  },
  {
    title: "Como verificar tus referencias",
    content: [
      { type: "text", value: "Despues de copiar una formula, siempre verifica que las referencias apunten donde deben. Un error en las referencias puede producir resultados incorrectos sin ningun mensaje de error — que es peor que un error visible." },
      { type: "key_points", items: [
        { title: "F2 para ver referencias con colores", text: "Haz clic en la celda de destino y presiona F2. Excel resalta cada referencia con un color diferente y muestra un recuadro en la celda referenciada. Verificas visualmente que los recuadros esten sobre las celdas correctas." },
        { title: "Formula Bar", text: "Haz clic en la celda y mira la Formula Bar. Verifica que la formula muestre las referencias que esperas. Si copiaste de C2 a C10, la formula en C10 deberia referenciar fila 10, no fila 2." },
        { title: "Verificar primera y ultima", text: "Un habito profesional: despues de copiar una formula a un rango largo, verifica al menos la primera celda, la ultima, y una del medio. Si esas 3 estan bien, el resto probablemente tambien." },
      ]},
    ]
  },
  {
    title: "Lo que viene despues: Absolute y Mixed References",
    content: [
      { type: "text", value: "Hay situaciones donde no quieres que una referencia se ajuste al copiar. Por ejemplo, cuando varias filas necesitan multiplicar por un mismo valor fijo como un tipo de cambio o un porcentaje de impuesto." },
      { type: "text", value: "Para eso existe el signo $, que 'bloquea' una referencia. $A$1 nunca se mueve, A$1 bloquea solo la fila, $A1 bloquea solo la columna. Esto se profundiza en el Nivel 2 cuando ya domines las referencias relativas. Por ahora, lo importante es que sepas que existe y que se activa con F4 dentro de la Formula Bar." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 3 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Cell References</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>El concepto mas importante de Excel: como las referencias se ajustan al copiar formulas y por que eso lo cambia todo.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que entiendas como funcionan las Relative References al copiar formulas, porque es el concepto que mas impacto tiene en todo tu uso de Excel.</p>
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
        {["Las referencias son enlaces vivos: si la celda original cambia, la formula se actualiza.", "Relative References se ajustan al copiar. =A1+B1 copiada una fila abajo se convierte en =A2+B2.", "Double-clic en Fill Handle rellena hasta donde haya datos adyacentes. La forma mas rapida.", "Siempre verifica con F2 que las referencias apunten donde deben despues de copiar.", "El signo $ bloquea referencias (Absolute/Mixed). Se profundiza en Nivel 2."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Formulas aritmeticas</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Funciones esenciales</span>
      </div>
    </div>
  );
}
