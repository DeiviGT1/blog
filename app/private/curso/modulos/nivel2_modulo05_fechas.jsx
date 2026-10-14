import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Como Excel almacena las fechas", content: [
    { type: "text", value: "Internamente, cada fecha es un numero. El 1 de enero de 1900 es el numero 1. Hoy es un numero de cinco digitos. Esto significa que puedes sumar, restar y operar con fechas como numeros. Si restas dos fechas, obtienes la diferencia en dias." },
  ]},
  { title: "Funciones de extraccion: TODAY, NOW, YEAR, MONTH, DAY", content: [
    { type: "definition_list", items: [
      { term: "TODAY()", def: "Devuelve la fecha actual. Se actualiza cada vez que se recalcula la hoja. No necesita argumentos." },
      { term: "NOW()", def: "Devuelve fecha y hora actual. Util para timestamps." },
      { term: "YEAR(date)", def: "Extrae el ano. =YEAR(\"15/03/2025\") devuelve 2025." },
      { term: "MONTH(date)", def: "Extrae el mes como numero. =MONTH(\"15/03/2025\") devuelve 3." },
      { term: "DAY(date)", def: "Extrae el dia. =DAY(\"15/03/2025\") devuelve 15." },
    ]},
  ]},
  { title: "Calculos con fechas", content: [
    { type: "definition_list", items: [
      { term: "Diferencia en dias", def: "=TODAY()-A1 da cuantos dias han pasado desde la fecha en A1. =A2-A1 da los dias entre dos fechas." },
      { term: "Sumar dias", def: "=A1+30 suma 30 dias a una fecha." },
      { term: "EDATE(start_date, months)", def: "Suma o resta meses exactos. =EDATE(A1, 3) suma 3 meses. =EDATE(A1, -1) resta 1 mes." },
      { term: "EOMONTH(start_date, months)", def: "Devuelve el ultimo dia del mes resultante. =EOMONTH(TODAY(), 0) = ultimo dia del mes actual. =EOMONTH(TODAY(), 1) = ultimo dia del proximo mes." },
    ]},
  ]},
  { title: "DATEDIF — la funcion oculta", content: [
    { type: "text", value: "DATEDIF calcula la diferencia entre dos fechas en anos, meses o dias. No aparece en el autocompletado de Excel pero funciona perfectamente." },
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=DATEDIF(start_date, end_date, unit). Units: \"Y\" (anos), \"M\" (meses), \"D\" (dias)." },
      { term: "Edad", def: "=DATEDIF(A1, TODAY(), \"Y\") calcula la edad en anos si A1 es la fecha de nacimiento." },
      { term: "Antiguedad", def: "=DATEDIF(A1, TODAY(), \"M\") calcula meses de antiguedad laboral." },
    ]},
  ]},
  { title: "NETWORKDAYS — dias laborables", content: [
    { type: "definition_list", items: [
      { term: "Sintaxis", def: "=NETWORKDAYS(start_date, end_date, [holidays]). Cuenta dias habiles excluyendo sabados, domingos y feriados opcionales." },
      { term: "Ejemplo", def: "=NETWORKDAYS(A1, B1) cuenta los dias laborables entre dos fechas. Si tienes una lista de feriados en E1:E10, usa =NETWORKDAYS(A1, B1, E1:E10)." },
      { term: "Uso tipico", def: "Calcular plazos de entrega, tiempos de respuesta SLA, duracion real de proyectos." },
    ]},
  ]},
  { title: "Errores comunes con fechas", content: [
    { type: "definition_list", items: [
      { term: "Fecha como texto", def: "Si una fecha se alinea a la izquierda, Excel la trata como texto. No se puede operar con ella. Solucion: DATEVALUE(text) la convierte a fecha real." },
      { term: "Formato DD/MM vs MM/DD", def: "Al importar datos, 03/04/2025 puede ser 3 de abril o 4 de marzo segun la configuracion regional. Siempre verifica." },
      { term: "Operar con texto que parece fecha", def: "Si =A1-B1 da #VALUE!, alguna de las celdas contiene texto en vez de fecha. Revisa la alineacion." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 5 de 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Funciones de fecha</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Trabaja con fechas de forma fluida: TODAY, DATEDIF, EDATE, EOMONTH, NETWORKDAYS y mas.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas calcular diferencias de fechas, plazos, antiguedades y dias laborables con las funciones de fecha de Excel.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este modulo</div>
        {["Las fechas son numeros internamente. Restar dos fechas da la diferencia en dias.", "TODAY() para fecha actual, NOW() para fecha y hora. YEAR/MONTH/DAY para extraer partes.", "DATEDIF no aparece en autocompletado pero calcula diferencias en anos, meses o dias.", "NETWORKDAYS cuenta dias laborables excluyendo fines de semana y feriados.", "Si una fecha se alinea a la izquierda, es texto. Usa DATEVALUE() para convertirla."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Funciones de texto</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Data Validation</span>
      </div>
    </div>
  );
}
