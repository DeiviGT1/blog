import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const CATEGORIES = [
  { title: "Interfaz y navegacion", terms: [
    { term: "Ribbon", def: "La barra de herramientas principal organizada en tabs (Home, Insert, Data, Formulas, etc.). Reemplazo los menus clasicos desde Excel 2007." },
    { term: "Formula Bar", def: "Barra encima de la hoja que muestra el contenido real de la celda activa. Muestra la formula mientras la celda muestra el resultado." },
    { term: "Name Box", def: "Cuadro a la izquierda de la Formula Bar. Muestra la direccion de la celda activa. Tambien se usa para crear Named Ranges rapidamente." },
    { term: "Status Bar", def: "Barra inferior de Excel. Muestra automaticamente SUM, AVERAGE y COUNT de la seleccion actual sin formulas." },
    { term: "Quick Access Toolbar (QAT)", def: "Barra de accesos rapidos personalizable arriba del Ribbon. Agrega los comandos que mas usas para acceso de un clic." },
    { term: "Sheet Tab", def: "Las pestanas en la parte inferior que representan cada hoja del Workbook. Clic derecho para renombrar, mover o eliminar." },
    { term: "Fill Handle", def: "El cuadrado pequeno en la esquina inferior derecha de la celda seleccionada. Arrastrar copia formulas o genera secuencias." },
    { term: "Freeze Panes", def: "Congela filas o columnas para que permanezcan visibles al hacer scroll. View > Freeze Panes." },
  ]},
  { title: "Datos y estructura", terms: [
    { term: "Workbook", def: "El archivo completo de Excel (.xlsx). Contiene una o mas Worksheets." },
    { term: "Worksheet (Sheet)", def: "Una hoja individual dentro del Workbook. Compuesta por celdas organizadas en filas y columnas." },
    { term: "Cell", def: "La interseccion de una fila y una columna. Se identifica por su direccion: A1, B5, Z100." },
    { term: "Range", def: "Un grupo de celdas contiguas. Se expresa como A1:D10 (desde A1 hasta D10)." },
    { term: "Table", def: "Estructura de datos formal creada con Ctrl+T. Tiene encabezados, filtros automaticos, y crece automaticamente al agregar filas." },
    { term: "Named Range", def: "Un nombre asignado a un rango de celdas. Hace las formulas mas legibles: =SUM(Sales) en vez de =SUM(D2:D5000)." },
    { term: "Data Model", def: "Un motor interno de Excel que permite relacionar multiples tablas sin formulas de busqueda. Base de Power Pivot." },
    { term: "Array", def: "Un conjunto de valores organizados en filas y/o columnas. Las Dynamic Arrays de Excel 365 derraman resultados automaticamente." },
  ]},
  { title: "Formulas y funciones", terms: [
    { term: "Formula", def: "Cualquier expresion que empieza con =. Puede ser simple (=A1+B1) o compleja (=SUMIFS(...)). Excel la evalua y muestra el resultado." },
    { term: "Function", def: "Operacion predefinida con nombre y sintaxis: =SUM(), =VLOOKUP(), =IF(). Todas las funciones son formulas, pero no todas las formulas usan funciones." },
    { term: "Argument", def: "Los valores que recibe una funcion dentro de los parentesis. En =SUM(A1:A10), el rango A1:A10 es el argumento." },
    { term: "Cell Reference", def: "La direccion de una celda usada en una formula. Relative (A1), Absolute ($A$1), o Mixed (A$1, $A1)." },
    { term: "Relative Reference", def: "Referencia que se ajusta al copiar una formula. Si copias =A1 una fila abajo, se convierte en =A2." },
    { term: "Absolute Reference", def: "Referencia fija ($A$1) que no se mueve al copiar. Se activa/cicla con F4." },
    { term: "Dynamic Array", def: "Formula que devuelve multiples valores que se derraman a celdas adyacentes automaticamente. FILTER, SORT, UNIQUE, SEQUENCE. Solo Excel 365." },
    { term: "Spill Range", def: "El area de celdas que ocupa el resultado de un Dynamic Array. Se referencia con el operador #: A1# abarca todo el resultado derramado." },
    { term: "Volatile Function", def: "Funcion que se recalcula cada vez que Excel recalcula (TODAY, NOW, RAND, OFFSET, INDIRECT). Muchas pueden hacer el archivo lento." },
  ]},
  { title: "Analisis de datos", terms: [
    { term: "PivotTable", def: "Herramienta que resume y agrupa datos arrastrando campos a 4 zonas: Rows, Columns, Values, Filters. Sin escribir formulas." },
    { term: "PivotChart", def: "Grafico vinculado a una PivotTable. Se actualiza automaticamente cuando la tabla cambia o se filtran datos." },
    { term: "Slicer", def: "Panel de botones visuales que filtra PivotTables. Un Slicer puede controlar multiples PivotTables via Report Connections." },
    { term: "Timeline", def: "Control visual para filtrar por fechas en PivotTables. Barra deslizante por anos, trimestres, meses o dias." },
    { term: "Calculated Field", def: "Campo personalizado dentro de una PivotTable que calcula valores a partir de otros campos existentes." },
    { term: "Conditional Formatting", def: "Formato que se aplica automaticamente cuando una celda cumple una condicion. Highlight Rules, Data Bars, Color Scales, Icon Sets." },
    { term: "Data Validation", def: "Reglas que controlan que se puede ingresar en una celda. Drop-down Lists, restricciones numericas, mensajes de error." },
    { term: "Sparkline", def: "Mini grafico dentro de una celda que muestra la tendencia de un rango. Tipos: Line, Column, Win/Loss." },
  ]},
  { title: "Power Tools", terms: [
    { term: "Power Query", def: "Herramienta ETL (Extract, Transform, Load) integrada en Excel. Importa datos de multiples fuentes, los transforma con pasos grabados, y los carga." },
    { term: "Power Pivot", def: "Motor analitico que permite crear modelos de datos con Relationships entre tablas y medidas DAX. Maneja millones de filas." },
    { term: "DAX", def: "Data Analysis Expressions. Lenguaje de formulas para Power Pivot. Funciones clave: SUM, CALCULATE, SUMX, RELATED, ALL." },
    { term: "M Language", def: "Lenguaje de Power Query para transformaciones avanzadas. Se edita en el Advanced Editor de Power Query." },
    { term: "Measure", def: "Calculo DAX dinamico que se evalua segun el contexto de filtro de la PivotTable. Para metricas de reporte." },
    { term: "Relationship", def: "Conexion entre dos tablas por un campo comun en el Data Model. Permite usar campos de ambas tablas en una PivotTable." },
    { term: "ETL", def: "Extract, Transform, Load. El proceso de sacar datos de una fuente, limpiarlos/transformarlos, y cargarlos al destino. Power Query hace ETL." },
  ]},
  { title: "Automatizacion", terms: [
    { term: "Macro", def: "Secuencia de acciones grabadas que Excel repite automaticamente. Se almacenan como codigo VBA." },
    { term: "VBA", def: "Visual Basic for Applications. Lenguaje de programacion integrado en Excel para automatizacion avanzada." },
    { term: "Module", def: "Contenedor de codigo VBA dentro del VBA Editor. Donde viven las Subs y Functions ejecutables." },
    { term: "Sub (Subroutine)", def: "Bloque de codigo VBA ejecutable. Sub NombreMacro() ... End Sub." },
  ]},
  { title: "Colaboracion y archivos", terms: [
    { term: ".xlsx", def: "Formato estandar de Excel sin macros. El mas comun y el que deberias usar por defecto." },
    { term: ".xlsm", def: "Formato de Excel con macros habilitadas. Necesario si el archivo contiene codigo VBA." },
    { term: ".xltx", def: "Plantilla de Excel. Al abrir crea una copia nueva sin modificar el original." },
    { term: ".csv", def: "Comma Separated Values. Formato de texto plano para datos tabulares. Sin formato, sin formulas, sin multiples hojas." },
    { term: "Co-authoring", def: "Edicion simultanea por multiples usuarios. Requiere OneDrive o SharePoint y formato .xlsx." },
    { term: "Version History", def: "Historial de versiones automatico cuando el archivo esta en OneDrive/SharePoint. Permite restaurar versiones anteriores." },
  ]},
];

export default function Module() {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    terms: cat.terms.filter(t =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.def.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.terms.length > 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Glosario de Excel</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>Todos los terminos que necesitas conocer, organizados por categoria.</p>
        <input
          type="text"
          placeholder="Buscar termino..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border-tertiary)", fontSize: 14, fontFamily: "inherit", outline: "none" }}
        />
      </div>
      {filtered.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: V[600], letterSpacing: "0.06em", padding: "8px 0", borderBottom: `1px solid ${V[100]}`, marginBottom: 8, textTransform: "uppercase" }}>{cat.title}</div>
          {cat.terms.map((t, ti) => (
            <div key={ti} style={{ padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: V[800] }}>{t.term}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 8 }}> — {t.def}</span>
            </div>
          ))}
        </div>
      ))}
      {filtered.length === 0 && <p style={{ textAlign: "center", color: "#999", padding: 40 }}>No se encontraron terminos para "{search}"</p>}
    </div>
  );
}
