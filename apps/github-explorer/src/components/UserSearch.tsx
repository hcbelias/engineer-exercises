import { useState } from "react";

interface Props {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function UserSearch({ onSearch, isLoading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="GitHub username…"
        style={{
          flex: 1,
          padding: "8px 12px",
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
      <button type="submit" disabled={isLoading || !value.trim()}>
        {isLoading ? "Loading…" : "Search"}
      </button>
    </form>
  );
}
