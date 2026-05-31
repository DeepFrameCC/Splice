import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, "../node_modules/.prisma/client/index.js");

if (!fs.existsSync(targetFile)) {
  console.error(`[patch-prisma-wasm] Target file not found: ${targetFile}`);
  process.exit(1);
}

let code = fs.readFileSync(targetFile, "utf8");

// Search for the standard fs.readFileSync query compiler loader block
const originalBlock = `      getQueryCompilerWasmModule: async () => {
        const queryCompilerWasmFilePath = require('path').join(config.dirname, 'query_compiler_bg.wasm')
        const queryCompilerWasmFileBytes = require('fs').readFileSync(queryCompilerWasmFilePath)

        return new WebAssembly.Module(queryCompilerWasmFileBytes)
      }`;

const patchedBlock = `      getQueryCompilerWasmModule: async () => {
        try {
          const queryCompilerWasmFilePath = require('path').join(config.dirname, 'query_compiler_bg.wasm')
          const queryCompilerWasmFileBytes = require('fs').readFileSync(queryCompilerWasmFilePath)
          return new WebAssembly.Module(queryCompilerWasmFileBytes)
        } catch (e) {
          if (e.message && (e.message.includes('not implemented') || e.code === 'ENOTDIR')) {
            const wasm = require('./query_compiler_bg.wasm');
            return wasm.default || wasm;
          }
          throw e;
        }
      }`;

if (code.includes("try {") && code.includes("require('./query_compiler_bg.wasm')")) {
  console.log("[patch-prisma-wasm] Prisma Client WASM query compiler already patched — skipping.");
  process.exit(0);
}

if (!code.includes(originalBlock)) {
  // Try dynamic spacing matching (in case of tab vs space discrepancies)
  const normalizedCode = code.replace(/\r\n/g, "\n");
  const fallbackMatch = normalizedCode.includes("fs').readFileSync(");
  if (!fallbackMatch) {
    console.error("[patch-prisma-wasm] Could not locate the query compiler loader block in Prisma Client index.js!");
    process.exit(1);
  }
  
  // Custom regex replace to be bulletproof
  const searchRegex = /getQueryCompilerWasmModule:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?new\s*WebAssembly\.Module\([\s\S]*?\)\s*\}/g;
  code = code.replace(searchRegex, `getQueryCompilerWasmModule: async () => {
        try {
          const queryCompilerWasmFilePath = require('path').join(config.dirname, 'query_compiler_bg.wasm')
          const queryCompilerWasmFileBytes = require('fs').readFileSync(queryCompilerWasmFilePath)
          return new WebAssembly.Module(queryCompilerWasmFileBytes)
        } catch (e) {
          if (e.message && (e.message.includes('not implemented') || e.code === 'ENOTDIR')) {
            const wasm = require('./query_compiler_bg.wasm');
            return wasm.default || wasm;
          }
          throw e;
        }
      }`);
} else {
  code = code.replace(originalBlock, patchedBlock);
}

fs.writeFileSync(targetFile, code, "utf8");
console.log("[patch-prisma-wasm] Prisma Client index.js patched successfully for Cloudflare Workers WebAssembly compatibility.");
