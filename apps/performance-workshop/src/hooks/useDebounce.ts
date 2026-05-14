// TODO: Implement useDebounce
//
// Requirements:
// 1. Return `value` unchanged until `delay` ms have elapsed since the last change
// 2. Reset the debounce timer every time `value` changes before the delay expires
// 3. Cancel the pending timer on cleanup to avoid calling setState after unmount
//
// Usage:
//   const debouncedQuery = useDebounce(query, 300);
//   // debouncedQuery lags 300 ms behind query — the expensive filter only fires
//   // after the user pauses typing, not on every keystroke.
export function useDebounce<T>(value: T, delay: number): T {
  // TODO: replace with a real implementation
  void delay;
  return value;
}
