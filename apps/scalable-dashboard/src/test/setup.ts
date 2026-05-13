import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: (fn: () => Promise<{ default: React.ComponentType }>) => {
    // Return a component that renders nothing (simulates lazy load not yet resolved)
    return () => null;
  },
}));
