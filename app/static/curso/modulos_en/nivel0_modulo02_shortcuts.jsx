import { useState } from "react";

const V = {
  50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A",
  400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629",
  800: "#520F1E", 900: "#3A0911",
};
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "Basic Movement",
    content: [
      {
        type: "text",
        value: "The mouse works, but it's slow. Keyboard shortcuts let you move across thousands of cells in seconds. The goal isn't to memorize a list, but to build in the ones you use every day until they're automatic."
      },
      {
        type: "definition_list",
        items: [
          { term: "Arrow Keys", def: "Move one cell in the direction pressed. The most basic move." },
          { term: "Ctrl + Arrow Key", def: "Jumps to the end of the data block in that direction. If you're in A1 and there's data down to A500, Ctrl+Down takes you to A500 in one jump." },
          { term: "Ctrl + Home", def: "Takes you to A1 instantly, no matter where you are." },
          { term: "Ctrl + End", def: "Takes you to the last cell with data on the sheet (where the last used row and column meet)." },
          { term: "Page Up / Page Down", def: "Moves up or down one full screen of rows. Useful for visually scanning long data." },
        ]
      },
    ]
  },
  {
    title: "Selecting Ranges",
    content: [
      {
        type: "text",
        value: "Selecting data is the starting point for almost everything in Excel: formatting, copying, applying formulas, creating Charts. Doing it with the keyboard is far more precise and faster than dragging with the mouse."
      },
      {
        type: "definition_list",
        items: [
          { term: "Shift + Arrow Key", def: "Extends the selection one cell at a time in the direction pressed." },
          { term: "Ctrl + Shift + Arrow Key", def: "Selects the whole data block in that direction. It's the most powerful combo for selecting entire columns or rows of data in one go." },
          { term: "Ctrl + A", def: "Selects the entire current data region. Press it a second time to select the whole sheet." },
          { term: "Ctrl + Space", def: "Selects the entire column of the active cell." },
          { term: "Shift + Space", def: "Selects the entire row of the active cell." },
        ]
      },
    ]
  },
  {
    title: "Quick Editing",
    content: [
      {
        type: "text",
        value: "These shortcuts control how you interact with cell contents. Mastering these moves is what separates a slow user from a fast one."
      },
      {
        type: "definition_list",
        items: [
          { term: "F2", def: "Enters edit mode on the active cell. The cursor appears inside the cell so you can edit its contents. If the cell has a formula, F2 color-highlights the cells it references." },
          { term: "Escape", def: "Cancels editing and restores the previous value. If you were typing something and made a mistake, Escape discards what you typed without saving." },
          { term: "Enter", def: "Confirms the value and moves down to the next cell. The standard way to confirm an entry." },
          { term: "Tab", def: "Confirms the value and moves to the right. Ideal for filling in data row by row (First Name, Last Name, Email, Tab, Tab, Tab...)." },
          { term: "Ctrl + Z", def: "Undo. Works multiple levels back. It's your safety net for any mistake." },
          { term: "Ctrl + Y", def: "Redo. Reverses the last Undo. It also repeats the last action you performed." },
          { term: "Delete", def: "Clears the contents of the selected cells without removing the formatting." },
        ]
      },
    ]
  },
  {
    title: "Productivity Shortcuts",
    content: [
      {
        type: "text",
        value: "These are the shortcuts that make a real difference in speed. Each one saves seconds that, multiplied by hundreds of times a day, add up to hours."
      },
      {
        type: "definition_list",
        items: [
          { term: "Ctrl + C / V / X", def: "Copy, paste, cut. In Excel, copying a cell with a formula copies the formula (adjusting the references)." },
          { term: "Ctrl + D", def: "Fill down. If you select B1:B10 and the first cell has a value or formula, Ctrl+D copies that content into every cell below." },
          { term: "Ctrl + R", def: "Fill right. Same logic as Ctrl+D, but horizontally." },
          { term: "Alt + =", def: "AutoSum. Automatically inserts a SUM function for the range Excel detects above or to the left." },
          { term: "Ctrl + Shift + L", def: "Turns AutoFilter on/off. A quick toggle for the filter drop-downs in the headers." },
          { term: "Ctrl + T", def: "Converts the current range into a Table. One of the most important actions you'll learn in this course." },
          { term: "Ctrl + 1", def: "Opens Format Cells. The most complete formatting window: number, alignment, font, borders, fill, protection." },
          { term: "Ctrl + Shift + +", def: "Inserts cells, rows or columns based on the current selection." },
          { term: "Ctrl + -", def: "Deletes cells, rows or columns based on the current selection." },
        ]
      },
    ]
  },
  {
    title: "Moving Between Sheets",
    content: [
      {
        type: "text",
        value: "When a Workbook has multiple Sheets, you need to be able to move between them without the mouse."
      },
      {
        type: "definition_list",
        items: [
          { term: "Ctrl + Page Down", def: "Moves to the next Sheet (to the right)." },
          { term: "Ctrl + Page Up", def: "Moves to the previous Sheet (to the left)." },
          { term: "Right-click the Sheet Tab arrows", def: "Shows a full list of every sheet in the Workbook. Useful when you have more sheets than fit in the bottom bar." },
        ]
      },
    ]
  },
  {
    title: "The Rule: Don't Memorize, Practice",
    content: [
      {
        type: "text",
        value: "The goal of this module isn't for you to memorize 30 shortcuts. It's for you to pick the 10-15 you'd use every day at work and practice them until they're automatic."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Start with 5",
            text: "Pick the 5 shortcuts you'd use most and use them deliberately for a week. Once you stop thinking about them, add 5 more."
          },
          {
            title: "Resist the mouse",
            text: "Every time you reach for the mouse to do something that has a shortcut, stop and use the keyboard. The first few times will be slower. After that, you'll be much faster."
          },
          {
            title: "The must-haves",
            text: "If you could only learn 5 shortcuts from this list: Ctrl+Arrow (navigate), Ctrl+Shift+Arrow (select), F2 (edit), Ctrl+Z (undo), and Ctrl+1 (Format Cells)."
          },
        ]
      },
    ]
  },
];

export default function Module() {
  const [openSection, setOpenSection] = useState(0);

  const renderBlock = (block, bi) => {
    if (block.type === "text") {
      return (
        <p key={bi} style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: bi === 0 ? "0 0 14px" : "14px 0", lineHeight: 1.7 }}>
          {block.value}
        </p>
      );
    }
    if (block.type === "definition_list") {
      return (
        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
          {block.items.map((item, di) => (
            <div key={di} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>{item.term}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.def}</div>
            </div>
          ))}
        </div>
      );
    }
    if (block.type === "key_points") {
      return (
        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
          {block.items.map((item, ki) => (
            <div key={ki} style={{ borderLeft: `2px solid ${V[200]}`, paddingLeft: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.text}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px",
            borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800],
          }}>LEVEL 0 — REQUIRED</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 2 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>
          Navigation and Keyboard Shortcuts
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Stop relying on the mouse for everything and gain real speed with the shortcuts that have the biggest impact.
        </p>
      </div>

      {/* Objective */}
      <div style={{
        background: V[50], borderLeft: `3px solid ${V[400]}`,
        borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0",
        padding: "12px 16px", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>
          Stop relying on the mouse for everything and work noticeably faster by mastering the highest-impact shortcuts.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SECTIONS.map((section, si) => {
          const isOpen = openSection === si;
          return (
            <div key={si} style={{
              borderRadius: "var(--border-radius-md)",
              border: `0.5px solid ${isOpen ? V[200] : "var(--color-border-tertiary)"}`,
              transition: "all 0.2s",
            }}>
              <div
                onClick={() => setOpenSection(isOpen ? -1 : si)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
              >
                <div style={{
                  width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                  background: isOpen ? V[600] : V[50],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 500, color: isOpen ? "#fff" : V[600],
                  transition: "all 0.2s",
                }}>{si + 1}</div>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: isOpen ? V[800] : "var(--color-text-primary)" }}>
                  {section.title}
                </span>
                <span style={{
                  fontSize: 16, color: "var(--color-text-tertiary)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}>&#x25BE;</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 16px 16px 56px" }}>
                  {section.content.map((block, bi) => renderBlock(block, bi))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Takeaways */}
      <div style={{
        background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem", marginTop: "1.5rem",
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>
          Key takeaways from this module
        </div>
        {[
          "Ctrl+Arrow jumps across data blocks. Ctrl+Shift+Arrow selects them. They're the most important duo.",
          "F2 enters edit mode and visually shows which cells a formula references.",
          "Tab confirms and moves right. Ideal for filling in tables row by row.",
          "Alt+= inserts AutoSum. Ctrl+T turns data into a Table. Ctrl+1 opens Format Cells.",
          "Don't memorize 30 shortcuts. Master 5 first, then add more gradually.",
        ].map((point, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0",
            borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none",
          }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: V[400], marginTop: 7 }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)",
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Previous: The Excel 365 Interface</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Data Structure and Organization</span>
      </div>
    </div>
  );
}
