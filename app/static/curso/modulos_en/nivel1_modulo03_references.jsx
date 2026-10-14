import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "What is a Cell Reference?",
    content: [
      { type: "text", value: "When you type =A1 in another cell, you're not copying A1's value — you're creating a live link. If A1 changes, your formula updates automatically. References are why Excel is so powerful: you build the logic once and it stays up to date forever." },
      { type: "text", value: "A reference is simply a cell's address: the column letter and the row number. A1, B5, and Z100 are all references. When you use them in formulas, Excel goes to that cell, grabs its value, and uses it in the calculation." },
    ]
  },
  {
    title: "Relative References: the default behavior",
    content: [
      { type: "text", value: "When you copy a formula from one cell to another, the references adjust automatically. This is called a Relative Reference, and it's Excel's default behavior." },
      { type: "key_points", items: [
        { title: "How it works", text: "If you type =A1+B1 in C1 and copy that formula to C2, it automatically becomes =A2+B2. Excel doesn't copy 'A1+B1' literally — it copies the instruction 'the cell 2 columns to my left + the cell 1 column to my left'. Since C2 is one row below C1, the references move down one row." },
        { title: "Why it's useful", text: "It means you can write a formula once and copy it to hundreds of rows, and each row calculates with its own data. You don't need to write a different formula for every row." },
        { title: "Practical example", text: "A table with column A = Price, column B = Quantity, column C = Total. In C2 you type =A2*B2. You copy C2 down to C100. Each row calculates its own total because the references adjust automatically." },
      ]},
    ]
  },
  {
    title: "The Fill Handle",
    content: [
      { type: "text", value: "The Fill Handle is the small square in the bottom-right corner of a selected cell. It's the main tool for copying formulas while taking advantage of Relative References." },
      { type: "definition_list", items: [
        { term: "Drag down", def: "Copies the formula to the rows below, adjusting the row references. Each row calculates with its own data." },
        { term: "Drag right", def: "Copies the formula to the next columns, adjusting the column references." },
        { term: "Double-click the Fill Handle", def: "The fastest way: if the adjacent column has data, double-clicking fills down automatically as far as that data goes. It works for hundreds or thousands of rows in an instant." },
        { term: "Ctrl+D as an alternative", def: "Select the range from the cell with the formula down to where you want to fill, then press Ctrl+D. It fills down without any dragging." },
      ]},
    ]
  },
  {
    title: "How to check your references",
    content: [
      { type: "text", value: "After copying a formula, always check that the references point where they should. A reference mistake can produce wrong results with no error message at all — which is worse than a visible error." },
      { type: "key_points", items: [
        { title: "F2 to see color-coded references", text: "Click the destination cell and press F2. Excel highlights each reference in a different color and draws a box around the referenced cell. You can visually confirm the boxes sit on the right cells." },
        { title: "Formula Bar", text: "Click the cell and look at the Formula Bar. Check that the formula shows the references you expect. If you copied from C2 to C10, the formula in C10 should reference row 10, not row 2." },
        { title: "Check the first and the last", text: "A professional habit: after copying a formula down a long range, check at least the first cell, the last one, and one in the middle. If those 3 are right, the rest probably are too." },
      ]},
    ]
  },
  {
    title: "Coming up next: Absolute and Mixed References",
    content: [
      { type: "text", value: "There are situations where you don't want a reference to adjust when you copy it. For example, when several rows need to multiply by the same fixed value, like an exchange rate or a tax percentage." },
      { type: "text", value: "That's what the $ sign is for: it 'locks' a reference. $A$1 never moves, A$1 locks only the row, and $A1 locks only the column. This is covered in depth in Level 2, once you've mastered relative references. For now, what matters is knowing it exists and that you toggle it with F4 in the Formula Bar." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 3 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Cell References</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>The most important concept in Excel: how references adjust when you copy formulas, and why that changes everything.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Understand how Relative References behave when you copy formulas, because it's the concept with the biggest impact on everything you do in Excel.</p>
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
        {["References are live links: if the source cell changes, the formula updates.", "Relative References adjust when copied. =A1+B1 copied one row down becomes =A2+B2.", "Double-clicking the Fill Handle fills down as far as the adjacent data goes. It's the fastest way.", "After copying, always use F2 to check that the references point where they should.", "The $ sign locks references (Absolute/Mixed). Covered in depth in Level 2."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Arithmetic Formulas</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Essential Functions</span>
      </div>
    </div>
  );
}
