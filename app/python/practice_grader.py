# app/python/practice_grader.py
"""
Corrector automático de las prácticas del curso de Excel (sin IA, costo $0).

Cómo funciona:
  - Abre el .xlsx dos veces: con fórmulas y con los valores que Excel dejó
    calculados al guardar. Excel guarda las fórmulas SIEMPRE en inglés dentro
    del archivo (aunque el alumno use Excel en español), así que revisar qué
    función usó funciona igual en los dos idiomas.
  - Ubica cada ejercicio por sus rótulos ("EJERCICIO 1" / "EXERCISE 1", el
    texto de cada tarea), no por coordenadas fijas: si el alumno insertó filas,
    renombró la hoja o escribió la respuesta en otra columna, igual lo encuentra.
  - Calcula la respuesta esperada con los datos QUE TIENE el archivo del alumno
    (si cambió un dato, se le evalúa contra su propio dato).
  - Por celda revisa: que sea fórmula (no el número escrito a mano), que use la
    función que pide el ejercicio y que el resultado sea correcto.

Resultado: dict serializable (se guarda en curso_submissions.auto_result).
Todos los mensajes van en los dos idiomas: {"es": ..., "en": ...}.
"""
import io
import re
import unicodedata
import zipfile
from decimal import Decimal, ROUND_HALF_UP

from openpyxl import load_workbook

GRADER_VERSION = 1
PASS_PERCENT = 70

ERRORS = {"#NAME?", "#VALUE!", "#REF!", "#DIV/0!", "#N/A", "#NUM!", "#NULL!",
          "#SPILL!", "#CALC!", "#GETTING_DATA", "#FIELD!", "#BLOCKED!", "#CONNECT!",
          "#BUSY!", "#UNKNOWN!", "#PYTHON!"}

ERROR_HELP = {
    "#NAME?":  ("Excel no reconoce un nombre: revisa cómo escribiste la función o si falta cerrar comillas.",
                "Excel doesn't recognize a name: check the function's spelling or a missing closing quote."),
    "#VALUE!": ("Hay un tipo de dato equivocado: estás operando texto como si fuera número.",
                "Wrong data type: you're doing math on text."),
    "#REF!":   ("La fórmula apunta a una celda que ya no existe (¿borraste filas o columnas?).",
                "The formula points to a cell that no longer exists (did you delete rows or columns?)."),
    "#DIV/0!": ("Estás dividiendo entre cero o entre una celda vacía.",
                "You're dividing by zero or by an empty cell."),
    "#N/A":    ("La búsqueda no encontró el valor. Revisa el rango y el valor buscado.",
                "The lookup didn't find the value. Check the range and the lookup value."),
    "#SPILL!": ("El resultado no tiene espacio para desbordarse: hay celdas ocupadas debajo o a la derecha.",
                "The result has no room to spill: there are non-empty cells below or to the right."),
    "#NUM!":   ("Un cálculo dio un número inválido.", "A calculation produced an invalid number."),
    "#CALC!":  ("La fórmula devolvió un resultado vacío o una LAMBDA sin llamar.",
                "The formula returned an empty result or an uncalled LAMBDA."),
}

MAX_UNCOMPRESSED = 60 * 1024 * 1024  # defensa contra zip bombs


def M(es, en):
    return {"es": es, "en": en}


# ── Normalización ─────────────────────────────────────────────────────────────

def norm(s) -> str:
    """minúsculas, sin acentos, solo letras/números/espacios."""
    if s is None:
        return ""
    s = unicodedata.normalize("NFKD", str(s))
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"[^0-9a-zA-Z@.\-_ ]+", " ", s).lower()
    return re.sub(r"\s+", " ", s).strip()


def to_num(v):
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        t = v.strip().replace("$", "").replace(",", "")
        try:
            return float(t)
        except ValueError:
            return None
    return None


def num_eq(a, b) -> bool:
    a, b = to_num(a), to_num(b)
    if a is None or b is None:
        return False
    return abs(a - b) <= max(0.005, abs(b) * 1e-9)


def excel_round(x, digits):
    q = Decimal(1).scaleb(-digits)  # 10^-digits
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))


def fmt(v):
    if v is None:
        return "—"
    n = to_num(v) if not isinstance(v, str) else None
    if n is not None:
        return f"{n:,.2f}".rstrip("0").rstrip(".")
    return str(v)


FUNC_RE = re.compile(r"([A-Z][A-Z0-9\.]*)\s*\(")


def funcs_in(formula: str) -> set:
    if not formula:
        return set()
    f = formula.upper().replace("_XLFN.", "").replace("_XLWS.", "").replace("_XLPM.", "")
    f = re.sub(r'"[^"]*"', '""', f)  # ignorar texto entre comillas
    return set(FUNC_RE.findall(f))


# ── Acceso al libro ───────────────────────────────────────────────────────────

class Book:
    def __init__(self, data: bytes):
        self.data = data
        self.wf = load_workbook(io.BytesIO(data), data_only=False)
        self.wv = load_workbook(io.BytesIO(data), data_only=True)
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            self.zip_names = z.namelist()
            self.sheet_xml = {
                n: z.read(n).decode("utf-8", "ignore")
                for n in self.zip_names
                if n.startswith("xl/worksheets/sheet") and n.endswith(".xml")
            }

    def sheet(self, title):
        return Sheet(self.wf[title], self.wv[title])

    def all_formulas(self):
        for ws in self.wf.worksheets:
            for row in ws.iter_rows():
                for c in row:
                    f = formula_text(c.value)
                    if f:
                        yield ws.title, c.coordinate, f


def formula_text(v):
    if v is None:
        return None
    t = getattr(v, "text", None)  # ArrayFormula (arrays dinámicos)
    if isinstance(t, str):
        return t if t.startswith("=") else "=" + t
    if isinstance(v, str) and v.startswith("=") and len(v) > 1:
        return v
    return None


class Sheet:
    def __init__(self, wsf, wsv):
        self.f, self.v = wsf, wsv

    def formula(self, r, c):
        cell = self.f.cell(row=r, column=c)
        if cell.data_type != "f" and getattr(cell.value, "text", None) is None:
            return None  # texto que empieza con "=" no es fórmula
        return formula_text(cell.value)

    def value(self, r, c):
        return self.v.cell(row=r, column=c).value

    def raw(self, r, c):
        return self.f.cell(row=r, column=c).value

    def is_blank(self, r, c):
        v = self.raw(r, c)
        return v is None or (isinstance(v, str) and not v.strip())

    def text(self, r, c):
        v = self.value(r, c)
        if v is None:
            v = self.raw(r, c)
        return norm(v)

    def find_row(self, prefixes, start=1, end=None, cols=(1, 2, 3)):
        """Primera fila cuyo texto (en col A-C) empieza con alguno de los prefijos."""
        end = end or min(self.f.max_row, 400)
        pre = [norm(p) for p in prefixes]
        for r in range(start, end + 1):
            for c in cols:
                t = self.text(r, c)
                if t and any(t.startswith(p) for p in pre):
                    return r
        return None


# ── Evaluación de una celda con fórmula ──────────────────────────────────────

def item(label, status, msg=None, cell=None, got=None, expected=None):
    return {"label": label, "status": status, "msg": msg, "cell": cell,
            "got": None if got is None else fmt(got),
            "expected": None if expected is None else fmt(expected)}


def check_formula_cell(sh, r, c, label, expected, *, compare=num_eq,
                       accepted=None, partial=None, need_formula=True,
                       tip_ok=None, structural=None):
    """
    accepted: lista de conjuntos de funciones; basta con que la fórmula tenga
              TODAS las de alguno de los conjuntos. None = cualquier fórmula.
    partial:  igual que accepted, pero si se cumple solo esto vale medio punto.
    structural(formula) -> bool: si Excel no dejó valor calculado, se usa para
              decidir si la estructura está bien (queda como 'sin verificar').
    """
    coord = f"{_col(c)}{r}"
    f = sh.formula(r, c)
    v = sh.value(r, c)
    raw = sh.raw(r, c)

    if f is None and (raw is None or (isinstance(raw, str) and not raw.strip())):
        return item(label, "fail", M("Celda vacía.", "Empty cell."), coord, None, expected)

    if f is None and need_formula and isinstance(raw, str) and raw.strip().startswith("="):
        return item(label, "fail",
                    M("La fórmula quedó escrita como texto: la celda está en formato Texto o empieza con un "
                      "apóstrofo. Ponla en formato General y vuelve a escribirla.",
                      "The formula was entered as text: the cell is formatted as Text or starts with an "
                      "apostrophe. Set it to General and type it again."),
                    coord, raw, expected)

    if f is None and need_formula:
        right = compare(raw, expected)
        return item(label, "fail",
                    M("Escribiste el resultado a mano" + (" (el número está bien)" if right else "") +
                      ". El ejercicio pide una fórmula, para que se actualice sola si cambian los datos.",
                      "You typed the result by hand" + (" (the number is right)" if right else "") +
                      ". The exercise asks for a formula so it updates when the data changes."),
                    coord, raw, expected)

    used = funcs_in(f) if f else set()
    uses_accepted = accepted is None or any(s <= used for s in accepted)
    uses_partial = bool(partial) and any(s <= used for s in partial)

    if v is None:
        # Excel no dejó el resultado calculado (archivo no guardado desde Excel)
        ok_struct = structural(f) if (structural and f) else uses_accepted
        return item(label, "unverified",
                    M("No pudimos ver el resultado: abre el archivo en Excel, guárdalo y vuelve a subirlo." +
                      ("" if ok_struct else " Además, revisa la función que usaste."),
                      "We couldn't see the result: open the file in Excel, save it and upload it again." +
                      ("" if ok_struct else " Also double-check the function you used.")),
                    coord, None, expected)

    if isinstance(v, str) and v.strip().upper() in ERRORS:
        err = v.strip().upper()
        es, en = ERROR_HELP.get(err, ("La fórmula devuelve un error.", "The formula returns an error."))
        return item(label, "fail", M(f"{err}: {es}", f"{err}: {en}"), coord, v, expected)

    if not compare(v, expected):
        hint = None
        if accepted and not uses_accepted:
            hint = _func_hint(accepted)
        return item(label, "fail",
                    M("El resultado no coincide." + (f" {hint['es']}" if hint else ""),
                      "The result doesn't match." + (f" {hint['en']}" if hint else "")),
                    coord, v, expected)

    if not uses_accepted:
        if uses_partial:
            h = _func_hint(accepted)
            return item(label, "partial",
                        M("El resultado está bien, pero " + h["es"][0].lower() + h["es"][1:],
                          "The result is right, but " + h["en"][0].lower() + h["en"][1:]),
                        coord, v, expected)
        h = _func_hint(accepted)
        return item(label, "partial",
                    M("El resultado está bien, pero no con la técnica que pide el ejercicio. " + h["es"],
                      "The result is right, but not with the technique the exercise asks for. " + h["en"]),
                    coord, v, expected)

    return item(label, "ok", tip_ok(used) if tip_ok else None, coord, v, expected)


def _func_hint(accepted):
    names = [" + ".join(sorted(s)) for s in accepted[:2]]
    return M("Usa " + " o ".join(names) + ".", "Use " + " or ".join(names) + ".")


def _col(c):
    s = ""
    while c:
        c, rem = divmod(c - 1, 26)
        s = chr(65 + rem) + s
    return s


def pick_answer_col(sh, r, primary, exclude=(), max_col=16):
    """Columna donde está la respuesta: la amarilla, o si está vacía, la primera
    celda con fórmula en esa fila (el alumno a veces escribe al lado)."""
    if not sh.is_blank(r, primary):
        return primary
    for c in range(2, max_col + 1):
        if c == primary or c in exclude:
            continue
        if sh.formula(r, c):
            return c
    return primary


# ── Ubicar la hoja de práctica ────────────────────────────────────────────────

def find_practice_sheet(book: Book, level_num: int):
    titles = book.wf.sheetnames
    for t in titles:
        n = norm(t)
        if n.startswith("practica") or n.startswith("practice"):
            return t, None
    for t in titles:
        sh = book.sheet(t)
        if sh.find_row([f"practica nivel {level_num}", f"level {level_num} practice"], 1, 12):
            return t, None
    if len(titles) == 1:
        return titles[0], None
    return titles[0], M("No encontramos la hoja de práctica por su nombre; evaluamos la primera hoja.",
                        "We couldn't find the practice sheet by name; we graded the first sheet.")


# ── Lectura de tablas de datos ───────────────────────────────────────────────

def locate(sh, prefixes, orig_row, start=1):
    """Fila real de un rótulo; si no aparece, la original."""
    r = sh.find_row(prefixes, start)
    return (r, r - orig_row) if r else (orig_row, 0)


# ══════════════════════════════════════════════════════════════════════════════
# NIVEL 0
# ══════════════════════════════════════════════════════════════════════════════

TYPE_SYNONYMS = {
    "texto": {"texto", "text", "cadena", "string", "txt", "alfanumerico", "alphanumeric"},
    "numero": {"numero", "number", "numerico", "numeric", "num", "entero", "decimal",
               "integer", "int", "float", "nro"},
    "fecha": {"fecha", "date", "datetime"},
    "booleano": {"booleano", "boolean", "bool", "logico", "logical", "verdadero falso", "true false"},
    "error": {"error", "err"},
    "formula": {"formula", "formulas"},
}
TYPE_LABEL = {"texto": ("Texto", "Text"), "numero": ("Número", "Number"), "fecha": ("Fecha", "Date"),
              "booleano": ("Booleano", "Boolean"), "error": ("Error", "Error")}


def classify_type_answer(ans):
    a = norm(ans)
    if not a:
        return set()
    found = set()
    for key, syns in TYPE_SYNONYMS.items():
        for s in syns:
            if re.search(rf"(^|\s){re.escape(s)}($|\s)", a):
                found.add(key)
    return found


def grade_nivel0(book, sh, lang):
    exercises, warnings = [], []

    # Ejercicio 1: formato de tabla de contactos
    r1, d = locate(sh, ["ejercicio 1", "exercise 1"], 4)
    hdr = r1 + 2
    items = []
    covered = False
    for t in sh.f.tables.values():
        ref = t.ref if hasattr(t, "ref") else t
        if _range_contains(ref, hdr, 1):
            covered = True
    if not covered and sh.f.auto_filter and sh.f.auto_filter.ref and _range_contains(sh.f.auto_filter.ref, hdr, 1):
        covered = True
    items.append(item(M("Formato de tabla aplicado", "Table format applied"),
                      "ok" if covered else "fail",
                      None if covered else M("Selecciona la tabla y usa Inicio → Dar formato como tabla (Ctrl + T).",
                                             "Select the table and use Home → Format as Table (Ctrl + T)."),
                      f"A{hdr}"))
    orig_w = {"A": 32, "B": 28, "C": 20, "D": 18, "E": 20}
    changed = any(abs((sh.f.column_dimensions[k].width or v) - v) >= 0.5 for k, v in orig_w.items())
    items.append(item(M("Ancho de columnas ajustado", "Column widths adjusted"),
                      "ok" if changed else "fail",
                      None if changed else M("Ajusta el ancho: doble clic en el borde del encabezado de columna (autoajustar).",
                                             "Adjust widths: double-click the column header border (AutoFit)."),
                      "A:E"))
    exercises.append({"title": M("Ejercicio 1 — Formato de tabla", "Exercise 1 — Table formatting"), "items": items})

    # Ejercicio 2: tipos de datos
    r2, _ = locate(sh, ["ejercicio 2", "exercise 2"], 14)
    expected = ["texto", "numero", "numero", "fecha", "booleano", "error", "texto", "numero"]
    also_ok = {7: {"formula"}}
    items = []
    for i, exp in enumerate(expected):
        r = r2 + 3 + i
        shown = sh.raw(r, 1)
        shown_txt = formula_text(shown) or (str(shown) if shown is not None else "")
        label = M(f"Tipo de «{shown_txt}»", f"Type of “{shown_txt}”")
        ans = sh.value(r, 2)
        if ans is None:
            ans = sh.raw(r, 2)
        found = classify_type_answer(ans)
        ok_set = {exp} | also_ok.get(i, set())
        es_l, en_l = TYPE_LABEL[exp]
        if not found:
            st, msg = "fail", (M("Celda vacía.", "Empty cell.") if not norm(ans) else
                               M("No reconocemos ese tipo. Usa Texto, Número, Fecha, Booleano o Error.",
                                 "We don't recognize that type. Use Text, Number, Date, Boolean or Error."))
        elif len(found) > 1 and not found <= ok_set:
            st, msg = "fail", M("Escribe un solo tipo.", "Write a single type.")
        elif found & ok_set:
            st, msg = "ok", None
        else:
            st, msg = "fail", M(f"La respuesta es {es_l}.", f"The answer is {en_l}.")
        items.append(item(label, st, msg, f"B{r}", ans, es_l if lang == "es" else en_l))
    exercises.append({"title": M("Ejercicio 2 — Tipos de datos", "Exercise 2 — Data types"), "items": items})

    exercises.append({"title": M("Ejercicio 3 — Atajos de teclado", "Exercise 3 — Keyboard shortcuts"),
                      "items": [], "note": M("Se practica con el teclado; no se evalúa en el archivo.",
                                             "Practiced on the keyboard; not graded from the file.")})
    return exercises, warnings


def _range_contains(ref, r, c):
    from openpyxl.utils.cell import range_boundaries
    try:
        c1, r1, c2, r2 = range_boundaries(str(ref).replace("$", "").split("!")[-1])
    except Exception:
        return False
    return r1 <= r <= r2 and c1 <= c <= c2


# ══════════════════════════════════════════════════════════════════════════════
# NIVEL 1
# ══════════════════════════════════════════════════════════════════════════════

L1_ORIG = [(3, 850), (8, 45), (2, 320), (5, 120), (4, 850), (6, 75), (3, 320), (12, 45), (2, 280), (5, 850)]


def _read_rows(sh, hdr, ncols, max_rows=60):
    rows = []
    for r in range(hdr + 1, hdr + 1 + max_rows):
        if sh.is_blank(r, 1):
            break
        rows.append((r, [sh.value(r, c) if sh.value(r, c) is not None else sh.raw(r, c)
                         for c in range(1, ncols + 1)]))
    return rows


def grade_nivel1(book, sh, lang):
    exercises, warnings = [], []
    hdr, _ = locate(sh, ["mes", "month"], 5)
    rows = _read_rows(sh, hdr, 7)
    totals, row_of = [], {}
    for r, vals in rows:
        u, p = to_num(vals[4]), to_num(vals[5])
        if u is not None and p is not None:
            totals.append(u * p)
            row_of[r] = u * p
    if len(totals) != len(L1_ORIG) or any(not num_eq(a, u * p) for a, (u, p) in zip(totals, L1_ORIG)):
        warnings.append(M("Cambiaste datos de la tabla original: te evaluamos con tus datos.",
                          "You changed the original data: we graded against your data."))
    if not totals:
        totals = [u * p for u, p in L1_ORIG]

    # Ejercicio 1
    r1, _ = locate(sh, ["ejercicio 1", "exercise 1"], 18)
    s = sum(totals)
    specs = [
        (("total de todas", "total of all"), M("Total de ventas", "Total sales"), s, [{"SUM"}, {"SUBTOTAL"}, {"AGGREGATE"}, {"SUMPRODUCT"}]),
        (("promedio", "average"), M("Promedio por transacción", "Average per transaction"), s / len(totals),
         [{"AVERAGE"}, {"SUM", "COUNT"}, {"SUM", "COUNTA"}, {"SUBTOTAL"}, {"AGGREGATE"}]),
        (("numero de", "number of"), M("Número de transacciones", "Number of transactions"), len(totals),
         [{"COUNT"}, {"COUNTA"}, {"ROWS"}, {"SUBTOTAL"}]),
        (("venta mas alta", "highest"), M("Venta más alta", "Highest sale"), max(totals), [{"MAX"}, {"LARGE"}, {"AGGREGATE"}, {"MAXIFS"}]),
        (("venta mas baja", "lowest"), M("Venta más baja", "Lowest sale"), min(totals), [{"MIN"}, {"SMALL"}, {"AGGREGATE"}, {"MINIFS"}]),
        (("total redondeado", "total rounded"), M("Total redondeado a decena", "Total rounded to the nearest ten"),
         excel_round(s, -1), [{"ROUND"}, {"MROUND"}]),
    ]
    items = []
    for i, (labels, label, exp, acc) in enumerate(specs):
        r = sh.find_row(labels, r1, r1 + 20, cols=(1,)) or (r1 + 3 + i)
        c = pick_answer_col(sh, r, 2, exclude=(3,))
        items.append(check_formula_cell(sh, r, c, label, exp, accepted=acc))
    exercises.append({"title": M("Ejercicio 1 — Totales y estadísticas", "Exercise 1 — Totals and statistics"), "items": items})

    # Ejercicio 2: comisión con IF (las celdas amarillas son C; la instrucción
    # vieja decía "columna H", así que también se acepta junto a los datos)
    r2, _ = locate(sh, ["ejercicio 2", "exercise 2"], 29)
    items = []
    data_rows = [r for r, _ in rows][:10] or list(range(6, 16))
    for i, drow in enumerate(data_rows):
        r = r2 + 3 + i
        g = row_of.get(drow, totals[i] if i < len(totals) else 0)
        exp = g * 0.05 if g > 2000 else g * 0.02
        label = M(f"Comisión fila {drow}", f"Commission row {drow}")
        if sh.is_blank(r, 3) and not sh.is_blank(drow, 8):
            r_use, c_use = drow, 8
        else:
            r_use, c_use = r, pick_answer_col(sh, r, 3, exclude=(2, 4))
        items.append(check_formula_cell(sh, r_use, c_use, label, exp, accepted=[{"IF"}, {"IFS"}]))
    exercises.append({"title": M("Ejercicio 2 — Comisión con IF", "Exercise 2 — Commission with IF"), "items": items})
    return exercises, warnings


# ══════════════════════════════════════════════════════════════════════════════
# NIVEL 2
# ══════════════════════════════════════════════════════════════════════════════

L2_ORIG = [("ventas", 4500), ("ti", 3800), ("marketing", 2900), ("ventas", 2200),
           ("ti", 5200), ("rrhh", 3100), ("finanzas", 3600), ("ventas", 2100)]
L2_ORIG_EN = ["sales", "it", "marketing", "sales", "it", "hr", "finance", "sales"]


def grade_nivel2(book, sh, lang):
    exercises, warnings = [], []
    hdr, _ = locate(sh, ["id"], 5)
    rows = _read_rows(sh, hdr, 8)
    emp = [(norm(v[2]), to_num(v[4])) for _, v in rows if to_num(v[4]) is not None]
    orig_es = [(d, s) for d, s in L2_ORIG]
    orig_en = [(d, s) for d, (_, s) in zip(L2_ORIG_EN, L2_ORIG)]
    if emp != orig_es and emp != orig_en:
        warnings.append(M("Cambiaste datos de la tabla original: te evaluamos con tus datos.",
                          "You changed the original data: we graded against your data."))
    if not emp:
        emp = orig_es

    # Ejercicio 1: SUMIFS por departamento
    r1, _ = locate(sh, ["ejercicio 1", "exercise 1"], 16)
    items = []
    for i in range(4):
        r = r1 + 3 + i
        dept_raw = sh.value(r, 1) or sh.raw(r, 1)
        dept = norm(dept_raw)
        exp = sum(s for d, s in emp if d == dept)
        c = pick_answer_col(sh, r, 2, exclude=(3, 4))
        items.append(check_formula_cell(
            sh, r, c, M(f"Total salarios {dept_raw}", f"Total salaries {dept_raw}"), exp,
            accepted=[{"SUMIFS"}], partial=[{"SUMIF"}, {"SUMPRODUCT"}, {"DSUM"}, {"FILTER", "SUM"}]))
    exercises.append({"title": M("Ejercicio 1 — SUMIFS por departamento", "Exercise 1 — SUMIFS by department"), "items": items})

    # Ejercicio 2: email corporativo
    r2, _ = locate(sh, ["ejercicio 2", "exercise 2"], 25)
    items = []

    def email_eq(got, exp_local):
        if not isinstance(got, str) or got.strip() != got.strip().lower():
            return False  # el ejercicio pide todo en minúsculas
        g = norm(got).replace(" ", "")
        return g in (exp_local + "@empresa.com", exp_local + "@company.com")

    for i in range(5):
        r = r2 + 3 + i
        name = str(sh.value(r, 1) or sh.raw(r, 1) or "").strip()
        parts = name.split(" ", 1)
        local = norm(parts[0][:1] + (parts[1] if len(parts) > 1 else "")).replace(" ", "")
        domain = "@empresa.com" if lang == "es" else "@company.com"
        c = pick_answer_col(sh, r, 2, exclude=(3,))
        items.append(check_formula_cell(
            sh, r, c, M(f"Email de {name}", f"Email for {name}"), local + domain,
            compare=lambda got, _e, _l=local: email_eq(got, _l)))
    exercises.append({"title": M("Ejercicio 2 — Funciones de texto", "Exercise 2 — Text functions"), "items": items})
    return exercises, warnings


# ══════════════════════════════════════════════════════════════════════════════
# NIVEL 3
# ══════════════════════════════════════════════════════════════════════════════

LOOKUP_SETS = [{"XLOOKUP"}, {"INDEX", "MATCH"}, {"INDEX", "XMATCH"}, {"VLOOKUP"}, {"LOOKUP"}, {"FILTER"}]


def _text_or_num_eq(got, exp):
    if to_num(exp) is not None and not isinstance(exp, str):
        return num_eq(got, exp)
    return norm(got) == norm(exp)


def grade_nivel3(book, sh, lang):
    exercises, warnings = [], []
    hdr, _ = locate(sh, ["codigo", "code"], 5)
    rows = _read_rows(sh, hdr, 8)
    records = {norm(v[0]): v for _, v in rows}

    # Ejercicio 1: buscador
    r1, _ = locate(sh, ["ejercicio 1", "exercise 1"], 18)
    rq = sh.find_row(["codigo a buscar", "code to look up"], r1, r1 + 6) or (r1 + 2)
    code = sh.value(rq, 3) or sh.raw(rq, 3)
    rec = records.get(norm(code))
    field_idx = [1, 2, 3, 4, 5, 7]
    labels = [M("Descripción", "Description"), M("Categoría", "Category"), M("Costo", "Cost"),
              M("PVP", "Retail price"), M("Stock", "Stock"), M("Estado", "Status")]
    items = []
    for i, (fi, label) in enumerate(zip(field_idx, labels)):
        r = r1 + 5 + i
        c = pick_answer_col(sh, r, 3, exclude=(2,))
        if rec is None:
            exp = "No encontrado" if lang == "es" else "Not found"
            cmp_ = lambda got, e: isinstance(got, str)  # texto "no encontrado" o #N/A manejado abajo
        else:
            exp = rec[fi]
            cmp_ = _text_or_num_eq
        res = check_formula_cell(sh, r, c, label, exp, compare=cmp_, accepted=LOOKUP_SETS)
        f = sh.formula(r, c)
        if res["status"] == "partial" and f and not funcs_in(f):
            res["msg"] = M("El resultado está bien, pero es una referencia directa: si cambias el código en "
                           f"C{rq} no se actualiza. Usa XLOOKUP o INDEX/MATCH.",
                           "The result is right, but it's a direct reference: it won't update if you change the "
                           f"code in C{rq}. Use XLOOKUP or INDEX/MATCH.")
        items.append(res)
    exercises.append({"title": M("Ejercicio 1 — Buscador con XLOOKUP", "Exercise 1 — XLOOKUP finder"), "items": items})

    # Ejercicio 2: FILTER de stock bajo
    r2, _ = locate(sh, ["ejercicio 2", "exercise 2"], 31)
    ref_row = sh.find_row(["respuesta", "answer"], r2, r2 + 15, cols=(1,))
    low = [v for _, v in rows if to_num(v[5]) is not None and to_num(v[6]) is not None
           and to_num(v[5]) < to_num(v[6])]
    cand = None
    for r in range(r2 + 1, min(sh.f.max_row, r2 + 40) + 1):
        if r == ref_row:
            continue
        for c in range(1, 12):
            f = sh.formula(r, c)
            if f and "FILTER" in funcs_in(f):
                cand = (r, c)
                break
        if cand:
            break
    label = M("Productos bajo el stock mínimo", "Products below minimum stock")
    if not cand:
        r, c = r2 + 2, 2
        st = "fail"
        msg = (M("Celda vacía.", "Empty cell.") if sh.is_blank(r, c) else
               M("No encontramos una fórmula con FILTER.", "We couldn't find a formula using FILTER."))
        items = [item(label, st, msg, f"B{r}")]
    else:
        r, c = cand
        items = [_grade_filter(sh, r, c, label, low)]
    exercises.append({"title": M("Ejercicio 2 — FILTER", "Exercise 2 — FILTER"), "items": items})
    return exercises, warnings


def _grade_filter(sh, r, c, label, low):
    coord = f"{_col(c)}{r}"
    f = sh.formula(r, c)
    v = sh.value(r, c)
    struct_ok = bool(re.search(r"F\$?\d+:\$?F\$?\d+\s*<\s*\$?G\$?\d+:\$?G\$?\d+", f.upper().replace(" ", ""))) or \
        bool(re.search(r"G\$?\d+:\$?G\$?\d+\s*>\s*\$?F\$?\d+:\$?F\$?\d+", f.upper().replace(" ", "")))
    if v is None:
        return item(label, "unverified",
                    M("No pudimos ver el resultado: abre el archivo en Excel, guárdalo y vuelve a subirlo.",
                      "We couldn't see the result: open the file in Excel, save it and upload it again."), coord)
    if isinstance(v, str) and v.strip().upper() == "#SPILL!":
        if struct_ok:
            return item(label, "ok",
                        M("Tu fórmula está bien; el #SPILL! fue porque la respuesta de referencia le quitaba espacio "
                          "(ya lo corregimos en el archivo nuevo).",
                          "Your formula is right; the #SPILL! happened because the reference answer was in the way "
                          "(fixed in the new file)."), coord)
        es, en = ERROR_HELP["#SPILL!"]
        return item(label, "fail", M("#SPILL!: " + es, "#SPILL!: " + en), coord, v)
    if isinstance(v, str) and v.strip().upper() in ERRORS:
        err = v.strip().upper()
        es, en = ERROR_HELP.get(err, ("La fórmula devuelve un error.", "The formula returns an error."))
        return item(label, "fail", M(f"{err}: {es}", f"{err}: {en}"), coord, v)
    # Leer el bloque desbordado: tantas filas como productos esperados
    got_first = [sh.value(r + k, c) for k in range(len(low) + 1)]
    # ¿qué columna de los datos devolvió? la que coincida con el primer valor
    if not low:
        ok = isinstance(v, str)
        return item(label, "ok" if ok else "fail", None, coord, v)
    col_match = None
    for j in range(8):
        if _text_or_num_eq(got_first[0], low[0][j]):
            col_match = j
            break
    if col_match is None:
        return item(label, "fail",
                    M("El resultado no son los productos con Stock < Mín Stock.",
                      "The result isn't the products with Stock < Min Stock."), coord, v,
                    ", ".join(str(x[0]) for x in low))
    expected_vals = [x[col_match] for x in low]
    got_vals = got_first[:len(low)]
    extra = got_first[len(low)]
    if all(_text_or_num_eq(g, e) for g, e in zip(got_vals, expected_vals)) and extra in (None, ""):
        return item(label, "ok", None, coord, ", ".join(map(str, got_vals)), ", ".join(map(str, expected_vals)))
    return item(label, "fail",
                M("La lista filtrada no coincide: revisa la condición (Stock < Mín Stock).",
                  "The filtered list doesn't match: check the condition (Stock < Min Stock)."),
                coord, ", ".join(str(g) for g in got_vals if g is not None), ", ".join(map(str, expected_vals)))


# ══════════════════════════════════════════════════════════════════════════════
# NIVEL 4
# ══════════════════════════════════════════════════════════════════════════════

L4_LAMBDAS = [
    (("iva", "tax"), M("LAMBDA IVA", "TAX LAMBDA")),
    (("precio_final", "final_price"), M("LAMBDA PRECIO_FINAL", "FINAL_PRICE LAMBDA")),
    (("dias_habiles", "workdays"), M("LAMBDA DIAS_HABILES", "WORKDAYS LAMBDA")),
    (("categorizar", "grade"), M("LAMBDA CATEGORIZAR", "GRADE LAMBDA")),
]
L4_CLIENTS = [8500, 3200, 1800, 6100, 2900]


def _defined_names(book):
    out = {}
    try:
        for name, dn in book.wf.defined_names.items():
            out[name.lower()] = str(dn.attr_text or "")
    except Exception:
        pass
    for ws in book.wf.worksheets:
        try:
            for name, dn in ws.defined_names.items():
                out[name.lower()] = str(dn.attr_text or "")
        except Exception:
            pass
    return out


def grade_nivel4(book, sh, lang):
    exercises, warnings = [], []

    # Desafío 1: LAMBDAs en el Administrador de nombres
    names = _defined_names(book)
    items = []
    for variants, label in L4_LAMBDAS:
        found = next((names[v] for v in variants if v in names), None)
        if found is None:
            items.append(item(label, "fail",
                              M(f"No encontramos el nombre {variants[0].upper()} en Fórmulas → Administrador de nombres.",
                                f"We couldn't find the name {variants[1].upper()} in Formulas → Name Manager."), None))
        elif "LAMBDA(" not in found.upper().replace("_XLFN.", ""):
            items.append(item(label, "fail", M("El nombre existe pero no está definido con LAMBDA.",
                                               "The name exists but isn't defined with LAMBDA."), None))
        else:
            items.append(item(label, "ok", None, None))
    exercises.append({"title": M("Desafío 1 — Funciones LAMBDA", "Challenge 1 — LAMBDA functions"), "items": items})

    # Desafío 2: dashboard (se detectan los elementos en el archivo)
    formulas = [f for _, _, f in book.all_formulas()]
    fsets = [funcs_in(f) for f in formulas]
    xml = "\n".join(book.sheet_xml.values())
    has_pivot = any(n.startswith("xl/pivotTables/") for n in book.zip_names)
    has_scale = "colorScale" in xml
    has_slicer = any(n.startswith("xl/slicers/") or n.startswith("xl/slicerCaches/") or n.startswith("xl/timelines/")
                     for n in book.zip_names)
    has_spark = "sparklineGroup" in xml
    top3 = any((s & {"SORT", "SORTBY", "LARGE", "TAKE"}) and (s & {"UNIQUE", "SUMIFS", "SUMIF"}) for s in fsets)
    alert = any("IF" in s and (s & {"SUM", "SUMIFS", "SUMIF"}) for s in fsets)

    def yes_no(ok, label, how):
        return item(label, "ok" if ok else "fail", None if ok else how)

    items = [
        yes_no(top3, M("Top 3 productos (SORT + UNIQUE + SUMIFS)", "Top 3 products (SORT + UNIQUE + SUMIFS)"),
               M("No encontramos una fórmula que combine SORT/LARGE con UNIQUE/SUMIFS.",
                 "We couldn't find a formula combining SORT/LARGE with UNIQUE/SUMIFS.")),
        item(M("Mapa de calor (tabla dinámica + escala de color)", "Heat map (PivotTable + color scale)"),
             "ok" if (has_pivot and has_scale) else ("partial" if (has_pivot or has_scale) else "fail"),
             None if (has_pivot and has_scale) else
             M(("Falta la tabla dinámica. " if not has_pivot else "") +
               ("Falta la escala de color (Formato condicional → Escalas de color)." if not has_scale else ""),
               ("PivotTable missing. " if not has_pivot else "") +
               ("Color scale missing (Conditional Formatting → Color Scales)." if not has_scale else ""))),
        yes_no(alert, M("Alerta de meta (IF + SUM)", "Goal alert (IF + SUM)"),
               M("No encontramos una fórmula IF con SUM para la alerta.",
                 "We couldn't find an IF formula with SUM for the alert.")),
        yes_no(has_spark, M("Minigráficos (sparklines)", "Sparklines"),
               M("No encontramos minigráficos: Insertar → Minigráficos → Línea.",
                 "No sparklines found: Insert → Sparklines → Line.")),
        yes_no(has_slicer, M("Segmentador de datos", "Slicer"),
               M("No encontramos un segmentador: Tabla dinámica → Analizar → Insertar segmentador.",
                 "No slicer found: PivotTable Analyze → Insert Slicer.")),
    ]
    exercises.append({"title": M("Desafío 2 — Dashboard", "Challenge 2 — Dashboard"), "items": items,
                      "note": M("Puedes construirlo en una hoja nueva de este mismo archivo.",
                                "You can build it on a new sheet in this same file.")})

    # Desafío 3: clasificación de clientes
    r3, _ = locate(sh, ["desafio 3", "challenge 3"], 23)
    items = []

    def letter_of(v):
        m = re.findall(r"(?:^|\s)([abc])(?:$|\s)", norm(v))
        return m[-1] if m else None

    for i in range(5):
        r = r3 + 3 + i
        client = sh.value(r, 1) or sh.raw(r, 1)
        total = to_num(sh.value(r, 2))
        if total is None:
            total = L4_CLIENTS[i]
        exp_letter = "a" if total > 5000 else ("b" if total >= 2000 else "c")
        exp_txt = ("Cliente " if lang == "es" else "Customer ") + exp_letter.upper()
        c = pick_answer_col(sh, r, 3, exclude=(4,))
        items.append(check_formula_cell(
            sh, r, c, M(f"Categoría de {client}", f"Category for {client}"), exp_txt,
            compare=lambda got, _e, _x=exp_letter: letter_of(got) == _x,
            accepted=[{"IFS"}, {"IF"}, {"SWITCH"}, {"XLOOKUP"}, {"LOOKUP"}, {"CHOOSE"}]))
    exercises.append({"title": M("Desafío 3 — Clasificar clientes", "Challenge 3 — Classify customers"), "items": items})
    return exercises, warnings


# ══════════════════════════════════════════════════════════════════════════════
# API
# ══════════════════════════════════════════════════════════════════════════════

_LEVEL_GRADERS = {"nivel0": grade_nivel0, "nivel1": grade_nivel1, "nivel2": grade_nivel2,
                  "nivel3": grade_nivel3, "nivel4": grade_nivel4}

POINTS = {"ok": 1.0, "partial": 0.5, "fail": 0.0, "unverified": 0.0}


def _fatal(status, msg):
    return {"version": GRADER_VERSION, "status": status, "score": None, "passed": False,
            "points": 0, "total": 0, "exercises": [], "warnings": [msg]}


def grade_practice(file_bytes: bytes, level_key: str, filename: str = "", lang: str = "es") -> dict:
    """Corrige una práctica. Nunca lanza excepción: si algo falla, lo dice en el resultado."""
    if level_key not in _LEVEL_GRADERS:
        return _fatal("unsupported", M("Esta entrega no tiene corrector automático.",
                                       "This submission has no automatic grader."))
    if filename.lower().endswith(".xls"):
        return _fatal("unreadable", M("El formato .xls es muy antiguo para corregirlo automáticamente: "
                                      "guárdalo como .xlsx y vuelve a subirlo.",
                                      "The .xls format is too old to grade automatically: save it as .xlsx "
                                      "and upload it again."))
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            if sum(i.file_size for i in z.infolist()) > MAX_UNCOMPRESSED:
                return _fatal("unreadable", M("El archivo es demasiado grande para corregirlo automáticamente.",
                                              "The file is too large to grade automatically."))
        book = Book(file_bytes)
    except Exception:
        return _fatal("unreadable", M("No pudimos abrir el archivo. ¿Es un Excel válido (.xlsx)?",
                                      "We couldn't open the file. Is it a valid Excel file (.xlsx)?"))

    level_num = int(level_key[-1])
    try:
        title, warn = find_practice_sheet(book, level_num)
        sh = book.sheet(title)
        if sh.find_row(["ejercicio 1", "exercise 1", "desafio 1", "challenge 1"]) is None:
            return _fatal("wrong_file", M(f"Este archivo no parece la práctica del Nivel {level_num}. "
                                          "Descárgala desde el curso y complétala ahí.",
                                          f"This file doesn't look like the Level {level_num} practice. "
                                          "Download it from the course and complete it there."))
        exercises, warnings = _LEVEL_GRADERS[level_key](book, sh, lang)
        if warn:
            warnings.insert(0, warn)
    except Exception:
        return _fatal("error", M("El corrector automático no pudo revisar este archivo; el instructor lo revisará.",
                                 "The automatic grader couldn't check this file; the instructor will review it."))

    all_items = [it for ex in exercises for it in ex["items"]]
    total = len(all_items)
    points = sum(POINTS[it["status"]] for it in all_items)
    unverified = sum(1 for it in all_items if it["status"] == "unverified")
    if unverified:
        warnings.append(M(f"{unverified} respuesta(s) sin resultado calculado: abre el archivo en Excel, "
                          "guárdalo (Ctrl + S) y vuelve a subirlo.",
                          f"{unverified} answer(s) have no calculated result: open the file in Excel, "
                          "save it (Ctrl + S) and upload it again."))
    score = round(points / total * 100) if total else None
    return {
        "version": GRADER_VERSION,
        "status": "graded" if total else "empty",
        "score": score,
        "passed": score is not None and score >= PASS_PERCENT,
        "points": points,
        "total": total,
        "sheet": title,
        "exercises": exercises,
        "warnings": warnings,
    }
