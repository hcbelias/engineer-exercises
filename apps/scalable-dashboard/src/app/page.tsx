// This is the dashboard home (Server Component)
// It renders stat cards and links to sub-routes.

import Link from "next/link";

const STATS = [
  { label: "Total Users", value: "10,000", href: "/users" },
  { label: "Active Sessions", value: "1,247", href: "/analytics" },
  { label: "Revenue (MTD)", value: "$84,320", href: "/analytics" },
];

export default function DashboardHome() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              display: "block",
              padding: 20,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: "#6b7280", marginTop: 4 }}>{stat.label}</div>
          </Link>
        ))}
      </div>
      <p style={{ color: "#6b7280" }}>
        Navigate to <strong>Users</strong> to see the virtualized table, <strong>Analytics</strong>{" "}
        to see lazy-loaded charts.
      </p>
    </div>
  );
}
