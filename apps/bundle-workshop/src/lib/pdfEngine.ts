// Synthetic PDF library — simulates a real PDF dependency (~7 KB).
// In a real app this would be something like jsPDF (280 KB) or pdfmake (800 KB).
// Importing it at the module level forces it into the initial bundle even if
// PDF export is only triggered by a user action deep in the /reports page.

// ─── Page size presets ────────────────────────────────────────────────────────

export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  A3: { width: 841.89, height: 1190.55 },
  A5: { width: 419.53, height: 595.28 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  Tabloid: { width: 792, height: 1224 },
  B4: { width: 708.66, height: 1000.63 },
  B5: { width: 498.9, height: 708.66 },
} as const;

export type PageSize = keyof typeof PAGE_SIZES;
export type Orientation = "portrait" | "landscape";

export function resolvePageSize(size: PageSize, orientation: Orientation = "portrait") {
  const { width, height } = PAGE_SIZES[size];
  return orientation === "portrait" ? { width, height } : { width: height, height: width };
}

// ─── Font registry ────────────────────────────────────────────────────────────

export const FONT_REGISTRY = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italic: "Helvetica-Oblique",
    boldItalic: "Helvetica-BoldOblique",
  },
  Times: {
    normal: "Times-Roman",
    bold: "Times-Bold",
    italic: "Times-Italic",
    boldItalic: "Times-BoldItalic",
  },
  Courier: {
    normal: "Courier",
    bold: "Courier-Bold",
    italic: "Courier-Oblique",
    boldItalic: "Courier-BoldOblique",
  },
  Symbol: { normal: "Symbol", bold: "Symbol", italic: "Symbol", boldItalic: "Symbol" },
  ZapfDingbats: {
    normal: "ZapfDingbats",
    bold: "ZapfDingbats",
    italic: "ZapfDingbats",
    boldItalic: "ZapfDingbats",
  },
} as const;

export type FontFamily = keyof typeof FONT_REGISTRY;

// ─── Colour helpers ───────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount)),
  );
}
export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.round(r * (1 - amount)),
    Math.round(g * (1 - amount)),
    Math.round(b * (1 - amount)),
  );
}

// ─── Layout utilities ─────────────────────────────────────────────────────────

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function margin(v: number | Partial<Margin>): Margin {
  if (typeof v === "number") return { top: v, right: v, bottom: v, left: v };
  return { top: 0, right: 0, bottom: 0, left: 0, ...v };
}
export function contentBox(page: { width: number; height: number }, m: Margin): Box {
  return {
    x: m.left,
    y: m.top,
    width: page.width - m.left - m.right,
    height: page.height - m.top - m.bottom,
  };
}
export function splitRect(box: Box, fractions: number[], axis: "x" | "y"): Box[] {
  const total = fractions.reduce((a, b) => a + b, 0);
  let offset = 0;
  return fractions.map((f) => {
    const size = (f / total) * (axis === "x" ? box.width : box.height);
    const b: Box =
      axis === "x"
        ? { x: box.x + offset, y: box.y, width: size, height: box.height }
        : { x: box.x, y: box.y + offset, width: box.width, height: size };
    offset += size;
    return b;
  });
}
export function gridLayout(box: Box, cols: number, rows: number, gap = 8): Box[][] {
  const cellW = (box.width - gap * (cols - 1)) / cols;
  const cellH = (box.height - gap * (rows - 1)) / rows;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      x: box.x + c * (cellW + gap),
      y: box.y + r * (cellH + gap),
      width: cellW,
      height: cellH,
    })),
  );
}

// ─── Table builder ────────────────────────────────────────────────────────────

export interface TableColumn {
  header: string;
  key: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: (v: unknown) => string;
}

export function buildTable(columns: TableColumn[], rows: Record<string, unknown>[]) {
  const totalWidth = columns.reduce((s, c) => s + (c.width ?? 100), 0);
  const header = columns.map((c) => ({ ...c, label: c.header }));
  const body = rows.map((row) =>
    columns.map((c) => ({
      value: c.format ? c.format(row[c.key]) : String(row[c.key] ?? ""),
      align: c.align ?? "left",
      width: c.width ?? 100,
    })),
  );
  return { header, body, totalWidth };
}

// ─── Template generators ──────────────────────────────────────────────────────

export const REPORT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  body{font-family:'Inter',Helvetica,sans-serif;font-size:11pt;color:#1f2937;line-height:1.5;}
  h1{font-size:22pt;font-weight:700;color:#111827;margin:0 0 4pt;}
  h2{font-size:15pt;font-weight:600;color:#374151;margin:16pt 0 6pt;}
  h3{font-size:12pt;font-weight:600;color:#4b5563;margin:12pt 0 4pt;}
  table{width:100%;border-collapse:collapse;margin:8pt 0;}
  th{background:#f3f4f6;font-weight:600;text-align:left;padding:6pt 8pt;border-bottom:1px solid #e5e7eb;}
  td{padding:5pt 8pt;border-bottom:1px solid #f3f4f6;}
  tr:nth-child(even) td{background:#f9fafb;}
  .stat{display:flex;flex-direction:column;padding:12pt;background:#f9fafb;border-radius:6pt;border:1pt solid #e5e7eb;}
  .stat-value{font-size:24pt;font-weight:700;color:#111827;}
  .stat-label{font-size:9pt;color:#6b7280;margin-top:2pt;}
  footer{font-size:8pt;color:#9ca3af;border-top:1pt solid #e5e7eb;padding-top:6pt;margin-top:16pt;}
`.trim();

export interface DocumentOptions {
  title: string;
  author: string;
  subject?: string;
  pageSize?: PageSize;
  orientation?: Orientation;
  margins?: Partial<Margin>;
}

export function createDocument(options: DocumentOptions) {
  const page = resolvePageSize(options.pageSize ?? "A4", options.orientation);
  const m = margin(options.margins ?? { top: 56, right: 48, bottom: 56, left: 48 });
  return {
    ...options,
    page,
    margin: m,
    content: contentBox(page, m),
    createdAt: new Date().toISOString(),
  };
}

export type PdfDoc = ReturnType<typeof createDocument>;
