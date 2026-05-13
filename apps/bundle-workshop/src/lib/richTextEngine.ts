// Synthetic rich text library — simulates a real editor dependency (~8 KB).
// In a real app this would be Tiptap (270 KB), Quill (200 KB), or Slate (150 KB).
// Eagerly importing it pulls it into the initial bundle even though the editor is
// only shown when the user clicks "Edit bio" inside Settings.

// ─── Command registry ─────────────────────────────────────────────────────────

export type CommandName =
  | "bold" | "italic" | "underline" | "strikethrough" | "code" | "superscript" | "subscript"
  | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify"
  | "indent" | "outdent" | "bulletList" | "numberedList" | "taskList"
  | "heading1" | "heading2" | "heading3" | "paragraph" | "blockquote" | "codeBlock"
  | "link" | "unlink" | "image" | "table" | "horizontalRule" | "hardBreak"
  | "undo" | "redo" | "selectAll" | "clearFormat";

export interface Command { name: CommandName; label: string; icon: string; shortcut?: string; group: string; }

export const COMMANDS: Command[] = [
  { name:"bold",           label:"Bold",           icon:"B",  shortcut:"Ctrl+B",       group:"inline" },
  { name:"italic",         label:"Italic",         icon:"I",  shortcut:"Ctrl+I",       group:"inline" },
  { name:"underline",      label:"Underline",      icon:"U",  shortcut:"Ctrl+U",       group:"inline" },
  { name:"strikethrough",  label:"Strikethrough",  icon:"S",  shortcut:"Ctrl+Shift+X", group:"inline" },
  { name:"code",           label:"Inline code",    icon:"`",  shortcut:"Ctrl+E",       group:"inline" },
  { name:"superscript",    label:"Superscript",    icon:"x²", shortcut:"Ctrl+.",       group:"inline" },
  { name:"subscript",      label:"Subscript",      icon:"x₂", shortcut:"Ctrl+,",       group:"inline" },
  { name:"alignLeft",      label:"Align left",     icon:"←",  shortcut:"Ctrl+Shift+L", group:"align"  },
  { name:"alignCenter",    label:"Align center",   icon:"↔",  shortcut:"Ctrl+Shift+E", group:"align"  },
  { name:"alignRight",     label:"Align right",    icon:"→",  shortcut:"Ctrl+Shift+R", group:"align"  },
  { name:"alignJustify",   label:"Justify",        icon:"≡",  shortcut:"Ctrl+Shift+J", group:"align"  },
  { name:"indent",         label:"Indent",         icon:"→|", shortcut:"Tab",          group:"list"   },
  { name:"outdent",        label:"Outdent",        icon:"|←", shortcut:"Shift+Tab",    group:"list"   },
  { name:"bulletList",     label:"Bullet list",    icon:"•",  shortcut:"Ctrl+Shift+8", group:"list"   },
  { name:"numberedList",   label:"Numbered list",  icon:"1.", shortcut:"Ctrl+Shift+7", group:"list"   },
  { name:"taskList",       label:"Task list",      icon:"☐",  shortcut:"Ctrl+Shift+9", group:"list"   },
  { name:"heading1",       label:"Heading 1",      icon:"H1", shortcut:"Ctrl+Alt+1",   group:"block"  },
  { name:"heading2",       label:"Heading 2",      icon:"H2", shortcut:"Ctrl+Alt+2",   group:"block"  },
  { name:"heading3",       label:"Heading 3",      icon:"H3", shortcut:"Ctrl+Alt+3",   group:"block"  },
  { name:"paragraph",      label:"Paragraph",      icon:"P",  shortcut:"Ctrl+Alt+0",   group:"block"  },
  { name:"blockquote",     label:"Blockquote",     icon:"❝",  shortcut:"Ctrl+Shift+B", group:"block"  },
  { name:"codeBlock",      label:"Code block",     icon:"</>",shortcut:"Ctrl+Alt+C",   group:"block"  },
  { name:"link",           label:"Add link",       icon:"🔗", shortcut:"Ctrl+K",       group:"insert" },
  { name:"unlink",         label:"Remove link",    icon:"🚫", shortcut:"Ctrl+Shift+K", group:"insert" },
  { name:"image",          label:"Insert image",   icon:"🖼",  shortcut:"Ctrl+Shift+I", group:"insert" },
  { name:"table",          label:"Insert table",   icon:"⊞",  shortcut:"Ctrl+Shift+T", group:"insert" },
  { name:"horizontalRule", label:"Divider",        icon:"—",  shortcut:"Ctrl+Shift+H", group:"insert" },
  { name:"hardBreak",      label:"Line break",     icon:"↵",  shortcut:"Shift+Enter",  group:"insert" },
  { name:"undo",           label:"Undo",           icon:"↩",  shortcut:"Ctrl+Z",       group:"history"},
  { name:"redo",           label:"Redo",           icon:"↪",  shortcut:"Ctrl+Y",       group:"history"},
  { name:"selectAll",      label:"Select all",     icon:"⊠",  shortcut:"Ctrl+A",       group:"history"},
  { name:"clearFormat",    label:"Clear format",   icon:"✕",  shortcut:"Ctrl+\\",      group:"history"},
];

// ─── HTML sanitiser allow-list ────────────────────────────────────────────────

export const ALLOWED_TAGS = new Set([
  "p","br","strong","em","u","s","code","pre","blockquote","h1","h2","h3","h4","h5","h6",
  "ul","ol","li","table","thead","tbody","tr","th","td","a","img","hr","span","div","mark","sub","sup",
]);

export const ALLOWED_ATTRS: Record<string, string[]> = {
  a:   ["href","title","target","rel"],
  img: ["src","alt","width","height","loading"],
  td:  ["colspan","rowspan","align"],
  th:  ["colspan","rowspan","align","scope"],
  "*": ["class","id","style"],
};

export function sanitise(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "");
}

// ─── Plugin system ────────────────────────────────────────────────────────────

export interface Plugin { name: string; version: string; install(editor: EditorAPI): void; }
export interface EditorAPI {
  exec(cmd: CommandName): void;
  query(cmd: CommandName): boolean;
  getHTML(): string;
  setHTML(html: string): void;
  on(event: string, handler: (e: Event) => void): () => void;
}

export function createPlugin(name: string, install: Plugin["install"]): Plugin {
  return { name, version: "1.0.0", install };
}

// ─── Markdown serialiser (basic) ──────────────────────────────────────────────

const MD_TRANSFORMS: [RegExp, string][] = [
  [/<h1>(.*?)<\/h1>/gi, "# $1\n"],
  [/<h2>(.*?)<\/h2>/gi, "## $1\n"],
  [/<h3>(.*?)<\/h3>/gi, "### $1\n"],
  [/<strong>(.*?)<\/strong>/gi, "**$1**"],
  [/<em>(.*?)<\/em>/gi, "_$1_"],
  [/<code>(.*?)<\/code>/gi, "`$1`"],
  [/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)"],
  [/<img src="(.*?)" alt="(.*?)"[^>]*>/gi, "![$2]($1)"],
  [/<li>(.*?)<\/li>/gi, "- $1\n"],
  [/<p>(.*?)<\/p>/gi, "$1\n\n"],
  [/<br\s*\/?>/gi, "\n"],
  [/<[^>]+>/g, ""],
];

export function htmlToMarkdown(html: string): string {
  return MD_TRANSFORMS.reduce((acc, [re, rep]) => acc.replace(re, rep), html).trim();
}

export function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n(.+)/g, "<p>$1</p>");
}

// ─── Editor factory ───────────────────────────────────────────────────────────

export interface EditorOptions {
  placeholder?: string;
  autofocus?: boolean;
  readOnly?: boolean;
  plugins?: Plugin[];
  onChange?: (html: string) => void;
}

export function createEditorConfig(options: EditorOptions = {}) {
  return {
    placeholder: options.placeholder ?? "Start writing…",
    autofocus: options.autofocus ?? false,
    readOnly: options.readOnly ?? false,
    plugins: options.plugins ?? [],
    toolbar: COMMANDS.reduce<Record<string, Command[]>>((groups, cmd) => {
      (groups[cmd.group] ??= []).push(cmd);
      return groups;
    }, {}),
  };
}

export type EditorConfig = ReturnType<typeof createEditorConfig>;
