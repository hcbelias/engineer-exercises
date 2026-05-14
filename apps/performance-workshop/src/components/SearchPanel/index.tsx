import { useState, useMemo } from "react";
import { filterAndSortProducts } from "../../utils/compute";
import { ALL_PRODUCTS } from "../../data/mockProducts";
import { SearchResults } from "./SearchResults";
import type { FilterState } from "../../types";

const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: 0,
  maxPrice: 500,
  inStockOnly: false,
  sortKey: "name",
  sortOrder: "asc",
};

export function SearchPanel() {
  const [query, setQuery] = useState("");

  // PERF ISSUE: `query` updates on every keystroke, so filterAndSortProducts
  // (a 5,000-item sort) runs on every character typed.
  // Fix: introduce debouncing so the filter only fires after the user pauses typing.
  const debouncedQuery = query; // TODO: debounce query

  const results = useMemo(
    () => filterAndSortProducts(ALL_PRODUCTS, DEFAULT_FILTERS, debouncedQuery),
    [debouncedQuery],
  );

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>1. Search — add debounce</h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        Open the browser Performance tab and record while typing quickly. You&apos;ll see
        filterAndSortProducts called on every keystroke. Fix: useDebounce(query, 300).
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 5,000 products…"
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: 15,
          border: "1px solid #d1d5db",
          borderRadius: 6,
          boxSizing: "border-box",
        }}
      />
      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
        {results.length.toLocaleString()} results
      </p>
      <SearchResults results={results.slice(0, 15)} />
    </section>
  );
}
