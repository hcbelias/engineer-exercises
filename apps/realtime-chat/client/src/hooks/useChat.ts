import { useEffect, useState } from "react";
import type { Message } from "../types";

// TODO: Implement useChat
//
// This hook manages the message list for a given room.
//
// Parameters:
//   roomId: string | null  — null means no room is selected
//
// Returns:
//   messages: Message[]    — ordered list (oldest first)
//   sendMessage: (text: string) => void
//
// Requirements:
// 1. Subscribe to the "message" event on chatSocket.
//    Append incoming messages to state.
// 2. sendMessage should emit "message:send" with { roomId, text }.
//    Guard against sending when roomId is null.
// 3. Clear messages when roomId changes (avoids showing stale history).
// 4. Remove the event listener in the cleanup function to avoid memory leaks.
//    Double-subscription is a common Socket.io bug in React — think about
//    how React StrictMode double-invokes effects and how that interacts with
//    socket event listeners.

export function useChat(_roomId: string | null): {
  messages: Message[];
  sendMessage: (text: string) => void;
} {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // TODO
  }, [_roomId]);

  function sendMessage(_text: string) {
    // TODO
  }

  return { messages, sendMessage };
}
