import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I backed up your files to a folder called 'definitely_not_deleted', which the system took literally.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 140) {
  throw new Error(`line is ${LINE.length} characters, gate is 1-140`);
}
if (LINE.trim().length === 0) {
  throw new Error("line is only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Read back and verify byte-identical output, with an exact size assertion
// (the tie-break favours smaller text, so the byte count is part of the entry).
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: output differs from the line");
}
if (Buffer.byteLength(back, "utf8") !== 100) {
  throw new Error(`expected exactly 100 bytes, got ${Buffer.byteLength(back, "utf8")}`);
}
console.log(`wrote ${LINE.length} characters to ${outPath}`);
