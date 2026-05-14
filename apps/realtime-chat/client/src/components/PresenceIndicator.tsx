import type { User } from "../types";

interface Props {
  users: User[];
  isConnected: boolean;
}

export function PresenceIndicator({ users, isConnected }: Props) {
  return (
    <aside style={{ width: 180, borderLeft: "1px solid #ccc", padding: 12 }}>
      <h3 style={{ margin: "0 0 8px" }}>
        Online{" "}
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isConnected ? "#22c55e" : "#ef4444",
          }}
        />
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {users.map((user) => (
          <li key={user.id} style={{ padding: "4px 0", fontSize: 14 }}>
            {user.username}
          </li>
        ))}
        {users.length === 0 && <li style={{ color: "#999", fontSize: 13 }}>No one else here</li>}
      </ul>
    </aside>
  );
}
