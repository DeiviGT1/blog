import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "El problema que resuelven",
    content: [
      { type: "text", value: "En el Nivel 1 aprendimos que al copiar una formula, las referencias se ajustan automaticamente (Relative References). Eso es perfecto la mayoria del tiempo. Pero hay situaciones donde necesitas que una referencia NO se mueva." },
      { type: "text", value: "Ejemplo clasico: varias filas necesitan multiplicar por un mismo valor fijo como un tipo de cambio, un porcentaje de impuesto, o un precio base. Si copias =A2*B1 hacia abajo, B1 se convierte en B2, B3, B4... y tu valor fijo se pierde." },
    ]
  },
  {
    title: "Los 4 tipos de referencia",
    content: [
      { type: "definition_list", items: [
        { term: "A1 (Relative)", def: "Se mueve en ambas direcciones al copiar. Es el comportamiento por defecto. Al copiar hacia abajo, la fila sube. Al copiar a la derecha, la columna avanza." },
        { term: "$A$1 (Absolute)", def: "No se mueve nunca. Ni la columna ni la fila cambian al copiar en ninguna direccion. Usala cuando necesitas que una referencia apunte siempre a la misma celda." },
        { term: "A$1 (Mixed — fila fija)", def: "La columna se mueve pero la fila queda fija. Util cuando copias horizontalmente y quieres que la fila no cambie." },
        { term: "$A1 (Mixed — columna fija)", def: "La fila se mueve pero la columna queda fija. Util cuando copias verticalmente y quieres que la columna no cambie." },
      ]},
      { type: "key_points", items: [
        { title: "El atajo F4", text: "Dentro de la Formula Bar, coloca el cursor en una referencia y presiona F4. Cada vez que lo presionas cicla entre los 4 tipos: A1 > $A$1 > A$1 > $A1 > A1. Es la forma mas rapida de agregar o quitar el $." },
      ]},
    ]
  },
  {
    title: "Como pensar en ellas",
    content: [
      { type: "text", value: "No memorices cuando usar cada tipo. En vez de eso, hazte estas dos preguntas antes de copiar una formula:" },
      { type: "key_points", items: [
        { title: "Pregunta 1: Si copio hacia abajo, esta referencia deberia bajar conmigo?", text: "Si la respuesta es NO (porque siempre debe apuntar a la misma fila), pon $ antes del numero de fila: A$1." },
        { title: "Pregunta 2: Si copio hacia la derecha, esta referencia deberia moverse a la derecha?", text: "Si la respuesta es NO (porque siempre debe apuntar a la misma columna), pon $ antes de la letra de columna: $A1." },
        { title: "Si ambas respuestas son NO", text: "Usa Absolute: $A$1. La referencia no se mueve en ninguna direccion." },
        { title: "Si ambas respuestas son SI", text: "Usa Relative: A1. Es el default y no necesitas hacer nada." },
      ]},
    ]
  },
  {
    title: "Caso practico: tabla de precios con descuento",
    content: [
      { type: "text", value: "Imagina una tabla donde la columna A tiene productos con sus precios, y la fila 1 tiene diferentes porcentajes de descuento (10%, 15%, 20%). Necesitas calcular el precio con descuento para cada combinacion." },
      { type: "key_points", items: [
        { title: "La formula en B2", text: "=$A2*(1-B$1). Analicemos: $A2 fija la columna A (el precio siempre esta en columna A) pero deja que la fila se mueva (cada producto tiene su fila). B$1 deja que la columna se mueva (cada porcentaje esta en una columna diferente) pero fija la fila 1 (los porcentajes siempre estan en fila 1)." },
        { title: "Al copiar a la derecha (a C2)", text: "Se convierte en =$A2*(1-C$1). $A2 no se movio (columna fija). B$1 se convirtio en C$1 (columna se movio al siguiente porcentaje). Correcto." },
        { title: "Al copiar hacia abajo (a B3)", text: "Se convierte en =$A3*(1-B$1). $A2 se convirtio en $A3 (fila se movio al siguiente producto). B$1 no se movio (fila fija). Correcto." },
        { title: "Una sola formula para toda la tabla", text: "Escribes la formula una vez en B2 y la copias a todo el rango. Cada celda calcula correctamente porque las referencias mixtas se ajustan exactamente como deben." },
      ]},
    ]
  },
  {
    title: "Errores comunes",
    content: [
      { type: "definition_list", items: [
        { term: "Poner $ donde no se necesita", def: "La formula funciona en la celda original pero no es flexible. Si reorganizas la hoja, las referencias absolutas innecesarias pueden apuntar a celdas incorrectas." },
        { term: "Olvidar el $ donde si se necesita", def: "El error mas peligroso: genera resultados incorrectos sin ningun mensaje de error. Excel calcula felizmente un numero equivocado." },
        { term: "No verificar despues de copiar", def: "Siempre usa F2 en la primera y la ultima celda despues de copiar. Verifica que las referencias apunten donde deben. Este habito te ahorra horas de depuracion." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>NIVEL 2 — INTERMEDIO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 1 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Absolute and Mixed References</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Domina el signo $ para controlar que se mueve y que se queda fijo al copiar formulas.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que domines los 4 tipos de referencia ($A$1, A$1, $A1, A1) y sepas elegir el correcto para cada situacion.</p>
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
        {["F4 cicla entre los 4 tipos de referencia. Es el atajo mas importante de este modulo.", "$ antes de la letra fija la columna. $ antes del numero fija la fila. $ en ambos fija todo.", "No memorices: preguntate 'deberia moverse si copio?' Si no, pon $.", "El caso clasico de Mixed References es una tabla de doble entrada (productos x descuentos).", "Siempre verifica con F2 despues de copiar. Errores en referencias dan resultados incorrectos sin aviso."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Nivel 2 — Intermedio</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Funciones condicionales</span>
      </div>
    </div>
  );
}
