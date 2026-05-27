import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, "../.open-next/assets");
const MAX_SIZE = 24 * 1024 * 1024; // 24 MB (Cloudflare limit is 25MB)

// Remove stale cached directories that should no longer exist in assets
const STALE_DIRS = ["videos"];
for (const dir of STALE_DIRS) {
  const dirPath = path.join(ASSETS_DIR, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`[clean-assets] Removing stale cached directory: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function cleanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      cleanDirectory(filePath);
    } else if (stat.size > MAX_SIZE) {
      console.log(`[clean-assets] Deleting large file to fit Cloudflare limits: ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
      fs.unlinkSync(filePath);
    }
  }
}

console.log(`[clean-assets] Checking for assets exceeding size limit in ${ASSETS_DIR}...`);
try {
  cleanDirectory(ASSETS_DIR);
  console.log("[clean-assets] Clean up finished successfully.");
} catch (error) {
  console.error("[clean-assets] Error occurred during clean up:", error);
}
