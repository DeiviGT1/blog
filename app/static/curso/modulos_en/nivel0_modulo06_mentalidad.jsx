import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  { title: "The Mindset Shift", content: [
    { type: "text", value: "Excel isn't a blank canvas where you type whatever you want wherever you want. It's a data engine that runs on rules. If your data is well structured, Excel does the heavy lifting. If it isn't, you'll fight every formula, every filter and every chart." },
    { type: "text", value: "This module pulls everything you learned in Level 0 into a set of principles you should always apply." },
  ]},
  { title: "The 10 Principles of a Good Excel User", content: [
    { type: "definition_list", items: [
      { term: "1 — Your data is a Table. Always.", def: "Use Ctrl+T. It expands automatically, has filters and works better with every tool." },
      { term: "2 — One row, one record. No exceptions.", def: "Each row = one item. Never mix two records in one row." },
      { term: "3 — One column, one field. No mixing.", def: "Each column = one type of data. First name and last name are two columns, not one." },
      { term: "4 — Never use Merge Cells in data.", def: "Breaks Sort, Filter, PivotTables and Copy/Paste. Only for decorative titles outside the table." },
      { term: "5 — Headers are sacred.", def: "Unique, clear, descriptive and in a single row." },
      { term: "6 — Keep data, calculations and presentation separate.", def: "Raw data in one area, calculations in another, presentation in another. Never mix them." },
      { term: "7 — Name your Sheets and files logically.", def: "The name says what's inside. If you have to explain it, it's wrong." },
      { term: "8 — Formatting communicates, it doesn't decorate.", def: "Bold for headers, Number Format for values, subtle colors to tell areas apart." },
      { term: "9 — Learn the shortcuts you use every day.", def: "15 shortcuts that are second nature save more than 50 half-memorized ones." },
      { term: "10 — If you do it more than twice, there's a faster way.", def: "Formulas, Fill Handle, Ctrl+D, Filter, PivotTables. Excel has tools for everything repetitive." },
    ]},
  ]},
  { title: "Visual Diagnosis: Signs of a Poorly Built Sheet", content: [
    { type: "text", value: "A user who has mastered these principles can look at any sheet and immediately diagnose what's wrong." },
    { type: "definition_list", items: [
      { term: "Merged cells everywhere", def: "Someone prioritized how it looks over how it works. Fix: unmerge and split the data properly." },
      { term: "Data that starts in F15", def: "There's no reason to start far from A1. It confuses PivotTables, macros and other users." },
      { term: "Totals mixed in with data", def: "A totals row inside the table skews the analysis. Move it out or use a separate formula." },
      { term: "Sheets named Sheet1 through Sheet5", def: "Nobody knows what's in each one. Renaming takes 30 seconds and saves hours." },
      { term: "Colors everywhere with no logic", def: "Decorative formatting that doesn't communicate anything. Simplify to 2-3 colors with a purpose." },
    ]},
  ]},
  { title: "Wrapping Up Level 0", content: [
    { type: "text", value: "With these 6 modules you have the mental and practical foundation to take on any later level. You don't know formulas yet, but you know how to think, navigate and organize like a professional." },
    { type: "text", value: "What you gained: you know the interface, navigate with shortcuts, structure data as a Table, format with purpose, organize files professionally, and think of Excel as a data engine." },
    { type: "text", value: "From Level 1 on, every new concept builds on this foundation. If something doesn't work the way you expect, the answer is probably here." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 6 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Mindset — Thinking in Tables</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>The mindset shift that separates a user who fights Excel from one who gets the most out of it.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Change the way you think about Excel: it's not a blank canvas, it's a data engine with rules.</p>
      </div>
      <Render sections={SECTIONS} />
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["Excel is a data engine with rules, not a blank canvas. Respect the structure and it will work for you.","The 10 principles aren't suggestions: they're the difference between a file that works and one that causes problems.","If you can spot what's wrong just by looking at a sheet, you already think like a professional.","Everything that comes next depends on these fundamentals being solid.","If something doesn't work in later levels, the answer is probably in Level 0."].map((p,i)=>(
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: File Naming and Organization</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>You've completed Level 0</span>
      </div>
    </div>
  );
}
