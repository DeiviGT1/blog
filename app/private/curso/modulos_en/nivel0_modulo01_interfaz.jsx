import { useState } from "react";

const V = {
  50: "#F9EAED", 100: "#EDCAD0", 200: "#DCA3AD", 300: "#C97A8A",
  400: "#B05A6A", 500: "#963B4D", 600: "#7B1D32", 700: "#6A1629",
  800: "#520F1E", 900: "#3A0911",
};
const GOLD = { 50: "#FDF8EC", 800: "#5C480F" };

const SECTIONS = [
  {
    title: "Anatomy of the Excel Window",
    content: [
      {
        type: "text",
        value: "Before you do anything in Excel, you need to know where you are. The Excel 365 window has fixed elements that are always there. Knowing them gives you control and speed."
      },
      {
        type: "definition_list",
        items: [
          { term: "Title Bar", def: "The top bar with the file name. If you're connected to OneDrive, it shows the AutoSave status." },
          { term: "Quick Access Toolbar", def: "A small bar in the top-left corner with quick shortcuts. By default it has Save, Undo and Redo. You can customize it." },
          { term: "Ribbon", def: "The command ribbon, organized into tabs: Home, Insert, Page Layout, Formulas, Data, Review, View. Each tab groups related tools." },
          { term: "Formula Bar", def: "Shows the actual content of the active cell. If the cell has a formula, you see the formula here (not the result). It's your window into what's really inside each cell." },
          { term: "Name Box", def: "To the left of the Formula Bar. Shows the address of the active cell (e.g., A1). It also works for navigation: type an address and press Enter to jump there." },
          { term: "Column / Row Headers", def: "Letters (A, B, C...) for columns and numbers (1, 2, 3...) for rows. Click a letter to select the whole column. Click a number to select the whole row." },
          { term: "Sheet Tabs", def: "At the bottom. Each tab is a sheet (Worksheet) inside the file (Workbook). Right-click to rename, move, copy or delete." },
          { term: "Status Bar", def: "The bottom bar that shows contextual information. When you select a range of numbers, it automatically shows SUM, AVERAGE and COUNT." },
          { term: "Zoom Slider", def: "Bottom right. Ctrl+mouse scroll is the fastest way to zoom." },
        ]
      },
    ]
  },
  {
    title: "Basic Customization",
    content: [
      {
        type: "text",
        value: "Excel adapts to the way you work. These 3 settings have the biggest impact on your day-to-day."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Quick Access Toolbar",
            text: "Click the arrow at the end of the toolbar > More Commands. Add the commands you use most. Recommended: Save, Undo, Redo, Quick Print, Sort Ascending, Sort Descending. Each command is one click away and always visible, no matter which Ribbon tab you're on."
          },
          {
            title: "Ribbon: collapse and expand",
            text: "Ctrl+F1 collapses the Ribbon to free up vertical space. Press it again to expand it. Handy on small screens or when you need to see more rows of data."
          },
          {
            title: "Search Box (Tell Me)",
            text: "The search field at the top of the Ribbon. Type what you want to do (\"merge\", \"freeze\", \"chart\") and Excel takes you straight to the tool. It's the most underrated shortcut in Excel: you don't need to know where something is if you know what it's called."
          },
        ]
      },
    ]
  },
  {
    title: "Workbook Views",
    content: [
      {
        type: "text",
        value: "Excel has 3 main views. Each one serves a different purpose."
      },
      {
        type: "definition_list",
        items: [
          { term: "Normal", def: "The default view. The one you'll use 95% of the time to work with data." },
          { term: "Page Layout", def: "Shows the sheet as it would look printed, with margins, headers and page breaks visible. Only useful when you need to prepare a document for printing." },
          { term: "Page Break Preview", def: "Shows blue lines marking where pages will break when printed. You can drag those lines to adjust the breaks." },
        ]
      },
      {
        type: "text",
        value: "Two essential view tools you'll use all the time:"
      },
      {
        type: "key_points",
        items: [
          {
            title: "Freeze Panes",
            text: "View > Freeze Panes. Freezes rows or columns so they stay visible while you scroll. The most common setup: click cell B2 and apply Freeze Panes to freeze row 1 (headers) and column A. That way, as you move through a long table, you always see the headers and the first column."
          },
          {
            title: "Split",
            text: "View > Split. Splits the window into independent panes so you can see two parts of the same sheet at once. Useful for comparing data that's far apart without scrolling back and forth."
          },
        ]
      },
    ]
  },
  {
    title: "The Status Bar as a Tool",
    content: [
      {
        type: "text",
        value: "The Status Bar at the bottom of Excel is a quick analysis tool that most users ignore."
      },
      {
        type: "text",
        value: "When you select a range of cells with numbers, the Status Bar automatically shows the SUM, AVERAGE and COUNT without writing a single formula. It's the fastest way to get a quick number."
      },
      {
        type: "key_points",
        items: [
          {
            title: "Customize the Status Bar",
            text: "Right-click the Status Bar to see all available options: Minimum, Maximum, Numerical Count, Average, Count, Sum. You can turn each one on or off. Tip: turn on every one you need for your kind of work."
          },
        ]
      },
    ]
  },
  {
    title: "Navigation and Structure",
    content: [
      {
        type: "text",
        value: "Excel organizes information into 3 hierarchical levels. Understanding this structure is essential for everything that follows."
      },
      {
        type: "definition_list",
        items: [
          { term: "Workbook", def: "The file (.xlsx). It can contain multiple Worksheets. It's what you open and close." },
          { term: "Worksheet (Sheet)", def: "Each tab inside the Workbook. A sheet has more than 1 million rows and 16,000+ columns. You'll usually use a fraction of that." },
          { term: "Cell", def: "The smallest unit. It's identified by its column and row (e.g., B5). It can hold a value, a formula, or be empty." },
        ]
      },
      {
        type: "text",
        value: "Two shortcuts worth making second nature right now: Ctrl+1 opens Format Cells (the most complete formatting window, direct access to everything), and Ctrl+mouse scroll gives you smooth zoom control."
      },
    ]
  },
];

export default function Module() {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0.5rem 0 2rem" }}>
      {/* Module header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px",
            borderRadius: "var(--border-radius-md)", background: GOLD[50], color: GOLD[800],
          }}>LEVEL 0 — REQUIRED</span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Module 1 of 6</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px" }}>
          The Excel 365 Interface
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Get to know every part of the Excel window so you can move around with confidence and know exactly where to find each tool.
        </p>
      </div>

      {/* Objective */}
      <div style={{
        background: V[50], borderLeft: `3px solid ${V[400]}`, borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0",
        padding: "12px 16px", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: V[600], letterSpacing: "0.04em", marginBottom: 2 }}>GOAL</div>
        <p style={{ fontSize: 13, color: V[800], margin: 0, lineHeight: 1.6 }}>
          Feel comfortable navigating the interface and know exactly where each tool is without having to hunt for it.
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
              background: isOpen ? "var(--color-background-primary)" : "var(--color-background-primary)",
              transition: "all 0.2s",
            }}>
              {/* Section header */}
              <div
                onClick={() => setOpenSection(isOpen ? -1 : si)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 28, height: 28, minWidth: 28, borderRadius: "50%",
                  background: isOpen ? V[600] : V[50],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 500,
                  color: isOpen ? "#fff" : V[600],
                  transition: "all 0.2s",
                }}>
                  {si + 1}
                </div>
                <span style={{
                  flex: 1, fontSize: 15, fontWeight: 500,
                  color: isOpen ? V[800] : "var(--color-text-primary)",
                }}>{section.title}</span>
                <span style={{
                  fontSize: 16, color: "var(--color-text-tertiary)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}>▾</span>
              </div>

              {/* Section content */}
              {isOpen && (
                <div style={{ padding: "0 16px 16px 56px" }}>
                  {section.content.map((block, bi) => {
                    if (block.type === "text") {
                      return (
                        <p key={bi} style={{
                          fontSize: 14, color: "var(--color-text-secondary)",
                          margin: bi === 0 ? "0 0 14px" : "14px 0",
                          lineHeight: 1.7,
                        }}>{block.value}</p>
                      );
                    }
                    if (block.type === "definition_list") {
                      return (
                        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
                          {block.items.map((item, di) => (
                            <div key={di} style={{
                              background: "var(--color-background-secondary)",
                              borderRadius: "var(--border-radius-md)",
                              padding: "10px 14px",
                            }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: V[600], marginBottom: 2 }}>
                                {item.term}
                              </div>
                              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                                {item.def}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === "key_points") {
                      return (
                        <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0" }}>
                          {block.items.map((item, ki) => (
                            <div key={ki} style={{
                              borderLeft: `2px solid ${V[200]}`,
                              paddingLeft: 14,
                            }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                                {item.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key takeaways */}
      <div style={{
        background: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
        marginTop: "1.5rem",
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Key takeaways from this module</div>
        {[
          "The Formula Bar shows what a cell really contains — always check it.",
          "The Name Box doesn't just show the address: you can type in it to jump to any cell.",
          "The Status Bar gives you SUM, AVERAGE and COUNT automatically when you select a range.",
          "Freeze Panes is essential for working with long tables without losing sight of the headers.",
          "Ctrl+1 (Format Cells) and the Search Box (Tell Me) are the two shortcuts that will save you the most time.",
        ].map((point, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "6px 0",
            borderTop: i > 0 ? "0.5px solid var(--color-border-tertiary)" : "none",
          }}>
            <div style={{
              width: 6, height: 6, minWidth: 6, borderRadius: "50%",
              background: V[400], marginTop: 7,
            }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>

      {/* Navigation footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "1.5rem", paddingTop: "1rem",
        borderTop: "0.5px solid var(--color-border-tertiary)",
      }}>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Level 0 — Fundamentals and Habits</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: V[600] }}>Next: Navigation and Keyboard Shortcuts</span>
      </div>
    </div>
  );
}
