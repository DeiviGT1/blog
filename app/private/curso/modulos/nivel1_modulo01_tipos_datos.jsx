import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Los 5 tipos de datos fundamentales",
    content: [
      { type: "text", value: "Todo lo que escribes en una celda, Excel lo clasifica internamente en uno de estos tipos. Entender esto evita el 80% de los errores que frustran a los principiantes." },
      { type: "definition_list", items: [
        { term: "Text", def: "Cualquier dato que Excel no puede interpretar como numero o fecha. Se alinea a la izquierda por defecto. Ejemplo: nombres, direcciones, codigos alfanumericos." },
        { term: "Numbers", def: "Valores numericos con los que Excel puede operar. Se alinean a la derecha por defecto. Incluye enteros, decimales, negativos." },
        { term: "Dates", def: "Internamente son numeros (1 de enero de 1900 = 1). Excel los muestra como fechas pero puedes sumar, restar y operar con ellos como numeros." },
        { term: "Booleans", def: "TRUE o FALSE. Los devuelven funciones logicas como IF o comparaciones como =A1>100. Son la base de toda logica condicional." },
        { term: "Errors", def: "Cuando algo falla en una formula: #DIV/0! (division por cero), #VALUE! (tipo incorrecto), #REF! (referencia rota), #N/A (no encontrado), #NAME? (funcion mal escrita)." },
      ]},
    ]
  },
  {
    title: "Como Excel decide el tipo de dato",
    content: [
      { type: "text", value: "Cuando escribes algo en una celda, Excel intenta interpretarlo automaticamente. Esto funciona bien la mayoria de las veces, pero genera problemas cuando la interpretacion no es la que esperas." },
      { type: "definition_list", items: [
        { term: "Escribes 123", def: "Excel lo interpreta como numero. Se alinea a la derecha." },
        { term: "Escribes 12/03/2025", def: "Excel lo interpreta como fecha. Internamente almacena un numero, muestra una fecha." },
        { term: "Escribes ABC", def: "Excel lo interpreta como texto. Se alinea a la izquierda." },
        { term: "Escribes 001234", def: "Excel elimina los ceros iniciales y lo convierte en 1234. Para mantener los ceros, formatea como Text antes de escribir o usa apostrofo: '001234." },
        { term: "Escribes 3/4", def: "Excel puede interpretarlo como fecha en vez de fraccion (la fecha depende de tu configuracion regional: 4 de marzo en formato MM/DD, o 3 de abril en DD/MM). Escribe 0 3/4 para fraccion o usa formato Text." },
        { term: "Un numero con espacio", def: "Si hay un espacio invisible antes o despues del numero, Excel lo trata como texto. Se alinea a la izquierda y las formulas no lo reconocen como numero." },
      ]},
    ]
  },
  {
    title: "Como forzar el tipo de dato",
    content: [
      { type: "text", value: "Cuando la interpretacion automatica de Excel no es la que necesitas, tienes herramientas para tomar el control." },
      { type: "key_points", items: [
        { title: "Apostrofo (') antes del valor", text: "Fuerza el contenido como texto. Ejemplo: '001234 mantiene los ceros. '12/03 queda como texto en vez de fecha. El apostrofo no se ve en la celda, solo en la Formula Bar." },
        { title: "Number Format antes de escribir", text: "Si formateas la celda como Text antes de escribir, todo lo que ingreses se mantiene como texto. Util para columnas de codigos, IDs o telefonos." },
        { title: "Format Cells (Ctrl+1)", text: "Cambia como se muestra un valor sin cambiar el valor real. Un numero puede mostrarse como Currency, Percentage, Date, o Custom Format segun lo que necesites." },
      ]},
    ]
  },
  {
    title: "Number Format: lo que ves vs. lo que hay",
    content: [
      { type: "text", value: "Este concepto es fundamental: una celda tiene un valor real (lo que Excel almacena) y una apariencia (lo que tu ves). El Number Format controla la apariencia sin modificar el valor." },
      { type: "definition_list", items: [
        { term: "General", def: "Sin formato especifico. Excel muestra el valor tal cual lo almacena." },
        { term: "Number", def: "Controla decimales y separador de miles. Ejemplo: 1234.5 se muestra como 1,234.50 con formato #,##0.00." },
        { term: "Currency", def: "Agrega simbolo de moneda. $1,234.50. Util para reportes financieros." },
        { term: "Percentage", def: "Multiplica por 100 y agrega %. El valor 0.15 se muestra como 15%. Cuidado: si escribes 15 y aplicas Percentage, muestra 1500%." },
        { term: "Date", def: "Muestra un numero como fecha. Multiples formatos: DD/MM/YYYY, MM-DD-YY, MMM-YYYY, etc." },
        { term: "Text", def: "Todo se trata como texto. Util para codigos con ceros iniciales o IDs alfanumericos." },
        { term: "Custom", def: "Formatos personalizados. Ejemplo: #,##0 (miles sin decimales), 0.0% (porcentaje con 1 decimal), dd-mmm-yyyy (fecha como 15-Mar-2025)." },
      ]},
    ]
  },
  {
    title: "Entrada de datos eficiente",
    content: [
      { type: "text", value: "Como ingresas datos importa tanto como que datos ingresas. Estos patrones te hacen mas rapido y reducen errores." },
      { type: "key_points", items: [
        { title: "Enter confirma y baja, Tab confirma y va a la derecha", text: "Para llenar una tabla por filas: Tab, Tab, Tab... y al final Enter. Excel vuelve a la primera columna de la siguiente fila automaticamente. Asi llenas tablas sin tocar el mouse." },
        { title: "Seleccionar rango primero", text: "Selecciona el rango donde vas a escribir datos. Tab se mueve dentro de la seleccion. Cuando llegas al final de una fila, salta a la primera celda de la siguiente. Asi no te sales del rango por accidente." },
        { title: "AutoFill con Fill Handle", text: "El cuadrado en la esquina inferior derecha de la celda seleccionada. Arrastralo para crear secuencias: 1,2,3... o Ene,Feb,Mar... o Lunes,Martes... Excel detecta el patron y lo continua." },
        { title: "Double-clic en Fill Handle", text: "Si la columna adyacente tiene datos, double-clic en el Fill Handle rellena automaticamente hasta donde haya datos al lado. La forma mas rapida de aplicar una formula a cientos de filas." },
        { title: "Flash Fill (Ctrl+E)", text: "Excel 365 detecta patrones de transformacion. Si en A1 tienes 'Juan Perez' y en B1 escribes 'Juan', al presionar Ctrl+E en B2 Excel completa los nombres automaticamente para todo el rango." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 1 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Tipos de datos y entrada</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Entiende como Excel interpreta lo que escribes y por que a veces se comporta de forma inesperada.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que entiendas como Excel clasifica datos, como controlar el tipo de dato, y como ingresar informacion de forma eficiente.</p>
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
        {["Excel clasifica todo en Text, Numbers, Dates, Booleans o Errors. La alineacion te dice el tipo: izquierda = texto, derecha = numero.", "El Number Format cambia como se ve un valor, no el valor real. 0.15 puede mostrarse como 15% o $0.15.", "Cuidado con los ceros iniciales (001234) y las fracciones (3/4) — Excel puede interpretarlos mal.", "Tab para llenar por filas, Enter para bajar. Selecciona el rango primero para no salirte.", "Flash Fill (Ctrl+E) detecta patrones y completa datos automaticamente. Es magia."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Nivel 1 — Basico</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Formulas aritmeticas</span>
      </div>
    </div>
  );
}
