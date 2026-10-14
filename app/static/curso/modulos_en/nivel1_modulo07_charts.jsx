import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "When to use a Chart",
    content: [
      { type: "text", value: "A Chart exists to answer a visual question: How do these values compare? What's the trend? What share does each category have? If your Chart doesn't answer a clear question, you probably don't need it — or you picked the wrong type." },
      { type: "text", value: "The rule: choose the Chart that answers your question as clearly as possible. A poorly chosen Chart is more confusing than a plain table of numbers." },
    ]
  },
  {
    title: "The 4 basic types",
    content: [
      { type: "text", value: "Each Chart type exists for a specific purpose. Choosing the right one is the most important decision you'll make." },
      { type: "definition_list", items: [
        { term: "Column Chart (vertical bars)", def: "For comparing values across categories. Examples: sales by region, expenses by department, output by month. The most versatile and most widely used type. Go with this one when in doubt." },
        { term: "Bar Chart (horizontal bars)", def: "Same as Column, but horizontal. Use it when category names are long and don't fit under vertical bars. Example: sales by product name." },
        { term: "Line Chart (lines)", def: "For showing trends over time or another continuous sequence. Examples: monthly sales, quarterly growth, daily temperature. The X axis usually represents time (days, months, years) or another sequential variable." },
        { term: "Pie Chart (circle)", def: "For showing each part's share of the total. Example: expense breakdown by category. Only use it with a few categories (5-6 max). With more than that, it becomes unreadable." },
      ]},
    ]
  },
  {
    title: "How to create a Chart",
    content: [
      { type: "text", value: "The process is simple: select the data, insert the Chart, customize it. Excel does most of the work." },
      { type: "key_points", items: [
        { title: "Select the right data", text: "Include the headers in your selection. Excel uses them as labels automatically. Select only the relevant columns — not the whole table if you don't need all of it." },
        { title: "Insert > Charts", text: "The Insert tab shows chart types based on your data. Excel 365 has a 'Recommended Charts' button that suggests the best type for the way your data is structured." },
        { title: "Alt+F1", text: "Creates an instant Chart on the same sheet from the selected data. The fastest way to make a chart." },
        { title: "F11", text: "Creates the Chart on a new, dedicated sheet. Useful when the chart is important and deserves its own space." },
      ]},
    ]
  },
  {
    title: "Chart Elements",
    content: [
      { type: "text", value: "Chart elements control what information is shown and how. Each one has a purpose." },
      { type: "definition_list", items: [
        { term: "Chart Title", def: "It should always be descriptive. 'Chart 1' says nothing. 'Sales by Region Q1 2025' says exactly what the chart shows. A good title makes the chart understandable without any explanation." },
        { term: "Axis Labels", def: "Labels that explain what each axis represents. X axis = categories or time. Y axis = values. Include units when relevant (USD, units, %)." },
        { term: "Legend", def: "Only needed when there's more than one data series. With a single series, the legend is redundant — delete it for a cleaner look." },
        { term: "Data Labels", def: "The numeric values shown on each bar or point. Useful when the exact number matters, but they can clutter the chart when there's a lot of data. Use them selectively." },
        { term: "Gridlines", def: "The background lines that help you estimate values. Horizontal gridlines are usually useful; vertical ones rarely are. Removing them gives a cleaner look." },
      ]},
      { type: "text", value: "To add or remove elements: click the Chart > the '+' button (Chart Elements) that appears on the right. From there you turn each element on or off with a checkbox." },
    ]
  },
  {
    title: "Professional design",
    content: [
      { type: "text", value: "A professional Chart looks clean, communicates one clear idea, and needs no explanation. These principles will get you there." },
      { type: "key_points", items: [
        { title: "No 3D effects", text: "Ever. 3D effects distort how values are read and make the chart look amateurish. Always use flat (2D) charts." },
        { title: "Chart Styles", text: "Chart Design > Chart Styles offers preset styles. Pick a clean one, then customize it. It's faster than designing from scratch." },
        { title: "Consistent colors", text: "Use a limited palette. If your report has 3 charts, the colors should be consistent across all of them. Don't use a different color on each chart without a reason." },
        { title: "Clean background", text: "The Chart area should have a white or transparent background. Never use patterned backgrounds or strong colors that compete with the data." },
        { title: "The 5-second test", text: "If someone can't understand your chart in 5 seconds, it probably has too much information, the wrong chart type, or no clear title." },
      ]},
    ]
  },
  {
    title: "Moving and reusing Charts",
    content: [
      { type: "text", value: "Excel Charts are objects you can move, resize, and reuse outside of Excel." },
      { type: "definition_list", items: [
        { term: "Moving within the sheet", def: "Drag the Chart to where you want it. It keeps its link to the data." },
        { term: "Move Chart (to another sheet)", def: "Right-click the Chart > Move Chart. You can move it to a new, dedicated sheet (Chart Sheet) or to another existing sheet." },
        { term: "Resizing", def: "Drag the Chart's corners or edges. Hold Alt while dragging to snap it to the cell borders." },
        { term: "Copying to PowerPoint or Word", def: "Ctrl+C on the Chart and Ctrl+V in PowerPoint/Word. The chart is pasted with a link to the Excel data. If you update the data, the chart in PowerPoint can be updated too." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 7 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Simple Charts</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Create clear, professional charts that deliver the right information to the right audience.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Create clear, professional Charts by choosing the right type, setting up the elements you need, and applying a clean design.</p>
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
        {["Column to compare, Line for trends, Pie for proportions (5-6 categories max).", "Include the headers in your selection. Excel uses them as labels automatically.", "Alt+F1 creates an instant Chart. F11 creates it on a new, dedicated sheet.", "Always use a descriptive title. Never use 3D effects. Keep colors consistent.", "If it can't be understood in 5 seconds, it has too much information or it's the wrong type."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Sort and Filter</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next level: Level 2 — Intermediate</span>
      </div>
    </div>
  );
}
