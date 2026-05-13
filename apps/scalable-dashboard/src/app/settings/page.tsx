// Settings page — demonstrates context consumption and Client Component boundaries.

// TODO: Think carefully before adding 'use client' here.
// Does the settings page itself need to be a Client Component?
// Can you keep this as a Server Component and push 'use client' into a child?

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <p style={{ color: "#6b7280" }}>
        This page is intentionally simple. Focus your time on the Users and Analytics pages.
      </p>
    </div>
  );
}
