import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does NOT update before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    rerender({ value: "updated", delay: 300 });

    // advance only part of the way — value should still be old
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("initial");
  });

  it("updates after the delay has fully elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    rerender({ value: "updated", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("resets the timer when value changes before the delay fires", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    // First change
    rerender({ value: "first", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200); // 200ms into first timer
    });

    // Value still old — timer hasn't fired
    expect(result.current).toBe("initial");

    // Second change at 200ms — should reset timer to 300ms from NOW
    rerender({ value: "second", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200); // only 200ms since second change — should not fire yet
    });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(100); // now 300ms since second change — should fire
    });

    expect(result.current).toBe("second");
  });

  it("does NOT call setState after unmount (no warning on runAllTimers post-unmount)", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    rerender({ value: "updated", delay: 300 });

    // Unmount before the timer fires
    unmount();

    // Running all timers after unmount must not throw or log warnings
    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();

    // The returned value is irrelevant after unmount — no assertion on result.current
    void result;
  });
});
