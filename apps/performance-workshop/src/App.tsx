import { useState } from "react";
import { SearchPanel } from "./components/SearchPanel";
import { StatsPanel } from "./components/StatsPanel";
import { ProductList } from "./components/ProductList";
import { ScrollTracker } from "./components/ScrollTracker";
import { ALL_PRODUCTS } from "./data/mockProducts";
import type { FilterState } from "./types";

const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: 0,
  maxPrice: 500,
  inStockOnly: false,
  sortKey: "name",
  sortOrder: "asc",
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cart, setCart] = useState<string[]>([]);

  // PERF ISSUE: handleAddToCart is redefined on every render of App.
  // When cart state updates, App re-renders and produces a new function reference,
  // which propagates down to ProductList → ProductCard as a changed prop.
  // Even after wrapping ProductCard in React.memo, it will still re-render because
  // its onAddToCart prop fails the shallow equality check.
  function handleAddToCart(id: string) { // PERF ISSUE: unstable function reference
    setCart((prev) => [...prev, id]);
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 24px 120px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#111827",
      }}
    >
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>
          Performance Workshop
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          Fix four categories of React performance issues:{" "}
          <strong>debounce</strong> (search),{" "}
          <strong>throttle</strong> (scroll),{" "}
          <strong>useMemo</strong> (stats + filter), and{" "}
          <strong>React.memo + useCallback</strong> (product cards).
          Open React DevTools → Profiler and record while interacting to measure
          the impact of each fix.
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9ca3af" }}>
          Cart: {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
      </header>

      {/* Exercise 1: debounce the search query */}
      <SearchPanel />

      {/* Exercise 2: useMemo for expensive aggregation */}
      <StatsPanel products={ALL_PRODUCTS} />

      {/* Exercise 3: useMemo + useCallback + React.memo on the product list */}
      <ProductList
        products={ALL_PRODUCTS}
        filters={filters}
        onFiltersChange={setFilters}
        onAddToCart={handleAddToCart}
        cart={cart}
      />

      {/* Exercise 4: throttle scroll events — visible as a fixed overlay */}
      <ScrollTracker />
    </div>
  );
}
