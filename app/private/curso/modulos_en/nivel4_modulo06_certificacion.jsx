import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [{ title: "What Is the MOS Certification", content: [{ type: "definition_list", items: [{ term: "Definition", def: "Microsoft Office Specialist: an official certification that validates your Excel skills. Recognized worldwide." }, { term: "Levels", def: "MOS Associate (intermediate features) and MOS Expert (advanced, including macros and analysis)." }, { term: "Value", def: "A differentiator on your resume. It objectively validates what you can do." }] }] }, { title: "Exam Structure", content: [{ type: "definition_list", items: [{ term: "Format", def: "A hands-on exam in real Excel. No multiple-choice questions, just tasks you have to complete." }, { term: "Example", def: "Create a PivotTable showing sales by quarter, add a Calculated Field for margin, and apply a Slicer by region." }, { term: "Time", def: "Usually 50 minutes to complete all the projects." }] }] }, { title: "Associate Exam Domains", content: [{ type: "definition_list", items: [{ term: "Manage Worksheets", def: "Create, navigate, format, and configure workbooks and worksheets." }, { term: "Manage Data", def: "Enter, format, sort, and filter data in cells and ranges." }, { term: "Tables", def: "Create and modify Tables; sort and filter tabular data." }, { term: "Formulas and Functions", def: "SUM, IF, VLOOKUP, and intermediate functions." }, { term: "Charts", def: "Create, modify, and format charts." }] }] }, { title: "Expert Exam Domains", content: [{ type: "definition_list", items: [{ term: "Workbook Options", def: "Templates, protection, macros, advanced options." }, { term: "Advanced Data", def: "Advanced data validation, text functions, formula-based conditional formatting." }, { term: "Advanced Formulas", def: "Nested functions, XLOOKUP, INDEX+MATCH, Named Ranges, basic macros." }, { term: "Advanced Charts and Tables", def: "Advanced PivotTables, Calculated Fields, PivotCharts." }] }] }, { title: "Prep Strategy", content: [{ type: "definition_list", items: [{ term: "Course coverage", def: "If you've completed Levels 0-3, you've covered 90% of the Associate exam and 70% of the Expert exam." }, { term: "Practice the exam format", def: "Timed tasks. Do 3+ full practice exams before the real one." }, { term: "Common mistakes", def: "Running out of time, misreading the task, not checking your results." }, { term: "Logistics", def: "At a Pearson VUE test center or online. Costs ~$100-150 USD. Instant results." }] }] }];
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
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: "var(--border-radius-md)", background: V[50], color: V[800] }}>LEVEL 4 — EXCEL PRO</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 6 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>MOS Certification Prep</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Microsoft Office Specialist: exam structure, domains, and strategy.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Understand the structure of the MOS exam and be able to prepare for it strategically.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways</div>
        {["MOS Associate for the intermediate level. MOS Expert for advanced.", "100% hands-on exam: real tasks in Excel, no multiple choice.", "Levels 0-3 of this course cover 90% of the Associate exam.", "Take 3+ timed practice exams to prepare.", "Instant results. Digital certificate for LinkedIn and your resume."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: Advanced Power Query</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Course complete</span>
      </div>
    </div>
  );
}
