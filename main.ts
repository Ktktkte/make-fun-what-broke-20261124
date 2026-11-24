import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the entry text next to this script, never from the working directory.
const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8").trim();

// The gate: 1 to 200 characters of UTF-8 text, not only whitespace.
if (text.length < 1 || text.length > 200) {
  console.error(`entry must be 1-200 characters, got ${text.length}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

// Read back what we wrote: the grader runs twice and the outputs must match.
const written = readFileSync(outPath, "utf8");
if (written !== text) {
  console.error("read-back mismatch: output does not match entry.txt");
  process.exit(1);
}
