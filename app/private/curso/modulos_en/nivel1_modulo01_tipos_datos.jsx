import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "The 5 fundamental data types",
    content: [
      { type: "text", value: "Everything you type into a cell, Excel classifies internally as one of these types. Understanding this prevents 80% of the errors that frustrate beginners." },
      { type: "definition_list", items: [
        { term: "Text", def: "Any data Excel can't interpret as a number or date. Left-aligned by default. Examples: names, addresses, alphanumeric codes." },
        { term: "Numbers", def: "Numeric values Excel can calculate with. Right-aligned by default. Includes integers, decimals, and negatives." },
        { term: "Dates", def: "Internally they're numbers (January 1, 1900 = 1). Excel displays them as dates, but you can add, subtract, and do math with them like any other number." },
        { term: "Booleans", def: "TRUE or FALSE. Returned by logical functions like IF or comparisons like =A1>100. They're the foundation of all conditional logic." },
        { term: "Errors", def: "When something goes wrong in a formula: #DIV/0! (division by zero), #VALUE! (wrong data type), #REF! (broken reference), #N/A (not found), #NAME? (misspelled function)." },
      ]},
    ]
  },
  {
    title: "How Excel decides the data type",
    content: [
      { type: "text", value: "When you type something into a cell, Excel tries to interpret it automatically. That works most of the time, but it causes problems when the interpretation isn't what you expected." },
      { type: "definition_list", items: [
        { term: "You type 123", def: "Excel reads it as a number. It's right-aligned." },
        { term: "You type 12/03/2025", def: "Excel reads it as a date. It stores a number internally and displays a date." },
        { term: "You type ABC", def: "Excel reads it as text. It's left-aligned." },
        { term: "You type 001234", def: "Excel drops the leading zeros and turns it into 1234. To keep the zeros, format the cell as Text before typing or use an apostrophe: '001234." },
        { term: "You type 3/4", def: "Excel may read it as a date instead of a fraction (which date depends on your regional settings: March 4 in MM/DD format, or April 3 in DD/MM). Type 0 3/4 for a fraction or use Text format." },
        { term: "A number with a space", def: "If there's an invisible space before or after the number, Excel treats it as text. It's left-aligned and formulas won't recognize it as a number." },
      ]},
    ]
  },
  {
    title: "How to force the data type",
    content: [
      { type: "text", value: "When Excel's automatic interpretation isn't what you need, you have tools to take control." },
      { type: "key_points", items: [
        { title: "Apostrophe (') before the value", text: "Forces the content to be text. Example: '001234 keeps the zeros. '12/03 stays as text instead of becoming a date. The apostrophe isn't visible in the cell, only in the Formula Bar." },
        { title: "Number Format before typing", text: "If you format the cell as Text before typing, everything you enter stays as text. Useful for columns of codes, IDs, or phone numbers." },
        { title: "Format Cells (Ctrl+1)", text: "Changes how a value is displayed without changing the actual value. A number can be shown as Currency, Percentage, Date, or a Custom Format, depending on what you need." },
      ]},
    ]
  },
  {
    title: "Number Format: what you see vs. what's there",
    content: [
      { type: "text", value: "This concept is fundamental: a cell has an actual value (what Excel stores) and an appearance (what you see). Number Format controls the appearance without changing the value." },
      { type: "definition_list", items: [
        { term: "General", def: "No specific format. Excel displays the value exactly as it's stored." },
        { term: "Number", def: "Controls decimals and the thousands separator. Example: 1234.5 displays as 1,234.50 with the #,##0.00 format." },
        { term: "Currency", def: "Adds a currency symbol: $1,234.50. Useful for financial reports." },
        { term: "Percentage", def: "Multiplies by 100 and adds %. The value 0.15 displays as 15%. Careful: if you type 15 and then apply Percentage, it shows 1500%." },
        { term: "Date", def: "Displays a number as a date. Many formats available: DD/MM/YYYY, MM-DD-YY, MMM-YYYY, etc." },
        { term: "Text", def: "Everything is treated as text. Useful for codes with leading zeros or alphanumeric IDs." },
        { term: "Custom", def: "Custom formats. Examples: #,##0 (thousands, no decimals), 0.0% (percentage with 1 decimal), dd-mmm-yyyy (date shown as 15-Mar-2025)." },
      ]},
    ]
  },
  {
    title: "Efficient data entry",
    content: [
      { type: "text", value: "How you enter data matters as much as what you enter. These patterns make you faster and reduce errors." },
      { type: "key_points", items: [
        { title: "Enter confirms and moves down, Tab confirms and moves right", text: "To fill a table row by row: Tab, Tab, Tab... then Enter at the end. Excel automatically jumps back to the first column of the next row. That way you fill tables without touching the mouse." },
        { title: "Select the range first", text: "Select the range where you'll type the data. Tab moves within the selection. When you reach the end of a row, it jumps to the first cell of the next one. That way you never accidentally leave the range." },
        { title: "AutoFill with the Fill Handle", text: "The small square in the bottom-right corner of the selected cell. Drag it to create sequences: 1,2,3... or Jan,Feb,Mar... or Monday,Tuesday... Excel detects the pattern and continues it." },
        { title: "Double-click the Fill Handle", text: "If the adjacent column has data, double-clicking the Fill Handle fills down automatically as far as that data goes. The fastest way to apply a formula to hundreds of rows." },
        { title: "Flash Fill (Ctrl+E)", text: "Excel 365 detects transformation patterns. If A1 has 'John Smith' and you type 'John' in B1, pressing Ctrl+E in B2 makes Excel fill in the first names for the whole range automatically." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 1 — BASIC</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 1 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Data Types and Data Entry</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Understand how Excel interprets what you type and why it sometimes behaves unexpectedly.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Understand how Excel classifies data, how to control the data type, and how to enter information efficiently.</p>
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
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["Excel classifies everything as Text, Numbers, Dates, Booleans, or Errors. Alignment tells you the type: left = text, right = number.", "Number Format changes how a value looks, not the actual value. 0.15 can display as 15% or $0.15.", "Watch out for leading zeros (001234) and fractions (3/4) — Excel can misinterpret them.", "Tab to fill across a row, Enter to move down. Select the range first so you stay inside it.", "Flash Fill (Ctrl+E) detects patterns and completes data automatically. It feels like magic."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Level 1 — Basic</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Arithmetic Formulas</span>
      </div>
    </div>
  );
}
