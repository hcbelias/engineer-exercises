import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as compute from "../../utils/compute";
import { ProductList } from ".";
import type { FilterState, Product } from "../../types";

const makeProduct = (id: number, inStock = true): Product => ({
  id: `p${id}`,
  name: `Product ${id}`,
  category: "Electronics",
  price: 10 * id,
  rating: 4,
  reviewCount: 100,
  inStock,
  tags: ["tag1"],
});

const PRODUCTS: Product[] = [makeProduct(1), makeProduct(2), makeProduct(3)];

const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: 0,
  maxPrice: 10_000,
  inStockOnly: false,
  sortKey: "name",
  sortOrder: "asc",
};

describe("ProductList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the filtered product list", () => {
    render(
      <ProductList
        products={PRODUCTS}
        filters={DEFAULT_FILTERS}
        onFiltersChange={vi.fn()}
        onAddToCart={vi.fn()}
        cart={[]}
      />,
    );

    // All three products should appear
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Product 3")).toBeInTheDocument();
  });

  it("does NOT re-run filterAndSortProducts when an unrelated prop (cart) changes", () => {
    const spy = vi.spyOn(compute, "filterAndSortProducts");

    const { rerender } = render(
      <ProductList
        products={PRODUCTS}
        filters={DEFAULT_FILTERS}
        onFiltersChange={vi.fn()}
        onAddToCart={vi.fn()}
        cart={[]}
      />,
    );

    const callsAfterMount = spy.mock.calls.length;
    expect(callsAfterMount).toBe(1);

    // Simulate a cart update: only `cart` changes, products and filters stay the same
    rerender(
      <ProductList
        products={PRODUCTS}
        filters={DEFAULT_FILTERS}
        onFiltersChange={vi.fn()}
        onAddToCart={vi.fn()}
        cart={["p1"]}
      />,
    );

    // With useMemo: still 1 call. Without (stub): 2 calls — test fails.
    expect(spy.mock.calls.length).toBe(1);
  });
});
