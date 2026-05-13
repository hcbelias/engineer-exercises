import type { Message } from "../types";

// In-memory message store: roomId → last 50 messages (MAX_HISTORY = 50)
const messageStore = new Map<string, Message[]>();

export const messageHandler = {
  /**
   * TODO: Implement addMessage
   * - Persist the message to this room's history
   * - Enforce the MAX_HISTORY limit (keep only the most recent messages)
   * - Return the stored Message so the caller can broadcast it
   */
  addMessage(_payload: {
    roomId: string;
    userId: string;
    username: string;
    text: string;
  }): Message {
    throw new Error("TODO: implement addMessage");
  },

  /**
   * TODO: Implement getHistory
   * - Return the stored messages for the room, or [] if none
   */
  getHistory(_roomId: string): Message[] {
    throw new Error("TODO: implement getHistory");
  },
};

// Export for testing
export { messageStore };
