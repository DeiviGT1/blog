import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  { title: "Power Query vs. Power Pivot", content: [
    { type: "text", value: "Esta es la confusion mas comun. Son herramientas complementarias, no competidoras. Resuelven problemas diferentes." },
    { type: "definition_list", items: [
      { term: "Power Query", def: "Importa y transforma datos. Es tu herramienta de limpieza: quita columnas, filtra filas, cambia tipos, combina tablas. El resultado es una tabla limpia lista para analizar. Piensa en Power Query como el cocinero que prepara los ingredientes." },
      { term: "Power Pivot", def: "Modela y analiza datos. Crea relaciones entre tablas, define medidas DAX para calculos complejos, y maneja millones de filas. Piensa en Power Pivot como el chef que combina los ingredientes en el plato final." },
      { term: "El flujo completo", def: "Power Query importa y limpia los datos > Power Pivot los relaciona y modela > PivotTables los presentan. Este es el flujo profesional de analisis en Excel." },
    ]},
  ]},
  { title: "Data Model vs. tablas de Power Query", content: [
    { type: "text", value: "Otra fuente de confusion frecuente. Las queries de Power Query y las tablas del Data Model son cosas distintas." },
    { type: "definition_list", items: [
      { term: "Query de Power Query", def: "Un conjunto de pasos de transformacion. El resultado se carga como tabla en una hoja de Excel. Vive en la hoja, ocupa celdas visibles, y tiene limite de ~1 millon de filas." },
      { term: "Tabla en el Data Model", def: "Vive dentro del motor in-memory de Power Pivot. No ocupa celdas en ninguna hoja. Puede manejar millones de filas. Se accede solo via PivotTables o medidas DAX." },
      { term: "Conexion entre ambos", def: "Una query de Power Query puede cargarse al Data Model en vez de a una hoja: Close and Load > Only Create Connection + Add to Data Model. Asi Power Query limpia y Power Pivot modela." },
    ]},
  ]},
  { title: "VLOOKUP vs. XLOOKUP vs. INDEX+MATCH", content: [
    { type: "definition_list", items: [
      { term: "VLOOKUP", def: "La mas simple y antigua. Solo busca en la primera columna del rango, usa un numero fijo de columna, y no puede buscar hacia la izquierda. Funciona en cualquier version de Excel." },
      { term: "XLOOKUP", def: "La evolucion moderna (solo Excel 365). Busca en cualquier direccion, no usa numero de columna, y tiene valor por defecto nativo sin IFERROR. Mas legible y segura." },
      { term: "INDEX+MATCH", def: "La combinacion mas flexible. Funciona en cualquier version, permite busquedas bidireccionales (fila + columna con doble MATCH), y no se rompe si insertas columnas." },
      { term: "Cuando usar cual", def: "En Excel 365 para trabajo nuevo: XLOOKUP. Para compatibilidad con versiones antiguas: INDEX+MATCH. VLOOKUP solo para archivos heredados o personas que ya la dominan." },
    ]},
  ]},
  { title: "Table vs. rango normal", content: [
    { type: "definition_list", items: [
      { term: "Rango normal", def: "Celdas sin estructura formal. Las formulas se rompen si insertas filas. Los filtros no se activan automaticamente. Los graficos no se ajustan a datos nuevos." },
      { term: "Table (Ctrl+T)", def: "Estructura formal: crece automaticamente al agregar filas, las formulas se copian solas, los filtros estan siempre activos, y las PivotTables se actualizan sin cambiar rangos." },
      { term: "Regla", def: "Si tus datos tienen encabezados y filas de registros, SIEMPRE usa Table. No hay razon para no hacerlo." },
    ]},
  ]},
  { title: "SUM vs. SUBTOTAL vs. AGGREGATE", content: [
    { type: "definition_list", items: [
      { term: "SUM", def: "Suma todo el rango, incluyendo filas ocultas por filtros. Si filtras una tabla, SUM sigue sumando todo." },
      { term: "SUBTOTAL", def: "Suma solo las celdas visibles. =SUBTOTAL(9, A1:A100) ignora filas ocultas por filtros. Usa 109 en vez de 9 para tambien ignorar filas ocultas manualmente (clic derecho > Hide)." },
      { term: "AGGREGATE", def: "Version mas avanzada de SUBTOTAL. =AGGREGATE(9, 7, A1:A100) suma ignorando errores y filas ocultas. El 9 indica SUM, el 7 indica ignorar filas ocultas y errores." },
    ]},
  ]},
  { title: "Analisis financiero en Excel", content: [
    { type: "text", value: "Excel es la herramienta dominante en finanzas. Estos son los conceptos y funciones financieras mas usados." },
    { type: "definition_list", items: [
      { term: "NPV (Net Present Value)", def: "=NPV(rate, values). Calcula el valor presente neto de flujos de caja futuros descontados a una tasa. Si NPV > 0, el proyecto genera valor." },
      { term: "IRR (Internal Rate of Return)", def: "=IRR(values). La tasa de retorno que hace NPV = 0. Compara con el costo de capital para evaluar si un proyecto es viable." },
      { term: "PMT (Payment)", def: "=PMT(rate, nper, pv). Calcula el pago periodico de un prestamo. rate = tasa por periodo, nper = numero de pagos, pv = monto del prestamo." },
      { term: "FV (Future Value)", def: "=FV(rate, nper, pmt, pv). Cuanto valdra una inversion en el futuro dados pagos periodicos y tasa de interes." },
      { term: "Sensitivity Analysis", def: "Tablas de datos (Data > What-If Analysis > Data Table) que muestran como cambia un resultado al variar uno o dos inputs. Base de los modelos financieros." },
      { term: "Scenario Manager", def: "Data > What-If Analysis > Scenario Manager. Define escenarios (optimista, pesimista, base) con diferentes valores para inputs clave." },
    ]},
  ]},
  { title: "OLAP Cubes y conexiones avanzadas", content: [
    { type: "definition_list", items: [
      { term: "Que es un OLAP Cube", def: "Un modelo de datos multidimensional almacenado en un servidor (SQL Server Analysis Services, por ejemplo). Permite analizar grandes volumenes de datos organizados por dimensiones (tiempo, region, producto)." },
      { term: "Excel como cliente OLAP", def: "Excel puede conectarse a OLAP Cubes via Data > Get Data > From Database > From Analysis Services. Creas PivotTables que consultan el cube directamente sin traer datos a Excel." },
      { term: "Diferencia con Power Pivot", def: "Power Pivot crea un modelo de datos local dentro del archivo Excel. Un OLAP Cube vive en un servidor compartido. Power Pivot es ideal para analisis personal o de equipo. OLAP es para analisis empresarial con datos centralizados." },
      { term: "MDX vs DAX", def: "MDX es el lenguaje de consulta de OLAP Cubes. DAX es el lenguaje de Power Pivot. Ambos analizan datos multidimensionales pero con sintaxis diferentes." },
    ]},
  ]},
  { title: "Formulas vs. Power Query para transformar", content: [
    { type: "definition_list", items: [
      { term: "Con formulas", def: "Usas TRIM, LEFT, RIGHT, IF en columnas auxiliares. Funciona pero es manual: si cambian los datos, tienes que ajustar rangos, copiar formulas, verificar." },
      { term: "Con Power Query", def: "Los pasos quedan grabados. Si cambian los datos, solo haces Refresh y todo se reprocesa automaticamente. Mas confiable, mas rapido, mas profesional." },
      { term: "Cuando usar formulas", def: "Transformaciones simples y puntuales. Un TRIM aqui, un LEFT alla." },
      { term: "Cuando usar Power Query", def: "Cualquier proceso que se repite: datos que recibes semanal/mensualmente, limpieza de archivos importados, consolidacion de multiples fuentes." },
    ]},
  ]},
  { title: "Relative vs. Absolute en la practica", content: [
    { type: "text", value: "La confusion clasica del principiante. La clave es hacerse dos preguntas antes de copiar:" },
    { type: "definition_list", items: [
      { term: "Si copio hacia abajo, esta referencia deberia bajar?", def: "SI = Relative (A1). NO = fija la fila con $ (A$1 o $A$1)." },
      { term: "Si copio a la derecha, esta referencia deberia moverse?", def: "SI = Relative (A1). NO = fija la columna con $ ($A1 o $A$1)." },
      { term: "Caso tipico", def: "Una tabla de precios x descuentos: =$B5*(1-C$1). $B fija la columna del precio, $1 fija la fila del descuento. La formula funciona copiada en cualquier direccion." },
    ]},
  ]},
  { title: "COUNT vs. COUNTA vs. COUNTIF vs. COUNTBLANK", content: [
    { type: "definition_list", items: [
      { term: "COUNT", def: "Cuenta celdas con numeros. Ignora texto, vacias, errores." },
      { term: "COUNTA", def: "Cuenta celdas no vacias. Incluye numeros, texto, errores, booleanos." },
      { term: "COUNTBLANK", def: "Cuenta celdas vacias. Lo opuesto de COUNTA." },
      { term: "COUNTIF", def: "Cuenta celdas que cumplen un criterio. =COUNTIF(A:A, \">100\")." },
      { term: "COUNTIFS", def: "Cuenta celdas que cumplen multiples criterios. =COUNTIFS(A:A, \"Norte\", B:B, \">100\")." },
    ]},
  ]},
];

export default function Module() {
  const [openSection, setOpenSection] = useState(0);
  const renderBlock = (block, bi) => {
    if (block.type === "text") return <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>{block.value}</p>;
    if (block.type === "definition_list") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((item, di) => (<div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}><div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{item.term}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.def}</div></div>))}</div>);
    return null;
  };
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Conceptos que confunden</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Las diferencias y comparaciones que la gente siempre pregunta, explicadas de forma clara.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"\u25BE"}</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
    </div>
  );
}
