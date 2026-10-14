import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "How Excel stores dates", content: [
    { type: "text", value: "Under the hood, every date is a number. January 1, 1900 is number 1. Today is a five-digit number. That means you can add, subtract, and do math with dates just like numbers. Subtract two dates and you get the difference in days." },
  ]},
  { title: "Extraction functions: TODAY, NOW, YEAR, MONTH, DAY", content: [
    { type: "definition_list", items: [
      { term: "TODAY()", def: "Returns the current date. It updates every time the sheet recalculates. It takes no arguments." },
      { term: "NOW()", def: "Returns the current date and time. Useful for timestamps." },
      { term: "YEAR(date)", def: "Extracts the year. =YEAR(\"3/15/2025\") returns 2025." },
      { term: "MONTH(date)", def: "Extracts the month as a number. =MONTH(\"3/15/2025\") returns 3." },
      { term: "DAY(date)", def: "Extracts the day. =DAY(\"3/15/2025\") returns 15." },
    ]},
  ]},
  { title: "Date calculations", content: [
    { type: "definition_list", items: [
      { term: "Difference in days", def: "=TODAY()-A1 gives how many days have passed since the date in A1. =A2-A1 gives the days between two dates." },
      { term: "Adding days", def: "=A1+30 adds 30 days to a date." },
      { term: "EDATE(start_date, months)", def: "Adds or subtracts exact months. =EDATE(A1, 3) adds 3 months. =EDATE(A1, -1) subtracts 1 month." },
      { term: "EOMONTH(start_date, months)", def: "Returns the last day of the resulting month. =EOMONTH(TODAY(), 0) = last day of the current month. =EOMONTH(TODAY(), 1) = last day of next month." },
    ]},
  ]},
  { title: "DATEDIF — the hidden function", content: [
    { type: "text", value: "DATEDIF calculates the difference between two dates in years, months, or days. It doesn't show up in Excel's autocomplete, but it works perfectly." },
    { type: "definition_list", items: [
      { term: "Syntax", def: "=DATEDIF(start_date, end_date, unit). Units: \"Y\" (years), \"M\" (months), \"D\" (days)." },
      { term: "Age", def: "=DATEDIF(A1, TODAY(), \"Y\") calculates age in years if A1 is the date of birth." },
      { term: "Tenure", def: "=DATEDIF(A1, TODAY(), \"M\") calculates an employee's tenure in months." },
    ]},
  ]},
  { title: "NETWORKDAYS — working days", content: [
    { type: "definition_list", items: [
      { term: "Syntax", def: "=NETWORKDAYS(start_date, end_date, [holidays]). Counts business days, excluding Saturdays, Sundays, and optional holidays." },
      { term: "Example", def: "=NETWORKDAYS(A1, B1) counts the working days between two dates. If you have a list of holidays in E1:E10, use =NETWORKDAYS(A1, B1, E1:E10)." },
      { term: "Typical use", def: "Calculating delivery lead times, SLA response times, and the real duration of projects." },
    ]},
  ]},
  { title: "Common date mistakes", content: [
    { type: "definition_list", items: [
      { term: "Date stored as text", def: "If a date is left-aligned, Excel is treating it as text. You can't do math with it. Fix: DATEVALUE(text) converts it to a real date." },
      { term: "DD/MM vs MM/DD format", def: "When importing data, 03/04/2025 can mean April 3 or March 4 depending on regional settings. Always double-check." },
      { term: "Doing math with text that looks like a date", def: "If =A1-B1 returns #VALUE!, one of the cells contains text instead of a date. Check the alignment." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 5 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Date Functions</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Work with dates fluently: TODAY, DATEDIF, EDATE, EOMONTH, NETWORKDAYS, and more.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Calculate date differences, deadlines, tenure, and working days with Excel's date functions.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["Dates are numbers under the hood. Subtracting two dates gives the difference in days.", "TODAY() for the current date, NOW() for date and time. YEAR/MONTH/DAY to extract parts.", "DATEDIF doesn't show up in autocomplete, but it calculates differences in years, months, or days.", "NETWORKDAYS counts working days, excluding weekends and holidays.", "If a date is left-aligned, it's text. Use DATEVALUE() to convert it."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Text Functions</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Data Validation</span>
      </div>
    </div>
  );
}
