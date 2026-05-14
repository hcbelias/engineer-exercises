import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

// TODO: Implement useDebouncedCallback
//
// Unlike useDebounce (which debounces a *value* via state), this hook debounces
// a *callback* — useful when the trigger is a DOM event, not a state change.
//
// Requirements:
// 1. Return a *stable* function reference that does not change across renders
//    (i.e. the returned function passes referential equality checks)
// 2. Invoking the returned function resets the debounce timer; `fn` executes only
//    after `delay` ms of inactivity
// 3. Always call the *latest* version of `fn` so stale closures never fire with
//    outdated props or state
// 4. Cancel any pending invocation on unmount
//
// Usage:
//   const handleSearch = useDebouncedCallback((q: string) => {
//     fetchResults(q); // only fires after 400 ms of no new calls
//   }, 400);
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef<T>(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    const timer = timerRef;
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  // TODO: replace the body below with a properly debounced implementation.
  // Currently this calls fn immediately on every invocation — no debounce at all.
  return useCallback((...args: Parameters<T>) => {
    fnRef.current(...args); // PERF ISSUE: fires immediately, no debounce
  }, []);
}
