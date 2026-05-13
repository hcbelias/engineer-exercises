"use client";

// This component is intentionally heavy to simulate a real notification panel
// that imports a formatting library, a date picker, etc.
// In production, you would NOT want this in your initial bundle.

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New user registered", time: "2 min ago", read: false },
  { id: 2, title: "Server deployment complete", time: "14 min ago", read: false },
  { id: 3, title: "Weekly report ready", time: "1 hour ago", read: true },
  { id: 4, title: "Alert: high memory usage", time: "3 hours ago", read: true },
];

interface Props {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: Props) {
  return (
    <div>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Notifications</strong>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>
          ×
        </button>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {MOCK_NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f3f4f6",
              background: n.read ? "#fff" : "#eff6ff",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</span>
            <small style={{ color: "#9ca3af", marginLeft: 12, whiteSpace: "nowrap" }}>{n.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
