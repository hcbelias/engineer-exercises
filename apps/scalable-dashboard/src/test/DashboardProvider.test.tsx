import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import React, { useRef } from "react";
import { DashboardProvider, useDashboard } from "../components/providers/DashboardProvider";

// ---------------------------------------------------------------------------
// Helper: a component that records how many times it renders and exposes
// the setter functions so tests can trigger state changes.
// ---------------------------------------------------------------------------

interface ThemeConsumerProps {
  onRender: () => void;
}

/** Only reads `theme` from context */
function ThemeConsumer({ onRender }: ThemeConsumerProps) {
  const { theme } = useDashboard();
  onRender();
  return <span data-testid="theme">{theme}</span>;
}

interface UnreadConsumerProps {
  onRender: () => void;
}

/** Only reads `unreadCount` from context */
function UnreadConsumer({ onRender }: UnreadConsumerProps) {
  const { unreadCount } = useDashboard();
  onRender();
  return <span data-testid="unread">{unreadCount}</span>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DashboardProvider re-render isolation", () => {
  it("a theme-only subscriber does NOT re-render when unreadCount changes", async () => {
    const themeRenders = vi.fn();
    let setUnread: ((n: number) => void) | undefined;

    function Controller() {
      const { setUnreadCount } = useDashboard();
      // Capture setter so the test can trigger updates without re-rendering ThemeConsumer
      setUnread = setUnreadCount;
      return null;
    }

    render(
      <DashboardProvider>
        <Controller />
        <ThemeConsumer onRender={themeRenders} />
      </DashboardProvider>
    );

    const rendersBefore = themeRenders.mock.calls.length;

    // Trigger a change to unreadCount — ThemeConsumer should NOT re-render
    act(() => {
      setUnread!(99);
    });

    const rendersAfter = themeRenders.mock.calls.length;

    // If the provider is properly split, ThemeConsumer should not have re-rendered.
    // This test will FAIL until the exercise is implemented (it documents the expected behaviour).
    expect(rendersAfter).toBe(rendersBefore);
  });

  it("an unreadCount-only subscriber does NOT re-render when theme changes", async () => {
    const unreadRenders = vi.fn();
    let setTheme: ((t: "light" | "dark") => void) | undefined;

    function Controller() {
      const { setTheme: st } = useDashboard();
      setTheme = st;
      return null;
    }

    render(
      <DashboardProvider>
        <Controller />
        <UnreadConsumer onRender={unreadRenders} />
      </DashboardProvider>
    );

    const rendersBefore = unreadRenders.mock.calls.length;

    act(() => {
      setTheme!("dark");
    });

    const rendersAfter = unreadRenders.mock.calls.length;

    // If the provider is properly split, UnreadConsumer should not have re-rendered.
    // This test will FAIL until the exercise is implemented.
    expect(rendersAfter).toBe(rendersBefore);
  });

  it("a theme subscriber DOES re-render when theme changes", async () => {
    const themeRenders = vi.fn();
    let setTheme: ((t: "light" | "dark") => void) | undefined;

    function Controller() {
      const { setTheme: st } = useDashboard();
      setTheme = st;
      return null;
    }

    render(
      <DashboardProvider>
        <Controller />
        <ThemeConsumer onRender={themeRenders} />
      </DashboardProvider>
    );

    const rendersBefore = themeRenders.mock.calls.length;

    act(() => {
      setTheme!("dark");
    });

    const rendersAfter = themeRenders.mock.calls.length;

    // ThemeConsumer should have re-rendered once
    expect(rendersAfter).toBeGreaterThan(rendersBefore);
  });

  it("an unreadCount subscriber DOES re-render when unreadCount changes", async () => {
    const unreadRenders = vi.fn();
    let setUnread: ((n: number) => void) | undefined;

    function Controller() {
      const { setUnreadCount } = useDashboard();
      setUnread = setUnreadCount;
      return null;
    }

    render(
      <DashboardProvider>
        <Controller />
        <UnreadConsumer onRender={unreadRenders} />
      </DashboardProvider>
    );

    const rendersBefore = unreadRenders.mock.calls.length;

    act(() => {
      setUnread!(42);
    });

    const rendersAfter = unreadRenders.mock.calls.length;

    expect(rendersAfter).toBeGreaterThan(rendersBefore);
  });
});
