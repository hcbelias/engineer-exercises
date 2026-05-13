// TODO: Implement a skeleton loading UI for the dashboard home.
//
// This file is automatically used by Next.js as a Suspense boundary
// while the page.tsx Server Component is streaming in data.
//
// Requirements:
// 1. Render placeholder "skeleton" cards that match the layout of the stat cards in page.tsx
//    Use a CSS animation (pulse/shimmer) to indicate loading.
// 2. Keep it simple — no external libraries needed.
//
// Discussion: Why does Next.js use a file-based loading.tsx instead of
// requiring you to manually wrap components in <Suspense>? What's the
// trade-off between the two approaches?

export default function DashboardLoading() {
  return (
    <div>
      <div
        style={{
          height: 32,
          width: 200,
          background: "#e5e7eb",
          borderRadius: 4,
          marginBottom: 24,
        }}
      />
      {/* TODO: replace with proper animated skeleton */}
      <p style={{ color: "#9ca3af" }}>Loading dashboard…</p>
    </div>
  );
}
