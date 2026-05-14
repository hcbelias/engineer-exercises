import type { Product } from "../types";
import { calculateStats } from "../utils/compute";

interface StatsPanelProps {
  products: Product[];
}

// PERF ISSUE: calculateStats runs on every render, including renders triggered by
// unrelated state changes (cart updates, filter changes, search input).
//
// calculateStats does 3 passes over all 5,000 items and takes ~8–15 ms per call.
// Because `products` (ALL_PRODUCTS) never changes, this work is 100% wasted on
// every render after the first.
// Fix: memoize the result so it only recomputes when `products` changes.
export function StatsPanel({ products }: StatsPanelProps) {
  const stats = calculateStats(products); // PERF ISSUE: runs on every render

  const fmt = (n: number) => n.toLocaleString();

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        2. Stats panel — add useMemo
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        calculateStats does 3 passes over {fmt(products.length)} items. Open the browser Performance
        tab: it fires on every render. Fix: wrap with useMemo.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {[
          { label: "Total products", value: fmt(stats.total) },
          { label: "In stock", value: fmt(stats.inStock) },
          { label: "Avg price", value: `$${stats.avgPrice.toFixed(2)}` },
          { label: "Avg rating", value: `★ ${stats.avgRating}` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: "12px 16px",
              background: "#f9fafb",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{label}</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#6b7280" }}>
        <strong style={{ color: "#374151" }}>Top tags: </strong>
        {stats.topTags.map(({ tag, count }) => (
          <span key={tag} style={{ marginRight: 12 }}>
            {tag} ({fmt(count)})
          </span>
        ))}
      </div>
    </section>
  );
}
