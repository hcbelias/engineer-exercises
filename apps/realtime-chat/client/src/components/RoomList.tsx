import type { Room } from "../types";

interface Props {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: (name: string) => void;
}

export function RoomList({ rooms, selectedRoomId, onSelectRoom, onCreateRoom }: Props) {
  function handleCreate() {
    const name = prompt("Room name:");
    if (name?.trim()) onCreateRoom(name.trim());
  }

  return (
    <aside style={{ width: 220, borderRight: "1px solid #ccc", padding: 12 }}>
      <h3 style={{ margin: "0 0 8px" }}>Rooms</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rooms.map((room) => (
          <li key={room.id}>
            <button
              onClick={() => onSelectRoom(room.id)}
              style={{
                width: "100%",
                textAlign: "left",
                background: selectedRoomId === room.id ? "#e0e7ff" : "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: 4,
              }}
            >
              #{room.name}{" "}
              <small style={{ color: "#666" }}>
                ({room.occupancy}/{room.maxOccupancy})
              </small>
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreate} style={{ marginTop: 12, width: "100%" }}>
        + New room
      </button>
    </aside>
  );
}
