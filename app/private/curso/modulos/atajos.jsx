import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const CATEGORIES = [
  { title: "Los 15 imprescindibles", highlight: true, shortcuts: [
    ["Ctrl + Arrow", "Navegar por bloques de datos"],
    ["Ctrl + Shift + Arrow", "Seleccionar bloques completos"],
    ["F2", "Editar celda / ver referencias con colores"],
    ["Ctrl + Z", "Deshacer (multiples niveles)"],
    ["Ctrl + 1", "Format Cells (Number, Font, Border...)"],
    ["Ctrl + T", "Convertir rango en Table"],
    ["Ctrl + Shift + L", "Activar/desactivar AutoFilter"],
    ["Alt + =", "AutoSum automatico"],
    ["Ctrl + D", "Rellenar celda hacia abajo"],
    ["Ctrl + C / V", "Copiar / Pegar"],
    ["Ctrl + Alt + V", "Paste Special (valores, formato...)"],
    ["F4 (en formula)", "Ciclar tipo de referencia: A1 > $A$1 > A$1 > $A1"],
    ["Ctrl + `", "Mostrar/ocultar todas las formulas"],
    ["Ctrl + S", "Guardar"],
    ["Ctrl + Home", "Ir a celda A1"],
  ]},
  { title: "Navegacion", shortcuts: [
    ["Arrow Keys", "Mover una celda en cualquier direccion"],
    ["Ctrl + Arrow", "Saltar al final del bloque de datos"],
    ["Ctrl + Home", "Ir a celda A1"],
    ["Ctrl + End", "Ir a ultima celda con datos"],
    ["Page Up / Down", "Mover una pantalla arriba/abajo"],
    ["Ctrl + Page Down", "Ir a la siguiente Sheet"],
    ["Ctrl + Page Up", "Ir a la Sheet anterior"],
    ["Ctrl + G", "Go To (ir a celda o rango especifico)"],
  ]},
  { title: "Seleccion", shortcuts: [
    ["Shift + Arrow", "Extender seleccion una celda"],
    ["Ctrl + Shift + Arrow", "Seleccionar hasta el final del bloque"],
    ["Ctrl + A", "Seleccionar tabla actual / toda la hoja"],
    ["Ctrl + Space", "Seleccionar columna completa"],
    ["Shift + Space", "Seleccionar fila completa"],
    ["Ctrl + Shift + End", "Seleccionar hasta la ultima celda con datos"],
  ]},
  { title: "Edicion", shortcuts: [
    ["F2", "Entrar en modo edicion de celda"],
    ["Enter", "Confirmar y mover abajo"],
    ["Tab", "Confirmar y mover a la derecha"],
    ["Escape", "Cancelar edicion actual"],
    ["Delete", "Borrar contenido (mantiene formato)"],
    ["Ctrl + Z", "Deshacer"],
    ["Ctrl + Y", "Rehacer / Repetir ultima accion"],
    ["F4 (en formula)", "Ciclar entre tipos de referencia ($)"],
  ]},
  { title: "Copiar y Pegar", shortcuts: [
    ["Ctrl + C", "Copiar"],
    ["Ctrl + X", "Cortar"],
    ["Ctrl + V", "Pegar"],
    ["Ctrl + Alt + V", "Paste Special (elegir que pegar)"],
    ["Ctrl + D", "Rellenar hacia abajo (copia de arriba)"],
    ["Ctrl + R", "Rellenar hacia la derecha"],
  ]},
  { title: "Formato", shortcuts: [
    ["Ctrl + 1", "Abrir Format Cells"],
    ["Ctrl + B", "Bold (negrita)"],
    ["Ctrl + I", "Italic (cursiva)"],
    ["Ctrl + U", "Underline (subrayado)"],
    ["Ctrl + Shift + ~", "Formato General"],
    ["Ctrl + Shift + $", "Formato Currency (moneda)"],
    ["Ctrl + Shift + %", "Formato Percentage"],
    ["Ctrl + Shift + #", "Formato Date"],
    ["Ctrl + Shift + !", "Formato Number con decimales y miles"],
  ]},
  { title: "Insertar y Eliminar", shortcuts: [
    ["Ctrl + Shift + +", "Insertar celdas/filas/columnas"],
    ["Ctrl + -", "Eliminar celdas/filas/columnas"],
    ["Ctrl + T", "Convertir a Table"],
    ["Ctrl + Shift + L", "Toggle AutoFilter"],
    ["Alt + =", "AutoSum"],
    ["Shift + F3", "Insertar funcion (Function Wizard)"],
    ["Shift + F11", "Insertar nueva Sheet"],
  ]},
  { title: "Formulas y funciones", shortcuts: [
    ["= (igual)", "Iniciar una formula"],
    ["Tab (en formula)", "Aceptar sugerencia de autocompletado"],
    ["Ctrl + `", "Mostrar/ocultar formulas en toda la hoja"],
    ["Ctrl + [", "Ir a celdas precedentes"],
    ["Ctrl + ]", "Ir a celdas dependientes"],
    ["F9 (en formula)", "Evaluar fragmento seleccionado en Formula Bar"],
  ]},
  { title: "Charts y PivotTables", shortcuts: [
    ["Alt + F1", "Crear Chart rapido en la misma hoja"],
    ["F11", "Crear Chart en hoja nueva dedicada"],
    ["Alt + N, V, T", "Insertar PivotTable desde Table/Range"],
    ["Ctrl + Alt + F5", "Refresh All (PivotTables/conexiones)"],
  ]},
  { title: "Archivos y general", shortcuts: [
    ["Ctrl + S", "Guardar"],
    ["Ctrl + N", "Nuevo Workbook"],
    ["Ctrl + O", "Abrir archivo"],
    ["Ctrl + W", "Cerrar Workbook actual"],
    ["Ctrl + P", "Imprimir / Print Preview"],
    ["Ctrl + F", "Buscar"],
    ["Ctrl + H", "Buscar y Reemplazar"],
    ["Ctrl + F1", "Mostrar/ocultar Ribbon"],
    ["Alt + F8", "Lista de macros"],
    ["Alt + F11", "Abrir VBA Editor"],
  ]},
];

export default function Module() {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    shortcuts: cat.shortcuts.filter(([key, desc]) =>
      key.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.shortcuts.length > 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Atajos de teclado</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>Referencia completa de keyboard shortcuts. Empieza con los 15 imprescindibles.</p>
        <input
          type="text"
          placeholder="Buscar atajo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border-tertiary)", fontSize: 14, fontFamily: "inherit", outline: "none" }}
        />
      </div>
      {filtered.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", padding: "8px 12px",
            borderRadius: 6, marginBottom: 8, textTransform: "uppercase",
            background: cat.highlight ? V[50] : "transparent",
            color: cat.highlight ? V[600] : V[600],
            border: cat.highlight ? `1px solid ${V[200]}` : "none",
            borderBottom: cat.highlight ? undefined : `1px solid ${V[100]}`,
          }}>{cat.title}{cat.highlight ? " — domina estos primero" : ""}</div>
          {cat.shortcuts.map(([key, desc], si) => (
            <div key={si} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", alignItems: "center" }}>
              <code style={{
                fontSize: 12, fontWeight: 600, color: V[800], background: V[50],
                padding: "3px 10px", borderRadius: 5, minWidth: 160, whiteSpace: "nowrap",
                fontFamily: "SFMono-Regular, Consolas, monospace",
              }}>{key}</code>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{desc}</span>
            </div>
          ))}
        </div>
      ))}
      {filtered.length === 0 && <p style={{ textAlign: "center", color: "#999", padding: 40 }}>No se encontraron atajos para "{search}"</p>}
    </div>
  );
}
