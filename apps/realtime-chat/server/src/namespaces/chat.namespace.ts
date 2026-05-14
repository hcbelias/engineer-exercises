import type { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents, SocketData } from "../types";

// TODO: Import and use roomHandler and messageHandler

export function registerChatNamespace(
  io: Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
) {
  const chat = io.of("/chat");

  chat.on("connection", (socket) => {
    // Assign a userId from the socket handshake query (the client sends it)
    const userId = (socket.handshake.query["userId"] as string) ?? socket.id;
    const username = (socket.handshake.query["username"] as string) ?? "Anonymous";
    socket.data.userId = userId;
    socket.data.username = username;

    console.log(`[chat] connected: ${username} (${userId})`);

    // TODO: Handle "room:join" event
    // - Validate the room exists and has capacity
    // - Subscribe the socket to the room so it receives broadcasts
    // - Return the room's recent message history via the callback
    // - Broadcast the updated occupancy to all room members
    // - Send the current room list to the joining socket
    socket.on("room:join", (_roomId, _callback) => {
      throw new Error("TODO: implement room:join handler");
    });

    // TODO: Handle "room:leave" event
    // - Unsubscribe the socket from the room
    // - Update and broadcast the new occupancy count
    socket.on("room:leave", (_roomId) => {
      throw new Error("TODO: implement room:leave handler");
    });

    // TODO: Handle "room:create" event
    // - Validate that the room name is unique
    // - Return the newly created Room via the callback
    // - Broadcast the updated room list to all connected clients
    socket.on("room:create", (_name, _callback) => {
      throw new Error("TODO: implement room:create handler");
    });

    // TODO: Handle "message:send" event
    // - Validate that the socket is in the target room
    // - Persist the message to the in-memory history for that room
    // - Broadcast the message to all members of the room
    // - Consider whether the sender should receive the broadcast too
    socket.on("message:send", (_payload) => {
      throw new Error("TODO: implement message:send handler");
    });

    socket.on("disconnect", (reason) => {
      console.log(`[chat] disconnected: ${username} (${reason})`);
      // TODO: Clean up any rooms the socket was in and update occupancy counts
    });
  });
}
