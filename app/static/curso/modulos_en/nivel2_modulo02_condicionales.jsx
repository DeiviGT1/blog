import { useState } from "react";

const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };

const SECTIONS = [
  {
    title: "IF — the fundamental conditional function",
    content: [
      { type: "text", value: "IF evaluates a condition and returns one value if it's true and another if it's false. It's how you get Excel to make decisions. Syntax: =IF(logical_test, value_if_true, value_if_false)." },
      { type: "definition_list", items: [
        { term: "Basic example", def: "=IF(B2>=70, \"Pass\", \"Fail\"). If B2 is greater than or equal to 70, it shows Pass. Otherwise, it shows Fail." },
        { term: "With numbers", def: "=IF(B2>1000, B2*0.1, 0). If the sale is over 1000, it calculates a 10% commission. Otherwise, it returns 0." },
        { term: "With empty cells", def: "=IF(A2=\"\", \"No data\", A2). If the cell is empty, it shows a message. Otherwise, it shows the value." },
        { term: "The 3 arguments", def: "It always has 3 parts: the question (condition), what to do if YES, and what to do if NO. If you leave out the third one, Excel returns FALSE when the condition isn't met." },
      ]},
    ]
  },
  {
    title: "Nested IFs",
    content: [
      { type: "text", value: "You can put one IF inside another to evaluate several conditions in a cascade. It works, but it quickly becomes hard to read." },
      { type: "key_points", items: [
        { title: "Example", text: "=IF(B2>=90, \"Excellent\", IF(B2>=70, \"Pass\", IF(B2>=50, \"Fair\", \"Fail\"))). It evaluates from highest to lowest: first 90, then 70, then 50, and if nothing matches it returns Fail." },
        { title: "Practical limit", text: "More than 3 levels of nesting becomes very hard to read and maintain. If you need more conditions, use IFS." },
        { title: "Order matters", text: "Always evaluate from the most restrictive condition to the least restrictive. If you put >=50 before >=90, the first condition catches everything and you never reach the second one." },
      ]},
    ]
  },
  {
    title: "IFS — multiple conditions without nesting",
    content: [
      { type: "text", value: "IFS is the modern version (Excel 365) that removes the need for nesting. It evaluates conditions in order and returns the value of the first one that is true." },
      { type: "definition_list", items: [
        { term: "Syntax", def: "=IFS(condition1, value1, condition2, value2, ..., TRUE, default_value). The condition-value pairs are evaluated in order." },
        { term: "Example", def: "=IFS(B2>=90, \"Excellent\", B2>=70, \"Pass\", B2>=50, \"Fair\", TRUE, \"Fail\"). Much easier to read than nested IFs." },
        { term: "The TRUE-at-the-end trick", def: "TRUE as the last condition is always met, so it works as the 'else' or default value. Without it, if no condition is met, IFS returns #N/A." },
        { term: "Excel 2019 and 365", def: "IFS is available in Excel 2019 and Excel 365. It doesn't exist in earlier versions. If you need compatibility with Excel 2016 or older, use nested IFs." },
      ]},
    ]
  },
  {
    title: "AND, OR, NOT — logical operators",
    content: [
      { type: "text", value: "These operators are used inside IF to build compound conditions: multiple criteria that must all be met, or where meeting just one is enough." },
      { type: "definition_list", items: [
        { term: "AND(condition1, condition2, ...)", def: "Returns TRUE only if ALL conditions are true. =IF(AND(B2>=70, C2=\"Paid\"), \"Approved\", \"Pending\") requires the score to be >=70 AND the status to be Paid." },
        { term: "OR(condition1, condition2, ...)", def: "Returns TRUE if AT LEAST ONE condition is true. =IF(OR(A2=\"Urgent\", B2>10000), \"Priority\", \"Normal\") flags it as a priority if it's urgent OR if the amount exceeds 10000." },
        { term: "NOT(condition)", def: "Flips the result: TRUE becomes FALSE and vice versa. =IF(NOT(A2=\"Canceled\"), \"Active\", \"Inactive\") marks everything that is NOT canceled as active." },
      ]},
      { type: "text", value: "You can combine them: =IF(AND(B2>=70, OR(C2=\"A\", C2=\"B\")), \"Pass\", \"Review\") requires a score >=70 AND a category of A or B." },
    ]
  },
  {
    title: "Best practices",
    content: [
      { type: "key_points", items: [
        { title: "Think before you type", text: "Put your condition into words first: 'if the sale is over 1000 and the customer is premium, then...'. If you can't explain it in one sentence, the formula is too complex." },
        { title: "Helper columns", text: "If your IF has more than 3 levels of nesting, it's better to split it into helper columns. One column evaluates the first condition, another the second, and a final IF combines the results." },
        { title: "Readability over compactness", text: "A formula anyone can read and understand is always better than a compact one only you understand (and that even you won't remember in 3 months)." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 2 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Conditional Functions</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Make Excel make logical decisions inside a formula: IF, IFS, AND, OR, NOT.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Use IF, IFS, AND, OR, and NOT so Excel makes automatic decisions based on logical conditions.</p>
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
        {["IF has 3 arguments: the condition, the value if true, and the value if false. Always all 3.", "IFS removes the need for nesting. Use TRUE at the end as the default value.", "AND requires ALL conditions to be met. OR requires at least one.", "Evaluate conditions from the most restrictive to the least restrictive.", "If your IF goes deeper than 3 levels, use helper columns or IFS to keep it readable."].map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Absolute and Mixed References</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: SUMIF, SUMIFS, COUNTIF, COUNTIFS</span>
      </div>
    </div>
  );
}
