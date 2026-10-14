# app/python/excel_generator_en.py
"""
English edition of excel_generator.py.
Generates comprehensive Excel practice/example files for each course level,
with all learner-visible text in US English.
The `lang` param only switches formula function names (es/en).
"""

import io
from openpyxl import Workbook
from openpyxl.styles import (
    PatternFill, Font, Alignment, Border, Side, GradientFill
)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import ColorScaleRule, CellIsRule, FormulaRule
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.chart.series import SeriesLabel

# ── Formula name maps ─────────────────────────────────────────────────────────

import re

FORMULAS = {
    "es": {
        "SUM":        "SUMA",
        "IF":         "SI",
        "IFERROR":    "SI.ERROR",
        "IFS":        "SI.CONJUNTO",
        "AND":        "Y",
        "OR":         "O",
        "NOT":        "NO",
        "VLOOKUP":    "BUSCARV",
        "HLOOKUP":    "BUSCARH",
        "XLOOKUP":    "BUSCARX",
        "INDEX":      "INDICE",
        "MATCH":      "COINCIDIR",
        "COUNTIF":    "CONTAR.SI",
        "COUNTIFS":   "CONTAR.SI.CONJUNTO",
        "SUMIF":      "SUMAR.SI",
        "SUMIFS":     "SUMAR.SI.CONJUNTO",
        "AVERAGEIF":  "PROMEDIO.SI",
        "AVERAGEIFS": "PROMEDIO.SI.CONJUNTO",
        "COUNT":      "CONTAR",
        "COUNTA":     "CONTARA",
        "AVERAGE":    "PROMEDIO",
        "MAX":        "MAX",
        "MIN":        "MIN",
        "LEFT":       "IZQUIERDA",
        "RIGHT":      "DERECHA",
        "MID":        "EXTRAE",
        "LEN":        "LARGO",
        "TRIM":       "ESPACIOS",
        "UPPER":      "MAYUSC",
        "LOWER":      "MINUSC",
        "PROPER":     "NOMPROPIO",
        "CONCATENATE":"CONCATENAR",
        "TEXT":       "TEXTO",
        "VALUE":      "VALOR",
        "DATE":       "FECHA",
        "TODAY":      "HOY",
        "NOW":        "AHORA",
        "YEAR":       "AÑO",
        "MONTH":      "MES",
        "DAY":        "DIA",
        "DATEDIF":    "SIFECHA",
        "NETWORKDAYS":"DIAS.LAB",
        "EOMONTH":    "FIN.MES",
        "FILTER":     "FILTRAR",
        "SORT":       "ORDENAR",
        "UNIQUE":     "UNICOS",
        "INDIRECT":   "INDIRECTO",
        "OFFSET":     "DESREF",
        "ROWS":       "FILAS",
        "COLUMNS":    "COLUMNAS",
        "ROUND":      "REDONDEAR",
        "INT":        "ENTERO",
        "ABS":        "ABS",
        "SQRT":       "RAIZ",
        "POWER":      "POTENCIA",
        "MOD":        "RESIDUO",
        "FIND":       "ENCONTRAR",
        "SEARCH":     "HALLAR",
        "SUBSTITUTE": "SUSTITUIR",
        "REPLACE":    "REEMPLAZAR",
        "REPT":       "REPETIR",
        "EXACT":      "IGUAL",
        "TRANSPOSE":  "TRANSPONER",
        "LARGE":      "K.ESIMO.MAYOR",
        "SMALL":      "K.ESIMO.MENOR",
        "RANK":       "JERARQUIA",
        "ISBLANK":    "ESBLANCO",
        "ISNUMBER":   "ESNUMERO",
        "ISTEXT":     "ESTEXTO",
        "ISERROR":    "ESERROR",
    },
    "en": {
        k: k for k in [
            "SUM","IF","IFERROR","IFS","AND","OR","NOT","VLOOKUP","HLOOKUP",
            "XLOOKUP","INDEX","MATCH","COUNTIF","COUNTIFS","SUMIF","SUMIFS",
            "AVERAGEIF","AVERAGEIFS","COUNT","COUNTA","AVERAGE","MAX","MIN",
            "LEFT","RIGHT","MID","LEN","TRIM","UPPER","LOWER","PROPER",
            "CONCATENATE","TEXT","VALUE","DATE","TODAY","NOW","YEAR","MONTH",
            "DAY","DATEDIF","NETWORKDAYS","EOMONTH","FILTER","SORT","UNIQUE",
            "INDIRECT","OFFSET","ROWS","COLUMNS","ROUND","INT","ABS","SQRT",
            "POWER","MOD","FIND","SEARCH","SUBSTITUTE","REPLACE","REPT",
            "EXACT","TRANSPOSE","LARGE","SMALL","RANK","ISBLANK","ISNUMBER",
            "ISTEXT","ISERROR",
        ]
    }
}


# ── Fórmulas SIEMPRE en inglés dentro del archivo ────────────────────────────
# Un .xlsx guarda las fórmulas en inglés; Excel las traduce al idioma de cada
# usuario al abrirlo. Si se escribe "=SUMA(...)" en el archivo, Excel (incluso
# en español) muestra #¿NOMBRE?. Por eso las celdas con fórmula se pasan a
# inglés al final; los TEXTOS de instrucciones sí nombran las funciones en el
# idioma elegido (con f()).

_ES_TO_EN = {es.upper(): en for en, es in FORMULAS["es"].items()}
_FUNC_TOKEN = re.compile(r'"[^"]*"|(?<![A-Za-z0-9_.])([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ0-9_.]*)(?=\()')


def to_english_formula(formula: str) -> str:
    def sub(m):
        if m.group(1) is None:  # texto entre comillas: no se toca
            return m.group(0)
        return _ES_TO_EN.get(m.group(1).upper(), m.group(1))
    return _FUNC_TOKEN.sub(sub, formula)


# Celdas que empiezan con "=" pero son texto explicativo, no fórmulas.
_DISPLAY_ONLY = re.compile(r"←|^=\s+\(")


def _formulas_to_english(wb):
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if isinstance(c.value, str) and c.value.startswith("="):
                    if _DISPLAY_ONLY.search(c.value):
                        c.data_type = "s"  # muestra una fórmula como texto (p. ej. "= (igual)")
                    else:
                        c.value = to_english_formula(c.value)


def f(lang, name):
    """Return formula name in the requested language."""
    return FORMULAS[lang].get(name, name)


# ── Style helpers ─────────────────────────────────────────────────────────────

def header_fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def bold_font(size=11, color="000000", italic=False):
    return Font(bold=True, size=size, color=color, italic=italic)

def normal_font(size=11):
    return Font(size=size)

def center():
    return Alignment(horizontal="center", vertical="center", wrap_text=True)

def left():
    return Alignment(horizontal="left", vertical="center", wrap_text=True)

def thin_border():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)

def col_width(ws, col_letter, width):
    ws.column_dimensions[col_letter].width = width

def row_height(ws, row_num, height):
    ws.row_dimensions[row_num].height = height

def header_row(ws, row, values, fill_hex, font_color="FFFFFF", row_h=22):
    for col, val in enumerate(values, 1):
        cell = ws.cell(row=row, column=col, value=val)
        cell.fill = header_fill(fill_hex)
        cell.font = bold_font(11, font_color)
        cell.alignment = center()
        cell.border = thin_border()
    row_height(ws, row, row_h)

def data_cell(ws, row, col, value, bold=False, center_align=False):
    cell = ws.cell(row=row, column=col, value=value)
    cell.font = bold_font(11) if bold else normal_font(11)
    cell.alignment = center() if center_align else left()
    cell.border = thin_border()
    return cell

def section_title(ws, row, col, text, hex_color="1F3864", colspan=1):
    cell = ws.cell(row=row, column=col, value=text)
    cell.fill = header_fill(hex_color)
    cell.font = bold_font(13, "FFFFFF")
    cell.alignment = left()
    row_height(ws, row, 24)
    return cell

def note_cell(ws, row, col, text, colspan=1):
    cell = ws.cell(row=row, column=col, value=text)
    cell.fill = PatternFill("solid", fgColor="FFF9C4")
    cell.font = Font(italic=True, size=10, color="5D4037")
    cell.alignment = left()
    return cell

def formula_example_row(ws, row, description, formula_text, result_formula,
                         fill_hex="EEF2FF"):
    ws.cell(row=row, column=1, value=description).border = thin_border()
    ws.cell(row=row, column=1).fill = PatternFill("solid", fgColor=fill_hex)
    ws.cell(row=row, column=1).font = normal_font(10)
    ws.cell(row=row, column=2, value=formula_text).border = thin_border()
    ws.cell(row=row, column=2).font = Font(name="Courier New", size=10, color="1A237E")
    ws.cell(row=row, column=2).fill = PatternFill("solid", fgColor="F8F9FA")
    c = ws.cell(row=row, column=3)
    if result_formula:
        c.value = result_formula
    c.border = thin_border()
    c.fill = PatternFill("solid", fgColor="F1F8E9")
    row_height(ws, row, 18)



# ══════════════════════════════════════════════════════════════════════════════
# LEVEL 0 — Fundamentals
# ══════════════════════════════════════════════════════════════════════════════

def _nivel0_ejemplos(wb, lang):
    # ── Sheet 1: Interface ────────────────────────────────────────────────────
    ws = wb.active
    ws.title = "01 Interface"
    ws.sheet_view.showGridLines = True

    section_title(ws, 1, 1, "📌 MODULE 1 — The Excel 365 Interface", "1F3864")
    note_cell(ws, 2, 1, "This map helps you find the main elements of the Excel screen.")

    headers = ["Interface area", "Where is it?", "What it's for", "Quick shortcut"]
    header_row(ws, 4, headers, "1565C0")

    rows = [
        ("Formula bar", "Above the cell grid", "Type or edit the contents of a cell", "F2 to edit"),
        ("Name Box", "Left of the formula bar", "Shows the active cell address or range name", "Ctrl+G for Go To"),
        ("Ribbon", "Top of the window", "Access to every feature, organized by tabs", "Alt to show key tips"),
        ("Status bar", "Bottom of the window", "Shows SUM, AVERAGE, COUNT of the selected range", "Right-click to customize"),
        ("Select All button", "Top-left corner of the grid", "Selects ALL cells on the sheet", "Ctrl+A"),
        ("Sheet tabs", "Bottom left", "Move between sheets in the workbook", "Ctrl+PgDn / Ctrl+PgUp"),
        ("Backstage view", "File tab", "Save, open, export, Excel options", "Alt+F"),
    ]
    for i, r in enumerate(rows, 5):
        for j, v in enumerate(r, 1):
            c = data_cell(ws, i, j, v)
        row_height(ws, i, 20)

    col_width(ws, "A", 30); col_width(ws, "B", 28); col_width(ws, "C", 38); col_width(ws, "D", 22)

    # ── Sheet 2: Essential shortcuts ──────────────────────────────────────────
    ws2 = wb.create_sheet("02 Shortcuts")
    section_title(ws2, 1, 1, "⌨️ MODULE 2 — Essential Excel 365 Shortcuts", "1F3864")
    note_cell(ws2, 2, 1, "Practice these shortcuts until they're second nature. 20 min/day for 2 weeks = expert.")

    cats = [
        ("NAVIGATION", "1565C0", [
            ("Ctrl + Home", "Go to cell A1"),
            ("Ctrl + End", "Go to the last cell with data"),
            ("Ctrl + →  /  ←", "Jump to the edge of the data block"),
            ("Ctrl + ↑  /  ↓", "Jump up/down to the edge of the block"),
            ("Ctrl + PgDn", "Go to the next sheet"),
            ("Ctrl + PgUp", "Go to the previous sheet"),
        ]),
        ("SELECTION", "2E7D32", [
            ("Ctrl + Shift + End", "Select up to the last cell with data"),
            ("Ctrl + Shift + Home", "Select up to A1"),
            ("Ctrl + Shift + →", "Select up to the edge of the block"),
            ("Ctrl + A", "Select the entire sheet"),
            ("Ctrl + Space", "Select the entire column"),
            ("Shift + Space", "Select the entire row"),
        ]),
        ("EDITING", "E65100", [
            ("F2", "Enter cell edit mode"),
            ("Ctrl + Z", "Undo"),
            ("Ctrl + Y", "Redo"),
            ("Ctrl + D", "Fill down from the cell above"),
            ("Ctrl + R", "Fill right from the cell on the left"),
            ("Ctrl + ;", "Insert today's date"),
            ("Ctrl + Shift + ;", "Insert the current time"),
            ("Alt + Enter", "Line break inside the cell"),
            ("Delete", "Clear contents (keeps formatting)"),
        ]),
        ("FORMATTING", "4A148C", [
            ("Ctrl + B", "Bold"),
            ("Ctrl + I", "Italic"),
            ("Ctrl + U", "Underline"),
            ("Ctrl + 1", "Open the Format Cells dialog"),
            ("Ctrl + Shift + $", "Currency format"),
            ("Ctrl + Shift + %", "Percentage format"),
            ("Ctrl + Shift + #", "Date format"),
        ]),
        ("FORMULAS / WORKBOOK", "C62828", [
            ("= (equals)", "Start a formula"),
            ("F4", "Toggle reference type ($A$1 → A$1 → $A1 → A1)"),
            ("Ctrl + `", "Show/hide formulas"),
            ("F9", "Calculate/refresh formulas"),
            ("Alt + =", "Insert AutoSum"),
            ("Ctrl + T", "Create a table"),
            ("Ctrl + Shift + L", "Turn filters on/off"),
        ]),
    ]

    r = 4
    for cat_name, cat_color, shortcuts in cats:
        header_row(ws2, r, [cat_name, "Action"], cat_color)
        r += 1
        for shortcut, desc in shortcuts:
            data_cell(ws2, r, 1, shortcut, bold=True, center_align=True)
            data_cell(ws2, r, 2, desc)
            row_height(ws2, r, 18)
            r += 1
        r += 1

    col_width(ws2, "A", 28); col_width(ws2, "B", 50)

    # ── Sheet 3: Data structure ───────────────────────────────────────────────
    ws3 = wb.create_sheet("03 Data Structure")
    section_title(ws3, 1, 1, "🗂️ MODULE 3 — Proper Data Structure", "1F3864")
    note_cell(ws3, 2, 1, "A well-structured table has: 1 header row, 1 value per cell, no empty rows/columns.")

    header_row(ws3, 4, ["✅ CORRECT — Sales Log"], "2E7D32")
    header_row(ws3, 5, ["ID","Date","Sales Rep","Product","Category","Quantity","Unit Price","Total"], "388E3C", "FFFFFF")

    sample = [
        (1,"2024-01-15","Anna Green","Laptop Pro","Electronics",2,850.00),
        (2,"2024-01-16","Charles Lewis","Ergonomic Mouse","Peripherals",5,45.00),
        (3,"2024-01-17","Mary Turner","Mechanical Keyboard","Peripherals",3,120.00),
        (4,"2024-01-18","Anna Green","27\" Monitor","Electronics",1,320.00),
        (5,"2024-01-19","Louis Moore","HD Webcam","Peripherals",4,75.00),
        (6,"2024-01-20","Charles Lewis","Gaming Chair","Furniture",2,280.00),
    ]
    for i, row_data in enumerate(sample, 6):
        for j, v in enumerate(row_data, 1):
            data_cell(ws3, i, j, v, center_align=(j in [1,3,4,5,6]))
        ws3.cell(row=i, column=8, value=f"=F{i}*G{i}").border = thin_border()
        row_height(ws3, i, 18)

    col_width(ws3, "A", 6); col_width(ws3, "B", 14); col_width(ws3, "C", 18)
    col_width(ws3, "D", 22); col_width(ws3, "E", 16); col_width(ws3, "F", 12)
    col_width(ws3, "G", 14); col_width(ws3, "H", 12)

    ws3.cell(row=13, column=1, value="❌ COMMON MISTAKES TO AVOID:").font = bold_font(11, "C62828")
    errors = [
        "• Merged cells in headers (they break filters and formulas)",
        "• Total rows inside the table (they interfere with PivotTables)",
        "• Mixed data in one column (numbers + text = broken formulas)",
        "• Extra spaces before/after text (use TRIM() to clean them up)",
        "• Dates stored as text (you can't add them or filter by date)",
    ]
    for i, err in enumerate(errors, 14):
        ws3.cell(row=i, column=1, value=err).font = Font(size=10, color="B71C1C")
        row_height(ws3, i, 16)

    # ── Sheet 4: Formatting ───────────────────────────────────────────────────
    ws4 = wb.create_sheet("04 Formatting")
    section_title(ws4, 1, 1, "🎨 MODULE 4 — Professional Formatting and Presentation", "1F3864")
    note_cell(ws4, 2, 1, "Formatting should communicate, not decorate. Less is more.")

    header_row(ws4, 4, ["Formatting technique", "How to apply it", "When to use it"], "7B1D32")
    fmt_tips = [
        ("Table (Ctrl+T)", "Select data → Insert → Table", "Any time you have a structured list of data"),
        ("Conditional formatting", "Home → Styles → Conditional Formatting", "Automatically highlight important values"),
        ("Custom number format", "Ctrl+1 → Number → Custom", 'E.g. #,##0.00 "USD" to display currency'),
        ("Freeze panes", "View → Freeze Panes → Freeze Top Row", "When you have many rows and need to keep headers visible"),
        ("AutoFit height/width", "Double-click the column/row border", "To automatically fit the content"),
        ("Cell styles", "Home → Cell Styles", "Apply consistent formatting in one click"),
    ]
    for i, (t, c, w) in enumerate(fmt_tips, 5):
        data_cell(ws4, i, 1, t, bold=True)
        data_cell(ws4, i, 2, c)
        data_cell(ws4, i, 3, w)
        row_height(ws4, i, 20)

    col_width(ws4, "A", 28); col_width(ws4, "B", 40); col_width(ws4, "C", 45)


def _nivel0_practica(wb, lang):
    ws = wb.active
    ws.title = "PRACTICE Level 0"
    section_title(ws, 1, 1, "📝 LEVEL 0 PRACTICE — Excel Fundamentals", "1F3864")
    note_cell(ws, 2, 1, "Complete the exercises. The yellow cells are the ones you need to fill in.")

    # Exercise 1
    section_title(ws, 4, 1, "EXERCISE 1: Organize and format a contact table", "1565C0", colspan=5)
    note_cell(ws, 5, 1, "Instructions: Apply table formatting, adjust column widths and add colors to the header.")
    header_row(ws, 6, ["First Name","Last Name","Email","Phone","City"], "1976D2")
    contacts = [
        ("Laura","Ramsey","laura@email.com","555-0101","New York"),
        ("Peter","Jenkins","peter@email.com","555-0102","Chicago"),
        ("Sophia","Chen","sophia@email.com","555-0103","Los Angeles"),
        ("Andrew","Miller","andrew@email.com","555-0104","Houston"),
        ("Valerie","Scott","valerie@email.com","555-0105","Miami"),
    ]
    for i, row in enumerate(contacts, 7):
        for j, v in enumerate(row, 1):
            data_cell(ws, i, j, v)

    # Exercise 2
    section_title(ws, 14, 1, "EXERCISE 2: Identify data types", "2E7D32")
    note_cell(ws, 15, 1, "Instructions: In column B, write the data type (Text / Number / Date / Boolean / Error).")
    header_row(ws, 16, ["Cell value", "Data type (you write it)", "Correct?"], "43A047")
    examples = ["Excel 365", "365", "3.14", "2024-01-15", "TRUE", "#DIV/0!", "  spaces  ", "=2+2"]
    for i, ex in enumerate(examples, 17):
        data_cell(ws, i, 1, ex)
        c = data_cell(ws, i, 2, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        data_cell(ws, i, 3, "")

    # Exercise 3
    section_title(ws, 27, 1, "EXERCISE 3: Use keyboard shortcuts", "E65100")
    note_cell(ws, 28, 1, "Instructions: Without using the mouse, perform the following actions in this workbook.")
    tasks_kb = [
        ("Go to cell A1 using only the keyboard", "Ctrl + Home"),
        ("Select the entire sheet", "Ctrl + A"),
        ("Make the text in row 6 bold", "Ctrl + B"),
        ("Open Format Cells", "Ctrl + 1"),
        ("Go to the last cell with data", "Ctrl + End"),
    ]
    header_row(ws, 29, ["Task", "Correct shortcut"], "EF6C00")
    for i, (task, shortcut) in enumerate(tasks_kb, 30):
        data_cell(ws, i, 1, task)
        data_cell(ws, i, 2, shortcut, bold=True, center_align=True)

    col_width(ws, "A", 32); col_width(ws, "B", 28); col_width(ws, "C", 20)
    col_width(ws, "D", 18); col_width(ws, "E", 20)


# ══════════════════════════════════════════════════════════════════════════════
# LEVEL 1 — Basic
# ══════════════════════════════════════════════════════════════════════════════

def _nivel1_ejemplos(wb, lang):
    F = lambda n: f(lang, n)

    # ── Sheet 1: Data types and basic formulas ────────────────────────────────
    ws = wb.active
    ws.title = "01 Types and Formulas"
    section_title(ws, 1, 1, "🔢 MODULES 1-2 — Data Types and Basic Formulas", "1F3864")

    header_row(ws, 3, ["Description", "Formula / Example", "Result"], "1565C0")
    col_width(ws, "A", 36); col_width(ws, "B", 38); col_width(ws, "C", 18)

    examples = [
        ("Simple sum", f"={F('SUM')}(10,20,30)", None),
        ("Subtraction", "=100-45", None),
        ("Multiplication", "=12*7.5", None),
        ("Division", "=250/4", None),
        ("Exponent", "=2^10", None),
        ("Percentage of a value", "=500*15%", None),
        ("Join text and a number", '="Sales: "&TEXT(1234.5,"#,##0.00")', None),
        ("Today's date", f"={F('TODAY')}()", None),
        ("Text in uppercase", f'={F("UPPER")}("hello world")', None),
        ("Text length", f'={F("LEN")}("Excel 365")', None),
    ]
    for i, (desc, formula, _) in enumerate(examples, 4):
        formula_example_row(ws, i, desc, formula, formula)
        row_height(ws, i, 18)

    # ── Sheet 2: References ───────────────────────────────────────────────────
    ws2 = wb.create_sheet("02 References")
    section_title(ws2, 1, 1, "🔗 MODULE 3 — References: Relative, Absolute and Mixed", "1F3864")

    note_cell(ws2, 2, 1, "Price list with tax. Notice how $D$2 is absolute (it doesn't change when you copy the formula).")
    ws2.cell(row=2, column=3, value="Tax rate:").font = bold_font()
    ws2.cell(row=2, column=4, value=0.16).number_format = "0%"
    ws2.cell(row=2, column=4).font = bold_font(12, "C62828")

    header_row(ws2, 4, ["Product","Base price","Tax (absolute ref.)","Final price","Formula used"], "1976D2")
    products = ["Laptop","Monitor","Keyboard","Mouse","Webcam","Headphones"]
    prices   = [850, 320, 120, 45, 75, 65]
    for i, (prod, price) in enumerate(zip(products, prices), 5):
        ws2.cell(row=i, column=1, value=prod).border = thin_border()
        ws2.cell(row=i, column=2, value=price).border = thin_border()
        ws2.cell(row=i, column=2).number_format = "#,##0.00"
        ws2.cell(row=i, column=3, value=f"=B{i}*$D$2").border = thin_border()
        ws2.cell(row=i, column=3).number_format = "#,##0.00"
        ws2.cell(row=i, column=4, value=f"=B{i}+C{i}").border = thin_border()
        ws2.cell(row=i, column=4).number_format = "#,##0.00"
        ws2.cell(row=i, column=5, value=f'=B{i}*(1+$D$2)  ← $D$2 stays fixed').border = thin_border()
        ws2.cell(row=i, column=5).font = Font(name="Courier New", size=9, color="1A237E")
        row_height(ws2, i, 18)

    col_width(ws2, "A", 16); col_width(ws2, "B", 14); col_width(ws2, "C", 20)
    col_width(ws2, "D", 20); col_width(ws2, "E", 40)

    # ── Sheet 3: Essential functions ──────────────────────────────────────────
    ws3 = wb.create_sheet("03 Essential Functions")
    section_title(ws3, 1, 1, "🧮 MODULE 4 — Essential Functions", "1F3864")

    header_row(ws3, 3, ["Function","Syntax","What does it do?","Example"], "1565C0")
    funcs = [
        (F("SUM"),        f"{F('SUM')}(range)",                    "Adds up all the values",               f"={F('SUM')}(10,20,30)"),
        (F("AVERAGE"),    f"{F('AVERAGE')}(range)",                "Calculates the average",               f"={F('AVERAGE')}(10,20,30)"),
        (F("COUNT"),      f"{F('COUNT')}(range)",                  "Counts cells that contain numbers",    f"={F('COUNT')}(A1:A10)"),
        (F("COUNTA"),     f"{F('COUNTA')}(range)",                 "Counts non-empty cells",               f"={F('COUNTA')}(A1:A10)"),
        (F("MAX"),        f"{F('MAX')}(range)",                    "Largest value",                        f"={F('MAX')}(A1:A10)"),
        (F("MIN"),        f"{F('MIN')}(range)",                    "Smallest value",                       f"={F('MIN')}(A1:A10)"),
        (F("IF"),         f"{F('IF')}(logical_test, value_if_true, value_if_false)", "Simple condition", f'={F("IF")}(A2>100,"High","Low")'),
        (F("IFERROR"),    f"{F('IFERROR')}(value, value_if_error)", "Handles errors",                      f'={F("IFERROR")}(A2/B2,0)'),
        (F("ROUND"),      f"{F('ROUND')}(number, num_digits)",     "Rounds to N decimal places",           f"={F('ROUND')}(3.14159,2)"),
        (F("ABS"),        f"{F('ABS')}(number)",                   "Absolute value (removes the minus sign)", f"={F('ABS')}(-15)"),
        (F("TRIM"),       f"{F('TRIM')}(text)",                    "Removes extra spaces",                 f'={F("TRIM")}("  Excel  ")'),
        (F("TEXT"),       f'{F("TEXT")}(value, "format_text")',    "Converts a number to formatted text",  f'={F("TEXT")}(TODAY(),"DD/MM/YYYY")'),
    ]
    for i, row in enumerate(funcs, 4):
        for j, v in enumerate(row, 1):
            c = data_cell(ws3, i, j, v)
            if j == 2:
                c.font = Font(name="Courier New", size=10, color="1A237E")
            if j == 4:
                c.font = Font(name="Courier New", size=10, color="1B5E20")
        row_height(ws3, i, 20)

    col_width(ws3, "A", 20); col_width(ws3, "B", 36); col_width(ws3, "C", 34); col_width(ws3, "D", 36)

    # ── Sheet 4: Conditional formatting ───────────────────────────────────────
    ws4 = wb.create_sheet("04 Conditional Formatting")
    section_title(ws4, 1, 1, "🎨 MODULE 5 — Conditional Formatting", "1F3864")
    note_cell(ws4, 2, 1, "Notice how the cell color changes automatically based on the value. Select the range C5:C14 to see the rules.")

    header_row(ws4, 4, ["Sales Rep","Month","Sales USD","Status","Note"], "1565C0")
    reps = ["Anna","Charles","Mary","Louis","Sophia","Peter","Valerie","David","Isabel","George"]
    import random; random.seed(42)
    sales = [random.randint(1500, 9500) for _ in range(10)]
    for i, (rep, sale) in enumerate(zip(reps, sales), 5):
        data_cell(ws4, i, 1, rep)
        data_cell(ws4, i, 2, "January 2024")
        ws4.cell(row=i, column=3, value=sale).border = thin_border()
        ws4.cell(row=i, column=3).number_format = "$#,##0"
        status = "🟢 Goal met" if sale >= 7000 else ("🟡 In progress" if sale >= 4000 else "🔴 Below goal")
        data_cell(ws4, i, 4, status)
        note = f'={F("IF")}(C{i}>=7000,"Bonus: $"&TEXT(C{i}*0.05,"#,##0"),"No bonus")'
        ws4.cell(row=i, column=5, value=note).border = thin_border()
        row_height(ws4, i, 18)

    # Color scale
    rule = ColorScaleRule(
        start_type="min", start_color="F44336",
        mid_type="percentile", mid_value=50, mid_color="FFEB3B",
        end_type="max", end_color="4CAF50"
    )
    ws4.conditional_formatting.add("C5:C14", rule)

    col_width(ws4, "A", 16); col_width(ws4, "B", 16); col_width(ws4, "C", 14)
    col_width(ws4, "D", 22); col_width(ws4, "E", 32)

    # ── Sheet 5: Basic charts ─────────────────────────────────────────────────
    ws5 = wb.create_sheet("05 Charts")
    section_title(ws5, 1, 1, "📊 MODULE 7 — Basic Charts", "1F3864")
    note_cell(ws5, 2, 1, "Select the range A4:B10 and insert a bar chart to visualize sales by region.")

    header_row(ws5, 4, ["Region","Q1 Sales","Q2 Sales","Q3 Sales"], "1565C0")
    regions = [("North",12500,14200,13800),("South",9800,10500,11200),
               ("East",15600,16800,15900),("West",8400,9100,9800),
               ("Central",11200,12400,13100),("International",6700,7800,8500)]
    for i, (r, q1, q2, q3) in enumerate(regions, 5):
        data_cell(ws5, i, 1, r)
        for j, v in enumerate([q1,q2,q3], 2):
            ws5.cell(row=i, column=j, value=v).border = thin_border()
            ws5.cell(row=i, column=j).number_format = "#,##0"

    chart = BarChart()
    chart.type = "col"
    chart.title = "Sales by Region"
    chart.y_axis.title = "USD"
    chart.x_axis.title = "Region"
    chart.style = 10
    data_ref = Reference(ws5, min_col=2, max_col=4, min_row=4, max_row=10)
    cats_ref = Reference(ws5, min_col=1, min_row=5, max_row=10)
    chart.add_data(data_ref, titles_from_data=True)
    chart.set_categories(cats_ref)
    chart.shape = 4
    ws5.add_chart(chart, "F4")

    col_width(ws5, "A", 18); col_width(ws5, "B", 14); col_width(ws5, "C", 14); col_width(ws5, "D", 14)


def _nivel1_practica(wb, lang):
    F = lambda n: f(lang, n)
    ws = wb.active
    ws.title = "PRACTICE Level 1"
    section_title(ws, 1, 1, "📝 LEVEL 1 PRACTICE — Basic", "1F3864")
    note_cell(ws, 2, 1, "Fill in the yellow cells with the correct formulas. Don't change the data cells.")

    # Monthly sales data
    section_title(ws, 4, 1, "DATA — Monthly Sales Log (do not modify)", "424242")
    header_row(ws, 5, ["Month","Product","Category","Sales Rep","Units","Unit Price","Sale Total"], "616161", "FFFFFF")

    sales_data = [
        ("January","Laptop Pro","Electronics","Anna Green",3,850),
        ("January","Ergonomic Mouse","Peripherals","Charles Lewis",8,45),
        ("February","27\" Monitor","Electronics","Mary Turner",2,320),
        ("February","Mechanical Keyboard","Peripherals","Anna Green",5,120),
        ("March","Laptop Pro","Electronics","Charles Lewis",4,850),
        ("March","HD Webcam","Peripherals","Mary Turner",6,75),
        ("April","27\" Monitor","Electronics","Anna Green",3,320),
        ("April","Ergonomic Mouse","Peripherals","Charles Lewis",12,45),
        ("May","Gaming Chair","Furniture","Mary Turner",2,280),
        ("May","Laptop Pro","Electronics","Anna Green",5,850),
    ]
    for i, row in enumerate(sales_data, 6):
        for j, v in enumerate(row, 1):
            data_cell(ws, i, j, v)
        ws.cell(row=i, column=7, value=f"=E{i}*F{i}").border = thin_border()

    # Exercise 1
    section_title(ws, 18, 1, "EXERCISE 1: Calculate totals and statistics", "1565C0")
    note_cell(ws, 19, 1, "Write the correct formula in each yellow cell. Reference the range G6:G15.")

    tasks1 = [
        ("Total of all sales", f"={F('SUM')}(G6:G15)"),
        ("Average sale per transaction", f"={F('AVERAGE')}(G6:G15)"),
        ("Number of transactions", f"={F('COUNT')}(G6:G15)"),
        ("Highest sale", f"={F('MAX')}(G6:G15)"),
        ("Lowest sale", f"={F('MIN')}(G6:G15)"),
        ("Total rounded to the nearest ten", f"={F('ROUND')}({F('SUM')}(G6:G15),-1)"),
    ]
    header_row(ws, 20, ["Task","Your formula (write it here)","Expected result"], "1976D2")
    for i, (task, formula) in enumerate(tasks1, 21):
        data_cell(ws, i, 1, task)
        c = data_cell(ws, i, 2, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        ws.cell(row=i, column=3, value=formula).font = Font(name="Courier New", size=10, color="388E3C")
        row_height(ws, i, 18)

    # Exercise 2
    section_title(ws, 29, 1, "EXERCISE 2: Conditional formulas", "2E7D32")
    note_cell(ws, 30, 1, "Calculate the commission in the yellow cells with IF: 5% if the sale > 2000, otherwise 2%.")
    header_row(ws, 31, ["Row","Sale Total (ref)",f"{F('IF')} formula for commission","Result"], "43A047")
    for i, row_num in enumerate(range(6, 16), 32):
        data_cell(ws, i, 1, row_num)
        data_cell(ws, i, 2, f"=G{row_num}")
        c = data_cell(ws, i, 3, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        expected = f'={F("IF")}(G{row_num}>2000,G{row_num}*5%,G{row_num}*2%)'
        ws.cell(row=i, column=4, value=expected).font = Font(name="Courier New", size=9, color="388E3C")
        row_height(ws, i, 18)

    col_width(ws, "A", 14); col_width(ws, "B", 18); col_width(ws, "C", 18)
    col_width(ws, "D", 14); col_width(ws, "E", 14); col_width(ws, "F", 14); col_width(ws, "G", 16)


# ══════════════════════════════════════════════════════════════════════════════
# LEVEL 2 — Intermediate
# ══════════════════════════════════════════════════════════════════════════════

def _nivel2_ejemplos(wb, lang):
    F = lambda n: f(lang, n)

    ws = wb.active
    ws.title = "01 Conditionals"
    section_title(ws, 1, 1, "🔀 MODULES 2-3 — Conditional and Aggregate Functions", "1F3864")

    # Data table for the examples
    note_cell(ws, 2, 1, f"Sales table to practice {F('SUMIFS')}, {F('COUNTIFS')}, {F('AVERAGEIFS')} and advanced {F('IF')} functions.")
    header_row(ws, 4, ["Region","Sales Rep","Category","Month","Sales","Goal","Goal Met?","Bonus"], "1565C0")

    data = [
        ("North","Anna","Electronics","January",8500,7000),
        ("South","Charles","Clothing","January",4200,5000),
        ("North","Anna","Electronics","February",9100,7000),
        ("East","Mary","Home","January",6800,6000),
        ("South","Charles","Electronics","February",7200,7000),
        ("West","Louis","Clothing","January",3800,5000),
        ("North","Mary","Home","February",5500,6000),
        ("East","Anna","Electronics","February",11200,7000),
        ("South","Louis","Electronics","January",6900,7000),
        ("West","Charles","Home","February",7800,6000),
        ("North","Louis","Clothing","January",5100,5000),
        ("East","Mary","Electronics","January",8900,7000),
    ]
    for i, row in enumerate(data, 5):
        for j, v in enumerate(row, 1):
            c = data_cell(ws, i, j, v)
        ws.cell(row=i, column=7, value=f'={F("IF")}(E{i}>=F{i},"✅ Yes","❌ No")').border = thin_border()
        ws.cell(row=i, column=8, value=f'={F("IF")}(E{i}>=F{i},E{i}*0.08,0)').border = thin_border()
        ws.cell(row=i, column=8).number_format = "$#,##0"

    # Summary table with SUMIFS / COUNTIFS
    section_title(ws, 20, 1, f"SUMMARY — Using {F('SUMIFS')} and {F('COUNTIFS')}", "1565C0")
    header_row(ws, 21, ["Region","Total sales","# Transactions","Average"], "1976D2")

    regions = ["North","South","East","West"]
    for i, reg in enumerate(regions, 22):
        data_cell(ws, i, 1, reg, bold=True)
        ws.cell(row=i, column=2,
                value=f'={F("SUMIFS")}($E$5:$E$16,$A$5:$A$16,A{i})').border = thin_border()
        ws.cell(row=i, column=2).number_format = "$#,##0"
        ws.cell(row=i, column=3,
                value=f'={F("COUNTIFS")}($A$5:$A$16,A{i})').border = thin_border()
        ws.cell(row=i, column=4,
                value=f'={F("IFERROR")}({F("AVERAGEIFS")}($E$5:$E$16,$A$5:$A$16,A{i}),0)').border = thin_border()
        ws.cell(row=i, column=4).number_format = "$#,##0"

    col_width(ws, "A", 12); col_width(ws, "B", 14); col_width(ws, "C", 14)
    col_width(ws, "D", 12); col_width(ws, "E", 12); col_width(ws, "F", 10)
    col_width(ws, "G", 12); col_width(ws, "H", 14)

    # ── Sheet 2: Text functions ───────────────────────────────────────────────
    ws2 = wb.create_sheet("02 Text")
    section_title(ws2, 1, 1, "🔤 MODULE 4 — Text Functions", "1F3864")
    note_cell(ws2, 2, 1, "Raw imported data with formatting problems. Use text functions to clean it up.")

    header_row(ws2, 4, ["Raw data (col A)","Description","Formula","Result"], "4A148C")
    txt_examples = [
        ("  john smith  ",  "Remove extra spaces",              f'={F("TRIM")}(A5)',                 None),
        ("  john smith  ",  "Uppercase",                        f'={F("UPPER")}({F("TRIM")}(A6))',   None),
        ("john smith",      "Proper case",                      f'={F("PROPER")}(A7)',               None),
        ("ITEMCODE-001-US", "Extract the first 8 characters",   f'={F("LEFT")}(A8,8)',               None),
        ("ITEMCODE-001-US", "Extract the country code (last 2)", f'={F("RIGHT")}(A8,2)',             None),
        ("ITEMCODE-001-US", "Extract '001' (position 10, length 3)", f'={F("MID")}(A10,10,3)',       None),
        ("john smith",      "Text length",                      f'={F("LEN")}(A11)',                 None),
        ("hello@world.com", "Position of the @",                f'={F("FIND")}("@",A12)',            None),
        ("hello@world.com", "Username (before the @)",          f'={F("LEFT")}(A13,{F("FIND")}("@",A13)-1)', None),
        ("price: $1,200",   "Replace $ with nothing",           f'={F("SUBSTITUTE")}(A14,"$","")',  None),
        ("Anna;Charles;Mary","Replace ; with a comma",          f'={F("SUBSTITUTE")}(A15,";",", ")', None),
    ]
    raw_vals = ["  john smith  ","  john smith  ","john smith","ITEMCODE-001-US","ITEMCODE-001-US",
                "ITEMCODE-001-US","john smith","hello@world.com","hello@world.com","price: $1,200","Anna;Charles;Mary"]

    for i, ((raw, desc, formula, _), raw_v) in enumerate(zip(txt_examples, raw_vals), 5):
        ws2.cell(row=i, column=1, value=raw_v).border = thin_border()
        data_cell(ws2, i, 2, desc)
        ws2.cell(row=i, column=3, value=formula).font = Font(name="Courier New", size=10, color="1A237E")
        ws2.cell(row=i, column=3).border = thin_border()
        ws2.cell(row=i, column=4, value=formula).border = thin_border()
        ws2.cell(row=i, column=4).fill = PatternFill("solid", fgColor="F1F8E9")

    col_width(ws2, "A", 24); col_width(ws2, "B", 36); col_width(ws2, "C", 48); col_width(ws2, "D", 24)

    # ── Sheet 3: Date functions ───────────────────────────────────────────────
    ws3 = wb.create_sheet("03 Dates")
    section_title(ws3, 1, 1, "📅 MODULE 5 — Date Functions", "1F3864")
    note_cell(ws3, 2, 1, "Project log to practice date functions.")

    header_row(ws3, 4, ["Project","Start date","End date","Total days","Workdays","Start month","Year","Finished?"], "1565C0")
    projects = [
        ("Project Alpha", "2024-01-15", "2024-03-20"),
        ("Project Beta",  "2024-02-01", "2024-04-15"),
        ("Project Gamma", "2024-03-10", "2024-05-30"),
        ("Project Delta", "2024-04-01", "2024-06-01"),
        ("Project Epsilon","2024-05-15", "2024-07-20"),
    ]
    from datetime import date
    today_str = date.today().isoformat()
    for i, (proj, start, end) in enumerate(projects, 5):
        data_cell(ws3, i, 1, proj, bold=True)
        ws3.cell(row=i, column=2, value=start).border = thin_border()
        ws3.cell(row=i, column=2).number_format = "MM/DD/YYYY"
        ws3.cell(row=i, column=3, value=end).border = thin_border()
        ws3.cell(row=i, column=3).number_format = "MM/DD/YYYY"
        ws3.cell(row=i, column=4, value=f"=C{i}-B{i}").border = thin_border()
        ws3.cell(row=i, column=5, value=f"={F('NETWORKDAYS')}(B{i},C{i})").border = thin_border()
        ws3.cell(row=i, column=6, value=f"={F('MONTH')}(B{i})").border = thin_border()
        ws3.cell(row=i, column=7, value=f"={F('YEAR')}(B{i})").border = thin_border()
        ws3.cell(row=i, column=8, value=f'={F("IF")}(C{i}<{F("TODAY")}(),"✅ Yes","⏳ No")').border = thin_border()
        row_height(ws3, i, 18)

    col_width(ws3, "A", 18); col_width(ws3, "B", 14); col_width(ws3, "C", 14)
    col_width(ws3, "D", 14); col_width(ws3, "E", 18); col_width(ws3, "F", 12)
    col_width(ws3, "G", 10); col_width(ws3, "H", 14)

    # ── Sheet 4: Data validation ──────────────────────────────────────────────
    ws4 = wb.create_sheet("04 Validation")
    section_title(ws4, 1, 1, "✅ MODULE 6 — Data Validation", "1F3864")
    note_cell(ws4, 2, 1, "The columns with a light blue background have data validation. Try typing an invalid value.")

    header_row(ws4, 4, ["Employee","Department","Rating (1-10)","Category","Review date"], "1565C0")

    # Dropdown validation for department
    dv_dept = DataValidation(type="list", formula1='"Sales,Marketing,Technology,HR,Finance"', allow_blank=True)
    dv_dept.error = "Pick a valid department from the list"
    dv_dept.errorTitle = "Invalid department"
    ws4.add_data_validation(dv_dept)

    # Number validation for rating
    dv_cal = DataValidation(type="whole", operator="between", formula1="1", formula2="10", allow_blank=True)
    dv_cal.error = "The rating must be a whole number between 1 and 10"
    dv_cal.errorTitle = "Invalid value"
    ws4.add_data_validation(dv_cal)

    employees = ["Anna Green","Charles Lewis","Mary Turner","Louis Moore","Sophia Chen","Peter Reed"]
    depts = ["Sales","Technology","Marketing","HR","Technology","Sales"]
    scores = [8, 9, 7, 6, 10, 8]
    dates = ["2024-01-15","2024-01-16","2024-01-17","2024-01-18","2024-01-19","2024-01-20"]

    for i, (emp, dept, score, d) in enumerate(zip(employees, depts, scores, dates), 5):
        data_cell(ws4, i, 1, emp)
        c2 = ws4.cell(row=i, column=2, value=dept)
        c2.border = thin_border()
        c2.fill = PatternFill("solid", fgColor="E3F2FD")
        dv_dept.sqref += f"B{i}"
        c3 = ws4.cell(row=i, column=3, value=score)
        c3.border = thin_border()
        c3.fill = PatternFill("solid", fgColor="E3F2FD")
        dv_cal.sqref += f"C{i}"
        ws4.cell(row=i, column=4, value=f'={F("IF")}(C{i}>=9,"Excellent",{F("IF")}(C{i}>=7,"Good",{F("IF")}(C{i}>=5,"Fair","Poor")))').border = thin_border()
        ws4.cell(row=i, column=5, value=d).border = thin_border()
        ws4.cell(row=i, column=5).number_format = "MM/DD/YYYY"

    col_width(ws4, "A", 20); col_width(ws4, "B", 18); col_width(ws4, "C", 20)
    col_width(ws4, "D", 14); col_width(ws4, "E", 18)


def _nivel2_practica(wb, lang):
    F = lambda n: f(lang, n)
    ws = wb.active
    ws.title = "PRACTICE Level 2"
    section_title(ws, 1, 1, "📝 LEVEL 2 PRACTICE — Intermediate", "1F3864")
    note_cell(ws, 2, 1, "Fill in the yellow cells. The reference formulas are shown in green so you can check your work.")

    # HR data
    section_title(ws, 4, 1, "DATA — Employee Payroll (do not modify)", "424242")
    header_row(ws, 5, ["ID","Name","Dept","Position","Salary","Hire Date","Years of Service","Country"], "616161")
    employees = [
        ("E001","Anna Green","Sales","Manager",4500,"2019-03-15","","Mexico"),
        ("E002","Charles Lewis","IT","Developer",3800,"2021-07-01","","Colombia"),
        ("E003","Mary Turner","Marketing","Analyst",2900,"2020-11-20","","Argentina"),
        ("E004","Louis Moore","Sales","Account Executive",2200,"2022-01-10","","Mexico"),
        ("E005","Sophia Chen","IT","Senior Dev",5200,"2018-05-08","","Colombia"),
        ("E006","Peter Reed","HR","Coordinator",3100,"2021-09-15","","Peru"),
        ("E007","Valerie Scott","Finance","Accountant",3600,"2020-04-22","","Chile"),
        ("E008","David Morgan","Sales","Account Executive",2100,"2023-02-01","","Mexico"),
    ]
    for i, row in enumerate(employees, 6):
        for j, v in enumerate(row, 1):
            data_cell(ws, i, j, v)
        ws.cell(row=i, column=7, value=f'={F("YEAR")}({F("TODAY")}())-{F("YEAR")}(F{i})').border = thin_border()
        row_height(ws, i, 18)

    # Exercise 1: SUMIFS
    section_title(ws, 16, 1, f"EXERCISE 1: {F('SUMIFS')} — Payroll summary by department", "1565C0")
    note_cell(ws, 17, 1, f"Use {F('SUMIFS')} to calculate total salaries by department.")
    header_row(ws, 18, ["Department","Total Salaries (your formula)","Expected result","# Employees"], "1976D2")
    depts = [("Sales", "$C$6:$C$13"), ("IT", "$C$6:$C$13"), ("Marketing", "$C$6:$C$13"), ("Finance", "$C$6:$C$13")]
    for i, (dept, _) in enumerate(depts, 19):
        data_cell(ws, i, 1, dept, bold=True)
        c = data_cell(ws, i, 2, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        expected = f'={F("SUMIFS")}($E$6:$E$13,$C$6:$C$13,A{i})'
        ws.cell(row=i, column=3, value=expected).font = Font(name="Courier New", size=9, color="388E3C")
        ws.cell(row=i, column=4, value=f'={F("COUNTIFS")}($C$6:$C$13,A{i})').border = thin_border()
        row_height(ws, i, 18)

    # Exercise 2: Text
    section_title(ws, 25, 1, "EXERCISE 2: Text manipulation — Build a company email ID", "2E7D32")
    note_cell(ws, 26, 1, 'Build the company email: first letter of the first name + last name + "@company.com". All lowercase.')
    header_row(ws, 27, ["Full name", "Company email (your formula)", "Expected result"], "43A047")
    full_names = ["Anna Green","Charles Lewis","Mary Turner","Louis Moore","Sophia Chen"]
    for i, name in enumerate(full_names, 28):
        data_cell(ws, i, 1, name)
        c = data_cell(ws, i, 2, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        # =LOWER(LEFT(A28,1)&MID(A28,FIND(" ",A28)+1,100)&"@company.com")
        expected = f'={F("LOWER")}({F("LEFT")}(A{i},1)&{F("MID")}(A{i},{F("FIND")}(" ",A{i})+1,100)&"@company.com")'
        ws.cell(row=i, column=3, value=expected).font = Font(name="Courier New", size=9, color="388E3C")
        row_height(ws, i, 18)

    col_width(ws, "A", 14); col_width(ws, "B", 20); col_width(ws, "C", 18)
    col_width(ws, "D", 14); col_width(ws, "E", 12); col_width(ws, "F", 16)
    col_width(ws, "G", 14); col_width(ws, "H", 12)


# ══════════════════════════════════════════════════════════════════════════════
# LEVEL 3 — Advanced
# ══════════════════════════════════════════════════════════════════════════════

def _nivel3_ejemplos(wb, lang):
    F = lambda n: f(lang, n)

    ws = wb.active
    ws.title = "01 XLOOKUP"
    section_title(ws, 1, 1, f"🔍 MODULES 1-2 — {F('XLOOKUP')} and {F('INDEX')}/{F('MATCH')}", "1F3864")
    note_cell(ws, 2, 1, f"{F('XLOOKUP')} is the improved version of {F('VLOOKUP')}. It works in any direction.")

    # Product catalog
    section_title(ws, 4, 1, "PRODUCT CATALOG (lookup table)", "424242")
    header_row(ws, 5, ["SKU","Name","Category","Price","Stock","Supplier"], "616161")
    catalog = [
        ("SKU-001","Laptop Pro 15","Electronics",1299,"45","TechSupply"),
        ("SKU-002","Wireless Mouse","Peripherals",39.99,"230","PerifCo"),
        ("SKU-003","27\" 4K Monitor","Electronics",549,"28","TechSupply"),
        ("SKU-004","Mechanical Keyboard","Peripherals",129,"95","PerifCo"),
        ("SKU-005","4K Webcam","Accessories",89,"67","AccessPro"),
        ("SKU-006","7-Port USB-C Hub","Accessories",59,"112","AccessPro"),
        ("SKU-007","1TB SSD","Storage",119,"78","StoragePlus"),
        ("SKU-008","32GB DDR5 RAM","Components",189,"34","TechSupply"),
    ]
    for i, row in enumerate(catalog, 6):
        for j, v in enumerate(row, 1):
            data_cell(ws, i, j, v)

    # XLOOKUP examples
    section_title(ws, 16, 1, f"{F('XLOOKUP')} EXAMPLES", "1565C0")
    header_row(ws, 17, ["SKU to find","What am I looking for?","Formula","Result"], "1976D2")

    xlookup_examples = [
        ("SKU-003", "Price",    f'={F("XLOOKUP")}("SKU-003",$A$6:$A$13,$D$6:$D$13,"Not found")'),
        ("SKU-007", "Supplier", f'={F("XLOOKUP")}("SKU-007",$A$6:$A$13,$F$6:$F$13,"Not found")'),
        ("SKU-999", "Price (doesn't exist — error handling)", f'={F("XLOOKUP")}("SKU-999",$A$6:$A$13,$D$6:$D$13,"❌ Not found")'),
        ("SKU-001", "Name + Price combined", f'={F("XLOOKUP")}("SKU-001",$A$6:$A$13,$B$6:$B$13)&" — $"&{F("XLOOKUP")}("SKU-001",$A$6:$A$13,$D$6:$D$13)'),
    ]
    for i, (sku, desc, formula) in enumerate(xlookup_examples, 18):
        data_cell(ws, i, 1, sku, center_align=True)
        data_cell(ws, i, 2, desc)
        ws.cell(row=i, column=3, value=formula).font = Font(name="Courier New", size=9, color="1A237E")
        ws.cell(row=i, column=3).border = thin_border()
        ws.cell(row=i, column=4, value=formula).border = thin_border()
        ws.cell(row=i, column=4).fill = PatternFill("solid", fgColor="F1F8E9")
        row_height(ws, i, 20)

    # INDEX / MATCH
    section_title(ws, 24, 1, f"{F('INDEX')}/{F('MATCH')} EXAMPLES", "E65100")
    note_cell(ws, 25, 1, "INDEX+MATCH works in older versions of Excel. XLOOKUP is only in Excel 365/2021+.")
    header_row(ws, 26, ["What am I looking for?","INDEX/MATCH formula","XLOOKUP equivalent"], "EF6C00", "FFFFFF")
    im_examples = [
        ("Price of SKU-004",
         f'={F("INDEX")}($D$6:$D$13,{F("MATCH")}("SKU-004",$A$6:$A$13,0))',
         f'={F("XLOOKUP")}("SKU-004",$A$6:$A$13,$D$6:$D$13)'),
        ("SKU with the most stock",
         f'={F("INDEX")}($A$6:$A$13,{F("MATCH")}({F("MAX")}($E$6:$E$13),$E$6:$E$13,0))',
         f'={F("XLOOKUP")}({F("MAX")}($E$6:$E$13),$E$6:$E$13,$A$6:$A$13)'),
        ("Name of the cheapest product",
         f'={F("INDEX")}($B$6:$B$13,{F("MATCH")}({F("MIN")}($D$6:$D$13),$D$6:$D$13,0))',
         f'={F("XLOOKUP")}({F("MIN")}($D$6:$D$13),$D$6:$D$13,$B$6:$B$13)'),
    ]
    for i, (desc, im, xl) in enumerate(im_examples, 27):
        data_cell(ws, i, 1, desc)
        ws.cell(row=i, column=2, value=im).font = Font(name="Courier New", size=9, color="1A237E")
        ws.cell(row=i, column=2).border = thin_border()
        ws.cell(row=i, column=3, value=xl).font = Font(name="Courier New", size=9, color="1B5E20")
        ws.cell(row=i, column=3).border = thin_border()
        row_height(ws, i, 20)

    col_width(ws, "A", 18); col_width(ws, "B", 30); col_width(ws, "C", 18)
    col_width(ws, "D", 12); col_width(ws, "E", 10); col_width(ws, "F", 16)

    # ── Sheet 2: Dynamic arrays ───────────────────────────────────────────────
    ws2 = wb.create_sheet("02 Dynamic Arrays")
    section_title(ws2, 1, 1, "🌊 MODULE 3 — Dynamic Arrays (Excel 365)", "1F3864")
    note_cell(ws2, 2, 1, f"The {F('FILTER')}, {F('SORT')} and {F('UNIQUE')} functions return multiple results automatically (they 'spill').")

    # Source data
    section_title(ws2, 4, 1, "SOURCE DATA — 2024 Transactions", "424242")
    header_row(ws2, 5, ["Date","Customer","Region","Product","Amount","Status"], "616161")
    transactions = [
        ("2024-01-10","TechCorp","North","Laptop",2598,"Paid"),
        ("2024-01-15","StartupXYZ","South","Monitor",549,"Pending"),
        ("2024-02-01","MegaStore","North","Keyboard",387,"Paid"),
        ("2024-02-14","TechCorp","East","Mouse",199.95,"Paid"),
        ("2024-03-05","GlobalTech","West","Webcam",356,"Canceled"),
        ("2024-03-20","StartupXYZ","North","Laptop",1299,"Paid"),
        ("2024-04-01","MegaStore","South","SSD",357,"Paid"),
        ("2024-04-15","TechCorp","North","RAM",567,"Pending"),
        ("2024-05-10","GlobalTech","East","Monitor",549,"Paid"),
        ("2024-05-25","StartupXYZ","West","USB Hub",177,"Paid"),
    ]
    for i, row in enumerate(transactions, 6):
        for j, v in enumerate(row, 1):
            data_cell(ws2, i, j, v)
            if j == 1:
                ws2.cell(row=i, column=j).number_format = "MM/DD/YYYY"
            if j == 5:
                ws2.cell(row=i, column=j).number_format = "$#,##0.00"

    # Dynamic arrays
    section_title(ws2, 18, 1, "RESULTS WITH DYNAMIC ARRAYS", "1565C0")

    ws2.cell(row=20, column=1, value="Only 'Paid' transactions:").font = bold_font(11, "1565C0")
    ws2.cell(row=21, column=1, value=f'={F("FILTER")}($A$6:$F$15,$F$6:$F$15="Paid","No results")')
    ws2.cell(row=21, column=1).font = Font(name="Courier New", size=10, color="1A237E")
    ws2.cell(row=21, column=1).border = thin_border()

    ws2.cell(row=28, column=1, value="Unique customers (no repeats):").font = bold_font(11, "2E7D32")
    ws2.cell(row=29, column=1, value=f'={F("UNIQUE")}($B$6:$B$15)')
    ws2.cell(row=29, column=1).font = Font(name="Courier New", size=10, color="1B5E20")
    ws2.cell(row=29, column=1).border = thin_border()

    ws2.cell(row=36, column=1, value="Transactions sorted by amount (largest to smallest):").font = bold_font(11, "E65100")
    ws2.cell(row=37, column=1, value=f'={F("SORT")}($A$6:$F$15,5,-1)')
    ws2.cell(row=37, column=1).font = Font(name="Courier New", size=10, color="BF360C")
    ws2.cell(row=37, column=1).border = thin_border()

    col_width(ws2, "A", 14); col_width(ws2, "B", 16); col_width(ws2, "C", 12)
    col_width(ws2, "D", 16); col_width(ws2, "E", 14); col_width(ws2, "F", 12)


def _nivel3_practica(wb, lang):
    F = lambda n: f(lang, n)
    ws = wb.active
    ws.title = "PRACTICE Level 3"
    section_title(ws, 1, 1, "📝 LEVEL 3 PRACTICE — Advanced", "1F3864")
    note_cell(ws, 2, 1, f"Use {F('XLOOKUP')}, {F('INDEX')}/{F('MATCH')} and dynamic arrays to complete the analysis.")

    # Inventory
    section_title(ws, 4, 1, "DATA — Warehouse Inventory (do not modify)", "424242")
    header_row(ws, 5, ["Code","Description","Category","Cost","Retail Price","Stock","Min Stock","Status"], "616161")
    inventory = [
        ("P-001","2TB Hard Drive","Storage",45,89,23,10,"OK"),
        ("P-002","RTX Graphics Card","GPU",350,699,5,3,"OK"),
        ("P-003","i9 Processor","CPU",280,549,8,5,"OK"),
        ("P-004","Z790 Motherboard","Motherboard",180,329,2,5,"⚠️ LOW"),
        ("P-005","850W Power Supply","PSU",75,149,15,8,"OK"),
        ("P-006","ATX Case","Case",55,109,3,5,"⚠️ LOW"),
        ("P-007","64GB RAM","RAM",120,219,11,10,"OK"),
        ("P-008","360mm Cooler","Cooling",85,169,6,5,"OK"),
        ("P-009","2TB NVMe SSD","Storage",90,179,1,5,"🔴 CRITICAL"),
        ("P-010","144Hz Monitor","Display",200,399,18,8,"OK"),
    ]
    for i, row in enumerate(inventory, 6):
        for j, v in enumerate(row, 1):
            data_cell(ws, i, j, v)

    # Exercise 1: XLOOKUP lookup table
    section_title(ws, 18, 1, f"EXERCISE 1: Product finder with {F('XLOOKUP')}", "1565C0")
    note_cell(ws, 19, 1, "The user types a code in C20 and you need to display all of the product's details.")
    ws.cell(row=20, column=1, value="Code to look up:").font = bold_font()
    c_search = ws.cell(row=20, column=3, value="P-005")
    c_search.fill = PatternFill("solid", fgColor="FFF176")
    c_search.border = thin_border()
    c_search.font = bold_font(12, "1565C0")

    header_row(ws, 22, ["Field","Value found","Your formula"], "1976D2")
    fields = ["Description","Category","Cost","Retail Price","Stock","Status"]
    cols   = [2, 3, 4, 5, 6, 8]
    letters = ["B","C","D","E","F","H"]
    for i, (field, col, letter) in enumerate(zip(fields, cols, letters), 23):
        data_cell(ws, i, 1, field, bold=True)
        expected = f'={F("XLOOKUP")}($C$20,$A$6:$A$15,${letter}$6:${letter}$15,"Not found")'
        ws.cell(row=i, column=2, value=expected).border = thin_border()
        ws.cell(row=i, column=2).fill = PatternFill("solid", fgColor="F1F8E9")
        c = data_cell(ws, i, 3, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        row_height(ws, i, 18)

    # Exercise 2: FILTER
    section_title(ws, 31, 1, f"EXERCISE 2: {F('FILTER')} — Products below minimum stock", "2E7D32")
    note_cell(ws, 32, 1, f"Use {F('FILTER')} to show only the products where Stock < Min Stock.")
    ws.cell(row=33, column=1, value="Your formula here:").font = bold_font()
    c_filt = data_cell(ws, 33, 2, "")
    c_filt.fill = PatternFill("solid", fgColor="FFF176")
    expected_filter = f'={F("FILTER")}($A$6:$H$15,$F$6:$F$15<$G$6:$G$15,"No products below minimum")'
    ws.cell(row=38, column=1, value="Answer:").font = bold_font(10, "388E3C")
    ws.cell(row=38, column=2, value=expected_filter).font = Font(name="Courier New", size=9, color="388E3C")

    col_width(ws, "A", 14); col_width(ws, "B", 24); col_width(ws, "C", 18)
    col_width(ws, "D", 10); col_width(ws, "E", 10); col_width(ws, "F", 10)
    col_width(ws, "G", 12); col_width(ws, "H", 14)


# ══════════════════════════════════════════════════════════════════════════════
# LEVEL 4 — Excel Pro
# ══════════════════════════════════════════════════════════════════════════════

def _nivel4_ejemplos(wb, lang):
    F = lambda n: f(lang, n)

    ws = wb.active
    ws.title = "01 Macros and VBA"
    section_title(ws, 1, 1, "🤖 MODULES 1-2 — Macros and VBA Basics", "1F3864")
    note_cell(ws, 2, 1, "Macros automate repetitive tasks. They're saved in .xlsm files (macro-enabled workbooks).")

    section_title(ws, 4, 1, "GUIDE: How to record your first macro", "4A148C")
    steps = [
        ("Step 1", "Go to View → Macros → Record Macro"),
        ("Step 2", "Give it a name (no spaces) and an optional keyboard shortcut"),
        ("Step 3", "Store it in: 'This Workbook' for personal use"),
        ("Step 4", "Perform the actions you want to automate"),
        ("Step 5", "Go to View → Macros → Stop Recording"),
        ("Step 6", "Test it with the assigned shortcut or Macros → Run"),
        ("Step 7", "Save the file as .xlsm (Excel Macro-Enabled Workbook)"),
    ]
    header_row(ws, 5, ["Step","Instruction"], "6A1B9A")
    for i, (step, instr) in enumerate(steps, 6):
        data_cell(ws, i, 1, step, bold=True, center_align=True)
        data_cell(ws, i, 2, instr)
        row_height(ws, i, 20)

    section_title(ws, 15, 1, "VBA CODE EXAMPLES — Basic macros", "1F3864")
    vba_examples = [
        ("Show a message",
         "Sub SayHello()\n    MsgBox \"Hello from VBA!\", vbInformation, \"Welcome\"\nEnd Sub"),
        ("Highlight the active cell in yellow",
         "Sub HighlightCell()\n    ActiveCell.Interior.Color = RGB(255, 255, 0)\n    ActiveCell.Font.Bold = True\nEnd Sub"),
        ("Sum a range and show the result",
         "Sub SumRange()\n    Dim total As Double\n    total = Application.WorksheetFunction.Sum(Range(\"B2:B20\"))\n    MsgBox \"Total: \" & total\nEnd Sub"),
        ("Flag empty cells in column A",
         "Sub FlagEmptyCells()\n    Dim i As Integer\n    For i = 1 To 100\n        If Cells(i, 1).Value = \"\" Then\n            Cells(i, 1).Interior.Color = RGB(255, 230, 230)\n        End If\n    Next i\nEnd Sub"),
        ("Create a new sheet with a custom name",
         "Sub CreateSheet()\n    Dim sheetName As String\n    sheetName = InputBox(\"Name for the new sheet:\")\n    If sheetName <> \"\" Then\n        Worksheets.Add.Name = sheetName\n        MsgBox \"Sheet '\" & sheetName & \"' created!\"\n    End If\nEnd Sub"),
    ]
    header_row(ws, 16, ["Macro","VBA code (paste this into the VBA Editor - Alt+F11)"], "7B1FA2")
    for i, (name, code) in enumerate(vba_examples, 17):
        data_cell(ws, i, 1, name, bold=True)
        c = ws.cell(row=i, column=2, value=code)
        c.font = Font(name="Courier New", size=9, color="1A237E")
        c.alignment = Alignment(wrap_text=True, vertical="top")
        c.border = thin_border()
        c.fill = PatternFill("solid", fgColor="F3E5F5")
        ws.row_dimensions[i].height = 70

    col_width(ws, "A", 30); col_width(ws, "B", 70)

    # ── Sheet 2: Dashboard template ───────────────────────────────────────────
    ws2 = wb.create_sheet("02 Dashboard Template")
    section_title(ws2, 1, 1, "📊 MODULE — Executive Dashboard with Formulas", "1F3864")
    note_cell(ws2, 2, 1, "This dashboard updates automatically when you change the data on the '03 Data' sheet.")

    # KPIs
    section_title(ws2, 4, 1, "KEY KPIs — Q1 2024", "1565C0")
    kpis = [
        ("💰 Total Sales",      f"='{F('SUM')}(Data!C:C)'",   "$89,450"),
        ("📦 Orders",           f"={F('COUNTA')}('03 Data'!A2:A1000)-1", "247"),
        ("👥 Unique customers", f"=SUMPRODUCT(1/COUNTIF('03 Data'!B2:B50,'03 Data'!B2:B50))", "38"),
        ("📈 Average order value", f"=C5/{F('COUNTA')}('03 Data'!A2:A248)", "$362"),
    ]
    for i, (kpi, _, val) in enumerate(kpis, 5):
        ws2.cell(row=i, column=1, value=kpi).font = bold_font(12)
        ws2.cell(row=i, column=1).border = thin_border()
        ws2.cell(row=i, column=2, value=val).font = bold_font(18, "1565C0")
        ws2.cell(row=i, column=2).alignment = center()
        ws2.cell(row=i, column=2).border = thin_border()
        ws2.row_dimensions[i].height = 30

    section_title(ws2, 11, 1, "RECOMMENDED STRUCTURE FOR A DASHBOARD", "424242")
    structure = [
        ("1. DATA sheet",        "Raw data, never change its format"),
        ("2. CALCULATIONS sheet", f"Summary tables, {F('SUMIFS')}, {F('COUNTIFS')}"),
        ("3. DASHBOARD sheet",   "Only charts and KPIs, referencing the calculations sheet"),
        ("4. Slicers",           "Connect them to PivotTables for interactive filtering"),
        ("5. Macro buttons",     "To refresh data or navigate between sheets"),
    ]
    header_row(ws2, 12, ["Layer","Description"], "616161")
    for i, (layer, desc) in enumerate(structure, 13):
        data_cell(ws2, i, 1, layer, bold=True)
        data_cell(ws2, i, 2, desc)
        row_height(ws2, i, 20)

    col_width(ws2, "A", 28); col_width(ws2, "B", 55)

    # ── Sheet 3: Dashboard data ───────────────────────────────────────────────
    ws3 = wb.create_sheet("03 Data")
    section_title(ws3, 1, 1, "📋 SOURCE DATA — Do not change the structure", "424242")
    header_row(ws3, 2, ["Order ID","Customer","Amount","Product","Category","Region","Date","Sales Rep"], "616161")
    import random; random.seed(99)
    customers = ["TechCorp","StartupXYZ","MegaStore","GlobalTech","InnovateCo","DataSoft","CloudBiz","DigitalPro"]
    products  = ["Laptop","Monitor","Keyboard","Mouse","Webcam","SSD","RAM","USB Hub"]
    cats      = ["Electronics","Electronics","Peripherals","Peripherals","Accessories","Storage","Components","Accessories"]
    regions   = ["North","South","East","West","Central"]
    reps      = ["Anna Green","Charles Lewis","Mary Turner","Louis Moore"]
    from datetime import date, timedelta
    start_date = date(2024, 1, 1)
    for i in range(2, 52):
        row_idx = i + 1
        order_date = start_date + timedelta(days=random.randint(0, 180))
        idx_p = random.randint(0, 7)
        ws3.cell(row=row_idx, column=1, value=f"ORD-{i:04d}").border = thin_border()
        ws3.cell(row=row_idx, column=2, value=random.choice(customers)).border = thin_border()
        ws3.cell(row=row_idx, column=3, value=round(random.uniform(200, 3000), 2)).border = thin_border()
        ws3.cell(row=row_idx, column=3).number_format = "$#,##0.00"
        ws3.cell(row=row_idx, column=4, value=products[idx_p]).border = thin_border()
        ws3.cell(row=row_idx, column=5, value=cats[idx_p]).border = thin_border()
        ws3.cell(row=row_idx, column=6, value=random.choice(regions)).border = thin_border()
        ws3.cell(row=row_idx, column=7, value=order_date.isoformat()).border = thin_border()
        ws3.cell(row=row_idx, column=7).number_format = "MM/DD/YYYY"
        ws3.cell(row=row_idx, column=8, value=random.choice(reps)).border = thin_border()

    for col, width in zip("ABCDEFGH", [14, 16, 14, 16, 16, 10, 14, 18]):
        col_width(ws3, col, width)


def _nivel4_practica(wb, lang):
    F = lambda n: f(lang, n)
    ws = wb.active
    ws.title = "PRACTICE Level 4"
    section_title(ws, 1, 1, "📝 LEVEL 4 PRACTICE — Excel Pro", "1F3864")
    note_cell(ws, 2, 1, "Advanced-level challenges. Combine multiple functions and build your own dashboard.")

    section_title(ws, 4, 1, "CHALLENGE 1: Custom LAMBDA function (Excel 365)", "4A148C")
    note_cell(ws, 5, 1, "LAMBDA lets you create your own functions. Enter these in the Name Manager.")
    lambda_examples = [
        ("TAX(amount)",  "=LAMBDA(amount, amount*0.16)",                    "Calculates 16% tax"),
        ("FINAL_PRICE",  "=LAMBDA(price, discount, price*(1-discount))",    "Price after discount"),
        ("WORKDAYS",     f"=LAMBDA(start,end, {F('NETWORKDAYS')}(start,end))", f"Wraps {F('NETWORKDAYS')}"),
        ("GRADE",        f'=LAMBDA(n, {F("IF")}(n>=9,"A",{F("IF")}(n>=7,"B","C")))', "Classifies a score as A/B/C"),
    ]
    header_row(ws, 6, ["Function name","LAMBDA code","Description"], "6A1B9A")
    for i, (name, code, desc) in enumerate(lambda_examples, 7):
        data_cell(ws, i, 1, name, bold=True)
        ws.cell(row=i, column=2, value=code).font = Font(name="Courier New", size=10, color="1A237E")
        ws.cell(row=i, column=2).border = thin_border()
        data_cell(ws, i, 3, desc)
        row_height(ws, i, 22)

    section_title(ws, 13, 1, "CHALLENGE 2: Build a minimum viable dashboard", "1565C0")
    note_cell(ws, 14, 1, "Create the following metrics using the data on the '03 Data' sheet in the examples file.")
    tasks = [
        ("Top 3 products by sales",       f"Combine {F('SORT')} + {F('UNIQUE')} + {F('SUMIFS')}"),
        ("Sales heat map by month and region", "PivotTable + Conditional Formatting color scale"),
        ("Missed-goal alert",             f'{F("IF")}({F("SUM")}(...)< target, "⚠️ ALERT", "✅ OK")'),
        ("Sparklines in a summary table", "Insert → Sparklines → Line"),
        ("Slicer",                        "PivotTable → PivotTable Analyze → Insert Slicer"),
    ]
    header_row(ws, 15, ["Task","Suggested technique","Status"], "1976D2")
    for i, (task, tech) in enumerate(tasks, 16):
        data_cell(ws, i, 1, task)
        data_cell(ws, i, 2, tech)
        c = data_cell(ws, i, 3, "⬜ To do")
        c.fill = PatternFill("solid", fgColor="FFF176")
        row_height(ws, i, 22)

    section_title(ws, 23, 1, "CHALLENGE 3: Complex nested formula — Classify customers", "2E7D32")
    note_cell(ws, 24, 1, f"Customer A: >$5000 total. Customer B: $2000-$5000. Customer C: <$2000. Use {F('SUMIFS')} + {F('IFS')}.")
    header_row(ws, 25, ["Customer","Total purchases (given)","Classification formula","Expected category"], "43A047")
    clients_data = [("TechCorp",8500),("StartupXYZ",3200),("GlobalTech",1800),("MegaStore",6100),("DataSoft",2900)]
    for i, (client, total) in enumerate(clients_data, 26):
        data_cell(ws, i, 1, client, bold=True)
        ws.cell(row=i, column=2, value=total).border = thin_border()
        ws.cell(row=i, column=2).number_format = "$#,##0"
        c = data_cell(ws, i, 3, "")
        c.fill = PatternFill("solid", fgColor="FFF176")
        expected = f'={F("IFS")}(B{i}>5000,"⭐ Customer A",B{i}>=2000,"🟡 Customer B",B{i}<2000,"Customer C")'
        ws.cell(row=i, column=4, value=expected).font = Font(name="Courier New", size=9, color="388E3C")
        ws.cell(row=i, column=4).border = thin_border()
        row_height(ws, i, 20)

    col_width(ws, "A", 30); col_width(ws, "B", 36); col_width(ws, "C", 22)


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════════════════════

_GENERATORS = {
    "nivel0": {"ejemplos": _nivel0_ejemplos, "practica": _nivel0_practica},
    "nivel1": {"ejemplos": _nivel1_ejemplos, "practica": _nivel1_practica},
    "nivel2": {"ejemplos": _nivel2_ejemplos, "practica": _nivel2_practica},
    "nivel3": {"ejemplos": _nivel3_ejemplos, "practica": _nivel3_practica},
    "nivel4": {"ejemplos": _nivel4_ejemplos, "practica": _nivel4_practica},
}

_LEVEL_COLORS = {
    "nivel0": "7B1D32",
    "nivel1": "1565C0",
    "nivel2": "2E7D32",
    "nivel3": "E65100",
    "nivel4": "4A148C",
}

_LEVEL_NAMES = {
    "nivel0": "Level 0 — Fundamentals",
    "nivel1": "Level 1 — Basic",
    "nivel2": "Level 2 — Intermediate",
    "nivel3": "Level 3 — Advanced",
    "nivel4": "Level 4 — Excel Pro",
}

_FILE_TYPE_LABELS = {
    "ejemplos": "Examples",
    "practica": "Practice",
}


def generate_excel(level_key: str, file_type: str, lang: str = "es") -> bytes:
    """
    Generate an English-language Excel file for the given level and type.

    Args:
        level_key: "nivel0" … "nivel4"
        file_type: "ejemplos" or "practica"
        lang: "es" (Spanish formula names) or "en" (English formula names)

    Returns:
        Raw .xlsx bytes ready to send as a file download.
    """
    if lang not in ("es", "en"):
        lang = "es"

    level_key = level_key.lower()
    file_type = file_type.lower()

    generators = _GENERATORS.get(level_key)
    if not generators:
        raise ValueError(f"Unknown level: {level_key}")

    gen_fn = generators.get(file_type)
    if not gen_fn:
        raise ValueError(f"Unknown file type: {file_type}. Use 'ejemplos' or 'practica'.")

    wb = Workbook()
    color = _LEVEL_COLORS.get(level_key, "1F3864")
    level_name = _LEVEL_NAMES.get(level_key, level_key)
    lang_label = "ES" if lang == "es" else "EN"
    type_label = _FILE_TYPE_LABELS.get(file_type, file_type.capitalize())

    # Cover sheet properties
    wb.active.sheet_properties.tabColor = color

    gen_fn(wb, lang)
    _formulas_to_english(wb)

    # Add a README sheet at the end
    ws_readme = wb.create_sheet("ℹ️ Instructions")
    ws_readme.sheet_properties.tabColor = "607D8B"
    section_title(ws_readme, 1, 1, f"📘 {level_name} — {type_label} File ({lang_label})", "1F3864")
    ws_readme.cell(row=3, column=1, value="Formula language:").font = bold_font()
    ws_readme.cell(row=3, column=2, value="Spanish" if lang == "es" else "English").font = bold_font(12, color)

    tips = [
        "• Enable macros if the file asks you to.",
        "• Yellow cells are the ones you need to complete in the exercises.",
        "• Green cells show the expected formula for reference.",
        "• Press Ctrl+` to show every formula in the workbook.",
        "• If you see #NAME?, try switching the formula language in your profile.",
        "• Save as .xlsx to share (or .xlsm if it contains macros).",
    ]
    for i, tip in enumerate(tips, 5):
        ws_readme.cell(row=i, column=1, value=tip).font = Font(size=11, color="1F3864")
        row_height(ws_readme, i, 18)

    col_width(ws_readme, "A", 65)

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf.read()
