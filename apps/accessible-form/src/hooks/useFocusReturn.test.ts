import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useFocusReturn } from "./useFocusReturn";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("useFocusReturn", () => {
  it("saveFocus() captures document.activeElement", () => {
    const button = document.createElement("button");
    button.textContent = "Trigger";
    document.body.appendChild(button);
    button.focus();

    const { result } = renderHook(() => useFocusReturn());

    act(() => {
      result.current.saveFocus();
    });

    // Move focus away
    const other = document.createElement("button");
    document.body.appendChild(other);
    other.focus();

    expect(document.activeElement).toBe(other);

    // restoreFocus should bring it back to the original button
    act(() => {
      result.current.restoreFocus();
    });

    expect(document.activeElement).toBe(button);
  });

  it("restoreFocus() moves focus back to the saved element", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open modal";
    document.body.appendChild(trigger);
    trigger.focus();

    const { result } = renderHook(() => useFocusReturn());

    act(() => {
      result.current.saveFocus();
    });

    // Simulate focus moving into a modal
    const modalButton = document.createElement("button");
    document.body.appendChild(modalButton);
    modalButton.focus();

    act(() => {
      result.current.restoreFocus();
    });

    expect(document.activeElement).toBe(trigger);
  });

  it("restoreFocus() does nothing if the saved element is no longer in the DOM", () => {
    const detachable = document.createElement("button");
    document.body.appendChild(detachable);
    detachable.focus();

    const { result } = renderHook(() => useFocusReturn());

    act(() => {
      result.current.saveFocus();
    });

    // Remove the saved element from the DOM
    detachable.remove();

    const other = document.createElement("button");
    document.body.appendChild(other);
    other.focus();

    // restoreFocus should not throw and should not crash
    expect(() => {
      act(() => {
        result.current.restoreFocus();
      });
    }).not.toThrow();

    // Focus should remain on 'other' since saved element is gone
    expect(document.activeElement).toBe(other);
  });
});
