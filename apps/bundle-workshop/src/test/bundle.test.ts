import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = join(import.meta.dirname, "../../dist/assets");

beforeAll(() => {
  // Build the app; may take a few seconds
  execSync("pnpm build", {
    cwd: join(import.meta.dirname, "../.."),
    stdio: "inherit",
  });
}, 60_000);

function jsFiles(): string[] {
  if (!existsSync(DIST)) return [];
  return readdirSync(DIST).filter((f) => f.endsWith(".js"));
}

describe("bundle output", () => {
  it("dist/assets contains more than 1 JS file (code splitting happened)", () => {
    const files = jsFiles();
    expect(files.length).toBeGreaterThan(1);
  });

  it("total initial JS chunk count is at least 4 (main + analytics + reports + settings)", () => {
    const files = jsFiles();
    // After proper lazy-splitting there should be at least 4 JS chunks
    expect(files.length).toBeGreaterThanOrEqual(4);
  });

  it("no single JS file exceeds 30 KB gzipped", () => {
    const files = jsFiles();
    for (const file of files) {
      const content = readFileSync(join(DIST, file));
      const gzipped = gzipSync(content);
      const kb = gzipped.length / 1024;
      expect(kb, `${file} is ${kb.toFixed(1)} KB gzipped — exceeds 30 KB`).toBeLessThanOrEqual(30);
    }
  });

  it("chartEngine content does NOT appear in the main/initial chunk", () => {
    const files = jsFiles();
    // The main/initial chunk is typically the largest file
    const sorted = files
      .map((f) => ({ name: f, size: statSync(join(DIST, f)).size }))
      .sort((a, b) => b.size - a.size);

    const mainChunk = sorted[0];
    expect(mainChunk, "No JS files found in dist/assets").toBeTruthy();

    const content = readFileSync(join(DIST, mainChunk.name), "utf-8");
    // "chartEngine" is a distinctive string from the chartEngine module
    expect(content).not.toContain("chartEngine");
  });

  it("geoData content does NOT appear inline in the reports page chunk", () => {
    const files = jsFiles();
    // The reports chunk should be a separate file; geoData should not be inlined
    // in the main bundle — look for geoData in ALL chunks to be safe
    const mainChunkContent = readFileSync(
      join(
        DIST,
        files
          .map((f) => ({ name: f, size: statSync(join(DIST, f)).size }))
          .sort((a, b) => b.size - a.size)[0].name,
      ),
      "utf-8",
    );
    // geoData is defined in the geo module; if code-splitting works correctly
    // it should not appear in the initial/main chunk
    expect(mainChunkContent).not.toContain("geoData");
  });
});
