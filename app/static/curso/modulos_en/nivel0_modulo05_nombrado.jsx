import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "Naming Sheets", content: [
    { type: "text", value: "Each Sheet's name should tell you what's inside without opening it. Most files have sheets named Sheet1, Sheet2, Sheet3." },
    { type: "key_points", items: [
      { title: "Good names", text: "Short, descriptive, no special characters: \"Data\", \"Summary\", \"Inputs\", \"Jan_2025\", \"Sales_Raw\", \"Dashboard\"." },
      { title: "Bad names", text: "\"Sheet1\", \"Sheet1 (2)\", \"final data v2 FINAL\". If you need to explain what's in it, the name is wrong." },
      { title: "Practical rules", text: "No unnecessary spaces (use _ or CamelCase), no special characters, 20-25 characters max." },
    ]},
  ]},
  { title: "Sheet Order Within the Workbook", content: [
    { type: "text", value: "The order should follow a logical left-to-right flow." },
    { type: "key_points", items: [
      { title: "First sheet: summary or index", text: "In complex files (5+ sheets), the first sheet should be a summary, an index with hyperlinks, or a Dashboard." },
      { title: "Logical flow", text: "Raw data > analysis/calculations > presentation/output. The reader follows the flow: where the data comes from > what was done > what the result is." },
      { title: "Helper sheets at the end", text: "Reference tables, parameters and lookups go at the end. Accessible, but not front and center." },
    ]},
  ]},
  { title: "Naming Workbooks", content: [
    { type: "key_points", items: [
      { title: "A consistent convention", text: "Pick a structure and stick to it: Project_Name_YYYY-MM.xlsx, or Report_Sales_Q1_2025.xlsx." },
      { title: "What you should never do", text: "Never: \"Book1.xlsx\", \"final report (2).xlsx\", \"v1 final FINAL CORRECTED.xlsx\". For versions, use dates or sequential numbers." },
      { title: "No problematic characters", text: "Avoid accented letters, symbols and other special characters. They can cause problems when sharing or uploading to SharePoint." },
    ]},
  ]},
  { title: "Sheet Tab Colors", content: [
    { type: "key_points", items: [
      { title: "How to use it", text: "Right-click the tab > Tab Color. Group sheets by function: data in blue, calculations in green, summary in orange, helpers in gray." },
      { title: "The rule", text: "3-4 colors max. If you use 10, the visual effect is lost. Color groups categories; it doesn't decorate." },
    ]},
  ]},
  { title: "Folder Organization", content: [
    { type: "text", value: "Even though it happens outside Excel, organizing files into folders is part of professional work." },
    { type: "key_points", items: [
      { title: "Suggested structure", text: "One folder per project. Inside: Data (sources), Analysis (working workbooks), Output (final deliverables)." },
      { title: "A simple test", text: "If someone new had to find a file, could they do it in under 30 seconds? If not, reorganize." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 5 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>File Naming and Organization</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Organization habits that scale when you handle multiple files and sheets at work.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Adopt organization habits that scale when you're handling lots of files and sheets.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["Give every Sheet a descriptive name: \"Data\", \"Summary\", \"Inputs\". Never leave \"Sheet1\".","Order sheets left to right: data > analysis > results > helpers.","Use consistent file naming conventions. Never \"v1 final FINAL CORRECTED\".","Tab colors group sheets by function. 3-4 colors max.","Organize folders: Data, Analysis, Output. Any file should be findable in under 30 seconds."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Formatting with Purpose</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Mindset — Thinking in Tables</span>
      </div>
    </div>
  );
}
