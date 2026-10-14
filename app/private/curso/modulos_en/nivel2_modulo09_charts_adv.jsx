import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Combo Charts — two types in one", content: [
    { type: "text", value: "For when you need to show two metrics with different scales on the same chart. Example: columns for sales volume and a line for average price." },
    { type: "key_points", items: [
      { title: "How to create one", text: "Insert > Combo Chart. Or select an existing Chart, right-click a series > Change Series Chart Type. Each series can have its own type (Column, Line, Area)." },
      { title: "When to use it", text: "When you have related metrics with different units or scales. Revenue (in thousands) + Growth Rate (in %). Units Sold + Average Price." },
    ]},
  ]},
  { title: "Secondary Axis", content: [
    { type: "text", value: "When the two metrics have very different scales, you need a second Y axis on the right." },
    { type: "key_points", items: [
      { title: "How to turn it on", text: "Select a series in the Chart > Format Data Series > Plot Series On: Secondary Axis. A second axis with its own scale appears on the right." },
      { title: "Watch out", text: "If the axes aren't clearly labeled, readers can mix up which scale belongs to which series. Always add clear axis titles with units." },
    ]},
  ]},
  { title: "Sparklines — tiny charts in cells", content: [
    { type: "definition_list", items: [
      { term: "What they are", def: "Tiny charts inside a cell that show the trend of a range. Insert > Sparklines: Line, Column, Win/Loss." },
      { term: "Example", def: "Next to each sales rep, a Sparkline showing their sales trend over the last 12 months. They don't replace a full Chart, but they give instant visual context." },
      { term: "Settings", def: "The Sparkline tab lets you change the type and color, mark high/low points, and adjust the axis so you can compare across Sparklines." },
    ]},
  ]},
  { title: "Trendlines", content: [
    { type: "definition_list", items: [
      { term: "How to add one", def: "Right-click a series in a Chart > Add Trendline. Types: Linear (the most common), Exponential, Moving Average." },
      { term: "Linear", def: "A straight line showing the overall direction. Useful for telling whether the data is rising, falling, or flat." },
      { term: "Moving Average", def: "Smooths out fluctuations to reveal the underlying trend. Set the period (3, 6, 12 months, etc.)." },
      { term: "Display Equation", def: "Shows the trendline's equation on the Chart. Display R-squared shows how well the line fits the data." },
    ]},
  ]},
  { title: "Advanced professional design", content: [
    { type: "key_points", items: [
      { title: "Cut the visual noise", text: "Remove excess gridlines, redundant legends, and unnecessary borders. Every element has to earn its place." },
      { title: "Color with purpose", text: "One color to highlight the main series, gray for context. Don't use a different color for every series without a reason." },
      { title: "Titles that state the takeaway", text: "'Sales grew 23% in Q4' beats 'Sales Q1-Q4'. The title should state the conclusion, not just describe the data." },
      { title: "The 5-second test", text: "If someone can't understand your chart in 5 seconds, it has too much information, it's the wrong type, or it's missing a clear title." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 9 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Advanced Charts</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Combo Charts, Secondary Axis, Sparklines, Trendlines. Visuals that tell a story.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Be able to build sophisticated visuals with Combo Charts, Secondary Axis, Sparklines, and Trendlines.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["Combo Charts combine two types (Column + Line) for metrics with different scales.", "Secondary Axis adds a second Y axis. Always label both axes with units.", "Sparklines give trend context inside a cell. Insert > Sparklines.", "Trendlines show the overall direction. Linear for trend, Moving Average for smoothing.", "Titles that state the takeaway, color with purpose, and the 5-second test."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: PivotTables from Scratch</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next level: Level 3 — Advanced</span>
      </div>
    </div>
  );
}
