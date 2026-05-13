// Users page — demonstrates virtualization of a large list.
//
// This page renders 10,000 user rows. Without virtualization, all 10,000
// DOM nodes are created at once, causing a janky initial render and
// significant memory usage.

import { UserTable } from "@/components/UserTable";

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        10,000 users — only the visible rows should be in the DOM at any time.
        Open React DevTools Profiler to measure the difference before and after virtualization.
      </p>
      {/* UserTable is a Client Component — it needs browser APIs for virtualization */}
      <UserTable />
    </div>
  );
}
