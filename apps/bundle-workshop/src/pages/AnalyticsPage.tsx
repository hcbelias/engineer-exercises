// chartEngine is imported at the top of this file.
// Because App.tsx imports AnalyticsPage *eagerly* (no React.lazy), chartEngine
// lands in the initial bundle — even if the user never visits /analytics.
//
// Fix (applied in App.tsx):
//   const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
//
// After that change, chartEngine moves into its own chunk and is only downloaded
// when the user first navigates here. Check dist/stats.html before and after.
import {
  PALETTE_DEFAULT,
  AXIS_FORMATS,
  ticks,
  rollingAverage,
  createConfig,
} from "../lib/chartEngine";
import { formatCurrency, formatCompact } from "../utils/formatters";

// ─── Fake time-series data ─────────────────────────────────────────────────

function seed(s: number) {
  let n = s;
  return () => {
    n = Math.imul(1664525, n) + 1013904223;
    return (n >>> 0) / 0xffffffff;
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const rand = seed(7);
const REVENUE = MONTHS.map(() => Math.round(rand() * 80000 + 60000));
const USERS = MONTHS.map(() => Math.round(rand() * 20000 + 30000));
const COSTS = MONTHS.map((_, i) => Math.round(REVENUE[i] * (rand() * 0.3 + 0.4)));

const smoothRevenue = rollingAverage(REVENUE, 3);
const config = createConfig("line", MONTHS, [
  {
    label: "Revenue",
    data: REVENUE,
    backgroundColor: PALETTE_DEFAULT[0],
    borderColor: PALETTE_DEFAULT[0],
  },
  {
    label: "3-mo avg",
    data: smoothRevenue,
    backgroundColor: PALETTE_DEFAULT[1],
    borderColor: PALETTE_DEFAULT[1],
  },
  {
    label: "Operating cost",
    data: COSTS,
    backgroundColor: PALETTE_DEFAULT[2],
    borderColor: PALETTE_DEFAULT[2],
  },
]);

const yTicks = ticks(Math.min(...COSTS), Math.max(...REVENUE));
const formatY = AXIS_FORMATS.compact;

// ─── Simulated chart UI (no canvas dependency) ────────────────────────────

function MiniBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
      {values.map((v, i) => (
        <div
          key={i}
          title={`${MONTHS[i]}: ${formatY(v)}`}
          style={{
            flex: 1,
            background: color,
            opacity: 0.8,
            height: `${(v / max) * 100}%`,
            borderRadius: "2px 2px 0 0",
            cursor: "default",
            transition: "opacity 0.2s",
          }}
        />
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  const totalRevenue = REVENUE.reduce((a, b) => a + b, 0);
  const totalCosts = COSTS.reduce((a, b) => a + b, 0);
  const profit = totalRevenue - totalCosts;
  const margin = profit / totalRevenue;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Analytics</h2>
      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>
        Chart series: {config.datasets.map((d) => d.label).join(", ")} · Y-axis:{" "}
        {yTicks.map((t) => formatY(t)).join(", ")}
      </p>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          { label: "Annual revenue", value: formatCurrency(totalRevenue) },
          { label: "Operating costs", value: formatCurrency(totalCosts) },
          { label: "Gross profit", value: formatCurrency(profit) },
          { label: "Profit margin", value: `${(margin * 100).toFixed(1)}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{ padding: "14px 16px", border: "1px solid #e5e7eb", borderRadius: 8 }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 20, fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Monthly revenue", data: REVENUE, color: PALETTE_DEFAULT[0] },
          { label: "3-month avg", data: smoothRevenue.map(Math.round), color: PALETTE_DEFAULT[1] },
          { label: "Operating costs", data: COSTS, color: PALETTE_DEFAULT[2] },
          { label: "Active users", data: USERS, color: PALETTE_DEFAULT[3] },
        ].map(({ label, data, color }) => (
          <div key={label} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>{label}</p>
            <MiniBar values={data} color={color} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#9ca3af",
                marginTop: 4,
              }}
            >
              <span>{formatCompact(Math.min(...data))}</span>
              <span>{formatCompact(Math.max(...data))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
