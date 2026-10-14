import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "The problem they solve", content: [
    { type: "text", value: "The formula =SUMIFS(D2:D5000, A2:A5000, \"North\", C2:C5000, \">1000\") works, but it tells you nothing about what those ranges are. With Named Ranges, the same formula becomes =SUMIFS(Sales, Region, \"North\", Amount, \">1000\"). Readable, clear, professional." },
  ]},
  { title: "How to create a Named Range", content: [
    { type: "key_points", items: [
      { title: "Quick way: Name Box", text: "Select the range, click the Name Box (to the left of the Formula Bar), and type the name. Press Enter. Done." },
      { title: "Full way: Define Name", text: "Formulas > Define Name. Lets you set the Scope (Workbook or a specific Sheet) and add a descriptive comment." },
      { title: "From a Table", text: "When you convert data to a Table (Ctrl+T), Excel creates structured names automatically. If the Table is called Sales, you can reference Sales[Region], Sales[Amount], and so on." },
    ]},
  ]},
  { title: "Name Manager", content: [
    { type: "text", value: "Formulas > Name Manager is the central tool for managing every name in a Workbook. From here you can view, edit, delete, and check which range each name points to." },
    { type: "key_points", items: [
      { title: "View all names", text: "A full list with name, current value, referenced range, and scope. Useful for auditing a file you inherited." },
      { title: "Edit ranges", text: "If your table grew, you can update the range here. With Tables this happens automatically." },
      { title: "Delete orphans", text: "Names that point to ranges that no longer exist (#REF!). Clean them up regularly." },
    ]},
  ]},
  { title: "Using them in formulas, Data Validation, and more", content: [
    { type: "definition_list", items: [
      { term: "In formulas", def: "=SUM(Sales) instead of =SUM(D2:D5000). More readable, and it updates if the range changes." },
      { term: "In Data Validation", def: "Source for a drop-down list: =StatusList instead of =$H$2:$H$5. Cleaner." },
      { term: "In Conditional Formatting", def: "Rules can reference Named Ranges to make them clearer." },
      { term: "In Charts", def: "A Chart's data ranges can point to Named Ranges. If the data grows, you only update the name." },
    ]},
  ]},
  { title: "Naming conventions", content: [
    { type: "key_points", items: [
      { title: "No spaces", text: "Use underscores or camelCase: Sales_North or SalesNorth, not 'north sales'." },
      { title: "Don't use cell names", text: "Don't name a range 'A1' or 'R1C1'. Excel gets confused." },
      { title: "Be descriptive", text: "The name should say what it holds: ProductPrices, EmployeeList, TaxRate. Not x, temp, data1." },
      { title: "Document them", text: "In Name Manager, use the Comments field to describe important names. Your future self will thank you." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 7 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Named Ranges</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Name your ranges for more readable formulas and files that are easier to maintain.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Be able to create, manage, and use Named Ranges in formulas, Data Validation, and Charts for more professional work.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["The Name Box is the fastest way: select, type a name, press Enter.", "Name Manager (Formulas tab) lets you view, edit, and clean up every name.", "Tables create structured names automatically: Table1[Column].", "Use Named Ranges in formulas, Data Validation, Conditional Formatting, and Charts.", "Keep names descriptive, without spaces, and documented with Comments."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Data Validation</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: PivotTables from Scratch</span>
      </div>
    </div>
  );
}
