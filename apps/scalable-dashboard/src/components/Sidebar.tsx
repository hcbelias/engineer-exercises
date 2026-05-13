// Server Component — no 'use client' needed because this is pure navigation markup.
// It renders on the server and sends only HTML to the browser.

import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/analytics", label: "Analytics" },
  { href: "/users", label: "Users" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: 200,
        borderRight: "1px solid #e5e7eb",
        padding: "24px 0",
        flexShrink: 0,
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{
                display: "block",
                padding: "10px 24px",
                textDecoration: "none",
                color: "#374151",
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
