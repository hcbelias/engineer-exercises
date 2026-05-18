import { useState, useEffect, useMemo } from "react";
import { buildTable, createDocument, REPORT_CSS } from "../lib/pdfEngine";
import type { GEO_DATA } from "../data/geoData";
import { formatNumber, formatCurrency } from "../utils/formatters";
import { Spinner } from "../components/Spinner";

type GeoEntry = (typeof GEO_DATA)[number];

const COLUMN_DEFS = [
  { header: "Country", key: "name", width: 160 },
  { header: "Capital", key: "capital", width: 120 },
  { header: "Continent", key: "continent", width: 120 },
  {
    header: "Population",
    key: "population",
    width: 100,
    align: "right" as const,
    format: (v: unknown) => formatNumber(v as number),
  },
  {
    header: "GDP/capita",
    key: "gdpPerCapita",
    width: 100,
    align: "right" as const,
    format: (v: unknown) => formatCurrency(v as number),
  },
  { header: "Currency", key: "currencyCode", width: 80 },
];

export function ReportsPage() {
  const [geoData, setGeoData] = useState<GeoEntry[] | null>(null);
  const [continents, setContinents] = useState<string[]>([]);
  const [continent, setContinent] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  useEffect(() => {
    import("../data/geoData").then(({ GEO_DATA, CONTINENTS }) => {
      setGeoData(GEO_DATA);
      setContinents(CONTINENTS);
    });
  }, []);

  const columns = useMemo(
    () => (geoData ? buildTable(COLUMN_DEFS, geoData as unknown as Record<string, unknown>[]) : null),
    [geoData],
  );

  const filtered = useMemo(
    () => (geoData ? (continent ? geoData.filter((c) => c.continent === continent) : geoData) : []),
    [geoData, continent],
  );

  async function handleExport() {
    setExporting(true);
    setExportDone(false);
    const doc = createDocument({ title: "Country Report", author: "Bundle Workshop" });
    void doc;
    void REPORT_CSS;
    await new Promise((r) => setTimeout(r, 1200));
    setExporting(false);
    setExportDone(true);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Reports</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {columns ? `${columns.header.length} columns · ` : ""}
            {geoData ? `${filtered.length} of ${geoData.length} countries` : "Loading…"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: 13,
              border: "1px solid #d1d5db",
              borderRadius: 6,
            }}
          >
            <option value="">All continents</option>
            {continents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              padding: "7px 14px",
              fontSize: 13,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: exporting ? "default" : "pointer",
              opacity: exporting ? 0.7 : 1,
            }}
          >
            {exporting ? "Generating…" : exportDone ? "Downloaded ✓" : "Export PDF"}
          </button>
        </div>
      </div>

      {!geoData || !columns ? (
        <Spinner />
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {columns.header.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "10px 12px",
                      textAlign: col.align ?? "left",
                      fontWeight: 600,
                      color: "#374151",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((country, ri) => (
                <tr
                  key={country.code}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    background: ri % 2 ? "#fafafa" : "#fff",
                  }}
                >
                  {columns.body[geoData.indexOf(country)].map((cell, ci) => (
                    <td
                      key={ci}
                      style={{ padding: "8px 12px", textAlign: cell.align, whiteSpace: "nowrap" }}
                    >
                      {cell.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
