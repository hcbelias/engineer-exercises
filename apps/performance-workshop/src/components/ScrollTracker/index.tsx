import { useState, useEffect } from "react";

export function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // PERF ISSUE: setState is called on *every* scroll event.
    // Browsers fire scroll at up to 60–120 Hz, meaning up to 120 React re-renders
    // per second while the user scrolls — each one a synchronous setState call.
    // Fix: limit how often the scroll position is applied to state.
    const handleScroll = () => {
      setScrollY(window.scrollY); // PERF ISSUE: fires on every scroll event
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayY = scrollY; // TODO: throttle scroll updates

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#1f2937",
        color: "#f9fafb",
        borderRadius: 10,
        padding: "10px 16px",
        fontSize: 13,
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 100,
      }}
    >
      <span>scroll: {displayY}px</span>
      {displayY > 400 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
