import { describe, it, expect, beforeEach } from "vitest";
import { roomHandler, rooms } from "../../src/handlers/room.handler";

describe("roomHandler", () => {
  beforeEach(() => {
    rooms.clear();
  });

  describe("createRoom", () => {
    it("returns a Room with the correct shape", () => {
      const room = roomHandler.createRoom("general");

      expect(room).toMatchObject({
        name: "general",
        occupancy: 0,
        maxOccupancy: 10,
      });
      expect(typeof room.id).toBe("string");
      expect(room.id.length).toBeGreaterThan(0);
    });

    it("stores the room in the rooms Map", () => {
      const room = roomHandler.createRoom("lobby");
      expect(rooms.has(room.id)).toBe(true);
      expect(rooms.get(room.id)).toEqual(room);
    });

    it("creates rooms with unique IDs", () => {
      const a = roomHandler.createRoom("a");
      const b = roomHandler.createRoom("b");
      expect(a.id).not.toBe(b.id);
    });
  });

  describe("getRoom", () => {
    it("returns undefined for an unknown ID", () => {
      expect(roomHandler.getRoom("does-not-exist")).toBeUndefined();
    });

    it("returns the room for an existing ID", () => {
      const created = roomHandler.createRoom("general");
      const fetched = roomHandler.getRoom(created.id);
      expect(fetched).toEqual(created);
    });
  });

  describe("listRooms", () => {
    it("returns an empty array when no rooms exist", () => {
      expect(roomHandler.listRooms()).toEqual([]);
    });

    it("returns all rooms as an array", () => {
      const a = roomHandler.createRoom("general");
      const b = roomHandler.createRoom("random");
      const list = roomHandler.listRooms();
      expect(list).toHaveLength(2);
      expect(list).toContainEqual(a);
      expect(list).toContainEqual(b);
    });
  });

  describe("joinRoom", () => {
    it("increments occupancy and returns the updated room", () => {
      const room = roomHandler.createRoom("general");
      const updated = roomHandler.joinRoom(room.id);
      expect(updated.occupancy).toBe(1);
      expect(updated.id).toBe(room.id);
    });

    it("allows multiple joins up to maxOccupancy", () => {
      const room = roomHandler.createRoom("general");
      for (let i = 1; i <= 10; i++) {
        const updated = roomHandler.joinRoom(room.id);
        expect(updated.occupancy).toBe(i);
      }
    });

    it("throws when the room is at capacity", () => {
      const room = roomHandler.createRoom("general");
      // Manually set occupancy to max so we can test the boundary
      rooms.set(room.id, { ...room, occupancy: room.maxOccupancy });
      expect(() => roomHandler.joinRoom(room.id)).toThrow();
    });

    it("throws when the room does not exist", () => {
      expect(() => roomHandler.joinRoom("ghost-room-id")).toThrow();
    });
  });

  describe("leaveRoom", () => {
    it("decrements occupancy and returns the updated room", () => {
      const room = roomHandler.createRoom("general");
      // Join first so there's someone to leave
      roomHandler.joinRoom(room.id);
      const updated = roomHandler.leaveRoom(room.id);
      expect(updated.occupancy).toBe(0);
    });

    it("does not let occupancy go below 0", () => {
      const room = roomHandler.createRoom("general");
      // occupancy is already 0 — leaving should not produce -1
      const updated = roomHandler.leaveRoom(room.id);
      expect(updated.occupancy).toBe(0);
    });
  });
});
