import { useState } from "react";

const V = {
  50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A",
  400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629",
  800: "#520F1E", 900: "#3A0911",
};
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "Anatomía de la ventana de Excel",
    content: [
      {
        type: "text",
        value: "Antes de hacer cualquier cosa en Excel, necesitas saber dónde estás. La ventana de Excel 365 tiene elementos fijos que siempre están presentes. Conocerlos te da control y velocidad."
      },
      {
        type: "definition_list",
        items: [
          { term: "Title Bar", def: "Barra superior con el nombre del archivo. Si estás conectado a OneDrive, muestra el estado de guardado automático (AutoSave)." },
          { term: "Quick Access Toolbar", def: "Barra pequeña arriba a la izquierda con atajos rápidos. Por defecto tiene Save, Undo y Redo. Es personalizable." },
          { term: "Ribbon", def: "La cinta de opciones organizada en tabs: Home, Insert, Page Layout, Formulas, Data, Review, View. Cada tab agrupa herramientas relacionadas." },
          { term: "Formula Bar", def: "Muestra el contenido real de la celda activa. Si la celda tiene una fórmula, aquí ves la fórmula (no el resultado). Es tu ventana a lo que realmente hay dentro de cada celda." },
          { term: "Name Box", def: "A la izquierda de la Formula Bar. Muestra la dirección de la celda activa (ej: A1). También sirve para navegar: escribe una dirección y Enter para saltar ahí." },
          { term: "Column / Row Headers", def: "Letras (A, B, C...) para columnas y números (1, 2, 3...) para filas. Clic en una letra selecciona toda la columna. Clic en un número selecciona toda la fila." },
          { term: "Sheet Tabs", def: "En la parte inferior. Cada tab es una hoja (Worksheet) dentro del libro (Workbook). Clic derecho para renombrar, mover, duplicar o eliminar." },
          { term: "Status Bar", def: "Barra inferior que muestra información contextual. Cuando seleccionas un rango con números, muestra automáticamente SUM, AVERAGE y COUNT." },
          { term: "Zoom Slider", def: "Abajo a la derecha. Ctrl+Scroll del mouse es la forma más rápida de hacer zoom." },
        ]
      },
    ]
  },
  {
    title: "Personalización básica",
    content: [
      {
        type: "text",
        value: "Excel se adapta a cómo trabajas. Estos 3 ajustes son los que más impacto tienen en tu día a día."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Quick Access Toolbar",
            text: "Haz clic en la flecha al final de la barra > More Commands. Agrega los comandos que más usas. Recomendados: Save, Undo, Redo, Quick Print, Sort Ascending, Sort Descending. Cada comando queda a un clic de distancia, siempre visible sin importar en qué tab del Ribbon estés."
          },
          {
            title: "Ribbon: colapsar y expandir",
            text: "Ctrl+F1 colapsa el Ribbon para ganar espacio vertical. Vuelve a presionar para expandir. Útil en pantallas pequeñas o cuando necesitas ver más filas de datos."
          },
          {
            title: "Search Box (Tell Me)",
            text: "El campo de búsqueda en la parte superior del Ribbon. Escribe lo que necesitas hacer (\"merge\", \"freeze\", \"chart\") y Excel te lleva directo a la herramienta. Es el atajo más subestimado de Excel: no necesitas saber dónde está algo si sabes cómo se llama."
          },
        ]
      },
    ]
  },
  {
    title: "Vistas de trabajo",
    content: [
      {
        type: "text",
        value: "Excel tiene 3 vistas principales. Cada una sirve para un propósito distinto."
      },
      {
        type: "definition_list",
        items: [
          { term: "Normal", def: "La vista por defecto. La que usarás el 95% del tiempo para trabajar con datos." },
          { term: "Page Layout", def: "Muestra la hoja como se vería impresa, con márgenes, encabezados y saltos de página visibles. Útil solo cuando necesitas preparar un documento para impresión." },
          { term: "Page Break Preview", def: "Muestra líneas azules que indican dónde se cortará la página al imprimir. Puedes arrastrar esas líneas para ajustar los saltos." },
        ]
      },
      {
        type: "text",
        value: "Dos herramientas esenciales de vista que usarás constantemente:"
      },
      {
        type: "key_points",
        items: [
          {
            title: "Freeze Panes",
            text: "View > Freeze Panes. Congela filas o columnas para que queden visibles mientras haces scroll. Lo más común: ubicarte en la celda B2 y aplicar Freeze Panes para congelar la fila 1 (encabezados) y la columna A. Así al moverte por una tabla larga siempre ves los encabezados y la primera columna."
          },
          {
            title: "Split",
            text: "View > Split. Divide la ventana en paneles independientes para ver dos secciones de la misma hoja al mismo tiempo. Útil para comparar datos que están lejos entre sí sin tener que ir y volver."
          },
        ]
      },
    ]
  },
  {
    title: "La Status Bar como herramienta",
    content: [
      {
        type: "text",
        value: "La Status Bar en la parte inferior de Excel es una herramienta de análisis rápido que la mayoría de usuarios ignora."
      },
      {
        type: "text",
        value: "Cuando seleccionas un rango de celdas con números, la Status Bar muestra automáticamente el resultado de SUM, AVERAGE y COUNT sin necesidad de escribir ninguna fórmula. Es la forma más rápida de obtener un dato puntual."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Personalizar la Status Bar",
            text: "Clic derecho sobre la Status Bar muestra todas las opciones disponibles: Minimum, Maximum, Numerical Count, Average, Count, Sum. Puedes activar o desactivar cada una. Recomendación: activa todas las que necesites para tu tipo de trabajo."
          },
        ]
      },
    ]
  },
  {
    title: "Navegación y lógica de estructura",
    content: [
      {
        type: "text",
        value: "Excel organiza la información en 3 niveles jerárquicos. Entender esta estructura es fundamental para todo lo que viene después."
      },
      {
        type: "definition_list",
        items: [
          { term: "Workbook", def: "El archivo (.xlsx). Puede contener múltiples Worksheets. Es lo que abres y cierras." },
          { term: "Worksheet (Sheet)", def: "Cada pestaña dentro del Workbook. Una hoja tiene más de 1 millón de filas y 16,000+ columnas. Normalmente usas una fracción." },
          { term: "Cell", def: "La unidad mínima. Se identifica por su columna y fila (ej: B5). Puede contener un valor, una fórmula o estar vacía." },
        ]
      },
      {
        type: "text",
        value: "Dos atajos que conviene internalizar desde ahora: Ctrl+1 abre Format Cells (la ventana de formato más completa, acceso directo a todo) y Ctrl+Scroll del mouse controla el zoom de forma fluida."
      },
    ]
  },
];

export default function Module() {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      {/* Module header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px",
            borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800],
          }}>NIVEL 0 — OBLIGATORIO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 1 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>
          La interfaz de Excel 365
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Conoce cada elemento de la ventana de Excel para moverte con confianza y saber exactamente dónde encontrar cada herramienta.
        </p>
      </div>

      {/* Objective */}
      <div style={{
        background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0",
        padding: "12px 16px", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>
          Que te sientas cómodo navegando la interfaz y sepas exactamente dónde está cada herramienta sin tener que buscarla.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((section, si) => {
          const isOpen = openSection === si;
          return (
            <div key={si} style={{
              borderRadius: "var(--border-radius-md)",
              border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}`,
              background: isOpen ? "var(--color-background-primary)" : "var(--color-background-primary)",
              transition: "all 0.2s",
            }}>
              {/* Section header */}
              <div
                onClick={() => setOpenSection(isOpen ? -1 : si)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                  background: isOpen ? V[600] : V[50],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 500,
                  color: isOpen ? "#fff" : V[600],
                  transition: "all 0.2s",
                }}>
                  {si + 1}
                </div>
                <span style={{
                  flex: 1, fontSize: 15, fontWeight: 500,
                  color: isOpen ? V[800] : "var(--color-text-primary)",
                }}>{section.title}</span>
                <span style={{
                  fontSize: 16, color: "var(--color-text-tertiary)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}>▾</span>
              </div>

              {/* Section content */}
              {isOpen && (
                <div style={{ padding: "0 16px 16px 56px" }}>
                  {section.content.map((block, bi) => {
                    if (block.type === "text") {
                      return (
                        <p key={bi} style={{
                          fontSize: 14, color: "var(--color-text-secondary)",
                          margin: bi === 0 ? "0 0 14px" : "14px 0",
                          lineHeight: 1.7,
                        }}>{block.value}</p>
                      );
                    }
                    if (block.type === "definition_list") {
                      return (
                        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
                          {block.items.map((item, di) => (
                            <div key={di} style={{
                              background: "var(--color-background-secondary)",
                              borderRadius: "var(--border-radius-md)",
                              padding: "10px 14px",
                            }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>
                                {item.term}
                              </div>
                              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                                {item.def}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === "key_points") {
                      return (
                        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
                          {block.items.map((item, ki) => (
                            <div key={ki} style={{
                              borderLeft: `2px solid ${V[200]}`,
                              paddingLeft: 14,
                            }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                                {item.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key takeaways */}
      <div style={{
        background: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
        marginTop: "1.5rem",
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Puntos clave de este módulo</div>
        {[
          "La Formula Bar muestra lo que realmente contiene una celda — siempre verifícala.",
          "El Name Box no solo muestra la dirección: puedes escribir ahí para navegar a cualquier celda.",
          "La Status Bar te da SUM, AVERAGE y COUNT automáticos al seleccionar un rango.",
          "Freeze Panes es esencial para trabajar con tablas largas sin perder los encabezados.",
          "Ctrl+1 (Format Cells) y Search Box (Tell Me) son los dos atajos que más tiempo te ahorrarán.",
        ].map((point, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "6px 0",
            borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none",
          }}>
            <div style={{
              width: 6, height: 6, minWidth: 6, borderRadius: "50%",
              background: V[400], marginTop: 7,
            }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Navigation footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "1.5rem", paddingTop: "1rem",
        borderTop: "0.5px solid var(--color-border-tertiary)",
      }}>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Nivel 0 — Fundamentos y hábitos</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Navegación y Keyboard Shortcuts</span>
      </div>
    </div>
  );
}
