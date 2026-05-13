import type { GithubRepo } from "../api/types";

interface Props {
  repo: GithubRepo;
  onToggleStar: (repo: GithubRepo) => void;
  isStarring: boolean;
}

export function RepoCard({ repo, onToggleStar, isStarring }: Props) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
          {repo.name}
        </a>
        {repo.description && (
          <p style={{ margin: "4px 0", color: "#555", fontSize: 14 }}>{repo.description}</p>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 13, color: "#888" }}>
          {repo.language && <span>{repo.language}</span>}
          <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
          <span>🍴 {repo.forks_count.toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={() => onToggleStar(repo)}
        disabled={isStarring}
        style={{
          marginLeft: 16,
          padding: "4px 12px",
          cursor: isStarring ? "wait" : "pointer",
          background: repo.viewer_has_starred ? "#fef3c7" : "#f1f5f9",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
        }}
      >
        {repo.viewer_has_starred ? "★ Starred" : "☆ Star"}
      </button>
    </div>
  );
}
