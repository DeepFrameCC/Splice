/**
 * Conservative HTML sanitizer for admin-authored rich text (TipTap output)
 * rendered via `dangerouslySetInnerHTML`.
 *
 * This is defense-in-depth: the content is already produced by an authenticated
 * ADMIN through a constrained editor, so the goal is to neutralise the high-risk
 * XSS vectors that would matter if an admin account were ever compromised — not
 * to be a general-purpose sanitizer for untrusted input.
 *
 * Implemented with string passes (no DOM / no jsdom) to stay compatible with the
 * Cloudflare Workers runtime, where DOMPurify cannot run. Because regex parsing
 * of HTML is inherently imperfect, the strategy is strict: drop entire dangerous
 * elements, strip every event handler, and block dangerous URL schemes.
 */

// Elements removed with their content (never legitimate in TipTap article body).
const DANGEROUS_BLOCKS = /<\s*(script|style|iframe|object|embed|form|noscript|template|svg|math)\b[\s\S]*?<\s*\/\s*\1\s*>/gi;
// Self-closing / unclosed variants of the same dangerous tags.
const DANGEROUS_VOID = /<\s*(script|style|iframe|object|embed|form|noscript|template|svg|math|link|meta|base)\b[^>]*>/gi;
// Inline event handlers: on*="..." / on*='...' / on*=value
const EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
// Dangerous URL schemes inside href/src/etc.
const DANGEROUS_PROTO = /\s+(href|src|xlink:href|formaction|action|data|poster|background)\s*=\s*("\s*(?:javascript|vbscript|data|file)\s*:[^"]*"|'\s*(?:javascript|vbscript|data|file)\s*:[^']*'|(?:javascript|vbscript|data|file)\s*:[^\s>]*)/gi;
// `style="..."` can carry expression()/url(javascript:) vectors — drop entirely.
const STYLE_ATTR = /\s+style\s*=\s*("[^"]*"|'[^']*')/gi;

/**
 * Note: `data:` URLs are stripped from src/href as well (an SVG data URI can
 * carry script). TipTap images point to uploaded R2 URLs, so this does not
 * affect legitimate content.
 */
export function sanitizeRichHtml(html: string): string {
  if (!html) return "";
  let out = html;
  out = out.replace(DANGEROUS_BLOCKS, "");
  out = out.replace(DANGEROUS_VOID, "");
  out = out.replace(EVENT_HANDLERS, "");
  out = out.replace(DANGEROUS_PROTO, "");
  out = out.replace(STYLE_ATTR, "");
  return out;
}
