import { useRef, useEffect } from "react";
import type { Message } from "../types";
import { MessageInput } from "./MessageInput";

interface Props {
  roomId: string | null;
  messages: Message[];
  onSend: (text: string) => void;
}

export function ChatWindow({ roomId, messages, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!roomId) {
    return (
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888" }}>Select a room to start chatting</p>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <strong>{msg.username}</strong>{" "}
            <small style={{ color: "#999" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
            <p style={{ margin: "2px 0 0 0" }}>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={onSend} />
    </main>
  );
}
