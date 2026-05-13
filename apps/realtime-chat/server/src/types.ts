// Shared type definitions for Socket.io events.
// These typed maps give you full autocompletion on both server and client.

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

// Events the SERVER sends TO the CLIENT
export interface ServerToClientEvents {
  // Chat namespace
  message: (msg: Message) => void;
  "room:history": (messages: Message[]) => void;
  "room:list": (rooms: Room[]) => void;
  "room:updated": (room: Room) => void;
  error: (payload: { code: string; message: string }) => void;

  // Presence namespace
  "presence:snapshot": (users: User[]) => void;
  "presence:joined": (user: User) => void;
  "presence:left": (userId: string) => void;
}

// Events the CLIENT sends TO the SERVER
export interface ClientToServerEvents {
  // Chat namespace
  "room:join": (roomId: string, callback: (history: Message[]) => void) => void;
  "room:leave": (roomId: string) => void;
  "room:create": (name: string, callback: (room: Room) => void) => void;
  "message:send": (payload: { roomId: string; text: string }) => void;

  // Presence namespace
  "presence:identify": (username: string) => void;
}

// Data attached to each socket (set during handshake or identify)
export interface SocketData {
  userId: string;
  username: string;
}
