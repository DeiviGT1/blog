import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "The problem they solve", content: [
    { type: "text", value: "You have a table of product codes and need to pull in the name or price from another table. Or a list of employees and you need their department from an HR master list. Copying and pasting by hand isn't an option with 5,000 rows. Lookup functions automate this." },
  ]},
  { title: "VLOOKUP — the classic", content: [
    { type: "definition_list", items: [
      { term: "Syntax", def: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]). Looks for a value in the first column of a range and returns a value from another column in the same row." },
      { term: "Example", def: "=VLOOKUP(A2, Products!A:D, 3, FALSE). Looks for the value in A2 in the first column of Products and returns the value from the third column. FALSE = exact match." },
      { term: "The critical argument", def: "The fourth argument should almost always be FALSE (exact match). TRUE does an approximate match and is a source of silent errors." },
    ]},
  ]},
  { title: "VLOOKUP's real limitations", content: [
    { type: "definition_list", items: [
      { term: "Only searches the first column", def: "It can't search a column other than the first one in the range. It can't look to the left." },
      { term: "col_index_num is a hard-coded number", def: "If you insert a column in the source table, the formula breaks without warning because the column number shifts." },
      { term: "First match only", def: "It always takes the first matching row. It can't search from bottom to top." },
      { term: "No built-in default value", def: "If it doesn't find the value, it returns #N/A. You have to wrap it in IFERROR to handle that." },
    ]},
  ]},
  { title: "XLOOKUP — the evolution in Excel 365", content: [
    { type: "text", value: "XLOOKUP fixes every one of VLOOKUP's limitations. It's more flexible, more readable, and safer." },
    { type: "definition_list", items: [
      { term: "Syntax", def: "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])." },
      { term: "Looks in any direction", def: "The lookup column and the return column are independent. It can look left, right, or anywhere." },
      { term: "No column number", def: "It uses a return range directly instead of a number. If you insert columns, the formula doesn't break." },
      { term: "Built-in default value", def: "The fourth argument defines what to return if the value isn't found. No need for IFERROR." },
      { term: "Example", def: "=XLOOKUP(A2, Products[Code], Products[Name], \"Not found\"). Looks up the code, returns the name, and shows \"Not found\" if it doesn't exist." },
    ]},
  ]},
  { title: "When to use each one", content: [
    { type: "key_points", items: [
      { title: "Excel 365: always use XLOOKUP", text: "It's better in every way: more readable, more flexible, safer. There's no reason to use VLOOKUP for new work if you have 365." },
      { title: "Compatibility: VLOOKUP", text: "If you collaborate with people on older versions of Excel, VLOOKUP works in all of them. XLOOKUP only works in 365." },
      { title: "Existing files: understand VLOOKUP", text: "Millions of files use VLOOKUP. You need to be able to read and edit it, even if you don't use it for new work." },
    ]},
  ]},
  { title: "Error handling", content: [
    { type: "definition_list", items: [
      { term: "VLOOKUP + IFERROR", def: "=IFERROR(VLOOKUP(...), \"Not found\"). The classic way to handle #N/A." },
      { term: "XLOOKUP built-in", def: "=XLOOKUP(A2, range, return, \"Not found\"). The fourth argument already handles it. Cleaner." },
      { term: "Always plan ahead", def: "Always ask yourself: what happens if the value I'm looking for isn't in the table? If you don't plan for it, your sheet shows #N/A to the user." },
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 3 — ADVANCED</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 1 of 8</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>VLOOKUP and XLOOKUP</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Look up and pull data from one table into another. Classic VLOOKUP and Excel 365's XLOOKUP.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Master VLOOKUP and XLOOKUP, understand how they differ, and know when to use each one.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["VLOOKUP searches the first column and returns from another. Always use FALSE for an exact match.", "XLOOKUP has no direction restriction, uses no column number, and has a built-in default value.", "In Excel 365, use XLOOKUP for new work. Understand VLOOKUP for existing files.", "Always plan for the 'not found' case: IFERROR with VLOOKUP, the fourth argument with XLOOKUP.", "VLOOKUP with a hard-coded col_index_num breaks if you insert columns. XLOOKUP doesn't have this problem."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Level 3 — Advanced</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: INDEX + MATCH</span>
      </div>
    </div>
  );
}
