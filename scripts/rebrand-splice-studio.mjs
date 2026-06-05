/**
 * Rebrand: "Splice" → "Splice Studio" across all user-facing brand references.
 *
 * Rules:
 *  - Only modifies .ts / .tsx files under app/, components/, lib/
 *  - Replaces brand name in user-visible strings (titles, descriptions, alt text, labels, JSON-LD, etc.)
 *  - Does NOT rename:
 *    - file/directory names
 *    - CSS class names (e.g. df-*, splice-*)
 *    - internal code identifiers (variable names, imports)
 *    - domain names (splicestudio.fr, splice.cc)
 *    - email addresses (contact.splicestudio@gmail.com)
 *    - social media handles (@splice.cc)
 *    - technical bucket/project names in wrangler/env configs
 *    - admin seed email (admin@splice.cc)
 *  - Handles "Splice Studio" (alternateName) → already correct, skip
 *  - Handles "© 2026 Splice" → "© 2026 Splice Studio"
 *  - Handles siteName: "Splice" → siteName: "Splice Studio"
 *  - Handles name: "Splice" → name: "Splice Studio" (in JSON-LD/metadata)
 *  - Handles "Splice Studio Studio" prevention (already "Splice Studio" stays unchanged)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
const DIRS = ['app', 'components', 'lib'];
const EXTS = new Set(['.ts', '.tsx']);

// Patterns to SKIP (these should NOT be rebranded)
const SKIP_PATTERNS = [
  /splicestudio\.fr/,           // domain
  /splice\.cc/,                 // social/email domain
  /contact\.splicestudio/,      // email
  /admin@splice/,               // seed email
  /splice-app-prod/,            // bucket name
  /splice-cdn/,                 // bucket name
  /splice-deliveries/,          // bucket name
  /splice-archive/,             // bucket name
  /Splice Studio/,              // already rebranded
  /SPLICE_/,                    // env variable names
  /"splice"/,                   // wrangler project name
  /Splicecc/,                   // Facebook page handle
];

function shouldSkipLine(line) {
  return SKIP_PATTERNS.some(p => p.test(line));
}

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== '.next') {
      results.push(...collectFiles(full));
    } else if (stat.isFile() && EXTS.has(extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

let totalFiles = 0;
let totalReplacements = 0;
const changedFiles = [];

for (const dir of DIRS) {
  const fullDir = join(ROOT, dir);
  const files = collectFiles(fullDir);

  for (const file of files) {
    const original = readFileSync(file, 'utf-8');
    const lines = original.split('\n');
    let fileChanged = false;
    let fileReplacements = 0;

    const newLines = lines.map((line) => {
      // Skip lines that contain patterns we don't want to touch
      if (shouldSkipLine(line)) return line;

      // Skip import/require lines
      if (/^\s*(import |require\(|from ")/.test(line)) return line;

      // Skip CSS class names
      if (/className=/.test(line) && !/(?:title|description|name|label|alt|aria-label|content)/.test(line)) {
        // Only process if the line also has semantic content attributes
        if (!/["'].*Splice.*["']/.test(line)) return line;
      }

      // Count and replace standalone "Splice" (not already "Splice Studio")
      // Use word boundary to avoid matching inside other words
      const regex = /\bSplice\b(?!\s+Studio)/g;
      if (regex.test(line)) {
        const newLine = line.replace(/\bSplice\b(?!\s+Studio)/g, 'Splice Studio');
        if (newLine !== line) {
          fileChanged = true;
          // Count how many replacements on this line
          const matches = line.match(/\bSplice\b(?!\s+Studio)/g);
          fileReplacements += matches ? matches.length : 0;
        }
        return newLine;
      }

      return line;
    });

    if (fileChanged) {
      const newContent = newLines.join('\n');
      writeFileSync(file, newContent, 'utf-8');
      totalFiles++;
      totalReplacements += fileReplacements;
      changedFiles.push({ file: file.replace(ROOT, ''), replacements: fileReplacements });
    }
  }
}

console.log(`\n✅ Rebrand complete`);
console.log(`   Files modified: ${totalFiles}`);
console.log(`   Replacements: ${totalReplacements}`);
console.log(`\nChanged files:`);
for (const f of changedFiles) {
  console.log(`  ${f.file} (${f.replacements} replacements)`);
}
