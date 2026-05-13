import type { GithubUser } from "../api/types";

interface Props {
  user: GithubUser;
}

export function UserCard({ user }: Props) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
      <img
        src={user.avatar_url}
        alt={user.login}
        width={64}
        height={64}
        style={{ borderRadius: "50%" }}
      />
      <div>
        <h2 style={{ margin: 0 }}>{user.name ?? user.login}</h2>
        {user.bio && <p style={{ margin: "4px 0", color: "#555" }}>{user.bio}</p>}
        <small style={{ color: "#888" }}>
          {user.public_repos} repos · {user.followers} followers · {user.following} following
        </small>
      </div>
      <a href={user.html_url} target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
        View on GitHub ↗
      </a>
    </div>
  );
}
