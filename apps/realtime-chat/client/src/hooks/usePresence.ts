import { useEffect, useState } from "react";
import type { User } from "../types";

// TODO: Implement usePresence
//
// This hook tracks which users are currently online.
//
// Parameters:
//   username: string  — the local user's display name
//
// Returns:
//   onlineUsers: User[]     — live list of connected users
//   isConnected: boolean    — presenceSocket connection state
//
// Requirements:
// 1. On mount, connect the presenceSocket (presenceSocket.connect()) and
//    emit "presence:identify" with the username.
// 2. Listen to "presence:snapshot" to initialise the user list when you first connect.
// 3. Listen to "presence:joined" and add the new user to state.
// 4. Listen to "presence:left" and remove the user with that userId from state.
// 5. Track isConnected by listening to "connect" and "disconnect" events.
// 6. On cleanup, disconnect the presenceSocket.
//
// Discussion question: If the user opens two tabs with the same username,
// how should the presence system handle it? What changes would you need on
// the server side?

export function usePresence(_username: string): {
  onlineUsers: User[];
  isConnected: boolean;
} {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // TODO
    return () => {
      // TODO: cleanup
    };
  }, [_username]);

  return { onlineUsers, isConnected };
}
