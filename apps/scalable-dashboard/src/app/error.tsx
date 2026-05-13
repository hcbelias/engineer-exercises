"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

// TODO: Implement a user-friendly error UI.
//
// This file is automatically used by Next.js as an error boundary for this route segment.
// It must be a Client Component (it receives the error and reset function as props).
//
// Requirements:
// 1. Display a helpful message (not the raw error.message in production)
// 2. Show a "Try again" button that calls reset() to re-render the route segment
// 3. Log the error to an error tracking service (console.error is fine for this exercise)
//
// Discussion: What's the difference between this error.tsx and a React class ErrorBoundary?
// When would you need both?

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      {/* TODO: implement proper error UI */}
      <h2>Something went wrong</h2>
      <p style={{ color: "#6b7280" }}>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
