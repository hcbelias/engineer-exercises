// Mirror of server/src/types.ts — keep in sync.
// In a real monorepo you'd share this via a `packages/shared` workspace package.

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  occupancy: number;
  maxOccupancy: number;
}

export interface User {
  id: string;
  username: string;
}

export interface ServerToClientEvents {
  message: (msg: Message) => void;
  "room:history": (messages: Message[]) => void;
  "room:list": (rooms: Room[]) => void;
  "room:updated": (room: Room) => void;
  error: (payload: { code: string; message: string }) => void;
  "presence:snapshot": (users: User[]) => void;
  "presence:joined": (user: User) => void;
  "presence:left": (userId: string) => void;
}

export interface ClientToServerEvents {
  "room:join": (roomId: string, callback: (history: Message[]) => void) => void;
  "room:leave": (roomId: string) => void;
  "room:create": (name: string, callback: (room: Room) => void) => void;
  "message:send": (payload: { roomId: string; text: string }) => void;
  "presence:identify": (username: string) => void;
}
