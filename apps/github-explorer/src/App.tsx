import { useState } from "react";
import { UserSearch } from "./components/UserSearch";
import { UserCard } from "./components/UserCard";
import { RepoList } from "./components/RepoList";
import { useUser } from "./hooks/useUser";
import { GitHubNotFoundError, GitHubRateLimitError } from "./api/types";

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const { data: user, isLoading, error } = useUser(username);

  function renderUserError() {
    if (!error) return null;
    if (error instanceof GitHubNotFoundError) {
      return <p style={{ color: "#dc2626" }}>{`User "${username}" not found.`}</p>;
    }
    if (error instanceof GitHubRateLimitError) {
      return (
        <p style={{ color: "#dc2626" }}>GitHub rate limit hit. Try again in {error.retryAfter}s.</p>
      );
    }
    return <p style={{ color: "#dc2626" }}>Error: {error.message}</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 24 }}>GitHub Explorer</h1>
      <UserSearch onSearch={setUsername} isLoading={isLoading} />
      {renderUserError()}
      {user && <UserCard user={user} />}
      <RepoList username={user ? username : null} />
    </div>
  );
}
