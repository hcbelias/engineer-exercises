import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from ".";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: "Test Modal",
  children: <p>Modal content</p>,
};

describe("Modal", () => {
  it("renders with role='dialog'", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-modal='true'", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby that references an existing element", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    const labelledById = dialog.getAttribute("aria-labelledby");

    expect(labelledById).toBeTruthy();
    const labelEl = document.getElementById(labelledById!);
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent).toContain("Test Modal");
  });

  it("calls onClose when the Escape key is pressed", async () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(<Modal {...defaultProps} onClose={onClose} />);

    // The overlay is the outermost wrapper div rendered into the portal
    // Find it by querying for an element that is NOT the dialog itself
    // but is a direct ancestor wrapping it (the backdrop/overlay).
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const overlay =
      (container.firstChild as HTMLElement) ??
      document.body.querySelector<HTMLElement>("div:not([role='dialog'])");

    // The Modal renders via portal into document.body, so query body
    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.parentElement as HTMLElement;

    await userEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
