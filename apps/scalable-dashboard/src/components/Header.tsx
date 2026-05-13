// Server Component for the top header.
// Note that the NotificationBell must be a Client Component (it needs state).
// We import it here — Next.js handles the Server/Client boundary automatically.

import { NotificationBell } from "./Notifications/NotificationBell";

export function Header() {
  return (
    <header
      style={{
        height: 56,
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#fff",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 18 }}>Dashboard</span>
      {/* NotificationBell is a Client Component imported into a Server Component — this is fine. */}
      <NotificationBell />
    </header>
  );
}
