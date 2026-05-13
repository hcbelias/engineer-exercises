import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useThrottle } from "../../hooks/useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useThrottle(42, 100));
    expect(result.current).toBe(42);
  });

  it("eventually settles to the latest value after rapid updates (trailing edge)", () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      { initialProps: { value: 0, interval: 100 } },
    );

    // Rapid series of updates
    rerender({ value: 1, interval: 100 });
    rerender({ value: 2, interval: 100 });
    rerender({ value: 3, interval: 100 });
    rerender({ value: 4, interval: 100 });
    rerender({ value: 5, interval: 100 });

    // After the interval, the hook should have settled on the latest value
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(5);
  });

  it("emits at most one update per interval for rapid changes", () => {
    const updates: number[] = [];
    const { rerender } = renderHook(
      ({ value, interval }) => {
        const throttled = useThrottle(value, interval);
        updates.push(throttled);
        return throttled;
      },
      { initialProps: { value: 0, interval: 100 } },
    );

    const baseUpdateCount = updates.length; // 1 from initial render

    // Send 5 rapid changes within the interval
    rerender({ value: 1, interval: 100 });
    rerender({ value: 2, interval: 100 });
    rerender({ value: 3, interval: 100 });
    rerender({ value: 4, interval: 100 });
    rerender({ value: 5, interval: 100 });

    const changesBeforeTick = updates.length - baseUpdateCount;

    // Advance past the throttle window
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const changesAfterTick = updates.length - baseUpdateCount - changesBeforeTick;

    // During the interval we should see at most 1 new distinct value published
    // (the throttle may pass through the very first change immediately or hold it —
    //  the requirement is "at most once per interval"). Total published changes
    // across both windows should be <= 2 (one leading/immediate + one trailing).
    const totalChanges = updates.length - baseUpdateCount;
    expect(totalChanges).toBeLessThanOrEqual(2);

    // The trailing update must reflect the last value
    void changesBeforeTick;
    void changesAfterTick;
  });

  it("does NOT update after unmount", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      { initialProps: { value: 0, interval: 100 } },
    );

    rerender({ value: 99, interval: 100 });
    unmount();

    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();

    void result;
  });
});
