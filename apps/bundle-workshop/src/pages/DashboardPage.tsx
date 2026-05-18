import { formatCurrency, formatNumber, formatPercent, formatChange, formatDate } from "../utils/formatters";

const METRICS = [
  {
    label: "Monthly revenue",
    value: 128400,
    prev: 115200,
    format: (v: number) => formatCurrency(v),
  },
  { label: "Active users", value: 48291, prev: 44100, format: (v: number) => formatNumber(v) },
  {
    label: "Conversion rate",
    value: 0.0342,
    prev: 0.0318,
    format: (v: number) => formatPercent(v),
  },
  {
    label: "Avg order value",
    value: 84.6,
    prev: 79.2,
    format: (v: number) => formatCurrency(v),
  },
  { label: "Churn rate", value: 0.021, prev: 0.024, format: (v: number) => formatPercent(v) },
  { label: "Support tickets", value: 312, prev: 287, format: (v: number) => formatNumber(v) },
];

const RECENT = [
  { id: "INV-0841", customer: "Acme Corp", amount: 4200, date: "2026-05-12", status: "paid" },
  {
    id: "INV-0840",
    customer: "Globex Industries",
    amount: 1850,
    date: "2026-05-12",
    status: "pending",
  },
  { id: "INV-0839", customer: "Initech LLC", amount: 9400, date: "2026-05-11", status: "paid" },
  { id: "INV-0838", customer: "Umbrella Corp", amount: 640, date: "2026-05-11", status: "overdue" },
  {
    id: "INV-0837",
    customer: "Soylent Green Inc",
    amount: 2100,
    date: "2026-05-10",
    status: "paid",
  },
];

const STATUS_COLOR: Record<string, string> = {
  paid: "#16a34a",
  pending: "#d97706",
  overdue: "#dc2626",
};

export function DashboardPage() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>Dashboard</h2>

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {METRICS.map(({ label, value, prev, format }) => {
          const change = (value - prev) / prev;
          return (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{label}</p>
              <p style={{ margin: "6px 0 2px", fontSize: 22, fontWeight: 700 }}>{format(value)}</p>
              <p style={{ margin: 0, fontSize: 12, color: change >= 0 ? "#16a34a" : "#dc2626" }}>
                {formatChange(change)} vs last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent invoices */}
      <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Recent invoices</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            {["ID", "Customer", "Amount", "Date", "Status"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECENT.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>{row.id}</td>
              <td style={{ padding: "10px 12px" }}>{row.customer}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                {formatCurrency(row.amount)}
              </td>
              <td style={{ padding: "10px 12px", color: "#6b7280" }}>{formatDate(row.date)}</td>
              <td style={{ padding: "10px 12px" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    background: STATUS_COLOR[row.status] + "22",
                    color: STATUS_COLOR[row.status],
                  }}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
