import { useCallback, useRef } from "react";

// Saves the currently focused element and restores focus to it later.
// Used by modals to return focus to the trigger button after closing.
//
// Returns:
//   saveFocus()    — captures the currently focused element
//   restoreFocus() — moves focus back to the saved element
//
// Guard against restoring focus to an element that is no longer in the DOM.

export function useFocusReturn() {
  const savedRef = useRef<Element | null>(null);

  const saveFocus = useCallback(() => {
    savedRef.current = document.activeElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if(savedRef.current && savedRef.current instanceof HTMLElement && savedRef.current.isConnected) {
      savedRef.current.focus();
    }

    savedRef.current = null;
  }, []);

  return { saveFocus, restoreFocus };
}
