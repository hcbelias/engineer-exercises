import type { FilterState, Product, ProductStats } from "../types";

// Pure functions — always wrap call sites with useMemo when inputs are stable.
// Both functions are intentionally unoptimized to make the perf impact measurable.

export function filterAndSortProducts(
  products: Product[],
  filters: FilterState,
  query: string,
): Product[] {
  const q = query.toLowerCase().trim();

  const filtered = products.filter((p) => {
    if (
      q &&
      !p.name.toLowerCase().includes(q) &&
      !p.tags.some((t) => t.includes(q)) &&
      !p.category.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    const key = filters.sortKey;
    const dir = filters.sortOrder === "asc" ? 1 : -1;
    const av = a[key];
    const bv = b[key];
    if (typeof av === "string" && typeof bv === "string") {
      return dir * av.localeCompare(bv);
    }
    return dir * ((av as number) - (bv as number));
  });
}

// Expensive aggregation: 3 passes over the full product array.
// On 5,000 items this takes ~8–15 ms — noticeable if called on every render cycle.
export function calculateStats(products: Product[]): ProductStats {
  const tagCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  let totalPrice = 0;
  let totalRating = 0;
  let inStockCount = 0;

  for (const p of products) {
    totalPrice += p.price;
    totalRating += p.rating;
    if (p.inStock) inStockCount++;
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
    for (const tag of p.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: products.length,
    inStock: inStockCount,
    avgPrice: Math.round((totalPrice / products.length) * 100) / 100,
    avgRating: Math.round((totalRating / products.length) * 10) / 10,
    categoryCounts,
    topTags,
  };
}
