import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  inCart: boolean;
  onAddToCart: (id: string) => void;
}

// PERF ISSUE: This component is not memoized.
// Every time ProductList re-renders (e.g. because cart state changed in App),
// ALL ProductCard instances re-render — even those whose `product` and `inCart`
// props are identical to the previous render.
//
// With 100 cards rendered, that's 100 wasted render cycles on every cart update.
// Fix: memoize this component so it only re-renders when its own props change.
// Note: memoization only works if ALL props pass shallow equality — including callbacks.
export function ProductCard({ product, inCart, onAddToCart }: ProductCardProps) {
  return (
    <div
      style={{
        padding: "12px 16px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: inCart ? "#f0fdf4" : "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
          {product.category} · ★ {product.rating} ({product.reviewCount.toLocaleString()} reviews)
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
          {product.tags.map((t) => (
            <span
              key={t}
              style={{
                background: "#e5e7eb",
                borderRadius: 4,
                padding: "1px 6px",
                marginRight: 4,
                fontSize: 11,
              }}
            >
              {t}
            </span>
          ))}
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
          ${product.price.toFixed(2)}
        </p>
        <p style={{ margin: "2px 0 6px", fontSize: 11, color: product.inStock ? "#16a34a" : "#dc2626" }}>
          {product.inStock ? "In stock" : "Out of stock"}
        </p>
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={inCart || !product.inStock}
          style={{
            padding: "4px 10px",
            fontSize: 12,
            borderRadius: 5,
            border: "1px solid #d1d5db",
            background: inCart ? "#dcfce7" : "#f9fafb",
            cursor: inCart || !product.inStock ? "default" : "pointer",
          }}
        >
          {inCart ? "In cart ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
