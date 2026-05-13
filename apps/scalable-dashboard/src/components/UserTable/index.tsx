"use client";

import { useRef } from "react";
import { MOCK_USERS } from "./mockData";
import { VirtualRow } from "./VirtualRow";

// TODO: Implement virtualized rendering using @tanstack/react-virtual
//
// The current implementation renders ALL 10,000 rows into the DOM at once.
// This causes a slow initial render (~2–4 seconds) and high memory usage.
//
// After your implementation, only the visible rows should be in the DOM at any time.
// The scrollbar must still reflect the full list height so the user can scroll correctly.
//
// Measurement:
// - Before: open React DevTools Profiler, record a render — note the commit time
// - After: repeat — the commit time should drop significantly
// - Also check the Elements panel: before you'll see 10,000 divs, after you'll see ~20

const ROW_HEIGHT = 48;

export function UserTable() {
  const parentRef = useRef<HTMLDivElement>(null);

  // TODO: set up virtualizer here

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1fr 120px 100px 120px",
          gap: 16,
          padding: "10px 16px",
          background: "#f9fafb",
          borderBottom: "2px solid #e5e7eb",
          fontWeight: 600,
          fontSize: 13,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <span>ID</span>
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Joined</span>
      </div>

      {/* TODO: Replace this non-virtualized rendering with a virtualized one */}
      <div
        ref={parentRef}
        style={{ height: 600, overflow: "auto" }}
      >
        {/* Non-virtualized — renders all 10,000 rows */}
        {MOCK_USERS.map((user) => (
          <VirtualRow
            key={user.id}
            user={user}
            style={{ height: ROW_HEIGHT }}
          />
        ))}
      </div>
    </div>
  );
}
