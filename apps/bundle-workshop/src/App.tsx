// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, Suspense } from "react";
import { Nav } from "./components/Nav";
import { Spinner } from "./components/Spinner";

// BUNDLE ISSUE: all four page components are imported statically.
// Vite/Rollup bundles everything reachable from a static import into the same chunk.
// The result: chartEngine + pdfEngine + geoData + richTextEngine all load on
// the very first visit — even if the user only ever looks at the Dashboard.
//
// Fix: convert the heavy pages to lazy imports so Rollup splits them into separate chunks.
// Keep DashboardPage as a static import — it is the landing page and should load immediately.
// Show a loading fallback while a lazy chunk is downloading.
//
// Rebuild (pnpm build) and open dist/stats.html to verify:
//   ✓ Initial chunk shrinks significantly
//   ✓ analytics, reports, and settings appear as separate chunks in the treemap
//   ✓ geoData is no longer visible in the initial chunk
import { DashboardPage } from "./pages/DashboardPage"; // ✅ keep static — it's the landing page
import { AnalyticsPage } from "./pages/AnalyticsPage"; // BUNDLE ISSUE: should be lazy
import { ReportsPage } from "./pages/ReportsPage"; // BUNDLE ISSUE: should be lazy
import { SettingsPage } from "./pages/SettingsPage"; // BUNDLE ISSUE: should be lazy

type Page = "dashboard" | "analytics" | "reports" | "settings";

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: () => <DashboardPage />,
  analytics: () => <AnalyticsPage />,
  reports: () => <ReportsPage />,
  settings: () => <SettingsPage />,
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const ActivePage = PAGES[page];

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "28px 24px 80px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#111827",
      }}
    >
      <header style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>Bundle Workshop</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
          Run{" "}
          <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 3 }}>
            pnpm build
          </code>{" "}
          then open{" "}
          <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 3 }}>
            dist/stats.html
          </code>{" "}
          to visualise the bundle. Fix the four BUNDLE ISSUEs and rebuild to see the chunks shrink.
        </p>
      </header>

      <Nav current={page} onChange={setPage} />

      {/* TODO: wrap ActivePage in a Suspense boundary after converting pages to lazy imports */}
      <ActivePage />

      {/* Keep Spinner and Suspense imported so they're available for the fix */}
      <div style={{ display: "none" }}>
        <Spinner />
      </div>
      <div style={{ display: "none" }}>{/* Suspense used above once lazy is applied */}</div>
    </div>
  );
}
