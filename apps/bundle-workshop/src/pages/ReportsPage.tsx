import { useState } from "react";
import { buildTable, createDocument, REPORT_CSS } from "../lib/pdfEngine";

// BUNDLE ISSUE: GEO_DATA (120 countries, ~18 KB) is imported at the module level.
// Because App.tsx imports ReportsPage eagerly, this data lands in the initial bundle
// and is parsed on every page load — even when the user never visits Reports.
//
// Fix: move the import inside the export handler so it only loads when needed:
//
//   async function handleExport() {
//     const { GEO_DATA } = await import("../data/geoData"); // dynamic import
//     // ... use GEO_DATA here
//   }
//
// Dynamic imports return a Promise — wrap the button handler in async/await and
// show a loading state while the chunk downloads.
//
// After the fix, rebuild and check that geoData no longer appears in the
// initial chunk in dist/stats.html.
import { GEO_DATA, CONTINENTS } from "../data/geoData"; // BUNDLE ISSUE: static import of large dataset

import { formatNumber, formatCurrency } from "../utils/formatters";

const COLUMNS = buildTable(
  [
    { header: "Country",    key: "name",          width: 160 },
    { header: "Capital",    key: "capital",       width: 120 },
    { header: "Continent",  key: "continent",     width: 120 },
    { header: "Population", key: "population",    width: 100, align: "right", format: v => formatNumber(v as number) },
    { header: "GDP/capita", key: "gdpPerCapita",  width: 100, align: "right", format: v => formatCurrency(v as number) },
    { header: "Currency",   key: "currencyCode",  width: 80  },
  ],
  GEO_DATA as unknown as Record<string, unknown>[],
);

export function ReportsPage() {
  const [continent, setContinent] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const filtered = continent ? GEO_DATA.filter(c => c.continent === continent) : GEO_DATA;
  const doc = createDocument({ title: "Country Report", author: "Bundle Workshop" });

  async function handleExport() {
    setExporting(true);
    setExportDone(false);
    // Simulate PDF generation using pdfEngine utilities
    void doc;
    void REPORT_CSS;
    await new Promise(r => setTimeout(r, 1200));
    setExporting(false);
    setExportDone(true);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Reports</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {COLUMNS.header.length} columns · {filtered.length} of {GEO_DATA.length} countries
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={continent}
            onChange={e => setContinent(e.target.value)}
            style={{ padding: "6px 10px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 6 }}
          >
            <option value="">All continents</option>
            {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{ padding: "7px 14px", fontSize: 13, background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: exporting ? "default" : "pointer", opacity: exporting ? 0.7 : 1 }}
          >
            {exporting ? "Generating…" : exportDone ? "Downloaded ✓" : "Export PDF"}
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {COLUMNS.header.map(col => (
                <th key={col.key} style={{ padding: "10px 12px", textAlign: col.align ?? "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((country, ri) => (
              <tr key={country.code} style={{ borderBottom: "1px solid #f3f4f6", background: ri % 2 ? "#fafafa" : "#fff" }}>
                {COLUMNS.body[GEO_DATA.indexOf(country)].map((cell, ci) => (
                  <td key={ci} style={{ padding: "8px 12px", textAlign: cell.align, whiteSpace: "nowrap" }}>
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
