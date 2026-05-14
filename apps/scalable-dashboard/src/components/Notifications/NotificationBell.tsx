"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// TODO: The NotificationPanel should NOT be in the initial bundle.
// Replace the eager import with next/dynamic so the panel only loads when first opened.
// After implementing, run `ANALYZE=true pnpm build` to verify it is in a separate chunk.
const NotificationPanel = dynamic(
  () => import("./NotificationPanel").then((m) => ({ default: m.NotificationPanel })),
  { loading: () => <p style={{ padding: 16 }}>Loading…</p> },
);

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}
      >
        🔔
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            width: 320,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 50,
          }}
        >
          <NotificationPanel onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
