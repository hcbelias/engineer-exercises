import { useCallback, useEffect, useRef } from "react";

// A live region announces dynamic content to screen reader users without
// moving keyboard focus. Essential for form errors, status updates, and
// notifications.
//
// Returns:
//   announce: (message: string, politeness?: "polite" | "assertive") => void
//
// The live region element must be appended to the document on mount and
// removed on unmount. Announcing the same message twice in a row must still
// trigger a new announcement.

export function useAnnounce() {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = document.createElement("div");
    element.style.cssText =
      "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("role", "status");
    regionRef.current = element;
    document.body.appendChild(element);

    return () => {
      element.remove();
    };
  }, []);

  const announce = useCallback((message: string, politeness: "polite" | "assertive" = "polite") => {
    if (!regionRef.current) return;
    regionRef.current.setAttribute("aria-live", politeness);
    regionRef.current.textContent = "";
    setTimeout(() => {
      if (regionRef.current) regionRef.current.textContent = message;
    }, 80);
  }, []);

  return { announce };
}
