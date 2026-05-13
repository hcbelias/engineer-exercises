import { useEffect, useState } from "react";
import type { Room, Message } from "../types";

// TODO: Implement useRoom
//
// This hook handles joining and leaving a room, and provides room metadata.
//
// Parameters:
//   roomId: string | null
//
// Returns:
//   room: Room | null           — current room metadata (null if not joined)
//   rooms: Room[]               — full list of available rooms
//   history: Message[]          — messages received on join (last 50)
//   createRoom: (name: string) => void
//
// Requirements:
// 1. On mount (or when roomId changes to a non-null value):
//    - Emit "room:join" with a callback that receives the message history
//    - Store the history in state
// 2. On cleanup (roomId changes or component unmounts):
//    - Emit "room:leave" for the previous roomId
// 3. Listen to "room:list" events to keep the rooms array up-to-date.
// 4. Listen to "room:updated" to update individual room metadata (occupancy).
// 5. createRoom emits "room:create" and adds the returned room to state.

export function useRoom(_roomId: string | null): {
  room: Room | null;
  rooms: Room[];
  history: Message[];
  createRoom: (name: string) => void;
} {
  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    // TODO: join/leave logic
    return () => {
      // TODO: cleanup
    };
  }, [_roomId]);

  useEffect(() => {
    // TODO: subscribe to room:list and room:updated events
    return () => {
      // TODO: cleanup
    };
  }, []);

  function createRoom(_name: string) {
    // TODO
  }

  return { room, rooms, history, createRoom };
}
