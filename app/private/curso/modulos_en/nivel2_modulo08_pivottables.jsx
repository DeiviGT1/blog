import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "What a PivotTable is", content: [
    { type: "text", value: "A tool that takes a data table and lets you summarize, group, and analyze it by dragging fields, without writing a single formula. What would take dozens of SUMIFS, COUNTIFS, and filters, a PivotTable does in seconds." },
    { type: "text", value: "It's the main reason people say someone 'knows Excel'. If you master PivotTables, you can analyze any dataset." },
  ]},
  { title: "Source data requirements", content: [
    { type: "key_points", items: [
      { title: "Tabular format", text: "One row per record, headers in the first row, no blank rows, no merged cells. Everything you learned in Level 0." },
      { title: "Use a Table (Ctrl+T)", text: "If the source is a Table, the PivotTable adjusts automatically as the data grows. If it's a regular range, you'll have to update the range by hand." },
      { title: "Clean data", text: "No mixed data types in a column, no inconsistent values (North, NORTH, north should all be the same). Clean first, analyze later." },
    ]},
  ]},
  { title: "How to create a PivotTable", content: [
    { type: "key_points", items: [
      { title: "Step 1", text: "Click anywhere inside your data table." },
      { title: "Step 2", text: "Insert > PivotTable. Excel detects the range automatically." },
      { title: "Step 3", text: "Choose where to place it: New Worksheet (most common) or Existing Worksheet." },
      { title: "Step 4", text: "The PivotTable Fields pane appears with 4 areas: Rows, Columns, Values, Filters." },
    ]},
  ]},
  { title: "The 4 areas of PivotTable Fields", content: [
    { type: "definition_list", items: [
      { term: "Rows", def: "What goes in each row. Drag 'Region' here and you'll get one row per region." },
      { term: "Columns", def: "What goes in each column. Drag 'Product' here and you'll get one column per product. Combined with Rows, it creates a matrix." },
      { term: "Values", def: "What gets calculated. Drag 'Sales' here and you'll see total sales. By default, numbers are summed (SUM) and text is counted (COUNT)." },
      { term: "Filters", def: "Report-level filters. Drag 'Year' here and you can filter the whole PivotTable by year from a drop-down at the top." },
    ]},
    { type: "text", value: "The magic: you can reshape it in seconds just by dragging fields between areas. Want sales by product instead of by region? Drag Region out and Product into Rows. Done." },
  ]},
  { title: "Summary functions and Show Values As", content: [
    { type: "definition_list", items: [
      { term: "Change the summary function", def: "Right-click a value > Summarize Values By > AVERAGE, MAX, MIN, COUNT, etc. You're not limited to SUM." },
      { term: "% of Grand Total", def: "Show Values As > % of Grand Total. Each cell shows its percentage of the overall total." },
      { term: "% of Column Total", def: "Each cell as a percentage of its column. Useful for comparing distributions." },
      { term: "Running Total", def: "A cumulative total. Useful for seeing how sales build up month over month." },
      { term: "Difference From", def: "The difference from a base item. Useful for comparing each region against a benchmark." },
    ]},
  ]},
  { title: "Refreshing and maintenance", content: [
    { type: "key_points", items: [
      { title: "Refresh", text: "When the data changes, the PivotTable doesn't update on its own. Right-click > Refresh, or PivotTable Analyze > Refresh. If your source is a Table, the range adjusts automatically." },
      { title: "Change Data Source", text: "If the data grew beyond the original range (and you didn't use a Table), go to PivotTable Analyze > Change Data Source to update the range." },
    ]},
  ]},
  { title: "Formatting and design", content: [
    { type: "definition_list", items: [
      { term: "PivotTable Styles", def: "The PivotTable Design tab offers built-in styles. Pick a clean one with subtle banding." },
      { term: "Report Layout", def: "PivotTable Design > Report Layout. Compact (default), Outline, Tabular. Tabular looks the most like a regular table and is the best for copying data." },
      { term: "Subtotals and Grand Totals", def: "Turn them on or off from PivotTable Design. Sometimes subtotals are unnecessary and removing them gives a cleaner look." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 8 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>PivotTables from Scratch</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Excel's most powerful tool: summarize, group, and analyze data by dragging fields.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Be able to build PivotTables from scratch, set up the 4 areas, change summary functions, and keep them up to date.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["Clean data in tabular format is the prerequisite. Without it, the PivotTable won't work well.", "The 4 areas: Rows, Columns, Values (calculations), Filters (report-level filters).", "Drag fields between areas to reshape your analysis in seconds.", "Show Values As turns numbers into percentages, running totals, or differences.", "Use a Table as the source so the PivotTable adjusts automatically as the data grows."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Named Ranges</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Advanced Charts</span>
      </div>
    </div>
  );
}
