// Synthetic chart library — simulates a real charting dependency (~8 KB).
// In a real app this would be something like Chart.js (170 KB) or Recharts (320 KB).
// Importing it at the module level pulls ALL of this into the initial bundle,
// even if charts are only shown on the /analytics route.

// ─── Colour palettes ─────────────────────────────────────────────────────────

export const PALETTE_DEFAULT = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#3b82f6",
];
export const PALETTE_PASTEL = [
  "#c7d2fe",
  "#ddd6fe",
  "#fbcfe8",
  "#fecdd3",
  "#fed7aa",
  "#fef08a",
  "#bbf7d0",
  "#99f6e4",
  "#bae6fd",
  "#bfdbfe",
];
export const PALETTE_DARK = [
  "#312e81",
  "#4c1d95",
  "#831843",
  "#881337",
  "#7c2d12",
  "#713f12",
  "#14532d",
  "#134e4a",
  "#0c4a6e",
  "#1e3a8a",
];
export const PALETTE_MONO = [
  "#f9fafb",
  "#f3f4f6",
  "#e5e7eb",
  "#d1d5db",
  "#9ca3af",
  "#6b7280",
  "#4b5563",
  "#374151",
  "#1f2937",
  "#111827",
];
export const PALETTE_DIVERGE = [
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#16a34a",
  "#059669",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
];

// ─── Easing functions ─────────────────────────────────────────────────────────

export const EASING = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInBack: (t: number) => 2.70158 * t * t * t - 1.70158 * t * t,
  easeOutBack: (t: number) => {
    const c = 1.70158;
    return 1 + ((c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2));
  },
  easeInBounce: (t: number) => 1 - EASING.easeOutBounce(1 - t),
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    else if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    else return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  easeInElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * t - 10) * Math.sin(((t * 10 - 10.75) * (2 * Math.PI)) / 3);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1;
  },
} as const;

// ─── Scale utilities ──────────────────────────────────────────────────────────

export function linearScale(domain: [number, number], range: [number, number]) {
  return (v: number) =>
    range[0] + ((v - domain[0]) / (domain[1] - domain[0])) * (range[1] - range[0]);
}
export function logScale(domain: [number, number], range: [number, number]) {
  const log = (d: [number, number]): [number, number] => [Math.log(d[0]), Math.log(d[1])];
  return linearScale(log(domain), range);
}
export function sqrtScale(domain: [number, number], range: [number, number]) {
  return (v: number) =>
    linearScale([Math.sqrt(domain[0]), Math.sqrt(domain[1])], range)(Math.sqrt(v));
}
export function bandScale(domain: string[], range: [number, number], padding = 0.1) {
  const step = (range[1] - range[0]) / (domain.length - padding * 2);
  return (v: string) => range[0] + domain.indexOf(v) * step + step * padding;
}
export function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}
export function normalise(v: number, min: number, max: number) {
  return clamp((v - min) / (max - min), 0, 1);
}
export function niceNum(v: number, round = false) {
  const exp = Math.floor(Math.log10(v));
  const f = v / Math.pow(10, exp);
  const nf = round
    ? f < 1.5
      ? 1
      : f < 3
        ? 2
        : f < 7
          ? 5
          : 10
    : f <= 1
      ? 1
      : f <= 2
        ? 2
        : f <= 5
          ? 5
          : 10;
  return nf * Math.pow(10, exp);
}
export function ticks(min: number, max: number, count = 5) {
  const step = niceNum((max - min) / count, true);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const result = [];
  for (let v = start; v <= end + step / 2; v += step) result.push(Math.round(v * 1e10) / 1e10);
  return result;
}

// ─── Axis formatters ─────────────────────────────────────────────────────────

export const AXIS_FORMATS = {
  number: (v: number) => v.toLocaleString(),
  compact: (v: number) => Intl.NumberFormat("en", { notation: "compact" }).format(v),
  percent: (v: number) => `${(v * 100).toFixed(1)}%`,
  currency: (v: number) =>
    Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(v),
  date: (v: number) => new Date(v).toLocaleDateString(),
  datetime: (v: number) => new Date(v).toLocaleString(),
  duration: (v: number) => {
    const h = Math.floor(v / 3600),
      m = Math.floor((v % 3600) / 60),
      s = v % 60;
    return `${h ? h + "h " : ""}${m ? m + "m " : ""}${s}s`;
  },
  bytes: (v: number) => {
    const u = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(1)} ${u[i]}`;
  },
  scientific: (v: number) => v.toExponential(2),
  ordinal: (v: number) =>
    `${v}${["th", "st", "nd", "rd"][v % 10 > 3 || ~~((v % 100) - (v % 10)) === 10 ? 0 : v % 10]}`,
};

// ─── Data transforms ─────────────────────────────────────────────────────────

export function stackSeries(data: Record<string, number>[]) {
  const keys = Object.keys(data[0] ?? {});
  return data.map((row) => {
    let acc = 0;
    return Object.fromEntries(
      keys.map((k) => {
        const v = row[k] ?? 0;
        const entry = [k, [acc, acc + v]];
        acc += v;
        return entry;
      }),
    );
  });
}
export function rollingAverage(values: number[], window: number) {
  return values.map((_, i) => {
    const s = Math.max(0, i - window + 1);
    return values.slice(s, i + 1).reduce((a, b) => a + b, 0) / (i - s + 1);
  });
}
export function groupBy<T>(arr: T[], key: keyof T): Map<T[keyof T], T[]> {
  return arr.reduce((m, item) => {
    const k = item[key];
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(item);
    return m;
  }, new Map<T[keyof T], T[]>());
}
export function extent(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)];
}
export function bin(values: number[], thresholds: number[]) {
  const bins: number[][] = Array.from({ length: thresholds.length + 1 }, () => []);
  values.forEach((v) => {
    const i = thresholds.findIndex((t) => v < t);
    bins[i === -1 ? bins.length - 1 : i].push(v);
  });
  return bins;
}
export function kde(kernel: (v: number) => number, thresholds: number[], data: number[]) {
  return thresholds.map((x) => ({
    x,
    y: data.reduce((s, v) => s + kernel(x - v), 0) / data.length,
  }));
}
export const epanechnikovKernel = (bandwidth: number) => (v: number) =>
  Math.abs((v /= bandwidth)) <= 1 ? (0.75 * (1 - v * v)) / bandwidth : 0;

// ─── Chart configuration defaults ────────────────────────────────────────────

export const DEFAULT_CONFIG = {
  animation: { duration: 750, easing: "easeInOutQuart" as keyof typeof EASING },
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } },
    tooltip: { padding: 10, cornerRadius: 6, displayColors: true },
  },
  layout: { padding: { top: 8, right: 8, bottom: 8, left: 8 } },
  scales: {
    x: { grid: { color: "#f3f4f6" }, ticks: { color: "#6b7280", font: { size: 12 } } },
    y: {
      grid: { color: "#f3f4f6" },
      ticks: { color: "#6b7280", font: { size: 12 } },
      beginAtZero: true,
    },
  },
};

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "radar"
  | "scatter"
  | "bubble"
  | "area"
  | "histogram"
  | "heatmap";
export type LegendPosition = "top" | "bottom" | "left" | "right";
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}
export interface ChartConfig {
  type: ChartType;
  labels: string[];
  datasets: ChartDataset[];
}

export function createConfig(
  type: ChartType,
  labels: string[],
  datasets: ChartDataset[],
): ChartConfig {
  return { type, labels, datasets };
}
