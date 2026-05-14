import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useFocusReturn } from "../../hooks/useFocusReturn";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// TODO: Implement an accessible modal dialog.
//
// When open, focus must move inside the dialog and be trapped there — keyboard
// users must not be able to reach content behind it. When closed, focus must
// return to whichever element triggered the modal.
//
// The dialog must be dismissible via the Escape key and by clicking the overlay.
// Content behind the modal must be hidden from assistive technology while it is open.
// When closed, the modal must not exist in the DOM.

export function Modal({ isOpen, onClose, title, children }: Props) {
  const titleId = "modal-title";
  const { containerRef, activate, deactivate } = useFocusTrap();
  const { saveFocus, restoreFocus } = useFocusReturn();

  useEffect(() => {
    if (!isOpen) return;
    // TODO: trap focus, save and restore focus, handle Escape, hide background content
    return () => {
      // TODO: clean up focus trap, restore focus, unhide background content
    };
  }, [isOpen, activate, deactivate, saveFocus, restoreFocus]);

  if (!isOpen) return null;

  return createPortal(
    // TODO: add overlay and wire up correct ARIA attributes on the dialog
    <div>
      <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}
