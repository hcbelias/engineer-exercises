import { useUserRepos } from "../hooks/useUserRepos";
import { useStarRepo } from "../hooks/useStarRepo";
import { RepoCard } from "./RepoCard";

interface Props {
  username: string | null;
}

export function RepoList({ username }: Props) {
  // TODO: Wire up useUserRepos and useStarRepo here.
  //
  // Requirements:
  // 1. Show a loading spinner while the first page loads (isLoading)
  // 2. Show an error message if the query fails
  // 3. Render a RepoCard for each repo in allRepos
  // 4. Show a "Load more" button when hasNextPage is true
  //    - Disable or show spinner on it while isFetchingNextPage is true
  //    - Call fetchNextPage on click
  // 5. Pass onToggleStar to RepoCard using the mutate function from useStarRepo
  // 6. Pass isStarring (mutation.isPending) to each RepoCard

  const { allRepos, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserRepos(username);
  const starMutation = useStarRepo();

  if (!username) return null;

  if (isLoading) return <p>Loading repositories…</p>;

  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>Repositories ({allRepos.length} loaded)</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {allRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onToggleStar={(r) =>
              starMutation.mutate({
                owner: username,
                name: r.name,
                currentlyStarred: r.viewer_has_starred,
              })
            }
            isStarring={starMutation.isPending}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{ marginTop: 16, padding: "8px 16px" }}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
