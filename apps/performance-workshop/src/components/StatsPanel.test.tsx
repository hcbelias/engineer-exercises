import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as compute from "../utils/compute";
import { StatsPanel } from "./StatsPanel";
import type { Product } from "../types";

const makeProduct = (id: number): Product => ({
  id: `p${id}`,
  name: `Product ${id}`,
  category: "Electronics",
  price: 10 * id,
  rating: 4,
  reviewCount: 100,
  inStock: true,
  tags: ["tag1", "tag2"],
});

const PRODUCTS: Product[] = Array.from({ length: 3 }, (_, i) => makeProduct(i + 1));

describe("StatsPanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders stats correctly", () => {
    render(<StatsPanel products={PRODUCTS} />);

    expect(screen.getByText("Total products")).toBeInTheDocument();
    expect(screen.getByText("In stock")).toBeInTheDocument();
    expect(screen.getByText("Avg price")).toBeInTheDocument();
    expect(screen.getByText("Avg rating")).toBeInTheDocument();
    // Both "Total products" and "In stock" show 3 — just assert there are stats values rendered
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
  });

  it("does NOT re-run calculateStats when an unrelated prop causes a parent re-render", () => {
    // We test that calculateStats is memoized by wrapping StatsPanel in a parent
    // that re-renders with new unrelated state. Because StatsPanel's `products`
    // prop doesn't change, a correct useMemo implementation will skip recomputation.

    const spy = vi.spyOn(compute, "calculateStats");

    const { rerender } = render(<StatsPanel products={PRODUCTS} />);

    // Recorded the initial call count (should be 1 from first render)
    const callsAfterMount = spy.mock.calls.length;
    expect(callsAfterMount).toBe(1);

    // Re-render with the SAME products reference — simulates a parent re-render
    // caused by unrelated state (e.g. cart changes). With useMemo this must NOT
    // trigger a new calculateStats call.
    rerender(<StatsPanel products={PRODUCTS} />);

    // With useMemo: still 1 call. Without (stub): 2 calls — test fails.
    expect(spy.mock.calls.length).toBe(1);
  });
});
