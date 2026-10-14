import { useState } from "react";
const V = { 50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A", 400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629", 800: "#520F1E", 900: "#3A0911" };
const SECTIONS = [
  { title: "Why text functions matter", content: [
    { type: "text", value: "Real-world data comes in messy: names with extra spaces, codes you need to split, columns you need to combine. Text functions handle all of this without editing cell by cell." },
  ]},
  { title: "Extract parts of text: LEFT, RIGHT, MID", content: [
    { type: "definition_list", items: [
      { term: "LEFT(text, num_chars)", def: "Extracts characters from the left. =LEFT(\"INV-2025-0034\", 3) returns \"INV\"." },
      { term: "RIGHT(text, num_chars)", def: "Extracts from the right. =RIGHT(\"INV-2025-0034\", 4) returns \"0034\"." },
      { term: "MID(text, start, num_chars)", def: "Extracts from any position. =MID(\"INV-2025-0034\", 5, 4) returns \"2025\". Start is the position of the first character to extract." },
    ]},
  ]},
  { title: "Length and search: LEN, FIND, SEARCH", content: [
    { type: "definition_list", items: [
      { term: "LEN(text)", def: "How many characters a text has. =LEN(\"Excel\") returns 5. Useful for validating code lengths." },
      { term: "FIND(find_text, within_text)", def: "The position where one text appears inside another. Case-sensitive. =FIND(\"@\", \"user@email.com\") returns 5." },
      { term: "SEARCH(find_text, within_text)", def: "Same as FIND, but not case-sensitive. Accepts wildcards." },
    ]},
    { type: "text", value: "Combined with MID and LEFT, they let you extract any part of a text dynamically. Example: =LEFT(A1, FIND(\"@\", A1)-1) extracts the username from an email address." },
  ]},
  { title: "Combine text: CONCAT, TEXTJOIN", content: [
    { type: "definition_list", items: [
      { term: "CONCAT(text1, text2, ...)", def: "Joins text. =CONCAT(A1, \" \", B1) joins first and last name with a space. The & operator works too: =A1&\" \"&B1." },
      { term: "TEXTJOIN(delimiter, ignore_empty, range)", def: "Joins a range with a separator. =TEXTJOIN(\", \", TRUE, A2:A10) combines all the values separated by commas. Far more powerful than CONCAT for ranges." },
    ]},
  ]},
  { title: "Clean and transform: TRIM, CLEAN, UPPER, LOWER, PROPER", content: [
    { type: "definition_list", items: [
      { term: "TRIM(text)", def: "Removes extra spaces, leaving just one space between words. Essential when importing external data." },
      { term: "CLEAN(text)", def: "Removes non-printable characters (line breaks, tabs). Apply TRIM after CLEAN: =TRIM(CLEAN(A1))." },
      { term: "UPPER / LOWER / PROPER", def: "UPPER: all uppercase. LOWER: all lowercase. PROPER: capitalizes the first letter of each word. Ideal for standardizing names." },
    ]},
  ]},
  { title: "TEXT — format values as text", content: [
    { type: "definition_list", items: [
      { term: "Syntax", def: "=TEXT(value, format_text). Converts a value to text with a specific format." },
      { term: "Dates", def: "=TEXT(A1, \"MM/DD/YYYY\") or =TEXT(A1, \"MMM-YYYY\") for \"Mar-2025\"." },
      { term: "Numbers", def: "=TEXT(A1, \"#,##0.00\") for a format with thousands separators and 2 decimals." },
      { term: "Combined with text", def: "=\"Date: \"&TEXT(A1, \"DD-MMM-YYYY\") produces \"Date: 15-Mar-2025\"." },
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
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 4 of 9</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>Text Functions</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Manipulate, clean, and transform text data with LEFT, RIGHT, MID, TRIM, CONCAT, TEXTJOIN, and more.</p>
      </div>
      <div style={{ background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>Extract, combine, clean, and transform text data using Excel's most important text functions.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((s, si) => { const isOpen = openSection === si; return (<div key={si} style={{ borderRadius: "var(--border-radius-md)", border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}` }}><div onClick={() => setOpenSection(isOpen ? -1 : si)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}><div style={{ width: 28, height: 28, minWidth: 28, borderRadius: "50%", background: isOpen ? V[600] : V[50], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600] }}>{si + 1}</div><span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>{s.title}</span><span style={{ fontSize: 16, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#x25BE;</span></div>{isOpen && <div style={{ padding: "0 16px 16px 56px" }}>{s.content.map((b, bi) => renderBlock(b, bi))}</div>}</div>); })}
      </div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginTop: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {["LEFT, RIGHT, and MID extract parts of text. LEN and FIND give you length and position.", "TRIM and CLEAN are the first things you apply when you receive external data. Always.", "TEXTJOIN is more powerful than CONCAT for joining ranges with a separator.", "UPPER, LOWER, and PROPER standardize text without editing cell by cell.", "TEXT converts numbers and dates into formatted text. Essential for combining them with other text."].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none" }}><div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} /><span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{p}</span></div>))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: SUMIF, SUMIFS, COUNTIF, COUNTIFS</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Date Functions</span>
      </div>
    </div>
  );
}
