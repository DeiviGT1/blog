import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Why INDEX + MATCH if XLOOKUP already exists", content: [
    { type: "key_points", items: [
      { title: "Existing files", text: "Millions of corporate files use INDEX+MATCH. You need to be able to read and edit it." },
      { title: "Universal compatibility", text: "It works in every version of Excel. XLOOKUP only works in 365." },
      { title: "Two-way lookups", text: "INDEX with a double MATCH lets you look up in two dimensions (row + column) more intuitively than XLOOKUP." },
    ]},
  ]},
  { title: "MATCH — finds the position", content: [
    { type: "definition_list", items: [
      { term: "Syntax", def: "=MATCH(lookup_value, lookup_array, [match_type]). It doesn't return a value but a position (a row or column number)." },
      { term: "Example", def: "=MATCH(\"North\", A2:A100, 0) returns the row number within the range where \"North\" appears. The 0 = exact match." },
      { term: "Always use 0", def: "The third argument should almost always be 0 (exact). 1 and -1 are for approximate matches you'll rarely need." },
    ]},
  ]},
  { title: "INDEX — returns a value by position", content: [
    { type: "definition_list", items: [
      { term: "Syntax", def: "=INDEX(array, row_num, [column_num]). Returns the value at a specific position in a range." },
      { term: "Example", def: "=INDEX(C2:C100, 5) returns the fifth value in the range C2:C100." },
      { term: "In two dimensions", def: "=INDEX(B2:F10, 3, 4) returns the value at row 3, column 4 of the range." },
    ]},
  ]},
  { title: "The INDEX + MATCH combo", content: [
    { type: "text", value: "Together, INDEX + MATCH do what VLOOKUP does, but without the restrictions. MATCH finds the position, INDEX returns the value at that position." },
    { type: "definition_list", items: [
      { term: "Formula", def: "=INDEX(C2:C100, MATCH(F1, A2:A100, 0)). In plain English: find F1 in column A, give me its position, and use that position to give me the matching value from column C." },
      { term: "Key advantage", def: "The return column (C) can be in any direction relative to the lookup column (A). It doesn't have VLOOKUP's limitation." },
      { term: "Practical example", def: "Looking up a product's price: =INDEX(Prices, MATCH(\"Laptop\", ProductNames, 0)). With Named Ranges, it reads very clearly." },
    ]},
  ]},
  { title: "Two-way lookup with a double MATCH", content: [
    { type: "text", value: "INDEX with a double MATCH lets you look up values in two-way tables: finding the value at the intersection of a specific row and column." },
    { type: "definition_list", items: [
      { term: "Formula", def: "=INDEX(B2:F10, MATCH(\"North\", A2:A10, 0), MATCH(\"Q3\", B1:F1, 0))." },
      { term: "How it works", def: "The first MATCH looks for \"North\" in the rows and returns its position. The second MATCH looks for \"Q3\" in the columns and returns its position. INDEX returns the value at that intersection." },
      { term: "Use cases", def: "Rate tables, price matrices, schedules. Any table where you need to look up by row AND by column." },
    ]},
  ]},
  { title: "Head-to-head comparison", content: [
    { type: "key_points", items: [
      { title: "VLOOKUP", text: "The simplest but the most limited. Only searches the first column and uses a hard-coded column number." },
      { title: "XLOOKUP", text: "The most modern and readable. No direction restrictions, with a built-in default value. Excel 365 only." },
      { title: "INDEX + MATCH", text: "The most flexible and universal. Works in every version. Supports two-way lookups. The corporate standard." },
    ]},
  ]},
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 3 — ADVANCED</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 2 of 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>INDEX + MATCH</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>The most flexible lookup combo: no restrictions, two-way, compatible with everything.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Master INDEX + MATCH for one-way and two-way lookups, and understand when to use it vs. XLOOKUP.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["MATCH finds the position. INDEX returns the value at that position. Together they're powerful.", "=INDEX(return_range, MATCH(lookup_value, lookup_range, 0)) is the base formula.", "Double MATCH for two-way lookups: INDEX(range, MATCH(row), MATCH(col)).", "Works in every version of Excel. It's the corporate standard.", "For new work in 365, use XLOOKUP. For compatibility or two-way lookups, INDEX+MATCH."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: VLOOKUP and XLOOKUP</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Nested Formulas and Dynamic Arrays</span>
      </div>
    </div>
  );
}
