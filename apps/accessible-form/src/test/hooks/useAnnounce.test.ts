import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAnnounce } from "../../hooks/useAnnounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useAnnounce", () => {
  it("appends an aria-live='polite' element to document.body after mount", () => {
    renderHook(() => useAnnounce());

    const liveRegion = document.body.querySelector("[aria-live]");
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.getAttribute("aria-live")).toBe("polite");
  });

  it("announce() sets the text content of the live region after a tick delay", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Form submitted successfully");
    });

    // Before the tick, content may still be empty (cleared first)
    const liveRegion = document.body.querySelector("[aria-live]")!;

    // Advance the timer by one tick
    act(() => {
      vi.runAllTimers();
    });

    expect(liveRegion.textContent).toBe("Form submitted successfully");
  });

  it("removes the aria-live element from the DOM after unmount", () => {
    const { unmount } = renderHook(() => useAnnounce());

    // Confirm it exists before unmount
    expect(document.body.querySelector("[aria-live]")).not.toBeNull();

    act(() => {
      unmount();
    });

    expect(document.body.querySelector("[aria-live]")).toBeNull();
  });
});
