/**
 * Patches @opennextjs/aws minimize-js.js to handle ENOENT errors gracefully.
 * The walk() function crashes when encountering broken symlinks or missing dirs.
 * Run before `opennextjs-cloudflare build`.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const target = resolve(
  "node_modules/@opennextjs/aws/dist/minimize-js.js"
);

let src = readFileSync(target, "utf8");

// Already patched?
if (src.includes("ENOENT")) {
  console.log("[patch] minimize-js.js already patched — skipping.");
  process.exit(0);
}

// Patch: wrap fs.readdir in try/catch to skip missing dirs
src = src.replace(
  "const current_dirs = await fs.readdir(currentDirPath);",
  `let current_dirs;
    try {
      current_dirs = await fs.readdir(currentDirPath);
    } catch (e) {
      if (e.code === "ENOENT") return;
      throw e;
    }`
);

// Also patch fs.stat to handle broken symlinks
src = src.replace(
  "const stat = await fs.stat(filePath);",
  `let stat;
        try {
          stat = await fs.stat(filePath);
        } catch (e) {
          if (e.code === "ENOENT") continue;
          throw e;
        }`
);

writeFileSync(target, src);
console.log("[patch] minimize-js.js patched successfully.");
