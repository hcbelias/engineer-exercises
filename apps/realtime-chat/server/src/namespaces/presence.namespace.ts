import type { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents, SocketData } from "../types";

export function registerPresenceNamespace(
  io: Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
) {
  const presence = io.of("/presence");

  presence.on("connection", (socket) => {
    console.log(`[presence] socket connected: ${socket.id}`);

    // TODO: Handle "presence:identify" event
    // - Record the user in the in-memory presence store
    // - Send the current full user list back to this socket as a snapshot
    // - Notify all other connected sockets that this user has joined
    socket.on("presence:identify", (_username) => {
      throw new Error("TODO: implement presence:identify handler");
    });

    // TODO: Handle disconnect
    // - Remove the user from the presence store
    // - Notify all remaining sockets that this user has left
    socket.on("disconnect", (_reason) => {
      // TODO
    });
  });
}
