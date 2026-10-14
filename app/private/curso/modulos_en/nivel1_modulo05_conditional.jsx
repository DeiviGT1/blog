import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "What is Conditional Formatting?",
    content: [
      { type: "text", value: "Formatting that's applied automatically when a condition is met. The cell formats itself based on its value. This lets a 500-row table 'speak for itself' without you having to check it row by row." },
      { type: "text", value: "You'll find it under Home > Conditional Formatting. Every rule applies to whatever range you have selected when you create it." },
    ]
  },
  {
    title: "Highlight Cells Rules",
    content: [
      { type: "text", value: "The most direct and intuitive rules. They highlight individual cells that meet a specific condition." },
      { type: "definition_list", items: [
        { term: "Greater Than / Less Than", def: "Highlights cells with values above or below a threshold. Example: highlight every sale under $1,000 in red." },
        { term: "Between", def: "Highlights cells with values within a range. Example: highlight amounts between $1,000 and $5,000 in yellow." },
        { term: "Equal To", def: "Highlights cells with an exact value. Example: highlight every cell that says 'Completed' in green." },
        { term: "Text That Contains", def: "Highlights cells that contain specific text. Example: highlight every cell that contains 'Urgent'." },
        { term: "Duplicate Values", def: "Highlights values that appear more than once in the range. Very useful for spotting duplicates in lists of IDs, emails, or codes." },
      ]},
    ]
  },
  {
    title: "Top/Bottom Rules",
    content: [
      { type: "text", value: "These highlight the highest values, the lowest values, or those above/below average. Excel finds them automatically — no sorting needed." },
      { type: "definition_list", items: [
        { term: "Top 10 Items", def: "Highlights the 10 highest values (you can change the number). Example: the top 5 salespeople." },
        { term: "Top 10%", def: "Highlights the top 10% of values. Useful for identifying your top-performing segment." },
        { term: "Bottom 10 Items", def: "Highlights the lowest values. Example: the products with the fewest sales." },
        { term: "Above Average", def: "Highlights every value above the range's average." },
        { term: "Below Average", def: "Highlights every value below the average. Useful for spotting underperformance." },
      ]},
    ]
  },
  {
    title: "Data Bars",
    content: [
      { type: "text", value: "Horizontal bars inside each cell that visually represent the size of the value. It's like a mini chart inside the cell." },
      { type: "key_points", items: [
        { title: "How they work", text: "The cell with the highest value gets the longest bar, and the rest scale proportionally. You can choose solid or gradient fill bars and customize the color." },
        { title: "When to use them", text: "Ideal for quickly comparing values in a column without building a Chart. Sales by rep, scores, response times — any numeric column." },
        { title: "Setup", text: "Home > Conditional Formatting > Data Bars. Choose between gradient and solid fill. To customize: More Rules lets you adjust the minimum and maximum values and the colors." },
      ]},
    ]
  },
  {
    title: "Color Scales",
    content: [
      { type: "text", value: "Color gradients that run from one extreme to the other. Each cell gets a color based on where it falls between the minimum and maximum values in the range." },
      { type: "key_points", items: [
        { title: "2-color scales", text: "Red to green, white to blue, etc. The lowest value gets one color, the highest gets another, and the values in between get proportional blends." },
        { title: "3-color scales", text: "Red-yellow-green is the most common. Red for low, yellow for middle, green for high. Great for heat maps." },
        { title: "When to use them", text: "Data grids where you want to spot patterns at a glance: monthly performance by rep, scores by department, temperatures by hour. The human eye picks up color patterns instantly." },
      ]},
    ]
  },
  {
    title: "Managing rules",
    content: [
      { type: "text", value: "When you have several rules on the same range, order and management matter." },
      { type: "definition_list", items: [
        { term: "Manage Rules", def: "Home > Conditional Formatting > Manage Rules. Shows every active rule with its range, condition, and format. From here you can edit, delete, and reorder them." },
        { term: "Priority order", def: "Rules are evaluated from top to bottom. If several are true, they all apply their formatting (they stack). The rule higher up wins if they conflict on the same attribute. You can reorder them to change priority." },
        { term: "Stop If True", def: "If you check this option on a rule, the rules below it aren't evaluated when it's true. Useful when you have rules that could conflict." },
        { term: "Clear Rules", def: "Home > Conditional Formatting > Clear Rules. You can clear the rules from the current selection or from the entire sheet. It doesn't affect manual formatting, only conditional formatting." },
      ]},
      { type: "text", value: "Note: at this level we use the preset rules from the menu. Rules with custom formulas (which allow much more complex conditions) are covered in later levels." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 5 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Basic Conditional Formatting</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Make your data stand out visually and automatically, based on rules you define.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Apply conditional formatting with Excel's preset rules: Highlight Cells Rules, Top/Bottom Rules, Data Bars, and Color Scales.</p>
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
        {["Highlight Cells Rules highlight by condition: greater than, less than, text that contains, duplicates.", "Top/Bottom Rules flag the best, the worst, or anything above/below average.", "Data Bars put mini charts inside cells. Instant visual comparison.", "Color Scales create heat maps. The eye spots color patterns instantly.", "Manage Rules lets you edit, delete, and prioritize rules when you have several on the same range."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Essential Functions</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Sort and Filter</span>
      </div>
    </div>
  );
}
