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

// Uppercase tokens that must stay uppercase when title-casing supplier/DB text.
const KEEP_UPPER = new Set([
  'UD', 'MAN', 'FAW', 'VW', 'ECU', 'PTO', 'ABS', 'LHD', 'RHD', 'EGR', 'LPG',
  'NPR', 'NQR', 'NKR', 'FTR', 'FSR', 'FVR', 'FRR', 'GVR', 'FM', 'FH', 'FE',
  'FC', 'FD', 'TD', 'GH', 'RF', 'SUV', 'GMC', 'BMW', 'DAF', 'TATA',
])
KEEP_UPPER.delete('TATA') // brand, not an acronym: "Tata"

function formatToken(token: string): string {
  if (/\d/.test(token)) return token.toUpperCase()
  const upper = token.toUpperCase()
  if (token.length <= 2 || KEEP_UPPER.has(upper)) return upper
  return upper.charAt(0) + upper.slice(1).toLowerCase()
}

/**
 * Title-cases lowercase or ALL CAPS stock text while keeping model codes and
 * acronyms upright: "ud kuzer rke150" -> "UD Kuzer RKE150", "faw 6-130fl" -> "FAW 6-130FL".
 */
export function formatDisplayName(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[A-Za-z0-9]+/g, formatToken)
}
