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
  const descriptionId = "modal-description";
  const { containerRef, activate, deactivate } = useFocusTrap();
  const { saveFocus, restoreFocus } = useFocusReturn();

  useEffect(() => {
    if (!isOpen) return;
    activate();
    return () => {
      deactivate();
    };
  }, [isOpen, activate, deactivate, saveFocus, restoreFocus]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal">
      <div className={`modal__overlay ${isOpen ? "modal__overlay--active" : ""}`} onClick={onClose}/>
      <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
        <h2 id={titleId}>{title}</h2>
        <div id={descriptionId}>
        {children}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}
