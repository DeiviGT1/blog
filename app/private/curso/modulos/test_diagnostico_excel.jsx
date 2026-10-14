import { useState } from "react";

const VINOTINTO = {
  50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A",
  400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629",
  800: "#520F1E", 900: "#3A0911",
};
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const QUESTIONS = [
  // NIVEL 1 — Básico
  {
    level: 1,
    q: "¿Qué función usarías para obtener el valor más alto de un rango?",
    options: ["MAX", "LARGE", "HIGH", "UPPER"],
    answer: 0,
  },
  {
    level: 1,
    q: "Si escribes =A1+B1 en C1 y luego copias esa celda hacia abajo a C2, ¿qué fórmula tendrá C2?",
    options: ["=A1+B1", "=A2+B2", "=A1+B2", "=A2+B1"],
    answer: 1,
  },
  {
    level: 1,
    q: "¿Cuál es la forma correcta de aplicar un AutoFilter a una tabla de datos?",
    options: [
      "Seleccionar todo el rango y usar Format > Filter",
      "Ubicarse en cualquier celda de la tabla y usar Data > Filter",
      "Hacer clic derecho y seleccionar Add Filter",
      "Ir a View > Filter Mode",
    ],
    answer: 1,
  },
  {
    level: 1,
    q: "Tienes una columna con valores numéricos que Excel muestra como texto (alineados a la izquierda). ¿Cuál es la causa más probable?",
    options: [
      "La columna es demasiado estrecha",
      "Los números tienen un apóstrofo o espacio adelante",
      "Falta aplicar Bold al rango",
      "El archivo está en modo protegido",
    ],
    answer: 1,
  },
  {
    level: 1,
    q: "¿Qué tipo de Chart es más adecuado para mostrar la proporción de cada categoría respecto al total?",
    options: ["Line Chart", "Pie Chart", "Bar Chart", "Scatter Plot"],
    answer: 1,
  },

  // NIVEL 2 — Intermedio
  {
    level: 2,
    q: "En la fórmula =A$1*$B1, ¿qué ocurre al copiarla una celda hacia la derecha?",
    options: [
      "Se convierte en =B$1*$B1",
      "Se convierte en =A$1*$B2",
      "Se convierte en =B$1*$C1",
      "No cambia nada",
    ],
    answer: 0,
  },
  {
    level: 2,
    q: "¿Qué función usarías para sumar las ventas de la región \"Norte\" solamente?",
    options: ["SUM", "SUMIF", "SUMPRODUCT", "TOTAL"],
    answer: 1,
  },
  {
    level: 2,
    q: "Necesitas que una celda muestre \"Aprobado\" si el valor es >= 70 y \"Reprobado\" si es menor. ¿Cuál es la fórmula correcta?",
    options: [
      "=IF(A1>=70, \"Aprobado\", \"Reprobado\")",
      "=IF(A1<70, \"Aprobado\", \"Reprobado\")",
      "=IFS(A1>=70, \"Aprobado\")",
      "=SWITCH(A1, 70, \"Aprobado\", \"Reprobado\")",
    ],
    answer: 0,
  },
  {
    level: 2,
    q: "En una PivotTable, ¿dónde colocarías el campo \"Producto\" si quieres ver un producto por fila?",
    options: ["Values", "Filters", "Rows", "Columns"],
    answer: 2,
  },
  {
    level: 2,
    q: "¿Qué herramienta usarías para crear una lista desplegable en una celda que solo permita elegir entre opciones predefinidas?",
    options: [
      "Conditional Formatting",
      "Data Validation con List",
      "Named Range solamente",
      "Comment con instrucciones",
    ],
    answer: 1,
  },

  // NIVEL 3 — Avanzado
  {
    level: 3,
    q: "¿Cuál es la principal ventaja de XLOOKUP sobre VLOOKUP?",
    options: [
      "Es más rápida en archivos grandes",
      "Puede buscar hacia la izquierda y no requiere número de columna",
      "Solo funciona con Tables",
      "Permite búsquedas en múltiples hojas simultáneamente",
    ],
    answer: 1,
  },
  {
    level: 3,
    q: "¿Qué combinación de funciones usarías para buscar un valor donde la columna de resultado está a la izquierda de la columna de búsqueda?",
    options: [
      "VLOOKUP con argumento negativo",
      "HLOOKUP + VLOOKUP",
      "INDEX + MATCH",
      "FIND + SEARCH",
    ],
    answer: 2,
  },
  {
    level: 3,
    q: "La función =FILTER(A2:C100, B2:B100=\"Activo\") es una Dynamic Array function de Excel 365. ¿Qué hace?",
    options: [
      "Aplica un AutoFilter a la tabla",
      "Devuelve un array con solo las filas donde la columna B es \"Activo\"",
      "Elimina las filas que no cumplen la condición",
      "Crea una PivotTable filtrada",
    ],
    answer: 1,
  },
  {
    level: 3,
    q: "¿Cuál es la función principal de Power Query en Excel?",
    options: [
      "Crear gráficos avanzados",
      "Escribir macros sin VBA",
      "Importar, transformar y limpiar datos de múltiples fuentes",
      "Proteger hojas con contraseña",
    ],
    answer: 2,
  },
  {
    level: 3,
    q: "¿Qué elemento usarías para permitir que el usuario filtre un Dashboard interactivo por periodo de tiempo?",
    options: [
      "Una celda con Data Validation",
      "Un Timeline conectado a la PivotTable",
      "Un Comment con instrucciones",
      "Un Hyperlink a otra hoja",
    ],
    answer: 1,
  },

  // NIVEL 4 — Pro
  {
    level: 4,
    q: "En VBA, ¿qué estructura usarías para recorrer todas las filas de una tabla hasta encontrar una celda vacía?",
    options: [
      "For Each...Next con Range",
      "Do While...Loop verificando IsEmpty",
      "Select Case con contador",
      "If Then sin bucle",
    ],
    answer: 1,
  },
  {
    level: 4,
    q: "En Power Pivot, ¿qué lenguaje se usa para crear medidas calculadas?",
    options: ["VBA", "M Language", "DAX", "SQL"],
    answer: 2,
  },
  {
    level: 4,
    q: "¿Qué permite hacer un Data Model en Excel?",
    options: [
      "Crear gráficos 3D",
      "Relacionar múltiples tablas sin fórmulas de búsqueda",
      "Grabar macros automáticamente",
      "Conectarse a internet en tiempo real",
    ],
    answer: 1,
  },
  {
    level: 4,
    q: "Si grabas una Macro con Record Macro y la guardas en Personal Macro Workbook, ¿qué significa eso?",
    options: [
      "Solo funciona en el archivo actual",
      "Se elimina al cerrar Excel",
      "Está disponible en cualquier Workbook que abras",
      "Se comparte automáticamente con otros usuarios",
    ],
    answer: 2,
  },
  {
    level: 4,
    q: "Tienes dos tablas en Power Query: Ventas (con ProductID) y Productos (con ProductID y ProductName). ¿Qué operación usarías para agregar el nombre del producto a la tabla de ventas?",
    options: [
      "Append Queries",
      "Merge Queries",
      "Group By",
      "Unpivot Columns",
    ],
    answer: 1,
  },
];

const LEVEL_NAMES = {
  1: "Nivel 1 — Básico",
  2: "Nivel 2 — Intermedio",
  3: "Nivel 3 — Avanzado",
  4: "Nivel 4 — Excel Pro",
};

function getRecommendation(scores) {
  if (scores[1] < 3) return {
    level: "Nivel 1 — Básico",
    route: "Nivel 0 → 1 → 2 → 3",
    detail: "Necesitas construir una base sólida desde los fundamentos. El Nivel 0 te dará los hábitos correctos y el Nivel 1 las herramientas esenciales.",
  };
  if (scores[2] < 3) return {
    level: "Nivel 2 — Intermedio",
    route: "Nivel 0 → Nivel 2",
    detail: "Tienes buena base pero necesitas reforzar funciones condicionales, PivotTables y análisis de datos. El Nivel 0 te ayudará a ordenar hábitos.",
  };
  if (scores[3] < 3) return {
    level: "Nivel 3 — Avanzado",
    route: "Nivel 0 (rápido) → Nivel 3",
    detail: "Dominas lo intermedio. Ahora toca llevar Excel al nivel profesional con XLOOKUP, Dynamic Arrays, Power Query y Dashboards.",
  };
  if (scores[4] < 3) return {
    level: "Nivel 4 — Excel Pro",
    route: "Nivel 3 (repaso rápido) → Nivel 4",
    detail: "Tienes un nivel avanzado sólido. El siguiente paso es automatización, VBA, Power Pivot y herramientas de especialización.",
  };
  return {
    level: "Dominas todos los niveles",
    route: "Nivel 4 → Especialización por industria",
    detail: "Excelente dominio general. Podrías beneficiarte de módulos especializados o enfocarte en certificación MOS Expert.",
  };
}

export default function DiagnosticTest() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[current];
  const totalQ = QUESTIONS.length;
  const progress = Math.round(((current + (confirmed ? 1 : 0)) / totalQ) * 100);

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  };

  const getScores = () => {
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) {
        scores[q.level]++;
      }
    });
    return scores;
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setConfirmed(false);
    setFinished(false);
  };

  // INTRO SCREEN
  if (!started) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem 0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", color: VINOTINTO[600], marginBottom: 6, textTransform: "uppercase" }}>Curso completo de Excel 365</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 8px" }}>Test diagnóstico de nivel</h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>Descubre tu punto de partida para elegir la ruta correcta</p>
        </div>

        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: "0 0 12px", lineHeight: 1.6 }}>
            Este test evalúa tu nivel actual de Excel a través de 20 preguntas de selección múltiple,
            organizadas en 4 bloques de dificultad creciente.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[
              ["20", "preguntas"],
              ["4", "niveles evaluados"],
              ["~10 min", "duración estimada"],
              ["Automático", "resultado y ruta"],
            ].map(([val, label], i) => (
              <div key={i} style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", border: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: VINOTINTO[600] }}>{val}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 20px", lineHeight: 1.6 }}>
          No te preocupes si no sabes algunas respuestas — ese es justamente el punto.
          Responde con lo que sepas y el test hará el resto.
        </p>

        <button
          onClick={() => setStarted(true)}
          style={{
            width: "100%", padding: "14px", fontSize: 15, fontWeight: 500,
            background: VINOTINTO[600], color: "#fff", border: "none",
            borderRadius: "var(--border-radius-md)", cursor: "pointer",
          }}
        >
          Comenzar test
        </button>
      </div>
    );
  }

  // RESULTS SCREEN
  if (finished) {
    const scores = getScores();
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const rec = getRecommendation(scores);

    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem 0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", color: VINOTINTO[600], marginBottom: 6, textTransform: "uppercase" }}>Resultado del diagnóstico</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 8px" }}>{total} / 20 respuestas correctas</h1>
        </div>

        {/* Score per level */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
          {[1, 2, 3, 4].map((lvl) => {
            const s = scores[lvl];
            const pct = (s / 5) * 100;
            const passed = s >= 3;
            return (
              <div key={lvl} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{LEVEL_NAMES[lvl]}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: passed ? "var(--color-text-success)" : VINOTINTO[600] }}>{s} / 5</span>
                </div>
                <div style={{ height: 6, background: "var(--color-border-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: passed ? "var(--color-text-success)" : VINOTINTO[500], borderRadius: 3, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendation */}
        <div style={{ background: VINOTINTO[50], borderRadius: "var(--border-radius-lg)", padding: "1.25rem", borderLeft: `3px solid ${VINOTINTO[600]}`, marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: VINOTINTO[600], marginBottom: 4, textTransform: "uppercase" }}>Recomendación</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: VINOTINTO[800], marginBottom: 8 }}>Comienza en: {rec.level}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{rec.detail}</div>
          <div style={{ display: "inline-block", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-md)", padding: "8px 14px", border: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, letterSpacing: "0.04em" }}>RUTA </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: VINOTINTO[600] }}>{rec.route}</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 16px", lineHeight: 1.6 }}>
          Recuerda que el Nivel 0 (Fundamentos y hábitos) es obligatorio para todos los perfiles,
          independientemente del resultado. Es la base que garantiza buenas prácticas desde el inicio.
        </p>

        <button
          onClick={restart}
          style={{
            width: "100%", padding: "12px", fontSize: 14, fontWeight: 500,
            background: "transparent", color: VINOTINTO[600],
            border: `1.5px solid ${VINOTINTO[600]}`, borderRadius: "var(--border-radius-md)",
            cursor: "pointer",
          }}
        >
          Repetir test
        </button>
      </div>
    );
  }

  // QUESTION SCREEN
  const isCorrect = confirmed && selected === question.answer;
  const isWrong = confirmed && selected !== question.answer;
  const currentLevel = question.level;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>Pregunta {current + 1} de {totalQ}</span>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: "3px 10px",
          borderRadius: "var(--border-radius-md)",
          background: VINOTINTO[50], color: VINOTINTO[800],
        }}>
          {LEVEL_NAMES[currentLevel]}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--color-border-tertiary)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: VINOTINTO[600], borderRadius: 2, transition: "width 0.3s" }} />
      </div>

      {/* Question */}
      <h2 style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 20px", lineHeight: 1.5 }}>
        {question.q}
      </h2>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {question.options.map((opt, idx) => {
          let bg = "var(--color-background-primary)";
          let border = "var(--color-border-tertiary)";
          let textColor = "var(--color-text-primary)";

          if (confirmed && idx === question.answer) {
            bg = "#E8F5E9";
            border = "#4CAF50";
            textColor = "#1B5E20";
          } else if (confirmed && idx === selected && idx !== question.answer) {
            bg = VINOTINTO[50];
            border = VINOTINTO[400];
            textColor = VINOTINTO[800];
          } else if (!confirmed && idx === selected) {
            bg = VINOTINTO[50];
            border = VINOTINTO[400];
            textColor = VINOTINTO[800];
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: "12px 16px", borderRadius: "var(--border-radius-md)",
                border: `1.5px solid ${border}`, background: bg,
                cursor: confirmed ? "default" : "pointer",
                transition: "all 0.15s",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}
            >
              <div style={{
                width: 24, height: 24, minWidth: 24, borderRadius: "50%",
                border: `1.5px solid ${border}`, background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 500, color: textColor,
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontSize: 14, color: textColor, lineHeight: 1.5, paddingTop: 2 }}>{opt}</span>
            </div>
          );
        })}
      </div>

      {/* Confirm / Next button */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          style={{
            width: "100%", padding: "12px", fontSize: 14, fontWeight: 500,
            background: selected === null ? "var(--color-border-tertiary)" : VINOTINTO[600],
            color: selected === null ? "var(--color-text-tertiary)" : "white",
            border: "none", borderRadius: "var(--border-radius-md)",
            cursor: selected === null ? "default" : "pointer",
            transition: "all 0.2s",
          }}
        >
          Confirmar respuesta
        </button>
      ) : (
        <div>
          <div style={{
            padding: "10px 14px", borderRadius: "var(--border-radius-md)", marginBottom: 12,
            background: isCorrect ? "#E8F5E9" : VINOTINTO[50],
            fontSize: 13, fontWeight: 500,
            color: isCorrect ? "#1B5E20" : VINOTINTO[800],
          }}>
            {isCorrect ? "Correcto" : `Incorrecto — la respuesta era: ${question.options[question.answer]}`}
          </div>
          <button
            onClick={handleNext}
            style={{
              width: "100%", padding: "12px", fontSize: 14, fontWeight: 500,
              background: VINOTINTO[600], color: "white",
              border: "none", borderRadius: "var(--border-radius-md)",
              cursor: "pointer",
            }}
          >
            {current < totalQ - 1 ? "Siguiente pregunta" : "Ver resultado"}
          </button>
        </div>
      )}
    </div>
  );
}
