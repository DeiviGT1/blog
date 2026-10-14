import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "What Data Validation is for", content: [
    { type: "text", value: "When you share a Workbook or build a tool for other people, you can't control what they type into each cell. Data Validation sets rules that restrict input: only numbers within a range, only dates, only values from a list. You'll find it under Data > Data Validation." },
  ]},
  { title: "Drop-down Lists — the most common use", content: [
    { type: "key_points", items: [
      { title: "How to create one", text: "Select the cell or range > Data > Data Validation > Allow: List. In Source, type the options separated by commas: Pending,In Progress,Completed. Or select a range of cells that holds the options." },
      { title: "Why point to a range", text: "If the options change often, it's better to point to a range on another sheet. That way you update the list in one place and every cell picks up the change." },
      { title: "With a Named Range", text: "If the range has a name (Define Name), you can type =RangeName in Source. Cleaner and easier to maintain." },
    ]},
  ]},
  { title: "Number and date validation", content: [
    { type: "definition_list", items: [
      { term: "Whole Number", def: "Accepts whole numbers only. You can set conditions like between 1 and 100, greater than 0, etc." },
      { term: "Decimal", def: "Accepts numbers with decimals within the range you define." },
      { term: "Date", def: "Accepts only dates within a valid range. Example: between today and one year from now." },
      { term: "Text Length", def: "Limits how long the text can be. Example: codes of exactly 8 characters, or comments of 200 characters max." },
    ]},
  ]},
  { title: "Input Message and Error Alert", content: [
    { type: "definition_list", items: [
      { term: "Input Message", def: "A tooltip that appears when the user selects the cell. Great for giving instructions: 'Select the order status'. Set it up on the Input Message tab of Data Validation." },
      { term: "Error Alert — Stop", def: "Blocks invalid input. The user can't move on until they enter a valid value. It's the safest option." },
      { term: "Error Alert — Warning", def: "Warns but still allows the entry. The user can ignore the warning and enter an invalid value." },
      { term: "Error Alert — Information", def: "Just informs. It doesn't block anything. Useful when you want to suggest without restricting." },
    ]},
  ]},
  { title: "Validation circles and auditing", content: [
    { type: "key_points", items: [
      { title: "Circle Invalid Data", text: "Data > Data Validation > Circle Invalid Data. Draws red circles around cells that break the rules. Very handy for auditing data that existed before you added the rules." },
      { title: "When to use it", text: "After importing data or receiving a file from someone else. Apply the validation rules, then use Circle Invalid Data to see which values don't comply." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 6 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Data Validation</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Control what goes into each cell: Drop-down Lists, numeric restrictions, and error messages.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Be able to create drop-down lists, input restrictions, and validation messages to keep your data quality under control.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["Drop-down Lists are the most common use. Point them to a range or Named Range for easy maintenance.", "The Stop Error Alert is the safest: it blocks invalid input.", "Input Message gives the user instructions when they select the cell.", "Circle Invalid Data audits existing data against your validation rules.", "Data Validation doesn't protect against Paste. If someone pastes values, they can bypass the rules."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Date Functions</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Named Ranges</span>
      </div>
    </div>
  );
}
