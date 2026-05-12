import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const roots = ["src"];
const extensions = new Set([".ts", ".tsx", ".css"]);
const issues = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(path);
        return;
      }

      const extension = entry.name.slice(entry.name.lastIndexOf("."));
      if (!extensions.has(extension)) return;

      const source = await readFile(path, "utf8");
      if (source.includes("\t")) {
        issues.push(`${path}: contains tab indentation`);
      }

      source.split("\n").forEach((line, index) => {
        if (/\s+$/.test(line)) {
          issues.push(`${path}:${index + 1}: trailing whitespace`);
        }
      });
    }),
  );
}

await Promise.all(roots.map((root) => walk(root)));

if (issues.length > 0) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("Source lint checks passed.");
