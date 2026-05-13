// Analytics page — demonstrates lazy-loaded charts.
//
// TODO: Decide which components should be Server Components and which
// must be Client Components. Add 'use client' directives ONLY where required.
//
// For each component used on this page, add a comment explaining:
// - Is it a Server Component or Client Component?
// - WHY does it need to be that type?
//
// Hint: ChartWrapper uses browser-only APIs (window, ResizeObserver).
// What happens if you try to render it as a Server Component?

import { LazyChart } from "@/components/charts/LazyChart";

// Simulated server-side data fetch
async function getAnalyticsData() {
  // In a real app this would be: db.query(...) or fetch("internal-api/...")
  // Server Components can call databases/internal services directly — no API route needed.
  await new Promise((r) => setTimeout(r, 100)); // simulate latency
  return {
    sessions: [120, 145, 132, 167, 189, 201, 178],
    revenue: [4200, 5100, 4800, 6200, 7100, 6800, 7400],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div>
      <h1>Analytics</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Charts are loaded lazily — they're not in the initial JavaScript bundle.
        Open the Network tab and observe that the chart code loads only when this page mounts.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2>Weekly Sessions</h2>
        {/* TODO: LazyChart is currently imported normally.
            Convert it to use next/dynamic with ssr:false.
            Explain in a comment WHY ssr:false is needed here. */}
        <LazyChart
          title="Sessions"
          data={data.sessions}
          labels={data.labels}
          color="#4f46e5"
        />
      </section>

      <section>
        <h2>Weekly Revenue</h2>
        <LazyChart
          title="Revenue ($)"
          data={data.revenue}
          labels={data.labels}
          color="#16a34a"
        />
      </section>
    </div>
  );
}
