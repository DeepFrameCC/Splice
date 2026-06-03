import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handlerPath = path.resolve(__dirname, "../.open-next/server-functions/default/handler.mjs");
const wasmSrcPath = path.resolve(__dirname, "../node_modules/.prisma/client/query_compiler_bg.wasm");
const wasmDestPath = path.resolve(__dirname, "../.open-next/server-functions/default/query_compiler_bg.wasm");

const isolatedClientDir = path.resolve(__dirname, "../.open-next/server-functions/default/node_modules/.prisma/client");
const isolatedIndexPath = path.resolve(isolatedClientDir, "index.js");
const isolatedWasmDestPath = path.resolve(isolatedClientDir, "query_compiler_bg.wasm");

if (!fs.existsSync(handlerPath)) {
  console.error(`[patch-opennext-wasm] handler.mjs not found at: ${handlerPath}`);
  process.exit(1);
}

if (!fs.existsSync(wasmSrcPath)) {
  console.error(`[patch-opennext-wasm] query_compiler_bg.wasm not found at: ${wasmSrcPath}`);
  process.exit(1);
}

// 1. Copy WASM to both destination paths
console.log(`[patch-opennext-wasm] Copying query_compiler_bg.wasm to handler dest...`);
fs.copyFileSync(wasmSrcPath, wasmDestPath);

if (fs.existsSync(isolatedClientDir)) {
  console.log(`[patch-opennext-wasm] Copying query_compiler_bg.wasm to isolated client dest...`);
  fs.copyFileSync(wasmSrcPath, isolatedWasmDestPath);
} else {
  console.warn(`[patch-opennext-wasm] Isolated client directory not found at: ${isolatedClientDir}`);
}

// The clean replacement for getQueryCompilerWasmModule
const CLEAN_REPLACEMENT = `getQueryCompilerWasmModule: async () => { const wasm = require('./query_compiler_bg.wasm'); return wasm.default || wasm; }`;

/**
 * Patch a file's getQueryCompilerWasmModule definition.
 * Handles:
 *   A) Original Prisma output with WebAssembly.Module(queryCompilerWasmFileBytes)
 *   B) Previously broken patch (missing "try {", has stray }catch(e){...})
 *   C) Already cleanly patched (no-op)
 */
function patchFile(filePath, label) {
  let code = fs.readFileSync(filePath, "utf8");

  // Pattern A: original Prisma WASM loader block (captures complete try/catch)
  const regexA = /getQueryCompilerWasmModule\s*:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?new\s*WebAssembly\.Module\([\s\S]*?throw\s+e\s*;?\s*\}\s*\}/g;

  // Pattern B: broken patch — captures stray catch block after function body
  const regexB = /getQueryCompilerWasmModule\s*:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}catch\s*\(e\)\s*\{[\s\S]*?throw\s+e\s*;?\s*\}\s*\}/g;

  // Pattern C: clean patch already applied
  const alreadyClean = `getQueryCompilerWasmModule: async () => { const wasm = require('./query_compiler_bg.wasm'); return wasm.default || wasm; }`;

  if (code.includes(alreadyClean) && !regexB.test(code)) {
    console.log(`[patch-opennext-wasm] ${label} already cleanly patched. Skipping.`);
    return;
  }

  regexA.lastIndex = 0;
  regexB.lastIndex = 0;

  let matched = false;

  if (regexB.test(code)) {
    regexB.lastIndex = 0;
    code = code.replace(regexB, CLEAN_REPLACEMENT);
    matched = true;
    console.log(`[patch-opennext-wasm] ${label}: fixed broken patch (pattern B).`);
  }

  if (!matched) {
    regexA.lastIndex = 0;
    if (regexA.test(code)) {
      regexA.lastIndex = 0;
      code = code.replace(regexA, CLEAN_REPLACEMENT);
      matched = true;
      console.log(`[patch-opennext-wasm] ${label}: replaced original Prisma WASM block (pattern A).`);
    }
  }

  if (!matched) {
    console.warn(`[patch-opennext-wasm] ${label}: no known pattern found. Manual inspection required.`);
    return;
  }

  fs.writeFileSync(filePath, code, "utf8");
  console.log(`[patch-opennext-wasm] ${label} patched successfully.`);
}

// 2. Patch handler.mjs
console.log(`[patch-opennext-wasm] Patching handler.mjs...`);
patchFile(handlerPath, "handler.mjs");

// 3. Patch isolated client index.js if it exists
if (fs.existsSync(isolatedIndexPath)) {
  console.log(`[patch-opennext-wasm] Patching isolated client index.js...`);
  patchFile(isolatedIndexPath, "isolated index.js");
} else {
  console.warn(`[patch-opennext-wasm] Isolated index.js not found at: ${isolatedIndexPath}`);
}

console.log("[patch-opennext-wasm] Patching complete.");
