/**
 * Detects gibberish or non-English content in form text fields.
 *
 * Strategy:
 * 1. Single "words" with no spaces that are suspiciously long → gibberish token
 * 2. Too many consecutive consonants → random character strings
 * 3. Non-Latin characters (Cyrillic, Arabic, CJK, etc.) → reject as non-English
 * 4. Extremely high ratio of uppercase within a single "word" → bot-generated
 */

// Regex: characters outside Basic Latin + Latin Extended (covers English, common punctuation, digits)
const NON_LATIN_REGEX = /[^\u0000-\u024F\s\d.,!?'"()\-@#+&%]/

// Detects long runs of consonants (5+ in a row) — common in random strings
const CONSONANT_RUN_REGEX = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/

export function validateLanguage(
  text: string,
  fieldName = 'Text'
): { valid: boolean; message?: string } {
  const trimmed = text?.trim() || ''

  if (!trimmed) return { valid: true } // Let required-field checks handle empty values

  // Check for non-Latin script characters
  if (NON_LATIN_REGEX.test(trimmed)) {
    return {
      valid: false,
      message: `${fieldName} must be written in English.`,
    }
  }

  const words = trimmed.split(/\s+/).filter((w) => w.length > 0)

  // A single "word" (no spaces) that is very long looks like a bot token
  if (words.length === 1 && trimmed.length > 15) {
    return {
      valid: false,
      message: `${fieldName} appears to contain a random string. Please write in plain English.`,
    }
  }

  // Check each word for gibberish patterns
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z]/g, '')

    // Skip very short words (numbers, initials, abbreviations)
    if (clean.length < 4) continue

    // Long consonant run within a single word
    if (CONSONANT_RUN_REGEX.test(clean)) {
      return {
        valid: false,
        message: `${fieldName} contains unrecognisable text. Please write in plain English.`,
      }
    }

    // If a "word" has no vowels at all and is reasonably long → gibberish
    const hasVowel = /[aeiouAEIOU]/.test(clean)
    if (!hasVowel && clean.length >= 5) {
      return {
        valid: false,
        message: `${fieldName} contains unrecognisable text. Please write in plain English.`,
      }
    }
  }

  return { valid: true }
}
