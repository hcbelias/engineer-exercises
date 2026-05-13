# Exercise 3 — Accessibility Workshop

Make three broken UI components fully accessible. No accessibility libraries allowed — implement ARIA patterns by hand.

## The problem

Most components that "look fine" in a browser are completely unusable with assistive technology. A keyboard-only user can't interact with a `<div onClick>` tab panel. A screen reader user doesn't know which form field has an error. A VoiceOver user gets trapped on a page with no way to skip past a header navigation.

This exercise forces you to understand and implement these patterns from first principles.

## What's pre-scaffolded

| File | Status |
|------|--------|
| `src/styles/global.css` | Done — `:focus-visible`, `.sr-only`, CSS custom properties |
| `src/App.tsx` | Done (broken) — tab panel uses `<div onClick>`, needs ARIA conversion |
| `src/components/MultiStepForm/index.tsx` | Done — step controller with validation |
| `src/components/MultiStepForm/StepOne/Two/Three.tsx` | Done (broken) — valid HTML, **no ARIA attributes** |
| `src/components/Modal/ModalTrigger.tsx` | Done — trigger button |
| `src/components/ComboBox/Option.tsx` | Done — option item with `role="option"` |
| `src/hooks/useFocusTrap.ts` | Partial — structure + focusable selector, **Tab cycling is TODO** |
| `src/hooks/useFocusReturn.ts` | Stub — **bodies are TODO** |
| `src/hooks/useAnnounce.ts` | Stub — **bodies are TODO** |
| `src/components/SkipNav/index.tsx` | Stub — **TODO** |
| `src/components/Modal/index.tsx` | Partial — portal + dialog shell, **focus management is TODO** |
| `src/components/ComboBox/index.tsx` | Partial — filtering works, **ARIA + keyboard nav is TODO** |
| `src/components/MultiStepForm/ProgressBar.tsx` | Stub — **TODO** |

## Your TODOs

### 1. Skip navigation link — `src/components/SkipNav/index.tsx`
Implement a skip navigation link that allows keyboard users to bypass the page header and jump directly to the main content. It should be visually hidden until focused, and must not cause layout shifts when it appears.

### 2. Tab panel — `src/App.tsx`
The current tab panel uses non-semantic `<div>` elements with click handlers. Convert it to a proper accessible tab pattern so that keyboard users can navigate between tabs and screen readers correctly identify the selected tab and its associated content panel.

### 3. Progress bar — `src/components/MultiStepForm/ProgressBar.tsx`
Implement the progress bar so that assistive technologies can communicate the user's current position in the multi-step form — including the current step, total steps, and which step is active.

### 4. Form fields — `StepOne.tsx`, `StepTwo.tsx`, `StepThree.tsx`
Wire up proper accessible labels, required-field indicators, and error states for every form input. Errors must be announced by screen readers without moving focus away from the field that caused them. The submit button should communicate when the form is being submitted.

### 5. `useFocusTrap.ts`
Implement the focus trap hook so that keyboard focus is constrained to the container it wraps — Tab and Shift+Tab must cycle through the container's focusable elements and never escape to the rest of the page.

### 6. `useFocusReturn.ts`
Implement the two-function API for saving and restoring focus. When a modal or overlay closes, focus should return to whichever element triggered it.

### 7. `useAnnounce.ts`
Implement a hook that allows components to push announcements to screen readers without moving focus. Messages should be delivered politely and the underlying live region must be cleaned up when the consumer unmounts.

### 8. Modal — `src/components/Modal/index.tsx`
Complete the modal so that it satisfies the ARIA dialog pattern: focus moves inside on open, is trapped while open, and returns to the trigger on close. The modal must be dismissible via keyboard. Content behind the modal should be hidden from assistive technology while it is open.

### 9. ComboBox — `src/components/ComboBox/index.tsx`
Implement full keyboard and screen reader support for the combobox. Users must be able to open the list, navigate options, select with Enter, and close with Escape — all without a mouse. The currently highlighted option must be announced as focus moves through the list.

## How to run

```bash
# From this app's directory:
pnpm dev

# Or from the monorepo root:
turbo dev --filter=@exercises/accessible-form
```

App starts on **http://localhost:3004**

## Testing accessibility

**Keyboard only**: Unplug your mouse. Can you complete the form, open/close the modal, and use the combobox without touching the mouse?

**Screen reader** (macOS):
1. System Settings → Accessibility → VoiceOver → turn on (or Cmd+F5)
2. Use VO+Right to navigate, VO+Space to activate
3. Verify: form errors are announced without moving focus; modal announces its title on open; progress bar reads "Step 2 of 3"

**Automated**: Run axe DevTools browser extension on each page — aim for zero violations.

## Acceptance criteria

- [ ] Skip nav link appears on first Tab press and moves focus to main content on Enter
- [ ] Tab panel is navigable with keyboard (arrows, Home, End)
- [ ] Form errors are announced by screen readers without focus moving
- [ ] Modal: opens with focus inside, Escape closes, focus returns to trigger
- [ ] ComboBox: all options reachable by keyboard, selected option announced
- [ ] Zero `aria-*` violations reported by axe DevTools

## Discussion questions

1. **`aria-live` regions**: When would you use `aria-live="assertive"` instead of `"polite"`? Give two concrete examples where the wrong choice creates a bad user experience.

2. **`aria-modal` vs `inert`**: The `aria-modal="true"` attribute is supposed to tell screen readers that content behind the dialog is hidden. Why doesn't it always work, and what's the `inert` attribute alternative?

3. **Focus management on route change**: In a React SPA, when the user navigates to a new page, where should focus go? What's the default browser behaviour and why doesn't it apply to client-side navigation?

4. **Color contrast**: WCAG 2.1 AA requires 4.5:1 contrast for normal text. Your error messages use `#dc2626` on white (`#ffffff`). Is this compliant? (Check with a contrast checker.) What's the minimum contrast for large text (18pt+ or 14pt bold)?

5. **Accessible name calculation**: An `<input>` can get its accessible name from a `<label>`, `aria-label`, or `aria-labelledby`. In what order does the browser prefer these? When would you use `aria-label` instead of a visible `<label>`, and what's the trade-off?
