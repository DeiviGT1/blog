import { useState } from "react";

const V = {
  50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A",
  400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629",
  800: "#520F1E", 900: "#3A0911",
};
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "Movimiento básico",
    content: [
      {
        type: "text",
        value: "El mouse funciona, pero es lento. Los atajos de teclado te permiten moverte por miles de celdas en segundos. El objetivo no es memorizar una lista, sino incorporar los que usas a diario hasta que sean automáticos."
      },
      {
        type: "definition_list",
        items: [
          { term: "Arrow Keys", def: "Mueven una celda en la dirección indicada. Lo más básico." },
          { term: "Ctrl + Arrow Key", def: "Salta al final del bloque de datos en esa dirección. Si estás en A1 y hay datos hasta A500, Ctrl+Down te lleva a A500 de un salto." },
          { term: "Ctrl + Home", def: "Te lleva a A1 instantáneamente, sin importar dónde estés." },
          { term: "Ctrl + End", def: "Te lleva a la última celda que contiene datos en la hoja (la intersección de la última fila y columna usadas)." },
          { term: "Page Up / Page Down", def: "Avanza o retrocede una pantalla completa de filas. Útil para revisar datos largos visualmente." },
        ]
      },
    ]
  },
  {
    title: "Selección de rangos",
    content: [
      {
        type: "text",
        value: "Seleccionar datos es la base de casi toda acción en Excel: formatear, copiar, aplicar fórmulas, crear Charts. Hacerlo con teclado es mucho más preciso y rápido que arrastrar con el mouse."
      },
      {
        type: "definition_list",
        items: [
          { term: "Shift + Arrow Key", def: "Extiende la selección una celda a la vez en la dirección indicada." },
          { term: "Ctrl + Shift + Arrow Key", def: "Selecciona todo el bloque de datos en esa dirección. Es la combinación más poderosa para seleccionar columnas o filas completas de datos de un solo golpe." },
          { term: "Ctrl + A", def: "Selecciona toda la región de datos actual. Si presionas una segunda vez, selecciona toda la hoja." },
          { term: "Ctrl + Space", def: "Selecciona toda la columna de la celda activa." },
          { term: "Shift + Space", def: "Selecciona toda la fila de la celda activa." },
        ]
      },
    ]
  },
  {
    title: "Edición rápida",
    content: [
      {
        type: "text",
        value: "Estos atajos controlan cómo interactúas con el contenido de las celdas. La diferencia entre un usuario lento y uno rápido está en dominar estos movimientos."
      },
      {
        type: "definition_list",
        items: [
          { term: "F2", def: "Entra en modo edición de la celda activa. El cursor aparece dentro de la celda y puedes editar su contenido. Si la celda tiene una fórmula, F2 resalta con colores las celdas que referencia." },
          { term: "Escape", def: "Cancela la edición y restaura el valor anterior. Si estabas escribiendo algo y te equivocaste, Escape deshace lo que escribiste sin guardar." },
          { term: "Enter", def: "Confirma el valor y baja a la siguiente celda. La forma estándar de confirmar entrada." },
          { term: "Tab", def: "Confirma el valor y se mueve a la derecha. Ideal para llenar datos por filas (Nombre, Apellido, Email, Tab, Tab, Tab...)." },
          { term: "Ctrl + Z", def: "Deshacer. Funciona múltiples niveles hacia atrás. Es tu red de seguridad para cualquier error." },
          { term: "Ctrl + Y", def: "Rehacer. Revierte el último Undo. También repite la última acción realizada." },
          { term: "Delete", def: "Borra el contenido de las celdas seleccionadas sin borrar el formato." },
        ]
      },
    ]
  },
  {
    title: "Atajos de productividad",
    content: [
      {
        type: "text",
        value: "Estos son los atajos que marcan la diferencia real en velocidad de trabajo. Cada uno ahorra segundos que, multiplicados por cientos de veces al día, se convierten en horas."
      },
      {
        type: "definition_list",
        items: [
          { term: "Ctrl + C / V / X", def: "Copiar, pegar, cortar. En Excel, copiar una celda con fórmula copia la fórmula (ajustando referencias)." },
          { term: "Ctrl + D", def: "Rellena hacia abajo. Si seleccionas B1:B10 y la primera celda tiene un valor o fórmula, Ctrl+D copia ese contenido a todas las celdas debajo." },
          { term: "Ctrl + R", def: "Rellena hacia la derecha. Misma lógica que Ctrl+D pero en dirección horizontal." },
          { term: "Alt + =", def: "AutoSum. Inserta automáticamente una función SUM del rango que Excel detecta arriba o a la izquierda." },
          { term: "Ctrl + Shift + L", def: "Activa/desactiva AutoFilter. Un toggle rápido para los menús desplegables de filtro en los encabezados." },
          { term: "Ctrl + T", def: "Convierte el rango actual en una Table. Una de las acciones más importantes que aprenderás en este curso." },
          { term: "Ctrl + 1", def: "Abre Format Cells. La ventana más completa para formatear: número, alineación, fuente, bordes, relleno, protección." },
          { term: "Ctrl + Shift + +", def: "Inserta celdas, filas o columnas según la selección actual." },
          { term: "Ctrl + -", def: "Elimina celdas, filas o columnas según la selección actual." },
        ]
      },
    ]
  },
  {
    title: "Navegación entre hojas",
    content: [
      {
        type: "text",
        value: "Cuando un Workbook tiene múltiples Sheets, necesitas poder moverte entre ellas sin usar el mouse."
      },
      {
        type: "definition_list",
        items: [
          { term: "Ctrl + Page Down", def: "Se mueve a la siguiente Sheet (a la derecha)." },
          { term: "Ctrl + Page Up", def: "Se mueve a la Sheet anterior (a la izquierda)." },
          { term: "Clic derecho en flechas de Sheet Tabs", def: "Muestra lista completa de todas las hojas del Workbook. Útil cuando tienes más hojas de las que caben en la barra inferior." },
        ]
      },
    ]
  },
  {
    title: "El criterio: no memorices, practica",
    content: [
      {
        type: "text",
        value: "El objetivo de este módulo no es que memorices 30 atajos. Es que identifiques los 10-15 que usarías todos los días en tu trabajo y los practiques hasta que sean automáticos."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Empieza con 5",
            text: "Elige los 5 atajos que más usarías y úsalos deliberadamente durante una semana. Cuando ya no pienses en ellos, agrega 5 más."
          },
          {
            title: "Resiste el mouse",
            text: "Cada vez que vayas a usar el mouse para algo que tiene atajo, detente y usa el teclado. Las primeras veces será más lento. Después será mucho más rápido."
          },
          {
            title: "Los imprescindibles",
            text: "Si solo pudieras aprender 5 atajos de esta lista: Ctrl+Arrow (navegar), Ctrl+Shift+Arrow (seleccionar), F2 (editar), Ctrl+Z (deshacer), y Ctrl+1 (Format Cells)."
          },
        ]
      },
    ]
  },
];

export default function Module() {
  const [openSection, setOpenSection] = useState(0);

  const renderBlock = (block, bi) => {
    if (block.type === "text") {
      return (
        <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>
          {block.value}
        </p>
      );
    }
    if (block.type === "definition_list") {
      return (
        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
          {block.items.map((item, di) => (
            <div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{item.term}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.def}</div>
            </div>
          ))}
        </div>
      );
    }
    if (block.type === "key_points") {
      return (
        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
          {block.items.map((item, ki) => (
            <div key={ki} style={{ borderLeft: `2px solid ${V[200]}`, paddingLeft: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.text}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px",
            borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800],
          }}>NIVEL 0 — OBLIGATORIO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Módulo 2 de 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>
          Navegación y Keyboard Shortcuts
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Deja de depender del mouse para todo y gana velocidad real de trabajo con los atajos que más impacto tienen.
        </p>
      </div>

      {/* Objective */}
      <div style={{
        background: V[50], borderLeft: `3px solid ${V[400]}`,
        borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0",
        padding: "12px 16px", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>OBJETIVO</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>
          Que dejes de depender del mouse para todo y ganes velocidad real de trabajo dominando los atajos de mayor impacto.
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
              transition: "all 0.2s",
            }}>
              <div
                onClick={() => setOpenSection(isOpen ? -1 : si)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
              >
                <div style={{
                  width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                  background: isOpen ? V[600] : V[50],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600],
                  transition: "all 0.2s",
                }}>{si + 1}</div>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>
                  {section.title}
                </span>
                <span style={{
                  fontSize: 16, color: "var(--color-text-tertiary)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}>&#x25BE;</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 16px 56px" }}>
                  {section.content.map((block, bi) => renderBlock(block, bi))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Takeaways */}
      <div style={{
        background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem", marginTop: "1.5rem",
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>
          Puntos clave de este módulo
        </div>
        {[
          "Ctrl+Arrow salta bloques de datos. Ctrl+Shift+Arrow los selecciona. Son el dúo más importante.",
          "F2 entra en modo edición y muestra visualmente qué celdas referencia una fórmula.",
          "Tab confirma y mueve a la derecha. Ideal para llenar tablas por filas.",
          "Alt+= inserta AutoSum. Ctrl+T convierte datos en Table. Ctrl+1 abre Format Cells.",
          "No memorices 30 atajos. Domina 5 primero y luego agrega más gradualmente.",
        ].map((point, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0",
            borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none",
          }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)",
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Anterior: La interfaz de Excel 365</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Siguiente: Estructura y organización de datos</span>
      </div>
    </div>
  );
}
