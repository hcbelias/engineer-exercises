import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useDebouncedCallback } from "./useDebouncedCallback";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the same function reference across re-renders", () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: fn, delay: 300 } },
    );

    const firstRef = result.current;
    rerender({ callback: fn, delay: 300 });
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it("does NOT call fn immediately when the debounced function is invoked", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current("arg1");
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("calls fn after the delay has elapsed", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current("arg1");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("arg1");
  });

  it("resets the timer when called again before delay elapses", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current("first");
    });

    act(() => {
      vi.advanceTimersByTime(200); // partway through
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      result.current("second"); // reset the timer
    });

    act(() => {
      vi.advanceTimersByTime(200); // still not 300ms from second call
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100); // now 300ms from second call
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");
  });

  it("always calls the LATEST version of fn (avoids stale closure)", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { callback: fn1, delay: 300 } },
    );

    // Invoke with fn1 in scope
    act(() => {
      result.current("arg");
    });

    // Before timer fires, swap to fn2
    rerender({ callback: fn2, delay: 300 });

    // Now let the timer fire
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // fn2 should have been called, NOT fn1
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn1).not.toHaveBeenCalled();
  });

  it("does NOT call fn after unmount", () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 300));

    act(() => {
      result.current("arg");
    });

    unmount();

    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();

    expect(fn).not.toHaveBeenCalled();
  });
});
