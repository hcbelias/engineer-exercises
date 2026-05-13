import type { Room } from "../types";

// In-memory room store. In production this would be Redis or a DB.
const rooms = new Map<string, Room>();

// TODO: Seed a few default rooms so the UI has something to show on first load.

export const roomHandler = {
  /**
   * TODO: Implement createRoom
   * - Create and store a new room with the given name
   * - Set a sensible default capacity
   * - Return the new Room
   */
  createRoom(_name: string): Room {
    throw new Error("TODO: implement createRoom");
  },

  /**
   * TODO: Implement getRoom
   * - Return the Room for the given id, or undefined if not found
   */
  getRoom(_roomId: string): Room | undefined {
    throw new Error("TODO: implement getRoom");
  },

  /**
   * TODO: Implement listRooms
   * - Return all rooms as an array
   */
  listRooms(): Room[] {
    throw new Error("TODO: implement listRooms");
  },

  /**
   * TODO: Implement joinRoom
   * - Validate the room exists and is not at capacity
   * - Track the new occupancy and return the updated Room
   */
  joinRoom(_roomId: string): Room {
    throw new Error("TODO: implement joinRoom");
  },

  /**
   * TODO: Implement leaveRoom
   * - Decrement occupancy (never below 0)
   * - Return the updated Room
   */
  leaveRoom(_roomId: string): Room {
    throw new Error("TODO: implement leaveRoom");
  },
};

// Export for testing
export { rooms };
