/**
 * Spares come from supplier stock lists in ALL CAPS ("NISSAN UD90 CENTRE PORTION").
 * These helpers turn that into readable names, titles and descriptions
 * without touching the stored data.
 */

// Uppercase tokens that must stay uppercase when title-casing (engine/model codes
// with digits are handled separately).
const KEEP_UPPER = new Set([
  'UD', 'MAN', 'FAW', 'VW', 'ECU', 'PTO', 'ABS', 'LHD', 'RHD', 'EGR', 'LPG',
  'NPR', 'NQR', 'NKR', 'FTR', 'FSR', 'FVR', 'FRR', 'GVR', 'FM', 'FH', 'FE',
  'FC', 'FD', 'TD', 'GH', 'RF', 'SUV', 'CAB',
])

// "CAB" is a word on spares ("Cab") rather than a code; keep it readable.
KEEP_UPPER.delete('CAB')

function formatToken(token: string): string {
  if (/\d/.test(token)) return token.toUpperCase()
  const upper = token.toUpperCase()
  if (token.length <= 2 || KEEP_UPPER.has(upper)) return upper
  return upper.charAt(0) + upper.slice(1).toLowerCase()
}

/** "NISSAN / UD FD46 ENGINE" -> "Nissan / UD FD46 Engine" */
export function formatSpareName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[A-Za-z0-9]+/g, formatToken)
}

/** "ud" -> "UD", "isuzu" -> "Isuzu" */
export function formatMake(make: string): string {
  return formatSpareName(make)
}

/** Shorten at a word boundary so titles never end mid-word or in "...". */
export function fitToLength(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max + 1)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : text.slice(0, max)
  return trimmed.replace(/[\s,/|\-–]+$/, '')
}

// Layout template appends " | A-Z Truck Sales" (17 chars); keep page portion <= 43.
const TITLE_MAX = 43

export function buildSpareTitle(name: string): string {
  const formatted = formatSpareName(name)
  const withIntent = `Used ${formatted} for Sale`
  if (withIntent.length <= TITLE_MAX) return withIntent
  return fitToLength(`Used ${formatted}`, TITLE_MAX)
}

export function buildSpareDescription(spare: {
  name: string
  make: string
  condition: string
}): string {
  const name = formatSpareName(spare.name)
  const make = formatMake(spare.make)
  const condition = spare.condition.toLowerCase()
  const text = `${name}: ${condition} part for ${make} trucks, inspected before sale. Available from A-Z Truck Sales in Alberton and Boksburg, Gauteng.`
  return fitToLength(text, 158)
}
