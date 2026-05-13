import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #ccc" }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        style={{ flex: 1, padding: "6px 10px", borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}
