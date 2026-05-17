import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAnnounce } from "./useAnnounce";

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

  it("announcing the same message twice still triggers a second announcement", () => {
    const { result } = renderHook(() => useAnnounce());
    const liveRegion = document.body.querySelector("[aria-live]")!;

    act(() => {
      result.current.announce("Email is required");
      vi.runAllTimers();
    });

    expect(liveRegion.textContent).toBe("Email is required");

    act(() => {
      result.current.announce("Email is required");
    });

    // textContent must be cleared before the timer fires so AT sees a mutation
    expect(liveRegion.textContent).toBe("");

    act(() => {
      vi.runAllTimers();
    });

    expect(liveRegion.textContent).toBe("Email is required");
  });

  it("live region is visually hidden from the page layout", () => {
    renderHook(() => useAnnounce());

    const liveRegion = document.body.querySelector("[aria-live]") as HTMLElement;
    expect(liveRegion).not.toBeNull();
    expect(liveRegion.style.position).toBe("absolute");
    expect(liveRegion.style.width).toBe("1px");
    expect(liveRegion.style.height).toBe("1px");
    expect(liveRegion.style.overflow).toBe("hidden");
  });

  it("announce() switches aria-live to assertive when specified", () => {
    const { result } = renderHook(() => useAnnounce());
    const liveRegion = document.body.querySelector("[aria-live]")!;

    act(() => {
      result.current.announce("Critical error", "assertive");
      vi.runAllTimers();
    });

    expect(liveRegion.getAttribute("aria-live")).toBe("assertive");
    expect(liveRegion.textContent).toBe("Critical error");
  });
});
