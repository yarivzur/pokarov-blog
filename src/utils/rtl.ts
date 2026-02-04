/**
 * RTL (Right-to-Left) utilities for Hebrew/English detection
 */

const HEBREW_REGEX = /[\u0590-\u05FF]/;

/**
 * Check if text contains Hebrew characters
 */
export function containsHebrew(text: string): boolean {
  return HEBREW_REGEX.test(text);
}

/**
 * Check if the text should be displayed RTL
 * Returns true if the text contains Hebrew characters
 */
export function isRTL(text: string): boolean {
  return containsHebrew(text);
}

/**
 * Get the text direction based on content
 */
export function getTextDirection(text: string): "rtl" | "ltr" {
  return isRTL(text) ? "rtl" : "ltr";
}

/**
 * Get the language code based on content
 */
export function getLanguage(text: string): "he" | "en" {
  return isRTL(text) ? "he" : "en";
}

/**
 * Get both direction and language in one call
 */
export function getDirectionAndLang(text: string): { dir: "rtl" | "ltr"; lang: "he" | "en" } {
  const isHebrew = isRTL(text);
  return {
    dir: isHebrew ? "rtl" : "ltr",
    lang: isHebrew ? "he" : "en",
  };
}
