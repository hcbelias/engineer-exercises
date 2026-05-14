import type { FilterState, SortKey, SortOrder } from "../../types";
import { CATEGORY_LIST } from "../../data/mockProducts";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        padding: "12px 16px",
        background: "#f9fafb",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        marginBottom: 16,
        fontSize: 13,
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#6b7280" }}>Category</span>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="">All</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#6b7280" }}>Min price ($)</span>
        <input
          type="number"
          min={0}
          max={500}
          value={filters.minPrice}
          onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
          style={{ width: 80, padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#6b7280" }}>Max price ($)</span>
        <input
          type="number"
          min={0}
          max={500}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          style={{ width: 80, padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 18 }}>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
        />
        In stock only
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#6b7280" }}>Sort by</span>
        <select
          value={filters.sortKey}
          onChange={(e) => onChange({ ...filters, sortKey: e.target.value as SortKey })}
          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="reviewCount">Reviews</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#6b7280" }}>Order</span>
        <select
          value={filters.sortOrder}
          onChange={(e) => onChange({ ...filters, sortOrder: e.target.value as SortOrder })}
          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
