import { useState } from "react";
import { RoomList } from "./components/RoomList";
import { ChatWindow } from "./components/ChatWindow";
import { PresenceIndicator } from "./components/PresenceIndicator";
import { useChat } from "./hooks/useChat";
import { useRoom } from "./hooks/useRoom";
import { usePresence } from "./hooks/usePresence";

// Username would come from an auth system in a real app.
// For this exercise use a fixed name or prompt the user.
const USERNAME = `User-${Math.random().toString(36).slice(2, 6)}`;

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { rooms, history, createRoom } = useRoom(selectedRoomId);
  const { messages, sendMessage } = useChat(selectedRoomId);
  const { onlineUsers, isConnected } = usePresence(USERNAME);

  // Merge history (received on join) with live messages
  const allMessages = [...history, ...messages];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <RoomList
        rooms={rooms}
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
        onCreateRoom={createRoom}
      />
      <ChatWindow
        roomId={selectedRoomId}
        messages={allMessages}
        onSend={sendMessage}
      />
      <PresenceIndicator users={onlineUsers} isConnected={isConnected} />
    </div>
  );
}
