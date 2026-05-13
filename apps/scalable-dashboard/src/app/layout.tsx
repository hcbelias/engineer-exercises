import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DashboardProvider } from "@/components/providers/DashboardProvider";

export const metadata: Metadata = {
  title: "Scalable Dashboard",
  description: "Frontend architecture exercise",
};

// This is a Server Component (no 'use client' directive).
// It renders on the server, meaning:
// - Zero JS sent to the browser for this layout itself
// - Child Server Components also render on the server
// - Only Client Components (marked 'use client') send JS to the browser
//
// Rule of thumb: push 'use client' as far DOWN the component tree as possible.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <DashboardProvider>
          <Header />
          <div style={{ display: "flex", flex: 1 }}>
            <Sidebar />
            <main style={{ flex: 1, padding: 24 }}>
              {children}
            </main>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
