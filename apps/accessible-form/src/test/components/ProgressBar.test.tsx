import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressBar } from "../../components/MultiStepForm/ProgressBar";

describe("ProgressBar", () => {
  it("has role='progressbar'", () => {
    render(<ProgressBar currentStep={1} totalSteps={3} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has aria-valuemin attribute", () => {
    render(<ProgressBar currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin");
  });

  it("has aria-valuemax attribute", () => {
    render(<ProgressBar currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax");
  });

  it("has aria-valuenow attribute", () => {
    render(<ProgressBar currentStep={2} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow");
  });

  it("aria-valuenow reflects the currentStep prop", () => {
    render(<ProgressBar currentStep={2} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "2");
  });

  it("aria-valuemax reflects the totalSteps prop", () => {
    render(<ProgressBar currentStep={1} totalSteps={5} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
  });

  it("updates aria-valuenow when currentStep changes", () => {
    const { rerender } = render(<ProgressBar currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "1");

    rerender(<ProgressBar currentStep={3} totalSteps={3} />);
    expect(bar).toHaveAttribute("aria-valuenow", "3");
  });
});
