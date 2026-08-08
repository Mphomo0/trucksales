/**
 * Numbers whose spoken form opens on a vowel sound and so take "an".
 * Scoped to the leading number of a tonnage label ("8 to 9 Ton" -> "an"),
 * which in practice never exceeds two digits.
 */
const VOWEL_SOUND_NUMBERS = new Set([8, 11, 18])

/**
 * Picks "a" or "an" for a phrase, going by sound rather than spelling.
 * Handles the leading-number case that tonnage labels need — "an 8 to 9 Ton",
 * "a 10 to 18 Ton" — and falls back to a vowel-letter check for words.
 */
export function indefiniteArticle(phrase: string): 'a' | 'an' {
  const trimmed = phrase.trim()
  if (!trimmed) return 'a'

  const leadingNumber = trimmed.match(/^(\d+)/)
  if (leadingNumber) {
    return VOWEL_SOUND_NUMBERS.has(Number(leadingNumber[1])) ? 'an' : 'a'
  }

  return /^[aeiou]/i.test(trimmed) ? 'an' : 'a'
}

/** Prefixes a phrase with the correct indefinite article: "an 8 to 9 Ton". */
export function withIndefiniteArticle(phrase: string): string {
  return `${indefiniteArticle(phrase)} ${phrase}`
}
