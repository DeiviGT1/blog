import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "The fundamental rule: everything starts with =",
    content: [
      { type: "text", value: "Every formula in Excel starts with the = sign. Without it, Excel treats what you type as text. Example: 5+3 is text that displays as-is. =5+3 is a formula that returns 8." },
      { type: "text", value: "The = sign is what tells Excel: 'what follows is an instruction to calculate, not a value to store'." },
    ]
  },
  {
    title: "Arithmetic operators",
    content: [
      { type: "text", value: "Excel uses the same operators as math, with small differences in notation." },
      { type: "definition_list", items: [
        { term: "+ (addition)", def: "=5+3 returns 8. =A1+B1 adds the values of both cells." },
        { term: "- (subtraction)", def: "=10-4 returns 6. =A1-B1 subtracts B1 from A1." },
        { term: "* (multiplication)", def: "=6*7 returns 42. =A1*B1 multiplies both values. Note: use an asterisk, not the letter x." },
        { term: "/ (division)", def: "=20/4 returns 5. =A1/B1 divides A1 by B1. If B1 is 0, it returns #DIV/0!" },
        { term: "^ (exponent)", def: "=2^3 returns 8 (2 to the power of 3). =A1^2 squares A1." },
        { term: "% (percent)", def: "=15% equals 0.15. =A1*15% calculates 15% of the value in A1." },
      ]},
    ]
  },
  {
    title: "Order of operations",
    content: [
      { type: "text", value: "Excel follows the same order as math. If you don't control it, your formulas can return wrong results with no visible error." },
      { type: "key_points", items: [
        { title: "Parentheses first", text: "Everything inside parentheses is calculated before the rest. =2*(3+4) returns 14, not 10." },
        { title: "Exponents second", text: "=2+3^2 returns 11 (first 3^2=9, then 2+9=11)." },
        { title: "Multiplication and division third", text: "=2+3*4 returns 14 (first 3*4=12, then 2+12=14). If you want the addition first: =(2+3)*4 returns 20." },
        { title: "Addition and subtraction last", text: "They run last unless parentheses change the order." },
        { title: "The golden rule", text: "When in doubt about the order, use parentheses. They never hurt, and they make the formula easier to read." },
      ]},
    ]
  },
  {
    title: "Formulas with cell references",
    content: [
      { type: "text", value: "Excel's real power isn't in =5+3 but in =A1+B1. When you use references, the result updates automatically whenever the source values change. This is the foundation for everything that comes next." },
      { type: "key_points", items: [
        { title: "References instead of hardcoded values", text: "If your boss tells you the tax rate changed from 15% to 16%, with hardcoded values you'd have to edit every formula. With references, you change one cell and every formula updates on its own." },
        { title: "Click to reference", text: "You don't need to type A1 by hand. Type = and then click the cell you want to reference. Excel inserts the reference for you. It's faster and cuts down on typos." },
        { title: "Color coding in the Formula Bar", text: "When you edit a formula (F2), Excel highlights the referenced cells in color. Blue, green, purple — each reference gets its own color. This lets you visually confirm your formula points where it should." },
      ]},
    ]
  },
  {
    title: "The Formula Bar as a tool",
    content: [
      { type: "text", value: "The Formula Bar is your window into what's really inside each cell. Learning to use it well is essential." },
      { type: "definition_list", items: [
        { term: "Viewing vs. editing", def: "Click a cell: the Formula Bar shows the full formula while the cell shows the result. That way you can see both." },
        { term: "F2 to edit", def: "Enters edit mode and shows color-coded references right on the sheet. You can drag those colored boxes to change the references visually." },
        { term: "Escape to cancel", def: "If you're editing and something goes wrong, Escape restores the previous value without saving changes." },
        { term: "Ctrl+Z after Enter", def: "If you already confirmed a wrong formula with Enter, Ctrl+Z undoes it immediately." },
      ]},
    ]
  },
  {
    title: "Common mistakes at this stage",
    content: [
      { type: "text", value: "These are the most frequent mistakes when people start working with formulas. Recognizing them saves you time." },
      { type: "definition_list", items: [
        { term: "#DIV/0!", def: "Division by zero. Appears when the divisor is 0 or an empty cell. Fix: make sure the divisor isn't zero before dividing." },
        { term: "Formula treated as text", def: "You forgot the = sign at the start. The cell shows 'A1+B1' as text instead of calculating it. Fix: add = at the beginning." },
        { term: "Reference to an empty cell", def: "If A1 is empty and you type =A1+B1, Excel treats A1 as 0. There's no error, but the result may be wrong if you expected a value there." },
        { term: "Circular reference", def: "When a formula refers to itself, directly or indirectly. Example: typing =A1+1 in A1. Excel shows a warning. Fix: correct the reference so it doesn't point to its own cell." },
        { term: "Unbalanced parentheses", def: "More opening than closing parentheses, or vice versa. Excel warns you and sometimes tries to fix it automatically, but it doesn't always get it right. Count your parentheses." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 2 of 7</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Arithmetic Formulas</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Every formula starts with =. Master the basic operators and cell references.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Master the arithmetic operators, understand the order of operations, and use cell references instead of hardcoded values.</p>
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
        {["Without = at the start, Excel treats the formula as text.", "Use parentheses whenever you're unsure about the order of operations.", "Use references (=A1+B1) instead of hardcoded values (=5+3). That way everything updates automatically.", "F2 color-codes the cells a formula references. Use it to double-check.", "#DIV/0! means division by zero. A circular reference means the formula points to itself."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Data Types and Data Entry</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Cell References</span>
      </div>
    </div>
  );
}
