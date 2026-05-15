import { useCallback, useRef } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function useFocusTrap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive.current || !containerRef.current) return;
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    ).filter((el) => !el.closest("[hidden]"));

    if (focusable.length === 0) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    if(e.shiftKey) {
      if(document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
        return;
      }
    }else{
      if(document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
        return;
      }
    }
  }, []);

  const activate = useCallback(() => {
    isActive.current = true;
    document.addEventListener("keydown", handleKeyDown);
    // Move focus to the first focusable element inside the container
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    firstFocusable?.focus();
  }, [handleKeyDown]);

  const deactivate = useCallback(() => {
    isActive.current = false;
    document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { containerRef, activate, deactivate };
}
