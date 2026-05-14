// TODO: Implement SkipNav
//
// A skip navigation link lets keyboard users bypass the page header and jump
// directly to the main content area. It must be the first focusable element
// on the page.
//
// The link should be invisible at rest and clearly visible when focused,
// without causing any layout shift. It must not obscure the content it
// overlays when visible.

export function SkipNav() {
  return (
    <a
      id="skip-nav"
      className="sr-only"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}
      href="#main-content"
    >
      Skip to main content
    </a>
  );
}
