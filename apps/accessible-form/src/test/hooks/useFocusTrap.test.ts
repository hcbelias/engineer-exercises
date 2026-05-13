import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useFocusTrap } from "../../hooks/useFocusTrap";

function makeContainer(...tagNames: ("button" | "a" | "input")[]): HTMLDivElement {
  const container = document.createElement("div");
  for (const tag of tagNames) {
    const el = document.createElement(tag) as HTMLElement;
    if (tag === "a") (el as HTMLAnchorElement).href = "#";
    container.appendChild(el);
  }
  document.body.appendChild(container);
  return container;
}

function fireTab(shiftKey = false) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true })
  );
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("useFocusTrap", () => {
  it("wraps Tab from last focusable element to first when active", () => {
    const { result } = renderHook(() => useFocusTrap());

    const container = makeContainer("button", "button", "button");
    // Manually assign containerRef to our container
    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: container,
    });

    act(() => {
      result.current.activate();
    });

    const focusable = container.querySelectorAll<HTMLElement>("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus the last element then press Tab
    last.focus();
    act(() => {
      fireTab(false);
    });

    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from first focusable element to last when active", () => {
    const { result } = renderHook(() => useFocusTrap());

    const container = makeContainer("button", "button", "button");
    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: container,
    });

    act(() => {
      result.current.activate();
    });

    const focusable = container.querySelectorAll<HTMLElement>("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus the first element then press Shift+Tab
    first.focus();
    act(() => {
      fireTab(true);
    });

    expect(document.activeElement).toBe(last);
  });

  it("does nothing when the container has no focusable elements", () => {
    const { result } = renderHook(() => useFocusTrap());

    const container = document.createElement("div");
    container.textContent = "No focusable children here";
    document.body.appendChild(container);

    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: container,
    });

    act(() => {
      result.current.activate();
    });

    const before = document.activeElement;

    // Should not throw and should not change focus
    act(() => {
      fireTab(false);
    });

    expect(document.activeElement).toBe(before);
  });

  it("does not trap focus before activate() is called", () => {
    const { result } = renderHook(() => useFocusTrap());

    const container = makeContainer("button", "button");
    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: container,
    });

    const focusable = container.querySelectorAll<HTMLElement>("button");
    const last = focusable[focusable.length - 1];

    // Focus last button WITHOUT calling activate
    last.focus();
    act(() => {
      fireTab(false);
    });

    // Focus should NOT have been moved to first (trap is inactive)
    expect(document.activeElement).not.toBe(focusable[0]);
  });

  it("removes the keydown listener after deactivate() so Tab is no longer trapped", () => {
    const { result } = renderHook(() => useFocusTrap());

    const container = makeContainer("button", "button");
    Object.defineProperty(result.current.containerRef, "current", {
      writable: true,
      value: container,
    });

    act(() => {
      result.current.activate();
    });

    act(() => {
      result.current.deactivate();
    });

    const focusable = container.querySelectorAll<HTMLElement>("button");
    const last = focusable[focusable.length - 1];
    last.focus();

    act(() => {
      fireTab(false);
    });

    // After deactivate, focus should NOT wrap to first
    expect(document.activeElement).not.toBe(focusable[0]);
  });
});
