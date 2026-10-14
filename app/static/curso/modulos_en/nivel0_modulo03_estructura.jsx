import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "The Fundamental Principle",
    content: [
      { type: "text", value: "This is the most important rule in the entire course. Once it becomes second nature, 80% of your Excel problems disappear before they start." },
      { type: "key_points", items: [
        { title: "One row = one record", text: "Each row represents a single item: a sale, an employee, a product, a transaction. Never put information from two different records in the same row." },
        { title: "One column = one field", text: "Each column represents a single type of information: name, date, amount, region, status. Never mix data types in the same column." },
      ]},
      { type: "text", value: "This principle is what makes Filter, Sort, PivotTables, SUMIFS and practically every analysis tool work correctly. When data isn't structured this way, nothing works well." },
    ]
  },
  {
    title: "Common Mistakes to Avoid",
    content: [
      { type: "text", value: "These are mistakes you'll see all the time in real-world files. Each one breaks some Excel feature." },
      { type: "definition_list", items: [
        { term: "Blank rows between data", def: "Excel reads an empty row as the end of the table. Sort, Filter and PivotTables stop including the rows below it. Never leave empty rows inside your data range." },
        { term: "Titles or notes inside the range", def: "If you put a title in row 1 and the data starts in row 3, Excel can get confused about what's data and what's decoration. Titles go outside the range or on another sheet." },
        { term: "One row with two records", def: "A cell that says \"John Smith - North Sales - $5,000\" should be 3 separate columns: Name, Region, Amount. One cell, one piece of data." },
        { term: "Mixing types in a column", def: "If an amount column has \"$1,000\" in one cell and \"Pending\" in another, Excel can't sum or analyze that column." },
        { term: "Totals inside the table", def: "A totals row at the bottom of your data makes PivotTables and SUMIFS include it in their calculations. Totals go outside the table." },
      ]},
    ]
  },
  {
    title: "Proper Headers",
    content: [
      { type: "text", value: "Headers are the first row of your table. Mistakes here cause problems down the line." },
      { type: "key_points", items: [
        { title: "Every column needs a header", text: "No exceptions. A column without a header confuses Filter, PivotTables and anyone who opens the file." },
        { title: "Headers must be unique", text: "Never repeat the same name. If you have two \"Amount\" columns, name them \"Sales Amount\" and \"Cost Amount\"." },
        { title: "A single header row", text: "Never use two rows. Multi-row headers break Filter and PivotTables. Use \"Sales Q1\", \"Sales Q2\" instead of one row for \"Sales\" and another for \"Q1, Q2\"." },
        { title: "Descriptive and short", text: "Good: \"Region\", \"Sale Date\", \"Unit Price\". Bad: \"a\", \"column 3\", \"last month's data\"." },
      ]},
    ]
  },
  {
    title: "How to Organize a Worksheet",
    content: [
      { type: "text", value: "Not everything belongs in the same area. Organizing the sections of your Worksheet prevents confusion and errors." },
      { type: "key_points", items: [
        { title: "Raw data", text: "Starts in A1. It's the main table. Always top-left. Never start a table in F15 without a reason." },
        { title: "Summaries and calculations", text: "Keep them separate: to the right, below with some space, or on another sheet. Don't mix raw data with summary formulas." },
        { title: "Parameters or inputs", text: "Variables the user changes (tax rate, exchange rate, cutoff date) go in a clearly marked area or on an \"Inputs\" sheet." },
      ]},
      { type: "text", value: "The idea: when someone opens your file, they should understand within 10 seconds where the data is, where the calculations are, and what they can change." },
    ]
  },
  {
    title: "Data Range vs. Table (Ctrl+T)",
    content: [
      { type: "text", value: "A range is any group of cells. A Table is a range that Excel formally recognizes as a data structure. The difference is huge. To convert: select any cell inside your data and press Ctrl+T." },
      { type: "definition_list", items: [
        { term: "Expands automatically", def: "When you add a row at the bottom, the Table grows on its own. Charts, PivotTables and Named Ranges that point to it update too." },
        { term: "Built-in filters", def: "Filter drop-downs appear automatically on every header when you create the Table." },
        { term: "Structured references", def: "Instead of =SUM(C2:C100), you write =SUM(Table1[Sales]). It's easier to read and adjusts to the size of the table." },
        { term: "Better with PivotTables", def: "When a PivotTable's source is a Table, new data is included automatically on Refresh." },
        { term: "Consistent visual formatting", def: "Banded rows that make it easier to read. You can change the style from Table Design." },
      ]},
      { type: "key_points", items: [
        { title: "The recommendation", text: "Always convert your data to a Table. It's almost always the best choice. The only exceptions are very small reference tables or compatibility with external systems." },
      ]},
    ]
  },
];

const Render = ({ sections }) => {
  const [openSection, setOpenSection] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sections.map((section, si) => {
        const isOpen = openSection === si;
        return (
          <div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}`, transition: "all 0.2s" }}>
            <div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600], transition: "all 0.2s" }}>{si + 1}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{section.title}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 16px 16px 56px" }}>
                {section.content.map((block, bi) => {
                  if (block.type === "text") return <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>{block.value}</p>;
                  if (block.type === "definition_list") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((it, di) => (<div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}><div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{it.term}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{it.def}</div></div>))}</div>);
                  if (block.type === "key_points") return (<div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>{block.items.map((it, ki) => (<div key={ki} style={{ borderLeft: `2px solid ${V[200]}`, paddingLeft: 14 }}><div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>{it.title}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{it.text}</div></div>))}</div>);
                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Module() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800] }}>LEVEL 0 — REQUIRED</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 3 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Data Structure and Organization</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>The most important rule in Excel: data must be structured as a table. Everything else depends on it.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Understand and apply the right data structure so every Excel tool works the way it should.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["One row = one record. One column = one field. No exceptions.","Never leave blank rows inside your data table.","Headers must be unique, descriptive and in a single row.","Keep raw data separate from calculations and parameters.","Always convert your data to a Table (Ctrl+T). It expands on its own, has filters and works better with everything."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Navigation and Keyboard Shortcuts</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Formatting with Purpose</span>
      </div>
    </div>
  );
}
