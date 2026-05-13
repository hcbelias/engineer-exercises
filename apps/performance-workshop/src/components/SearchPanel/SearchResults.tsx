import type { Product } from "../../types";

interface SearchResultsProps {
  results: Product[];
}

// PERF ISSUE: This component is not memoized.
// When SearchPanel re-renders on every keystroke, SearchResults re-renders too —
// even when `results` hasn't changed (e.g. while the debounced value is still settling).
// Fix: memoize this component so it only re-renders when its props actually change.
export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 8 }}>No results.</p>
    );
  }

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "8px 0 0",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {results.map((product) => (
        <li
          key={product.id}
          style={{
            padding: "8px 12px",
            background: "#f9fafb",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <strong>{product.name}</strong>
            <span style={{ color: "#6b7280", marginLeft: 8 }}>{product.category}</span>
          </span>
          <span style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}
