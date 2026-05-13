import { useState } from "react";
import { COMMANDS, createEditorConfig, htmlToMarkdown, markdownToHtml, sanitise } from "../lib/richTextEngine";

// This component imports richTextEngine (~8 KB) at module load time.
// BUNDLE ISSUE in SettingsPage: the parent eagerly imports RichTextEditor at the
// top of the file, so richTextEngine is pulled into the initial bundle even though
// the editor is only shown when the user clicks "Edit bio".
//
// Fix (applied in SettingsPage):
//   const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<"rich" | "markdown">("rich");
  const config = createEditorConfig({ placeholder });
  const groups = Object.entries(config.toolbar);

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    onChange(sanitise((e.target as HTMLDivElement).innerHTML));
  }

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", fontFamily: "sans-serif" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 10px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        {groups.map(([group, commands]) => (
          <span key={group} style={{ display: "flex", gap: 2, marginRight: 8 }}>
            {commands.map(cmd => (
              <button
                key={cmd.name}
                title={`${cmd.label}${cmd.shortcut ? ` (${cmd.shortcut})` : ""}`}
                style={{ padding: "3px 7px", fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 4, background: "#fff", cursor: "pointer", fontFamily: "monospace" }}
              >
                {cmd.icon}
              </button>
            ))}
          </span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["rich", "markdown"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #d1d5db", borderRadius: 4, background: mode === m ? "#6366f1" : "#fff", color: mode === m ? "#fff" : "#374151", cursor: "pointer" }}
            >
              {m === "rich" ? "Rich" : "MD"}
            </button>
          ))}
        </div>
      </div>

      {/* Editor area */}
      {mode === "rich" ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          style={{ minHeight: 140, padding: "12px 14px", outline: "none", fontSize: 14, lineHeight: 1.6 }}
        />
      ) : (
        <textarea
          value={htmlToMarkdown(value)}
          onChange={e => onChange(sanitise(markdownToHtml(e.target.value)))}
          style={{ width: "100%", minHeight: 140, padding: "12px 14px", border: "none", outline: "none", fontSize: 13, fontFamily: "monospace", lineHeight: 1.6, boxSizing: "border-box", resize: "vertical" }}
        />
      )}

      <div style={{ padding: "4px 10px", borderTop: "1px solid #f3f4f6", fontSize: 11, color: "#9ca3af" }}>
        {COMMANDS.length} commands · {value.length} chars
      </div>
    </div>
  );
}
