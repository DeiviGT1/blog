import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "SUMIF — sum with one criterion", content: [
    { type: "text", value: "SUMIF adds up the values in a range only where a condition is met. After SUM, it's the most widely used analysis function. Syntax: =SUMIF(range, criteria, sum_range)." },
    { type: "definition_list", items: [
      { term: "Example", def: "=SUMIF(A2:A100, \"North\", C2:C100). Adds up the values in column C only where column A says 'North'. First argument: where to look. Second: what to look for. Third: what to add up." },
      { term: "With operators", def: "=SUMIF(B2:B100, \">1000\", C2:C100). Adds up column C where column B is greater than 1000. Operators go inside quotes." },
      { term: "With a cell reference", def: "=SUMIF(A2:A100, E1, C2:C100). Uses the value in E1 as the criterion. That way you can change the criterion without editing the formula." },
    ]},
  ]},
  { title: "SUMIFS — sum with multiple criteria", content: [
    { type: "text", value: "SUMIFS extends SUMIF to several conditions at once. Important note: in SUMIFS the sum range comes FIRST (the opposite of SUMIF)." },
    { type: "definition_list", items: [
      { term: "Syntax", def: "=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...). Adds up values where ALL conditions are met." },
      { term: "Example", def: "=SUMIFS(D2:D100, A2:A100, \"North\", B2:B100, \"Electronics\"). Adds up sales where the region is North AND the category is Electronics." },
      { term: "With dates", def: "=SUMIFS(D2:D100, E2:E100, \">=\"&DATE(2025,1,1), E2:E100, \"<\"&DATE(2025,4,1)). Adds up sales for Q1 2025." },
    ]},
  ]},
  { title: "COUNTIF and COUNTIFS — count with criteria", content: [
    { type: "text", value: "Same logic as SUMIF/SUMIFS, but counting instead of adding. How many rows meet the condition?" },
    { type: "definition_list", items: [
      { term: "COUNTIF", def: "=COUNTIF(A2:A100, \"North\"). Counts how many cells in the range say 'North'. =COUNTIF(B2:B100, \">1000\"). Counts how many cells are greater than 1000." },
      { term: "COUNTIFS", def: "=COUNTIFS(A2:A100, \"North\", B2:B100, \">1000\"). Counts how many rows are from North AND have a value greater than 1000." },
      { term: "Counting duplicates", def: "=COUNTIF(A2:A100, A2). If it returns >1, the value in A2 appears more than once. Handy for spotting duplicates." },
    ]},
  ]},
  { title: "AVERAGEIF and AVERAGEIFS", content: [
    { type: "text", value: "The same pattern, but for averages. The syntax is identical to SUMIF/SUMIFS." },
    { type: "definition_list", items: [
      { term: "AVERAGEIF", def: "=AVERAGEIF(A2:A100, \"North\", C2:C100). Average sales for the North region only." },
      { term: "AVERAGEIFS", def: "=AVERAGEIFS(D2:D100, A2:A100, \"North\", B2:B100, \"Electronics\"). Average sales for North + Electronics." },
    ]},
  ]},
  { title: "Operators and wildcards in criteria", content: [
    { type: "text", value: "Criteria aren't limited to exact text. You can use comparison operators and wildcards for more flexible conditions." },
    { type: "definition_list", items: [
      { term: "\">\"&value", def: "Greater than. Example: \">1000\" or \">\"&E1 to use a reference." },
      { term: "\"<=\"&value", def: "Less than or equal to. Example: \"<=\"&E1." },
      { term: "\"<>\"&value", def: "Not equal to. Example: \"<>North\" counts everything except North." },
      { term: "* (asterisk)", def: "Wildcard: any number of characters. \"Mar*\" matches March, Marketing, Maria." },
      { term: "? (question mark)", def: "Wildcard: exactly one character. \"A?\" matches AB, AC, A1 but not ABC." },
    ]},
  ]},
  { title: "The mental pattern", content: [
    { type: "text", value: "All these functions follow the same logic: 'calculate something, but only where this condition is met'. Once you get the pattern, you can learn any variant in minutes." },
    { type: "key_points", items: [
      { title: "SUMIF/SUMIFS", text: "What do the values that meet the condition add up to?" },
      { title: "COUNTIF/COUNTIFS", text: "How many rows meet the condition?" },
      { title: "AVERAGEIF/AVERAGEIFS", text: "What is the average of the values that meet the condition?" },
      { title: "The pattern", text: "They all use: a range to search + what to look for + (optionally) a range to calculate on. The version ending in S accepts multiple criteria." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 2 — INTERMEDIATE</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 3 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>SUMIF, SUMIFS, COUNTIF, COUNTIFS</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Sum and count data by applying criteria. The foundation of real-world data analysis in Excel.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Sum, count, and average data by applying one or more criteria with Excel's conditional functions.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => {
          const isOpen = openSection === si;
          return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}>
            <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span>
            </div>
            {isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}
          </div>);
        })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["SUMIF: where to look + what to look for + what to sum. SUMIFS: what to sum goes FIRST.", "COUNTIF/COUNTIFS follow the same pattern but count instead of sum.", "Operators in criteria go inside quotes: \">1000\", \"<>North\".", "Wildcards: * for any text, ? for a single character.", "The pattern is always the same: calculate something, but only where the condition is met."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Conditional Functions</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Text Functions</span>
      </div>
    </div>
  );
}
