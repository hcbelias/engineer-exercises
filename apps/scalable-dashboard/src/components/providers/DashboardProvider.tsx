"use client";

import { createContext, useContext, useState } from "react";

// PROBLEM: This context holds ALL dashboard state in one object.
// When any piece of state changes (e.g., unreadCount), ALL consumers re-render —
// even components that only care about theme.
//
// TODO: Refactor to eliminate unnecessary re-renders.
//
// Choose an approach that ensures components only re-render when the state
// they actually care about changes. In a code comment, explain:
// - Which approach you chose and why
// - What the trade-off is vs. other approaches
// - When would you reach for a dedicated state management library instead?

interface DashboardState {
  theme: "light" | "dark";
  unreadCount: number;
  selectedUserId: number | null;
  setTheme: (theme: "light" | "dark") => void;
  setUnreadCount: (n: number) => void;
  setSelectedUserId: (id: number | null) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [unreadCount, setUnreadCount] = useState(4);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // TODO: refactor to avoid unnecessary re-renders across all consumers
  const value: DashboardState = {
    theme,
    unreadCount,
    selectedUserId,
    setTheme,
    setUnreadCount,
    setSelectedUserId,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
