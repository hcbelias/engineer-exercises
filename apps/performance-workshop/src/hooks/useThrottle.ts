import { useState, useEffect, useRef } from "react";

// TODO: Implement useThrottle
//
// Requirements:
// 1. Return updates to `value` at most once per `interval` ms
// 2. Always apply the *latest* value when the interval fires (trailing edge), so
//    fast-moving values (e.g. scroll position) are never stuck on a stale snapshot
// 3. Clean up any pending timer on unmount
//
// Usage:
//   const throttledY = useThrottle(scrollY, 100);
//   // throttledY updates at most 10 times per second regardless of scroll speed.
//   // Without throttle, scroll events can fire 60–100+ times per second, each
//   // triggering a setState and a full React re-render cycle.
export function useThrottle<T>(value: T, interval: number): T {
  // TODO: replace with a real implementation
  void interval;
  const lastRef = useRef<T>(value);
  lastRef.current = value;
  return value;
}
