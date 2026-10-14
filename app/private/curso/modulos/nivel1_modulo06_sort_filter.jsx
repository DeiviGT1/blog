import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Sort: ordenar datos",
    content: [
      { type: "text", value: "Ordenar es una de las operaciones mas basicas y mas utiles. Pero tiene una trampa peligrosa que debes conocer antes de usarla." },
      { type: "key_points", items: [
        { title: "La regla critica", text: "Siempre ubicarte dentro de la tabla (o seleccionar toda la tabla) antes de ordenar. Si seleccionas solo una columna y ordenas, esa columna se reordena pero las demas NO — desalineando todos los datos. Este es uno de los errores mas destructivos en Excel." },
        { title: "Sort A to Z / Z to A", text: "Ordena la columna activa en orden ascendente o descendente. Si estas dentro de una Table, Excel automaticamente ordena toda la tabla. Si estas en un rango suelto, Excel te pregunta si quieres expandir la seleccion — siempre di que si." },
        { title: "Atajos en Quick Access Toolbar", text: "Si agregaste Sort Ascending y Sort Descending a tu Quick Access Toolbar (como recomendamos), ordenar es un solo clic." },
      ]},
    ]
  },
  {
    title: "Sort by Multiple Levels",
    content: [
      { type: "text", value: "Cuando necesitas ordenar por mas de un criterio, usas Custom Sort." },
      { type: "key_points", items: [
        { title: "Como acceder", text: "Home > Sort and Filter > Custom Sort, o Data > Sort. Abre una ventana donde defines los niveles de ordenamiento." },
        { title: "Como funciona", text: "El primer nivel es el criterio principal. El segundo nivel ordena dentro de los grupos del primero. Ejemplo: primero por Region (A-Z), y dentro de cada region por Sales (mayor a menor). Asi ves las regiones en orden alfabetico y dentro de cada region las ventas ordenadas." },
        { title: "Agregar niveles", text: "Clic en Add Level para agregar mas criterios. Puedes tener tantos niveles como necesites. El orden de los niveles importa: el primero tiene prioridad." },
      ]},
    ]
  },
  {
    title: "Filter: AutoFilter",
    content: [
      { type: "text", value: "El Filter permite mostrar solo las filas que cumplen ciertos criterios, ocultando temporalmente el resto. Los datos no se eliminan, solo se ocultan." },
      { type: "definition_list", items: [
        { term: "Activar Filter", def: "Ctrl+Shift+L o Data > Filter. Aparecen menus desplegables en cada encabezado de columna. Si tus datos estan en una Table (Ctrl+T), los filtros ya estan activos." },
        { term: "Filtrar por valores", def: "Clic en la flecha del encabezado > aparece una lista de todos los valores unicos. Desmarca los que no quieres ver. Select All para seleccionar/deseleccionar todo rapidamente." },
        { term: "Buscar dentro del filtro", def: "El campo de busqueda dentro del menu de filtro te permite encontrar valores especificos cuando la lista es muy larga. Escribe parte del texto y la lista se filtra en tiempo real." },
      ]},
    ]
  },
  {
    title: "Tipos de filtro segun el dato",
    content: [
      { type: "text", value: "Excel ofrece opciones de filtro diferentes segun el tipo de dato de la columna. Esto hace que filtrar sea mas intuitivo y poderoso." },
      { type: "definition_list", items: [
        { term: "Text Filters", def: "Aparecen en columnas de texto. Opciones: Equals, Does Not Equal, Begins With, Ends With, Contains, Does Not Contain. Ejemplo: filtrar nombres que contengan 'Mar'." },
        { term: "Number Filters", def: "Aparecen en columnas numericas. Opciones: Equals, Greater Than, Less Than, Between, Top 10, Above Average, Below Average. Ejemplo: ventas mayores a 5000." },
        { term: "Date Filters", def: "Aparecen en columnas de fecha. Opciones: Today, Yesterday, This Week, This Month, This Quarter, This Year, Last Month, Next Month, Between. Ejemplo: todas las ventas del mes actual." },
        { term: "Filter by Color", def: "Si hay Conditional Formatting aplicado, puedes filtrar por color de celda o color de texto. Ejemplo: mostrar solo las celdas en rojo (las que tienen valores por debajo del umbral)." },
      ]},
    ]
  },
  {
    title: "Trabajar con datos filtrados",
    content: [
      { type: "text", value: "Cuando aplicas un Filter, hay comportamientos que debes conocer para evitar errores." },
      { type: "key_points", items: [
        { title: "Status Bar respeta el filtro", text: "Al seleccionar un rango filtrado, la Status Bar (SUM, AVERAGE, COUNT) calcula solo con las celdas visibles. Esto es correcto y util." },
        { title: "Formulas SUM no respetan el filtro", text: "Una formula =SUM(A1:A100) suma TODOS los valores, incluyendo los ocultos por el filtro. Si necesitas sumar solo lo visible, usa =SUBTOTAL(109, A1:A100). El 109 indica SUM ignorando filas ocultas." },
        { title: "Copy/Paste con filtro", text: "Cuando copias datos filtrados, solo se copian las celdas visibles. Esto es util para extraer un subconjunto de datos. Pero al pegar, se pegan en filas consecutivas, no en las filas originales." },
      ]},
    ]
  },
  {
    title: "Clear Filter vs. Remove Filter",
    content: [
      { type: "text", value: "Dos acciones que suenan parecido pero hacen cosas diferentes." },
      { type: "definition_list", items: [
        { term: "Clear Filter (limpiar)", def: "Quita los criterios de filtro pero mantiene los dropdowns activos en los encabezados. Todas las filas vuelven a ser visibles. Clic en la flecha del encabezado > Clear Filter From [columna]." },
        { term: "Remove Filter (quitar)", def: "Desactiva los filtros completamente. Los dropdowns desaparecen de los encabezados. Ctrl+Shift+L para toggle. Util cuando ya no necesitas filtrar." },
        { term: "Indicador visual", def: "Cuando un filtro esta activo, la flecha del encabezado cambia a un icono de embudo. Los numeros de fila se muestran en azul en vez de negro. Esto te recuerda que hay filas ocultas." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Modulo 6 de 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Sort and Filter</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Organiza y encuentra datos rapidamente. Ordena por multiples criterios y filtra para ver solo lo que necesitas.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Que puedas ordenar datos por multiples criterios y usar Filter para encontrar exactamente lo que buscas en cualquier tabla.</p>
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
        {["Siempre ubicarte dentro de la tabla antes de ordenar. Nunca selecciones solo una columna.", "Custom Sort permite multiples niveles: primero por Region, luego por Sales dentro de cada region.", "Ctrl+Shift+L activa/desactiva AutoFilter. Las Tables lo tienen activo por defecto.", "Text Filters, Number Filters y Date Filters ofrecen opciones diferentes segun el tipo de dato.", "SUM en formulas suma todo (incluyendo ocultos). SUBTOTAL(109,...) suma solo lo visible."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: Conditional Formatting basico</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Charts simples</span>
      </div>
    </div>
  );
}
