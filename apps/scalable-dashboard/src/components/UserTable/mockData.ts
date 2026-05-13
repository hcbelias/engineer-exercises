// This data is generated at module load time.
// TODO: Notice that this runs EVERY TIME this module is imported.
// In a Server Component, this is fine — it runs once on the server.
// In a Client Component, this can run during hydration AND on re-imports.
// What would be a better approach for production? (Consider: React cache(),
// moving data fetching to the server, or using a memo at the component level)

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
}

const ROLES = ["Admin", "Editor", "Viewer", "Contributor", "Moderator"];
const STATUSES: User["status"][] = ["active", "active", "active", "inactive", "suspended"];
const FIRST_NAMES = ["Alice", "Bob", "Carlos", "Diana", "Eve", "Frank", "Grace", "Hiro", "Iris", "Jack"];
const LAST_NAMES = ["Smith", "Jones", "Silva", "Chen", "Kim", "Müller", "Okonkwo", "Patel", "Torres", "White"];

function seededRandom(seed: number): number {
  // Deterministic pseudo-random (LCG) — same seed always produces same sequence
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  return ((a * seed + c) % m) / m;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export const MOCK_USERS: User[] = Array.from({ length: 10_000 }, (_, i) => {
  const firstName = pick(FIRST_NAMES, i * 3 + 1);
  const lastName = pick(LAST_NAMES, i * 3 + 2);
  const year = 2019 + Math.floor(seededRandom(i * 3 + 3) * 5);
  const month = String(Math.floor(seededRandom(i * 7) * 12) + 1).padStart(2, "0");

  return {
    id: i + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    role: pick(ROLES, i * 5),
    status: pick(STATUSES, i * 7),
    joinedAt: `${year}-${month}-01`,
  };
});
