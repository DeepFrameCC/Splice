const WORDS_PER_MINUTE = 200;

/**
 * Calculate estimated reading time from HTML content.
 * Strips tags, counts words, divides by 200 wpm.
 * Returns at least 1 minute.
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
