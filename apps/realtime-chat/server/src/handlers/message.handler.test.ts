import { describe, it, expect, beforeEach } from "vitest";
import { messageHandler, messageStore } from "./message.handler";

const BASE_PAYLOAD = {
  roomId: "room-1",
  userId: "user-42",
  username: "alice",
  text: "Hello!",
};

describe("messageHandler", () => {
  beforeEach(() => {
    messageStore.clear();
  });

  describe("addMessage", () => {
    it("returns a Message with all required fields", () => {
      const msg = messageHandler.addMessage(BASE_PAYLOAD);

      expect(typeof msg.id).toBe("string");
      expect(msg.id.length).toBeGreaterThan(0);
      expect(msg.roomId).toBe(BASE_PAYLOAD.roomId);
      expect(msg.userId).toBe(BASE_PAYLOAD.userId);
      expect(msg.username).toBe(BASE_PAYLOAD.username);
      expect(msg.text).toBe(BASE_PAYLOAD.text);
      expect(typeof msg.timestamp).toBe("number");
      expect(msg.timestamp).toBeGreaterThan(0);
    });

    it("stores the message so getHistory can retrieve it", () => {
      const msg = messageHandler.addMessage(BASE_PAYLOAD);
      const history = messageHandler.getHistory(BASE_PAYLOAD.roomId);

      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(msg);
    });

    it("assigns unique IDs to different messages", () => {
      const a = messageHandler.addMessage(BASE_PAYLOAD);
      const b = messageHandler.addMessage(BASE_PAYLOAD);
      expect(a.id).not.toBe(b.id);
    });
  });

  describe("getHistory", () => {
    it("returns [] for an unknown room", () => {
      expect(messageHandler.getHistory("nonexistent-room")).toEqual([]);
    });

    it("returns messages in insertion order", () => {
      messageHandler.addMessage({ ...BASE_PAYLOAD, text: "first" });
      messageHandler.addMessage({ ...BASE_PAYLOAD, text: "second" });
      messageHandler.addMessage({ ...BASE_PAYLOAD, text: "third" });

      const history = messageHandler.getHistory(BASE_PAYLOAD.roomId);
      expect(history).toHaveLength(3);
      expect(history[0].text).toBe("first");
      expect(history[2].text).toBe("third");
    });
  });

  describe("50-message trim (MAX_HISTORY)", () => {
    it("keeps exactly 50 messages after 51 are added", () => {
      for (let i = 0; i < 51; i++) {
        messageHandler.addMessage({ ...BASE_PAYLOAD, text: `msg-${i}` });
      }

      const history = messageHandler.getHistory(BASE_PAYLOAD.roomId);
      expect(history).toHaveLength(50);
    });

    it("discards the oldest message when the limit is exceeded", () => {
      for (let i = 0; i < 51; i++) {
        messageHandler.addMessage({ ...BASE_PAYLOAD, text: `msg-${i}` });
      }

      const history = messageHandler.getHistory(BASE_PAYLOAD.roomId);
      // msg-0 (the oldest) should have been dropped; msg-1 is now first
      expect(history[0].text).toBe("msg-1");
      expect(history[49].text).toBe("msg-50");
    });
  });

  describe("multiple rooms", () => {
    it("keeps independent histories for different rooms", () => {
      messageHandler.addMessage({ ...BASE_PAYLOAD, roomId: "room-A", text: "in A" });
      messageHandler.addMessage({ ...BASE_PAYLOAD, roomId: "room-B", text: "in B" });

      expect(messageHandler.getHistory("room-A")).toHaveLength(1);
      expect(messageHandler.getHistory("room-A")[0].text).toBe("in A");

      expect(messageHandler.getHistory("room-B")).toHaveLength(1);
      expect(messageHandler.getHistory("room-B")[0].text).toBe("in B");
    });
  });
});
