import { filterAndSortProducts } from "../../utils/compute";
import { FilterBar } from "./FilterBar";
import { ProductCard } from "./ProductCard";
import type { FilterState, Product } from "../../types";

interface ProductListProps {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onAddToCart: (id: string) => void;
  cart: string[];
}

export function ProductList({
  products,
  filters,
  onFiltersChange,
  onAddToCart,
  cart,
}: ProductListProps) {
  // PERF ISSUE: filterAndSortProducts runs on every render of ProductList, even
  // when `products` and `filters` haven't changed (e.g. when cart state updates).
  // Fix: memoize so it only recomputes when its inputs actually change.
  const filtered = filterAndSortProducts(products, filters, ""); // PERF ISSUE: no memoization

  // PERF ISSUE: onAddToCart (from App) is redefined on every App render.
  // Every new reference causes ProductCard to receive a changed prop — defeating
  // component memoization even after you add it to ProductCard.
  // Fix: ensure the function reference is stable and ProductCard only re-renders
  // when its own props change.
  //
  // Together these ensure ProductCard only re-renders when its own product or
  // inCart value changes, not on every parent render.

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        3. Product list — add useMemo, useCallback & React.memo
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        Click "Add to cart" and watch the React DevTools Profiler: all{" "}
        {Math.min(filtered.length, 100)} cards re-render on every click. Fix the
        three PERF ISSUEs above to eliminate the wasted renders.
      </p>

      <FilterBar filters={filters} onChange={onFiltersChange} />

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        Showing {Math.min(filtered.length, 100).toLocaleString()} of{" "}
        {filtered.length.toLocaleString()} results
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.slice(0, 100).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inCart={cart.includes(product.id)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
