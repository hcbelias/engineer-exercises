import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { UserTable } from "../components/UserTable";

describe("UserTable", () => {
  it("renders a scrollable container with a fixed height", () => {
    const { container } = render(<UserTable />);

    // The scroll container should have overflow:auto and a fixed height
    const scrollContainer = container.querySelector(
      '[style*="overflow: auto"], [style*="overflow:auto"]'
    );
    expect(scrollContainer).toBeTruthy();

    const style = (scrollContainer as HTMLElement).style;
    // height should be set (600px per the component implementation)
    expect(style.height).toBeTruthy();
    expect(parseInt(style.height)).toBeGreaterThan(0);
  });

  it("renders far fewer than 10,000 row elements (virtualization)", () => {
    const { container } = render(<UserTable />);

    // Count elements that look like data rows.
    // The component uses divs styled as rows inside the scroll container.
    // With virtualization only ~20-30 rows are in the DOM at once.
    // Without virtualization all 10,000 are rendered.
    //
    // We look for children of the scroll container (the first overflow:auto div).
    const scrollContainer = container.querySelector(
      '[style*="overflow: auto"], [style*="overflow:auto"]'
    );
    expect(scrollContainer).toBeTruthy();

    const renderedRows = scrollContainer!.querySelectorAll("[style]");
    expect(renderedRows.length).toBeLessThan(100);
  });
});
