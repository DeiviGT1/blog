import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "The Golden Rule", content: [
    { type: "text", value: "If formatting doesn't help people understand the data, cut it. Excel isn't Word or PowerPoint. The goal is clarity, not looks. Every formatting decision should answer one question: does this help the reader understand the information faster?" },
  ]},
  { title: "Number Formats", content: [
    { type: "text", value: "A cell has two layers: the actual value (what it contains) and the format (how it's displayed). A cell can contain 0.156 and display \"16%\" or \"$0.16\" depending on the Number Format." },
    { type: "definition_list", items: [
      { term: "General", def: "No specific format. Excel decides how to display it. It's the default." },
      { term: "Number", def: "Decimals and thousands separator. #,##0 for whole numbers, #,##0.00 for two decimals." },
      { term: "Currency / Accounting", def: "Adds a currency symbol. Accounting lines up the symbols and shows negatives in parentheses." },
      { term: "Percentage", def: "Multiplies by 100 and adds %. If the cell contains 0.15, it shows 15%. If you type 15 and apply %, it shows 1500%." },
      { term: "Date / Time", def: "Controls how a date is displayed. The underlying value doesn't change: MM/DD/YYYY, MMM-YY, etc." },
      { term: "Text", def: "Treats everything as text. Useful for codes with leading zeros (001234)." },
      { term: "Custom", def: "Custom formats: #,##0 for thousands with no decimals, 0.0% for one decimal in percentages." },
    ]},
    { type: "key_points", items: [
      { title: "The classic mistake", text: "Confusing format with content. If a cell shows \"$1,000\" but you typed the text \"$1,000\" instead of the number 1000 with Currency format, Excel can't calculate with it. Always enter the clean value." },
    ]},
  ]},
  { title: "Formatting That Actually Helps", content: [
    { type: "key_points", items: [
      { title: "Bold for headers", text: "Visually sets headers apart from everything else. Only for headers and section titles." },
      { title: "Borders to separate sections", text: "Thin borders between data and summary. Don't put borders on every cell — it clutters the view." },
      { title: "Subtle fill colors", text: "Light gray for inputs, pale blue for headers. 2-3 colors max, never loud ones." },
      { title: "Alignment", text: "Text on the left, numbers on the right, headers centered. Consistent with Excel's defaults." },
    ]},
  ]},
  { title: "What You Should Never Do", content: [
    { type: "definition_list", items: [
      { term: "Merge Cells in data", def: "Breaks Sort, Filter, PivotTables and Copy/Paste. The most destructive mistake. Only justified for titles outside the table." },
      { term: "Random font sizes", def: "5 different sizes with no logic = the reader can't tell what matters. Use 2 at most." },
      { term: "Color as the only indicator", def: "If \"red = urgent\" but no text says so, someone who is color-blind can't read the sheet." },
      { term: "Diagonal text", def: "Hard to read and adds nothing. If the header is long, make the column wider." },
      { term: "Excessive decorative borders", def: "Thick borders, double lines, colored borders. They clutter the view without adding anything." },
    ]},
  ]},
  { title: "Quick Formatting Tools", content: [
    { type: "key_points", items: [
      { title: "Format Painter", text: "Select a cell with the format you want > Home > Format Painter (paintbrush icon). Double-click the icon to apply it to multiple ranges. Alternative: Ctrl+C > select the destination > Ctrl+Alt+V > Formats." },
      { title: "Cell Styles", text: "Home > Cell Styles. Predefined styles for headers, inputs and calculations. Keeps large files consistent." },
      { title: "Conditional Formatting (preview)", text: "Automatic formatting based on rules. Covered in depth in Level 1. Here it's just the concept." },
    ]},
  ]},
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 4 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Formatting with Purpose</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Formatting exists to communicate information, not to decorate. Learn to use it with professional judgment.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Understand that formatting exists to communicate, not to decorate, and apply it with professional judgment.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["Formatting communicates, it doesn't decorate. If it doesn't help people understand the data, cut it.","Number Format controls how a value is displayed, not what it contains. Never confuse format with content.","Merge Cells in data is the most destructive mistake. Never do it.","2-3 colors max, 2 font sizes, borders only where they help.","Format Painter and Cell Styles keep things visually consistent."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Data Structure and Organization</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: File Naming and Organization</span>
      </div>
    </div>
  );
}
