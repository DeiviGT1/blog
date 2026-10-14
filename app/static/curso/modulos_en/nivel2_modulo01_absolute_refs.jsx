import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "The problem they solve",
    content: [
      { type: "text", value: "In Level 1 we learned that when you copy a formula, its references adjust automatically (Relative References). That's exactly what you want most of the time. But there are situations where you need a reference to stay put." },
      { type: "text", value: "Classic example: several rows need to multiply by the same fixed value, like an exchange rate, a tax rate, or a base price. If you copy =A2*B1 down, B1 turns into B2, B3, B4... and your fixed value is lost." },
    ]
  },
  {
    title: "The 4 reference types",
    content: [
      { type: "definition_list", items: [
        { term: "A1 (Relative)", def: "Moves in both directions when copied. This is the default behavior. Copy down and the row number increases. Copy right and the column advances." },
        { term: "$A$1 (Absolute)", def: "Never moves. Neither the column nor the row changes, no matter which direction you copy. Use it when a reference must always point to the same cell." },
        { term: "A$1 (Mixed — locked row)", def: "The column moves but the row stays locked. Useful when you copy horizontally and want the row to stay the same." },
        { term: "$A1 (Mixed — locked column)", def: "The row moves but the column stays locked. Useful when you copy vertically and want the column to stay the same." },
      ]},
      { type: "key_points", items: [
        { title: "The F4 shortcut", text: "In the Formula Bar, place the cursor on a reference and press F4. Each press cycles through the 4 types: A1 > $A$1 > A$1 > $A1 > A1. It's the fastest way to add or remove the $." },
      ]},
    ]
  },
  {
    title: "How to think about them",
    content: [
      { type: "text", value: "Don't memorize when to use each type. Instead, ask yourself these two questions before copying a formula:" },
      { type: "key_points", items: [
        { title: "Question 1: If I copy down, should this reference move down with me?", text: "If the answer is NO (because it should always point to the same row), put a $ before the row number: A$1." },
        { title: "Question 2: If I copy to the right, should this reference move to the right?", text: "If the answer is NO (because it should always point to the same column), put a $ before the column letter: $A1." },
        { title: "If both answers are NO", text: "Use Absolute: $A$1. The reference doesn't move in any direction." },
        { title: "If both answers are YES", text: "Use Relative: A1. It's the default, so you don't need to do anything." },
      ]},
    ]
  },
  {
    title: "Hands-on example: price table with discounts",
    content: [
      { type: "text", value: "Picture a table where column A lists products with their prices, and row 1 holds different discount rates (10%, 15%, 20%). You need to calculate the discounted price for every combination." },
      { type: "key_points", items: [
        { title: "The formula in B2", text: "=$A2*(1-B$1). Let's break it down: $A2 locks column A (the price is always in column A) but lets the row move (each product has its own row). B$1 lets the column move (each discount rate is in a different column) but locks row 1 (the rates are always in row 1)." },
        { title: "Copying to the right (to C2)", text: "It becomes =$A2*(1-C$1). $A2 didn't move (locked column). B$1 became C$1 (the column moved to the next discount rate). Correct." },
        { title: "Copying down (to B3)", text: "It becomes =$A3*(1-B$1). $A2 became $A3 (the row moved to the next product). B$1 didn't move (locked row). Correct." },
        { title: "One formula for the whole table", text: "You write the formula once in B2 and copy it across the entire range. Every cell calculates correctly because the mixed references adjust exactly the way they should." },
      ]},
    ]
  },
  {
    title: "Common mistakes",
    content: [
      { type: "definition_list", items: [
        { term: "Adding $ where it isn't needed", def: "The formula works in the original cell but isn't flexible. If you reorganize the sheet, unnecessary absolute references can end up pointing to the wrong cells." },
        { term: "Forgetting the $ where it is needed", def: "The most dangerous mistake: it produces wrong results without any error message. Excel happily calculates the wrong number." },
        { term: "Not checking after copying", def: "Always press F2 on the first and last cells after copying. Make sure the references point where they should. This habit saves you hours of debugging." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 2 — INTERMEDIATE</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 1 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Absolute and Mixed References</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Master the $ sign to control what moves and what stays fixed when you copy formulas.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Master the 4 reference types ($A$1, A$1, $A1, A1) and know how to pick the right one for each situation.</p>
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
        {["F4 cycles through the 4 reference types. It's the most important shortcut in this module.", "A $ before the letter locks the column. A $ before the number locks the row. A $ on both locks everything.", "Don't memorize: ask yourself 'should this move when I copy?' If not, add a $.", "The classic Mixed References case is a two-way table (products x discounts).", "Always check with F2 after copying. Reference errors produce wrong results without warning."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Level 2 — Intermediate</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Conditional Functions</span>
      </div>
    </div>
  );
}
