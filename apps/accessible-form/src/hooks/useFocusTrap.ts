import { useCallback, useRef } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// TODO: Implement useFocusTrap
//
// A focus trap prevents keyboard focus from leaving a container element.
// This is required for accessible modals and dialogs.
//
// Returns:
//   containerRef — attach to your container element
//   activate()  — start trapping focus
//   deactivate() — stop trapping focus and remove all listeners
//
// When active, Tab and Shift+Tab must cycle through the focusable elements
// inside the container and never escape to the rest of the page.
// The trap must handle containers whose focusable children change after activation.

export function useFocusTrap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive.current || !containerRef.current) return;
    if (e.key !== "Tab") return;

    // TODO: implement Tab / Shift+Tab cycling within the container
    const focusable = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    ).filter((el) => !el.closest("[hidden]"));

    if (focusable.length === 0) return;

    // TODO: cycle focus between the first and last focusable elements
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
