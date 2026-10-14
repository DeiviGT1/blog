import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "Sort: putting data in order",
    content: [
      { type: "text", value: "Sorting is one of the most basic and most useful operations. But it has a dangerous trap you need to know about before you use it." },
      { type: "key_points", items: [
        { title: "The critical rule", text: "Always click inside the table (or select the whole table) before sorting. If you select just one column and sort, that column gets reordered but the others DON'T — misaligning all your data. This is one of the most destructive mistakes in Excel." },
        { title: "Sort A to Z / Z to A", text: "Sorts the active column in ascending or descending order. If you're inside a Table, Excel automatically sorts the whole table. If you're in a plain range, Excel asks whether you want to expand the selection — always say yes." },
        { title: "Shortcuts in the Quick Access Toolbar", text: "If you added Sort Ascending and Sort Descending to your Quick Access Toolbar (as we recommended), sorting takes a single click." },
      ]},
    ]
  },
  {
    title: "Sort by Multiple Levels",
    content: [
      { type: "text", value: "When you need to sort by more than one criterion, use Custom Sort." },
      { type: "key_points", items: [
        { title: "How to get there", text: "Home > Sort & Filter > Custom Sort, or Data > Sort. A dialog box opens where you define the sort levels." },
        { title: "How it works", text: "The first level is the main criterion. The second level sorts within the groups created by the first. Example: first by Region (A-Z), then within each region by Sales (largest to smallest). That way you see the regions in alphabetical order, with sales sorted inside each one." },
        { title: "Adding levels", text: "Click Add Level to add more criteria. You can have as many levels as you need. The order of the levels matters: the first one takes priority." },
      ]},
    ]
  },
  {
    title: "Filter: AutoFilter",
    content: [
      { type: "text", value: "Filter lets you show only the rows that meet certain criteria, temporarily hiding the rest. The data isn't deleted, just hidden." },
      { type: "definition_list", items: [
        { term: "Turning on Filter", def: "Ctrl+Shift+L or Data > Filter. Dropdown arrows appear on every column header. If your data is in a Table (Ctrl+T), the filters are already on." },
        { term: "Filtering by values", def: "Click the header arrow > a list of every unique value appears. Uncheck the ones you don't want to see. Use Select All to check or uncheck everything quickly." },
        { term: "Searching inside the filter", def: "The search box in the filter menu helps you find specific values when the list is very long. Type part of the text and the list filters in real time." },
      ]},
    ]
  },
  {
    title: "Filter types by data type",
    content: [
      { type: "text", value: "Excel offers different filter options depending on the column's data type. This makes filtering more intuitive and more powerful." },
      { type: "definition_list", items: [
        { term: "Text Filters", def: "Appear on text columns. Options: Equals, Does Not Equal, Begins With, Ends With, Contains, Does Not Contain. Example: filter names that contain 'Mar'." },
        { term: "Number Filters", def: "Appear on numeric columns. Options: Equals, Greater Than, Less Than, Between, Top 10, Above Average, Below Average. Example: sales greater than 5000." },
        { term: "Date Filters", def: "Appear on date columns. Options: Today, Yesterday, This Week, This Month, This Quarter, This Year, Last Month, Next Month, Between. Example: all sales from the current month." },
        { term: "Filter by Color", def: "If Conditional Formatting is applied, you can filter by cell color or font color. Example: show only the red cells (the ones with values below the threshold)." },
      ]},
    ]
  },
  {
    title: "Working with filtered data",
    content: [
      { type: "text", value: "When you apply a Filter, there are a few behaviors you need to know to avoid mistakes." },
      { type: "key_points", items: [
        { title: "The Status Bar respects the filter", text: "When you select a filtered range, the Status Bar (SUM, AVERAGE, COUNT) calculates using only the visible cells. That's correct and useful." },
        { title: "SUM formulas ignore the filter", text: "A formula like =SUM(A1:A100) adds ALL the values, including the ones hidden by the filter. If you need to add only what's visible, use =SUBTOTAL(109, A1:A100). The 109 means SUM, ignoring hidden rows." },
        { title: "Copy/Paste with a filter", text: "When you copy filtered data, only the visible cells are copied. That's handy for extracting a subset of data. But when you paste, it lands in consecutive rows, not in the original rows." },
      ]},
    ]
  },
  {
    title: "Clear Filter vs. Remove Filter",
    content: [
      { type: "text", value: "Two actions that sound alike but do different things." },
      { type: "definition_list", items: [
        { term: "Clear Filter (reset)", def: "Removes the filter criteria but keeps the dropdown arrows on the headers. All rows become visible again. Click the header arrow > Clear Filter From [column]." },
        { term: "Remove Filter (turn off)", def: "Turns filters off completely. The dropdown arrows disappear from the headers. Ctrl+Shift+L toggles it on and off. Useful when you no longer need to filter." },
        { term: "Visual indicator", def: "When a filter is active, the header arrow changes to a funnel icon, and the row numbers turn blue instead of black. This reminds you that there are hidden rows." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 6 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Sort and Filter</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Organize and find data fast. Sort by multiple criteria and filter to see only what you need.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Sort data by multiple criteria and use Filter to find exactly what you're looking for in any table.</p>
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
        {["Always click inside the table before sorting. Never select just one column.", "Custom Sort supports multiple levels: first by Region, then by Sales within each region.", "Ctrl+Shift+L turns AutoFilter on and off. Tables have it on by default.", "Text Filters, Number Filters, and Date Filters offer different options depending on the data type.", "SUM in a formula adds everything (hidden rows included). SUBTOTAL(109,...) adds only what's visible."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Basic Conditional Formatting</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Simple Charts</span>
      </div>
    </div>
  );
}
