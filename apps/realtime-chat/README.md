# Exercise 1 — Real-time Chat with Socket.io

Build a multi-room chat application where multiple users join named rooms, exchange messages, and see who is online — all in real time.

## The problem

A real-time chat system requires careful handling of:

- **Namespaces** — isolating concerns (chat vs. presence) within one Socket.io server
- **Rooms** — routing events only to the correct subscribers
- **Reconnection** — gracefully recovering from network interruptions
- **State consistency** — keeping room occupancy, online users, and message history correct across connects/disconnects

## What's pre-scaffolded

| File                      | Status                                                                        |
| ------------------------- | ----------------------------------------------------------------------------- |
| `server/src/index.ts`     | Done — Express + Socket.io bootstrap, two namespaces registered               |
| `server/src/types.ts`     | Done — typed event maps for full TypeScript safety                            |
| `client/src/App.tsx`      | Done — two-panel layout, `selectedRoom` state lifted here                     |
| `client/src/components/*` | Done — display shells (RoomList, ChatWindow, MessageInput, PresenceIndicator) |
| `client/src/socket.ts`    | Partial — sockets created but **reconnection options missing**                |
| `client/src/hooks/*`      | Stub — signatures and docs present, bodies are `TODO`                         |
| `server/src/namespaces/*` | Stub — event handlers wired up, logic is `TODO`                               |
| `server/src/handlers/*`   | Stub — in-memory store helpers, implementations are `TODO`                    |

## Your TODOs

### Server

**`server/src/handlers/room.handler.ts`**
Implement in-memory room management: creating rooms, looking up a room by ID, listing all rooms, joining a room (enforcing capacity limits), and leaving a room. Seed at least two default rooms so the UI has something to display on load.

**`server/src/handlers/message.handler.ts`**
Implement message persistence: storing a new message for a room (keeping only the last 50 per room) and retrieving the history for a given room.

**`server/src/namespaces/chat.namespace.ts`**
Wire up the event handlers for the chat namespace:

- Joining a room should validate capacity, deliver history to the joining socket, and notify other room members of the updated state
- Leaving a room should update occupancy
- Creating a room should broadcast the updated room list to all connected clients
- Sending a message should verify the sender is in the room, persist it, and broadcast it to all room members
- Disconnecting should clean up any rooms the socket was occupying

**`server/src/namespaces/presence.namespace.ts`**
When a user identifies themselves, send the current online snapshot to that user and announce their arrival to everyone else. On disconnect, remove them and broadcast their departure.

### Client

**`client/src/socket.ts`**
Configure the sockets with reconnection behaviour so the client automatically recovers from network interruptions. Include the user's identity in the connection handshake.

**`client/src/hooks/useChat.ts`**
Subscribe to incoming messages and append them to local state. Expose a function to send a message to the current room. Reset the message list when the active room changes.

**`client/src/hooks/useRoom.ts`**
Join the active room on mount and leave it on cleanup. Keep the room list in sync as rooms are created or their state changes. Expose a function to create a new room.

**`client/src/hooks/usePresence.ts`**
Connect to the presence namespace, identify the current user, and maintain a live list of online users by handling join, leave, and snapshot events. Track the connection status.

## How to run

```bash
# From this app's directory:
pnpm dev

# Or from the monorepo root:
turbo dev --filter=@exercises/realtime-chat
```

Server starts on **http://localhost:3001**  
Client starts on **http://localhost:3002**

Open two browser tabs to test multi-user behaviour.

## Acceptance criteria

- [ ] Users can create and list rooms
- [ ] Users joining a room receive the last 50 messages as history
- [ ] New messages appear in real time for all users in the room
- [ ] Users in room A do NOT see messages from room B
- [ ] The presence panel shows connected users and updates on join/leave
- [ ] Disconnecting (close tab) removes the user from the presence list within 5 seconds
- [ ] The connection survives a server restart (reconnection kicks in with exponential backoff)

## Discussion questions

1. **Broadcast vs. emit**: `chat.to(roomId).emit(...)` sends to all sockets in the room _including_ the sender. `socket.to(roomId).emit(...)` excludes the sender. Which is correct for `message:send` and why? Does your answer change if you implement optimistic UI updates on the client?

2. **Reconnection state**: When the client reconnects after a network drop, how do you ensure it rejoins all rooms it was in before the disconnect? What server-side data do you need to store?

3. **Scaling beyond one server**: Your in-memory room and message stores break the moment you run two Node.js instances behind a load balancer. What's the minimal change needed to fix this? (Hint: Socket.io Adapter)

4. **Presence at scale**: The `/presence` namespace broadcasts to all connected clients on every join/leave. At 10,000 concurrent users, this becomes expensive. How would you redesign it?

5. **Security**: The current `userId` is set from the handshake query string — any client can spoof it. How would you authenticate sockets in a production system?
