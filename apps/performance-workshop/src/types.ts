export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
}

export type SortKey = "price" | "rating" | "reviewCount" | "name";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortKey: SortKey;
  sortOrder: SortOrder;
}

export interface ProductStats {
  total: number;
  inStock: number;
  avgPrice: number;
  avgRating: number;
  categoryCounts: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
}
