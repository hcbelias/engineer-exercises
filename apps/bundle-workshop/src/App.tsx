import { useState, Suspense, lazy } from "react";
import { Nav } from "./components/Nav";
import { Spinner } from "./components/Spinner";
import { DashboardPage } from "./pages/DashboardPage";

const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((m) => ({ default: m.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

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

      <Suspense fallback={<Spinner />}>
        <ActivePage />
      </Suspense>
    </div>
  );
}
