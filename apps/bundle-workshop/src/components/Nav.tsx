type Page = "dashboard" | "analytics" | "reports" | "settings";

interface NavProps {
  current: Page;
  onChange: (page: Page) => void;
}

const LINKS: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "reports", label: "Reports", icon: "📄" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export function Nav({ current, onChange }: NavProps) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid #e5e7eb",
        marginBottom: 32,
        paddingBottom: 0,
      }}
    >
      {LINKS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: current === id ? "2px solid #6366f1" : "2px solid transparent",
            background: "none",
            cursor: "pointer",
            fontWeight: current === id ? 600 : 400,
            color: current === id ? "#6366f1" : "#6b7280",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
