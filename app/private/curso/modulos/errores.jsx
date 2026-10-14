import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const ERRORS = [
  { code: "#DIV/0!", color: "#D32F2F", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Estas dividiendo entre cero o entre una celda vacia. Excel no puede calcular una division cuyo denominador es 0." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Celda vacia como divisor", def: "=A1/B1 donde B1 esta vacia. Excel trata vacias como 0 en divisiones." },
        { term: "Formula que referencia datos pendientes", def: "Esperabas que B1 tuviera un valor pero aun no se ha ingresado." },
        { term: "AVERAGE de rango vacio", def: "=AVERAGE(A1:A10) donde todas las celdas estan vacias devuelve #DIV/0! porque internamente divide suma/cantidad y cantidad es 0." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "IFERROR", def: "=IFERROR(A1/B1, 0). Si da error, devuelve 0 (o \"N/A\" o lo que prefieras)." },
        { term: "IF para prevenir", def: "=IF(B1=0, 0, A1/B1). Verifica antes de dividir." },
        { term: "En XLOOKUP", def: "XLOOKUP tiene valor por defecto nativo como cuarto argumento. No necesitas IFERROR." },
      ]},
    ]},
  ]},
  { code: "#VALUE!", color: "#E65100", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Estas usando un tipo de dato incorrecto en una formula. Ejemplo: intentas sumar texto con numeros, o una funcion recibe un argumento del tipo equivocado." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Numero almacenado como texto", def: "La celda muestra '123' pero esta alineada a la izquierda: es texto. No puedes operar con ella como numero." },
        { term: "Espacios invisibles", def: "Hay un espacio antes o despues del numero. Excel lo trata como texto." },
        { term: "Formula con rango mal definido", def: "Argumentos que esperan un valor unico reciben un rango, o viceversa." },
        { term: "Operacion matematica con texto", def: "=\"abc\"+5 da #VALUE! porque no puedes sumar texto y numero." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "VALUE()", def: "=VALUE(A1) convierte texto numerico a numero real." },
        { term: "TRIM()", def: "=TRIM(A1) elimina espacios extra. Combina: =VALUE(TRIM(A1))." },
        { term: "Triangulo verde", def: "Si Excel detecta un numero como texto, muestra un triangulo verde en la esquina de la celda. Clic > Convert to Number." },
        { term: "Text to Columns", def: "Data > Text to Columns > Fixed Width > Finish. Fuerza la conversion de texto a numero en un rango completo." },
      ]},
    ]},
  ]},
  { code: "#REF!", color: "#C62828", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Una referencia en la formula ya no es valida. Generalmente porque eliminaste una fila, columna u hoja que la formula necesitaba." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Eliminar fila/columna referenciada", def: "Si tu formula apunta a B5 y eliminas la columna B, la formula se convierte en #REF!." },
        { term: "Eliminar hoja referenciada", def: "Si una formula dice =Sheet2!A1 y eliminas Sheet2, aparece #REF!." },
        { term: "Pegar sobre celdas referenciadas", def: "Cortar y pegar puede romper referencias que apuntaban al area sobrescrita." },
        { term: "VLOOKUP con col_index fuera de rango", def: "=VLOOKUP(A1, B:D, 5, FALSE). El rango B:D solo tiene 3 columnas pero pediste la 5ta." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Ctrl+Z inmediato", def: "Si acabas de causar el error, Ctrl+Z deshace la accion y restaura las referencias." },
        { term: "Revisar manualmente", def: "Haz clic en la celda con error, mira la Formula Bar, busca donde dice #REF! y reemplaza con la referencia correcta." },
        { term: "Prevencion", def: "Usa Tables (Ctrl+T) y Named Ranges. Son mas resistentes a eliminaciones accidentales." },
      ]},
    ]},
  ]},
  { code: "#N/A", color: "#4A148C", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Un valor buscado no fue encontrado. Es el error mas comun de funciones de busqueda (VLOOKUP, XLOOKUP, MATCH, INDEX+MATCH)." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Valor no existe en la tabla", def: "Buscas el producto 'ABC' pero no esta en la columna de busqueda. Verifica que el valor exista exactamente." },
        { term: "Espacios extra", def: "Buscas 'Norte' pero la tabla tiene 'Norte ' (con espacio final). Visualmente se ven iguales pero para Excel son diferentes." },
        { term: "Tipo de dato diferente", def: "Buscas el numero 123 pero la tabla lo tiene como texto '123' (o viceversa). Mismo valor, tipo diferente." },
        { term: "VLOOKUP con TRUE/1", def: "Usar TRUE o 1 como cuarto argumento hace busqueda aproximada. Si los datos no estan ordenados, da resultados incorrectos o #N/A." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "IFERROR / IFNA", def: "=IFERROR(VLOOKUP(...), \"No encontrado\"). IFNA solo captura #N/A, no otros errores." },
        { term: "XLOOKUP nativo", def: "=XLOOKUP(valor, busqueda, retorno, \"No encontrado\"). El cuarto argumento maneja el caso." },
        { term: "TRIM en ambos lados", def: "Aplica TRIM tanto al valor buscado como a la columna de busqueda para eliminar espacios." },
        { term: "Verificar tipos", def: "Usa TYPE() para verificar si un valor es numero (1) o texto (2). Si no coinciden, convierte con VALUE() o TEXT()." },
      ]},
    ]},
  ]},
  { code: "#NAME?", color: "#1565C0", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Excel no reconoce un nombre que usaste en la formula. Puede ser una funcion mal escrita, un Named Range que no existe, o texto sin comillas." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Funcion mal escrita", def: "=SUMM(A1:A10) en vez de =SUM(A1:A10). =VLOKUP en vez de =VLOOKUP." },
        { term: "Named Range eliminado", def: "La formula usa =SUM(Sales) pero alguien elimino el Named Range 'Sales' en Name Manager." },
        { term: "Texto sin comillas", def: "=IF(A1=Norte, ...) en vez de =IF(A1=\"Norte\", ...). Sin comillas, Excel busca un nombre llamado Norte." },
        { term: "Funcion no disponible", def: "Usas XLOOKUP en una version de Excel que no la tiene (solo 365). O un add-in no esta habilitado." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Revisa la ortografia", def: "Compara caracter por caracter con la documentacion. Excel es estricto con los nombres de funciones." },
        { term: "Usa autocompletado", def: "Escribe las primeras letras de la funcion y Tab para aceptar la sugerencia. Evita errores de tipeo." },
        { term: "Pon comillas a texto", def: "Todo texto literal en formulas va entre comillas dobles: \"Norte\", \"Activo\", \"Pendiente\"." },
        { term: "Verifica Named Ranges", def: "Formulas > Name Manager. Busca nombres con #REF! y eliminalos o corrígelos." },
      ]},
    ]},
  ]},
  { code: "#NUM!", color: "#AD1457", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "El resultado de un calculo es un numero invalido. Demasiado grande, demasiado pequeno, o matematicamente imposible." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Raiz cuadrada de negativo", def: "=SQRT(-1) da #NUM! porque la raiz cuadrada de un numero negativo no existe en numeros reales." },
        { term: "IRR sin solucion", def: "=IRR(rango) puede dar #NUM! si los flujos de caja no tienen una tasa de retorno valida." },
        { term: "Numero fuera de rango", def: "Excel maneja numeros hasta ~1.8 x 10^308. Operaciones que excedan esto dan #NUM!." },
        { term: "Iteraciones insuficientes", def: "Funciones como IRR y RATE usan iteraciones. Si no convergen en el limite, dan #NUM!." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Verificar datos de entrada", def: "Asegurate que los valores de entrada sean razonables para la funcion que usas." },
        { term: "Para IRR/RATE", def: "Agrega un guess (estimacion inicial) como argumento. =IRR(rango, 0.1) le da un punto de partida." },
        { term: "IFERROR como siempre", def: "=IFERROR(formula, \"Error en calculo\") para manejar el caso elegantemente." },
      ]},
    ]},
  ]},
  { code: "#NULL!", color: "#37474F", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Usaste un operador de interseccion (espacio) entre dos rangos que no se intersectan. Es el error menos comun." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Espacio accidental", def: "=SUM(A1:A10 B1:B10). Hay un espacio entre los dos rangos en vez de una coma. Excel interpreta el espacio como operador de interseccion." },
        { term: "Coma faltante", def: "Deberia ser =SUM(A1:A10, B1:B10) con coma separando los rangos." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Agrega la coma", def: "Reemplaza el espacio por coma: =SUM(A1:A10, B1:B10)." },
        { term: "Verifica la formula", def: "Si necesitas la interseccion real de dos rangos (raro), asegurate que se solapan." },
      ]},
    ]},
  ]},
  { code: "##### (numeros)", color: "#455A64", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "No es un error real. La columna es demasiado angosta para mostrar el valor. El dato esta correcto, solo no cabe visualmente." },
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Ensanchar columna", def: "Arrastra el borde del encabezado de columna. O doble clic en el borde para autoajustar." },
        { term: "AutoFit", def: "Selecciona la columna > Home > Format > AutoFit Column Width." },
        { term: "Cambiar formato", def: "Si el numero tiene muchos decimales, reduce con un formato como #,##0 (sin decimales) o #,##0.00 (2 decimales)." },
      ]},
    ]},
  ]},
  { code: "Circular Reference", color: "#BF360C", sections: [
    { title: "Que significa", content: [
      { type: "text", value: "Una formula se referencia a si misma directa o indirectamente. Ejemplo: en A1 escribes =A1+1. Excel no puede calcular esto porque necesita el resultado para calcular el resultado." },
    ]},
    { title: "Causas comunes", content: [
      { type: "definition_list", items: [
        { term: "Auto-referencia directa", def: "En A1 escribes =A1+B1. La formula incluye su propia celda." },
        { term: "Cadena circular", def: "A1 referencia B1, B1 referencia C1, y C1 referencia A1. Circulo indirecto." },
        { term: "SUM de rango que incluye la celda", def: "En C10 escribes =SUM(C1:C10). El rango incluye la celda donde esta la formula." },
      ]},
    ]},
    { title: "Como arreglar", content: [
      { type: "definition_list", items: [
        { term: "Excel te avisa", def: "Muestra un dialogo de Circular Reference Warning. Nota el mensaje y busca la celda indicada." },
        { term: "Formulas > Error Checking", def: "Error Checking > Circular References muestra las celdas involucradas." },
        { term: "Corregir el rango", def: "En el ejemplo de SUM, cambia a =SUM(C1:C9) para excluir la celda donde esta la formula." },
        { term: "Trace Precedents", def: "Formulas > Trace Precedents para ver visualmente las dependencias y encontrar el circulo." },
      ]},
    ]},
  ]},
];

export default function Module() {
  const [openError, setOpenError] = useState(0);
  const [openSection, setOpenSection] = useState(0);
  const renderBlock = (block, bi) => {
    if (block.type === "text") return <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>{block.value}</p>;
    if (block.type === "definition_list") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((item, di) => (<div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}><div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{item.term}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.def}</div></div>))}</div>);
    return null;
  };

  const err = ERRORS[openError];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Guia de errores de Excel</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>Que significa cada error, por que aparece, y como arreglarlo.</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {ERRORS.map((e, i) => (
          <button key={i} onClick={() => { setOpenError(i); setOpenSection(0); }} style={{ padding: "6px 14px", borderRadius: 8, border: openError === i ? `2px solid ${e.color}` : "1px solid var(--color-border-tertiary)", background: openError === i ? e.color+"15" : "white", color: openError === i ? e.color : "var(--color-text-secondary)", fontWeight: openError === i ? 600 : 400, fontSize: 13, cursor: "pointer", fontFamily: "monospace" }}>{e.code}</button>
        ))}
      </div>
      <div style={{ background: err.color+"10", border: `1px solid ${err.color}30`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: err.color, fontFamily: "monospace" }}>{err.code}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {err.sections.map((s, si) => {
          const isOpen = openSection === si;
          return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}>
            <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span>
              <span style={{ fontSize: 14, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"\u25BE"}</span>
            </div>
            {isOpen && <div style={{ padding: "0 16px 16px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}
          </div>);
        })}
      </div>
    </div>
  );
}
