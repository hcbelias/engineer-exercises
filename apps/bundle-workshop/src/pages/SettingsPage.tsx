import { useState, Suspense } from "react";
import { Spinner } from "../components/Spinner";

// BUNDLE ISSUE: RichTextEditor (which imports richTextEngine) is imported statically
// even though it is only rendered when the user clicks "Edit bio".
//
// Because App.tsx eagerly imports SettingsPage, AND SettingsPage statically imports
// RichTextEditor, richTextEngine ends up in the initial bundle for every visitor —
// even those who only ever look at the Dashboard.
//
// Fix: lazy-load RichTextEditor so richTextEngine only downloads when the editor is opened.
// Wrap the conditional render in a Suspense boundary to show a loading fallback.
//
// Verify in dist/stats.html: richTextEngine should appear in a separate chunk.
import RichTextEditor from "../components/RichTextEditor"; // BUNDLE ISSUE: static import

interface Field { label: string; type: "text" | "email" | "select"; options?: string[]; defaultValue: string; }

const PROFILE_FIELDS: Field[] = [
  { label: "Full name",     type: "text",   defaultValue: "Alex Morgan"              },
  { label: "Email",         type: "email",  defaultValue: "alex@example.com"          },
  { label: "Job title",     type: "text",   defaultValue: "Senior Engineer"           },
  { label: "Timezone",      type: "select", defaultValue: "UTC-5",
    options: ["UTC-8","UTC-7","UTC-6","UTC-5","UTC-4","UTC-3","UTC","UTC+1","UTC+2","UTC+5:30","UTC+8","UTC+9"] },
  { label: "Language",      type: "select", defaultValue: "English",
    options: ["English","Portuguese","Spanish","French","German","Japanese","Mandarin"]   },
];

export function SettingsPage() {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("<p>Engineering lead focused on performance and developer experience.</p>");
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500); }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>Settings</h2>

      {/* Profile fields */}
      <section style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 14px" }}>Profile</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PROFILE_FIELDS.map(({ label, type, options, defaultValue }) => (
            <label key={label} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
              <span style={{ color: "#4b5563", fontWeight: 500 }}>{label}</span>
              {type === "select" ? (
                <select defaultValue={defaultValue} style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}>
                  {options!.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type} defaultValue={defaultValue} style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }} />
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Bio with lazy-loaded editor */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Bio</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: "5px 12px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
              Edit bio
            </button>
          )}
        </div>

        {editing ? (
          <Suspense fallback={<Spinner label="Loading editor…" />}>
            <RichTextEditor value={bio} onChange={setBio} placeholder="Tell us about yourself…" />
          </Suspense>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: bio }} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, lineHeight: 1.6, color: "#374151" }} />
        )}
      </section>

      {/* Save */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave} style={{ padding: "8px 18px", fontSize: 14, background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Save changes
        </button>
        {saved && <span style={{ fontSize: 13, color: "#16a34a", alignSelf: "center" }}>Saved ✓</span>}
      </div>
    </div>
  );
}
