import type { User } from "./mockData";

const STATUS_COLORS: Record<User["status"], string> = {
  active: "#16a34a",
  inactive: "#6b7280",
  suspended: "#dc2626",
};

interface Props {
  user: User;
  style: React.CSSProperties; // position styles from the virtualizer
}

// Pre-scaffolded row component.
// The parent UserTable is responsible for positioning this row using
// the absolute positioning styles provided by @tanstack/react-virtual.

export function VirtualRow({ user, style }: Props) {
  return (
    <div
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 120px 100px 120px",
        gap: 16,
        padding: "0 16px",
        alignItems: "center",
        borderBottom: "1px solid #f3f4f6",
        background: "#fff",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#9ca3af" }}>#{user.id}</span>
      <span style={{ fontWeight: 500 }}>{user.name}</span>
      <span style={{ color: "#6b7280" }}>{user.email}</span>
      <span>{user.role}</span>
      <span style={{ color: STATUS_COLORS[user.status], fontWeight: 500, textTransform: "capitalize" }}>
        {user.status}
      </span>
      <span style={{ color: "#9ca3af" }}>{user.joinedAt}</span>
    </div>
  );
}
