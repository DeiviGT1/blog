import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "SUMIF — sumar con un criterio", content: [
    { type: "text", value: "SUMIF suma los valores de un rango solo donde se cumple una condicion. Es la funcion de analisis mas usada despues de SUM. Sintaxis: =SUMIF(range, criteria, sum_range)." },
    { type: "definition_list", items: [
      { term: "Ejemplo", def: "=SUMIF(A2:A100, \"Norte\", C2:C100). Suma los valores de columna C solo donde columna A dice 'Norte'. Primer argumento: donde buscar. Segundo: que buscar. Tercero: que sumar." },
      { term: "Con operadores", def: "=SUMIF(B2:B100, \">1000\", C2:C100). Suma columna C donde columna B es mayor a 1000. Los operadores van entre comillas." },
      { term: "Con referencia a celda", def: "=SUMIF(A2:A100, E1, C2:C100). Usa el valor de E1 como criterio. Asi puedes cambiar el criterio sin editar la formula." },
    ]},
  ]},
  { title: "SUMIFS — sumar con multiples criterios", content: [
    { type: "text", value: "SUMIFS extiende SUMIF a multiples condiciones simultaneas. Nota importante: en SUMIFS el rango de suma va PRIMERO (al reves que SUMIF)." },
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...). Suma donde TODAS las condiciones se cumplen." },
      { term: "Ejemplo", def: "=SUMIFS(D2:D100, A2:A100, \"Norte\", B2:B100, \"Electronics\"). Suma ventas donde la region es Norte Y la categoria es Electronics." },
      { term: "Con fechas", def: "=SUMIFS(D2:D100, E2:E100, \">=\"&DATE(2025,1,1), E2:E100, \"<\"&DATE(2025,4,1)). Suma ventas del primer trimestre 2025." },
    ]},
  ]},
  { title: "COUNTIF y COUNTIFS — contar con criterios", content: [
    { type: "text", value: "La misma logica de SUMIF/SUMIFS pero para contar en vez de sumar. Cuantas filas cumplen la condicion?" },
    { type: "definition_list", items: [
      { term: "COUNTIF", def: "=COUNTIF(A2:A100, \"Norte\"). Cuenta cuantas celdas en el rango dicen 'Norte'. =COUNTIF(B2:B100, \">1000\"). Cuenta cuantas celdas superan 1000." },
      { term: "COUNTIFS", def: "=COUNTIFS(A2:A100, \"Norte\", B2:B100, \">1000\"). Cuenta cuantas filas son de Norte Y tienen valor mayor a 1000." },
      { term: "Contar duplicados", def: "=COUNTIF(A2:A100, A2). Si devuelve >1, el valor de A2 aparece mas de una vez. Util para detectar duplicados." },
    ]},
  ]},
  { title: "AVERAGEIF y AVERAGEIFS", content: [
    { type: "text", value: "El mismo patron pero para promedios. La sintaxis es identica a SUMIF/SUMIFS." },
    { type: "definition_list", items: [
      { term: "AVERAGEIF", def: "=AVERAGEIF(A2:A100, \"Norte\", C2:C100). Promedio de ventas solo para la region Norte." },
      { term: "AVERAGEIFS", def: "=AVERAGEIFS(D2:D100, A2:A100, \"Norte\", B2:B100, \"Electronics\"). Promedio de ventas para Norte + Electronics." },
    ]},
  ]},
  { title: "Operadores y wildcards en criterios", content: [
    { type: "text", value: "Los criterios no se limitan a texto exacto. Puedes usar operadores de comparacion y wildcards para condiciones mas flexibles." },
    { type: "definition_list", items: [
      { term: "\">\"&valor", def: "Mayor que. Ejemplo: \">1000\" o \">\"&E1 para usar una referencia." },
      { term: "\"<=\"&valor", def: "Menor o igual que. Ejemplo: \"<=\"&E1." },
      { term: "\"<>\"&valor", def: "Distinto de. Ejemplo: \"<>Norte\" cuenta todo excepto Norte." },
      { term: "* (asterisco)", def: "Wildcard: cualquier cantidad de caracteres. \"Mar*\" encuentra Marzo, Marketing, Maria." },
      { term: "? (signo de interrogacion)", def: "Wildcard: exactamente un caracter. \"A?\" encuentra AB, AC, A1 pero no ABC." },
    ]},
  ]},
  { title: "El patron mental", content: [
    { type: "text", value: "Todas estas funciones siguen la misma logica: 'calcula algo, pero solo donde se cumpla esta condicion'. Una vez que entiendes el patron, cualquier variante se aprende en minutos." },
    { type: "key_points", items: [
      { title: "SUMIF/SUMIFS", text: "Cuanto suman los valores que cumplen la condicion?" },
      { title: "COUNTIF/COUNTIFS", text: "Cuantas filas cumplen la condicion?" },
      { title: "AVERAGEIF/AVERAGEIFS", text: "Cual es el promedio de los valores que cumplen la condicion?" },
      { title: "El patron", text: "Todas usan: rango donde buscar + que buscar + (opcionalmente) rango donde calcular. La version con S al final acepta multiples criterios." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 3 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>SUMIF, SUMIFS, COUNTIF, COUNTIFS</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Suma y cuenta datos aplicando criterios. La base del analisis de datos real en Excel.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas sumar, contar y promediar datos aplicando uno o multiples criterios con las funciones condicionales de Excel.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => {
          const isOpen = openSection === si;
          return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}>
            <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span>
            </div>
            {isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}
          </div>);
        })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este modulo</div>
        {["SUMIF: donde buscar + que buscar + que sumar. SUMIFS: que sumar va PRIMERO.", "COUNTIF/COUNTIFS siguen el mismo patron pero cuentan en vez de sumar.", "Operadores en criterios van entre comillas: \">1000\", \"<>Norte\".", "Wildcards: * para cualquier texto, ? para un caracter.", "El patron es siempre el mismo: calcula algo, pero solo donde se cumpla la condicion."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Funciones condicionales</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Funciones de texto</span>
      </div>
    </div>
  );
}
