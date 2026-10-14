import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "La regla fundamental: todo empieza con =",
    content: [
      { type: "text", value: "Toda formula en Excel empieza con el signo =. Sin el, Excel trata lo que escribes como texto. Ejemplo: 5+3 es texto que se muestra tal cual. =5+3 es una formula que devuelve 8." },
      { type: "text", value: "Este signo = es lo que le dice a Excel: 'lo que viene a continuacion es una instruccion que debes calcular, no un valor que debes almacenar'." },
    ]
  },
  {
    title: "Operadores aritmeticos",
    content: [
      { type: "text", value: "Excel usa los mismos operadores que las matematicas, con pequenas variaciones en la notacion." },
      { type: "definition_list", items: [
        { term: "+ (suma)", def: "=5+3 devuelve 8. =A1+B1 suma los valores de ambas celdas." },
        { term: "- (resta)", def: "=10-4 devuelve 6. =A1-B1 resta B1 de A1." },
        { term: "* (multiplicacion)", def: "=6*7 devuelve 42. =A1*B1 multiplica ambos valores. Nota: se usa asterisco, no la letra x." },
        { term: "/ (division)", def: "=20/4 devuelve 5. =A1/B1 divide A1 entre B1. Si B1 es 0, devuelve #DIV/0!" },
        { term: "^ (potencia)", def: "=2^3 devuelve 8 (2 elevado a la 3). =A1^2 eleva A1 al cuadrado." },
        { term: "% (porcentaje)", def: "=15% equivale a 0.15. =A1*15% calcula el 15% del valor en A1." },
      ]},
    ]
  },
  {
    title: "Orden de operaciones",
    content: [
      { type: "text", value: "Excel sigue el mismo orden que las matematicas. Si no lo controlas, tus formulas pueden dar resultados incorrectos sin error visible." },
      { type: "key_points", items: [
        { title: "Parentesis primero", text: "Todo lo que esta entre parentesis se calcula antes que el resto. =2*(3+4) devuelve 14, no 10." },
        { title: "Potencias segundo", text: "=2+3^2 devuelve 11 (primero 3^2=9, luego 2+9=11)." },
        { title: "Multiplicacion y division tercero", text: "=2+3*4 devuelve 14 (primero 3*4=12, luego 2+12=14). Si quieres que sume primero: =(2+3)*4 devuelve 20." },
        { title: "Suma y resta al final", text: "Son las ultimas en ejecutarse si no hay parentesis que cambien el orden." },
        { title: "La regla de oro", text: "Cuando tengas duda sobre el orden, usa parentesis. Nunca esta de mas y hace la formula mas legible." },
      ]},
    ]
  },
  {
    title: "Formulas con referencias de celda",
    content: [
      { type: "text", value: "La potencia real de Excel no esta en =5+3 sino en =A1+B1. Cuando usas referencias, el resultado se actualiza automaticamente si los valores originales cambian. Esta es la base de todo lo que viene despues." },
      { type: "key_points", items: [
        { title: "Referencias en vez de valores fijos", text: "Si tu jefe te dice que el impuesto cambio de 15% a 16%, con valores fijos tendrias que cambiar cada formula. Con referencias, cambias una celda y todas las formulas se actualizan solas." },
        { title: "Clic para referenciar", text: "No necesitas escribir A1 manualmente. Escribe = y luego haz clic en la celda que quieres referenciar. Excel inserta la referencia automaticamente. Esto es mas rapido y reduce errores de tipeo." },
        { title: "Color coding en Formula Bar", text: "Cuando editas una formula (F2), Excel resalta con colores las celdas que referencia. Azul, verde, morado — cada referencia tiene su color. Esto te permite verificar visualmente que tu formula apunta donde debe." },
      ]},
    ]
  },
  {
    title: "La Formula Bar como herramienta",
    content: [
      { type: "text", value: "La Formula Bar es tu ventana a lo que realmente hay dentro de cada celda. Aprender a usarla bien es fundamental." },
      { type: "definition_list", items: [
        { term: "Ver vs. editar", def: "Haz clic en una celda: la Formula Bar muestra la formula completa mientras la celda muestra el resultado. Asi puedes ver ambas cosas." },
        { term: "F2 para editar", def: "Entra en modo edicion y muestra las referencias con colores directamente en la hoja. Puedes arrastrar esos recuadros de color para cambiar las referencias visualmente." },
        { term: "Escape para cancelar", def: "Si estas editando y algo sale mal, Escape restaura el valor anterior sin guardar cambios." },
        { term: "Ctrl+Z despues de Enter", def: "Si ya confirmaste una formula incorrecta con Enter, Ctrl+Z la deshace inmediatamente." },
      ]},
    ]
  },
  {
    title: "Errores comunes en esta etapa",
    content: [
      { type: "text", value: "Estos son los errores que mas se repiten cuando alguien empieza con formulas. Reconocerlos te ahorra tiempo." },
      { type: "definition_list", items: [
        { term: "#DIV/0!", def: "Division por cero. Aparece cuando el denominador de una division es 0 o una celda vacia. Solucion: verificar que el divisor no sea cero antes de dividir." },
        { term: "Formula tratada como texto", def: "Olvidaste el signo = al inicio. La celda muestra 'A1+B1' como texto en vez de calcular. Solucion: agregar = al inicio." },
        { term: "Referencia a celda vacia", def: "Si A1 esta vacia y escribes =A1+B1, Excel trata A1 como 0. No da error pero el resultado puede ser incorrecto si esperabas un valor ahi." },
        { term: "Referencia circular", def: "Cuando una formula se referencia a si misma directa o indirectamente. Ejemplo: en A1 escribes =A1+1. Excel muestra advertencia. Solucion: corregir la referencia para que no apunte a su propia celda." },
        { term: "Parentesis desbalanceados", def: "Mas parentesis de apertura que de cierre o viceversa. Excel te avisa y a veces intenta corregir automaticamente, pero no siempre acierta. Cuenta tus parentesis." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 2 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Formulas aritmeticas</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Toda formula empieza con =. Domina los operadores basicos y las referencias de celda.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que domines los operadores aritmeticos, entiendas el orden de operaciones, y uses referencias de celda en vez de valores fijos.</p>
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
        {["Sin = al inicio, Excel trata la formula como texto.", "Usa parentesis siempre que tengas duda sobre el orden de operaciones.", "Usa referencias (=A1+B1) en vez de valores fijos (=5+3). Asi todo se actualiza automaticamente.", "F2 muestra con colores las celdas que referencia una formula. Usalo para verificar.", "#DIV/0! significa division por cero. Referencia circular significa que la formula se apunta a si misma."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Tipos de datos y entrada</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Cell References</span>
      </div>
    </div>
  );
}
