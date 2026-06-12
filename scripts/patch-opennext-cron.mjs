import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Inject a `scheduled()` handler into the OpenNext-generated worker.
 *
 * OpenNext (`@opennextjs/cloudflare`) emits `.open-next/worker.js` with only a
 * `fetch` handler. The Cron Trigger declared in `wrangler.jsonc` (every 4 min)
 * therefore had no handler to invoke — the Neon keep-alive never ran and the DB
 * still scaled to zero, causing 504s on cold start (cf. vault note
 * `fix-504-timeout-neon-galerie`).
 *
 * This post-build patch keeps `main` pointed at the standard `.open-next/worker.js`
 * (so OpenNext's bundling, wasm patching and asset cleaning are untouched) and
 * appends a `scheduled` method that pings Neon with `SELECT 1` over the HTTP
 * driver (Workers-compatible, stateless). Idempotent: re-running is a no-op.
 */

const workerPath = path.resolve(__dirname, "../.open-next/worker.js");

if (!fs.existsSync(workerPath)) {
  console.error(`[patch-opennext-cron] worker.js not found at: ${workerPath}`);
  process.exit(1);
}

let code = fs.readFileSync(workerPath, "utf8");

const MARKER = "[scheduled:keep-alive]";
if (code.includes(MARKER)) {
  console.log("[patch-opennext-cron] scheduled handler already present. Skipping.");
  process.exit(0);
}

// 1. Add the Neon import at the very top (imports must stay top-level).
const NEON_IMPORT = `import { neon as __neonKeepAlive } from "@neondatabase/serverless";\n`;
code = NEON_IMPORT + code;

// 2. Insert the scheduled() method as the first property of the default export.
const SCHEDULED = `
    // Injected by scripts/patch-opennext-cron.mjs — keeps Neon compute warm.
    async scheduled(_controller, env, ctx) {
        const raw = env.DATABASE_URL && env.DATABASE_URL.trim().replace(/^["']|["']$/g, "");
        if (!raw) {
            console.error("[scheduled:keep-alive] DATABASE_URL is not defined");
            return;
        }
        ctx.waitUntil((async () => {
            const start = Date.now();
            try {
                const sql = __neonKeepAlive(raw);
                await sql\`SELECT 1\`;
                console.log(\`[scheduled:keep-alive] ok in \${Date.now() - start}ms\`);
            } catch (error) {
                console.error("[scheduled:keep-alive] Neon ping failed:", error);
            }
        })());
    },`;

const anchor = "export default {";
const idx = code.indexOf(anchor);
if (idx === -1) {
  console.error("[patch-opennext-cron] `export default {` anchor not found — worker layout changed. Manual inspection required.");
  process.exit(1);
}

code = code.slice(0, idx + anchor.length) + SCHEDULED + code.slice(idx + anchor.length);

fs.writeFileSync(workerPath, code, "utf8");
console.log("[patch-opennext-cron] scheduled() handler injected into worker.js.");
