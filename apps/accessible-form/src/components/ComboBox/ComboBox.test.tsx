import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComboBox } from ".";

const OPTIONS = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

const defaultProps = {
  label: "Fruit",
  options: OPTIONS,
  value: "",
  onChange: vi.fn(),
};

describe("ComboBox", () => {
  it("input has role='combobox'", () => {
    render(<ComboBox {...defaultProps} />);
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("aria-expanded is 'false' initially", () => {
    render(<ComboBox {...defaultProps} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("aria-expanded becomes 'true' when the list is open", async () => {
    render(<ComboBox {...defaultProps} />);
    const input = screen.getByRole("combobox");

    // Typing opens the list
    await userEvent.type(input, "a");

    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("ArrowDown opens the list and moves focus to the first option", async () => {
    render(<ComboBox {...defaultProps} />);
    const input = screen.getByRole("combobox");

    input.focus();
    await userEvent.keyboard("{ArrowDown}");

    // List should be open
    expect(input).toHaveAttribute("aria-expanded", "true");

    // The first option should be the active descendant
    const activeDescendant = input.getAttribute("aria-activedescendant");
    expect(activeDescendant).toBeTruthy();

    const activeOption = document.getElementById(activeDescendant!);
    expect(activeOption).not.toBeNull();
    // The first option in the list should be highlighted/active
    expect(activeOption?.getAttribute("aria-selected")).toBe("true");
  });

  it("Enter key selects the active option and calls onChange", async () => {
    const onChange = vi.fn();
    render(<ComboBox {...defaultProps} onChange={onChange} />);
    const input = screen.getByRole("combobox");

    input.focus();
    // Open and move to first option
    await userEvent.keyboard("{ArrowDown}");
    // Select the first option
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith(OPTIONS[0]);
  });

  it("Escape key closes the list", async () => {
    render(<ComboBox {...defaultProps} />);
    const input = screen.getByRole("combobox");

    await userEvent.type(input, "a");
    expect(input).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
});
