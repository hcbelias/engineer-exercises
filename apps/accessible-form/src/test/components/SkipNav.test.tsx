import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkipNav } from "../../components/SkipNav";

describe("SkipNav", () => {
  it("renders an anchor element", () => {
    render(<SkipNav />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.tagName.toLowerCase()).toBe("a");
  });

  it("href points to #main-content", () => {
    render(<SkipNav />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("is visually hidden by default (sr-only class or not visible)", () => {
    render(<SkipNav />);
    const link = screen.getByRole("link");

    // The link should have a class that hides it visually (e.g. sr-only)
    // OR be positioned off-screen via inline style.
    // We accept either approach.
    const hasSrOnly = link.classList.contains("sr-only");
    const style = link.getAttribute("style") ?? "";
    const isPositionedOffScreen =
      style.includes("position") &&
      (style.includes("absolute") || style.includes("fixed"));

    expect(hasSrOnly || isPositionedOffScreen).toBe(true);
  });
});
