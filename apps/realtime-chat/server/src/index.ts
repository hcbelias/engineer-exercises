import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from "./types";
import { registerChatNamespace } from "./namespaces/chat.namespace";
import { registerPresenceNamespace } from "./namespaces/presence.namespace";

const app = express();
const httpServer = createServer(app);

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Register namespaces
registerChatNamespace(io);
registerPresenceNamespace(io);

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
