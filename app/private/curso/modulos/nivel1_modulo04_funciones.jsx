import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Formula vs. funcion",
    content: [
      { type: "text", value: "Una formula es cualquier expresion que empieza con = (ejemplo: =A1+B1). Una funcion es una operacion predefinida con nombre y sintaxis (ejemplo: =SUM(A1:B1)). Todas las funciones son formulas, pero no todas las formulas usan funciones." },
      { type: "key_points", items: [
        { title: "Anatomia de una funcion", text: "Nombre + parentesis de apertura + argumentos separados por comas + parentesis de cierre. Ejemplo: =SUM(A1:A10). El tooltip que aparece al escribir te guia con los argumentos." },
        { title: "Rangos con dos puntos", text: "A1:A10 significa 'desde A1 hasta A10, incluyendo todas las celdas entre medio'. Es la forma de indicar un rango continuo. Se usa en la mayoria de funciones." },
      ]},
    ]
  },
  {
    title: "SUM — sumar un rango",
    content: [
      { type: "text", value: "La funcion mas usada de Excel. =SUM(A1:A100) suma todos los valores del rango. Es mejor que =A1+A2+A3+... porque es mas limpia, se adapta si insertas filas, y es mas facil de mantener." },
      { type: "definition_list", items: [
        { term: "Sintaxis", def: "=SUM(number1, [number2], ...). Acepta rangos, celdas individuales, y numeros directos." },
        { term: "Rango continuo", def: "=SUM(A1:A100) suma todo desde A1 hasta A100." },
        { term: "Rangos no contiguos", def: "=SUM(A1:A10, C1:C10, E5) suma tres rangos separados en una sola formula." },
        { term: "Atajo", def: "Alt+= inserta AutoSum automaticamente detectando el rango mas probable." },
      ]},
    ]
  },
  {
    title: "AVERAGE — promedio aritmetico",
    content: [
      { type: "text", value: "=AVERAGE(A1:A100) calcula el promedio (suma dividida entre la cantidad de valores). Pero tiene un comportamiento que debes conocer." },
      { type: "key_points", items: [
        { title: "Ignora celdas vacias", text: "Si tienes 10 celdas y 3 estan vacias, AVERAGE calcula el promedio de las 7 que tienen valor. Las vacias no cuentan como cero." },
        { title: "Cuenta los ceros", text: "Una celda con valor 0 SI se cuenta. Esto puede cambiar significativamente tu promedio. Si tienes 100, 200, 0, el promedio es 100, no 150." },
        { title: "Ignora texto", text: "Si una celda en el rango tiene texto, AVERAGE la ignora sin dar error." },
      ]},
    ]
  },
  {
    title: "COUNT y COUNTA — contar celdas",
    content: [
      { type: "text", value: "Dos funciones que parecen iguales pero hacen cosas muy diferentes. La distincion es clave." },
      { type: "definition_list", items: [
        { term: "COUNT", def: "=COUNT(A1:A100). Cuenta cuantas celdas contienen numeros. No cuenta texto, no cuenta vacias, no cuenta errores. Solo numeros." },
        { term: "COUNTA", def: "=COUNTA(A1:A100). Cuenta cuantas celdas NO estan vacias. Incluye numeros, texto, errores, booleanos — todo excepto celdas completamente vacias." },
        { term: "Cuando usar cada una", def: "COUNT para saber cuantos valores numericos tienes (cuantas ventas, cuantas transacciones). COUNTA para saber cuantos registros hay en total, incluyendo los que tienen texto." },
        { term: "Ejemplo practico", def: "Una columna con 100 filas: 80 tienen numeros, 10 tienen texto ('N/A'), 10 estan vacias. COUNT devuelve 80. COUNTA devuelve 90." },
      ]},
    ]
  },
  {
    title: "MAX y MIN — valores extremos",
    content: [
      { type: "text", value: "Las funciones mas simples pero muy utiles para analisis rapido." },
      { type: "definition_list", items: [
        { term: "MAX", def: "=MAX(A1:A100). Devuelve el valor mas alto del rango. Ignora texto y celdas vacias." },
        { term: "MIN", def: "=MIN(A1:A100). Devuelve el valor mas bajo del rango. Ignora texto y celdas vacias." },
        { term: "Uso tipico", def: "Venta mas alta del mes: =MAX(Sales). Temperatura minima: =MIN(Temps). Precio mas bajo: =MIN(Prices)." },
      ]},
    ]
  },
  {
    title: "Combinandolas en un caso real",
    content: [
      { type: "text", value: "Con solo estas 6 funciones puedes construir un resumen completo de cualquier tabla de datos. Imagina una tabla de ventas con una columna Sales:" },
      { type: "definition_list", items: [
        { term: "Total de ventas", def: "=SUM(Sales) — cuanto se vendio en total." },
        { term: "Venta promedio", def: "=AVERAGE(Sales) — ticket promedio por transaccion." },
        { term: "Numero de transacciones", def: "=COUNT(Sales) — cuantas ventas se registraron." },
        { term: "Registros totales", def: "=COUNTA(Sales) — cuantas filas tienen algun dato (incluyendo errores o texto)." },
        { term: "Venta mas alta", def: "=MAX(Sales) — la transaccion mas grande." },
        { term: "Venta mas baja", def: "=MIN(Sales) — la transaccion mas pequena." },
      ]},
      { type: "text", value: "Estas 6 lineas dan un panorama completo de los datos. Y recuerda: la Status Bar en la parte inferior de Excel muestra SUM, AVERAGE y COUNT automaticamente al seleccionar un rango, sin necesidad de escribir formulas." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 4 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Funciones esenciales</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Las 6 funciones que usaras el 80% del tiempo: SUM, AVERAGE, COUNT, COUNTA, MAX, MIN.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que domines las 6 funciones que cubren el 80% de los calculos que haras en Excel: SUM, AVERAGE, COUNT, COUNTA, MAX y MIN.</p>
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
        {["SUM para sumar rangos. Alt+= la inserta automaticamente.", "AVERAGE ignora vacias pero cuenta los ceros. Ojo con la diferencia.", "COUNT cuenta solo numeros. COUNTA cuenta todo lo que no esta vacio.", "MAX y MIN dan los extremos. Ignoran texto y vacias.", "Con estas 6 funciones puedes hacer un resumen completo de cualquier tabla de datos."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Cell References</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Conditional Formatting basico</span>
      </div>
    </div>
  );
}
