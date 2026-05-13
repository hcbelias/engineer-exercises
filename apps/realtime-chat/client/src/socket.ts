import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "./types";

// TODO: Create two typed socket singletons — one for the /chat namespace and
// one for the /presence namespace.
//
// Requirements:
// - autoConnect: false  (connect explicitly so you can set username first)
// - reconnection: true
// - reconnectionAttempts: 5
// - reconnectionDelay: 1000       (1s initial delay)
// - reconnectionDelayMax: 10000   (cap at 10s — exponential backoff)
// - reconnectionJitter: 0.5       (add jitter so clients don't all retry at once)
//
// The sockets must be typed: Socket<ServerToClientEvents, ClientToServerEvents>
//
// Discussion question: What happens on the 6th reconnection attempt when
// reconnectionAttempts is 5? How would you notify the user that the connection
// is permanently lost?

export const chatSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
  // TODO: replace with io("/chat", { ...options })
  io("/chat", { autoConnect: false }) as Socket<ServerToClientEvents, ClientToServerEvents>;

export const presenceSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
  // TODO: replace with io("/presence", { ...options })
  io("/presence", { autoConnect: false }) as Socket<ServerToClientEvents, ClientToServerEvents>;
