import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "IF — la funcion condicional fundamental",
    content: [
      { type: "text", value: "IF evalua una condicion y devuelve un valor si es verdadera y otro si es falsa. Es la forma de hacer que Excel tome decisiones. Sintaxis: =IF(logical_test, value_if_true, value_if_false)." },
      { type: "definition_list", items: [
        { term: "Ejemplo basico", def: "=IF(B2>=70, \"Aprobado\", \"Reprobado\"). Si B2 es mayor o igual a 70, muestra Aprobado. Si no, muestra Reprobado." },
        { term: "Con numeros", def: "=IF(B2>1000, B2*0.1, 0). Si la venta supera 1000, calcula 10% de comision. Si no, devuelve 0." },
        { term: "Con celdas vacias", def: "=IF(A2=\"\", \"Sin datos\", A2). Si la celda esta vacia, muestra un mensaje. Si no, muestra el valor." },
        { term: "Los 3 argumentos", def: "Siempre tiene 3 partes: la pregunta (condicion), que hacer si SI, que hacer si NO. Si omites el tercero, Excel devuelve FALSE cuando la condicion no se cumple." },
      ]},
    ]
  },
  {
    title: "IF anidados",
    content: [
      { type: "text", value: "Puedes poner un IF dentro de otro para evaluar multiples condiciones en cascada. Funciona pero se vuelve dificil de leer rapidamente." },
      { type: "key_points", items: [
        { title: "Ejemplo", text: "=IF(B2>=90, \"Excelente\", IF(B2>=70, \"Aprobado\", IF(B2>=50, \"Regular\", \"Reprobado\"))). Evalua de mayor a menor: primero 90, luego 70, luego 50, y si nada se cumple devuelve Reprobado." },
        { title: "Limite practico", text: "Mas de 3 niveles de anidamiento se vuelve muy dificil de leer y mantener. Si necesitas mas condiciones, usa IFS." },
        { title: "Orden importa", text: "Evalua siempre de la condicion mas restrictiva a la menos restrictiva. Si pones >=50 antes que >=90, la primera condicion captura todo y nunca llegas a la segunda." },
      ]},
    ]
  },
  {
    title: "IFS — multiples condiciones sin anidar",
    content: [
      { type: "text", value: "IFS es la version moderna (Excel 365) que elimina la necesidad de anidar. Evalua condiciones en orden y devuelve el valor de la primera que sea verdadera." },
      { type: "definition_list", items: [
        { term: "Sintaxis", def: "=IFS(condition1, value1, condition2, value2, ..., TRUE, default_value). Los pares condicion-valor se evaluan en orden." },
        { term: "Ejemplo", def: "=IFS(B2>=90, \"Excelente\", B2>=70, \"Aprobado\", B2>=50, \"Regular\", TRUE, \"Reprobado\"). Mas legible que IF anidados." },
        { term: "El truco de TRUE al final", def: "TRUE como ultima condicion siempre se cumple, funcionando como el 'else' o valor por defecto. Sin el, si ninguna condicion se cumple, IFS devuelve #N/A." },
        { term: "Excel 2019 y 365", def: "IFS esta disponible en Excel 2019 y Excel 365. No existe en versiones anteriores. Si necesitas compatibilidad con Excel 2016 o antes, usa IF anidados." },
      ]},
    ]
  },
  {
    title: "AND, OR, NOT — operadores logicos",
    content: [
      { type: "text", value: "Estos operadores se usan dentro de IF para crear condiciones compuestas: multiples criterios que deben cumplirse juntos o donde basta que uno se cumpla." },
      { type: "definition_list", items: [
        { term: "AND(condition1, condition2, ...)", def: "Devuelve TRUE solo si TODAS las condiciones son verdaderas. =IF(AND(B2>=70, C2=\"Pagado\"), \"Aprobado\", \"Pendiente\") requiere que el puntaje sea >=70 Y que el estatus sea Pagado." },
        { term: "OR(condition1, condition2, ...)", def: "Devuelve TRUE si AL MENOS UNA condicion es verdadera. =IF(OR(A2=\"Urgente\", B2>10000), \"Prioridad\", \"Normal\") marca como prioridad si es urgente O si el monto supera 10000." },
        { term: "NOT(condition)", def: "Invierte el resultado: TRUE se convierte en FALSE y viceversa. =IF(NOT(A2=\"Cancelado\"), \"Activo\", \"Inactivo\") marca como activo todo lo que NO sea cancelado." },
      ]},
      { type: "text", value: "Se pueden combinar: =IF(AND(B2>=70, OR(C2=\"A\", C2=\"B\")), \"Aprobado\", \"Revisar\") requiere puntaje >=70 Y que la categoria sea A o B." },
    ]
  },
  {
    title: "Buenas practicas",
    content: [
      { type: "key_points", items: [
        { title: "Piensa antes de escribir", text: "Nombra tu condicion mentalmente: 'si la venta es mayor a 1000 y el cliente es premium, entonces...'. Si no puedes explicarlo en una frase, la formula es demasiado compleja." },
        { title: "Columnas auxiliares", text: "Si tu IF tiene mas de 3 niveles de anidamiento, es mejor dividirlo en columnas auxiliares. Una columna que evalua la primera condicion, otra la segunda, y un IF final que combina los resultados." },
        { title: "Legibilidad sobre compacidad", text: "Una formula que cualquiera pueda leer y entender siempre es mejor que una formula compacta que solo tu entiendes (y que en 3 meses ni tu recordaras)." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 2 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Funciones condicionales</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Haz que Excel tome decisiones logicas dentro de una formula: IF, IFS, AND, OR, NOT.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas usar IF, IFS, AND, OR y NOT para que Excel tome decisiones automaticas basadas en condiciones logicas.</p>
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
        {["IF tiene 3 argumentos: condicion, valor si verdadero, valor si falso. Siempre los 3.", "IFS elimina la necesidad de anidar. Usa TRUE al final como valor por defecto.", "AND requiere que TODAS las condiciones se cumplan. OR requiere al menos una.", "Evalua condiciones de la mas restrictiva a la menos restrictiva.", "Si tu IF tiene mas de 3 niveles, usa columnas auxiliares o IFS para mantener legibilidad."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Absolute and Mixed References</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: SUMIF, SUMIFS, COUNTIF, COUNTIFS</span>
      </div>
    </div>
  );
}
