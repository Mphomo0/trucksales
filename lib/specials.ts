/**
 * Single definition of "this special is live", shared by the /specials listing
 * and the /specials/[slug] detail page so the two can never disagree.
 * A vehicle special needs both dates and a positive price, and now must fall
 * inside the window. A stored date at exactly 00:00:00.000Z is date-only and is
 * read as a South African (UTC+2) calendar day: the start opens at 00:00 SAST
 * and the end runs to 23:59:59.999 SAST. Any value with a time of day is literal.
 */
export const SPECIALS_REVALIDATE_SECONDS = 3600

type SpecialWindow = {
  specialPrice?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

const SAST_OFFSET_MS = 2 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

function isDateOnly(d: Date): boolean {
  return (
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  )
}

/** First instant a special is live: date-only values open at 00:00 SAST. */
export function specialStartsAt(from: Date | string): Date {
  const d = new Date(from)
  return isDateOnly(d) ? new Date(d.getTime() - SAST_OFFSET_MS) : d
}

/** Last instant a special is live: date-only values run to 23:59:59.999 SAST. */
export function specialEndsAt(to: Date | string): Date {
  const d = new Date(to)
  return isDateOnly(d) ? new Date(d.getTime() + DAY_MS - SAST_OFFSET_MS - 1) : d
}

export function isSpecialActive(
  special: SpecialWindow,
  now: Date = new Date(),
): boolean {
  const { specialPrice, specialValidFrom, specialValidTo } = special
  if (!specialPrice || specialPrice <= 0) return false
  if (!specialValidFrom || !specialValidTo) return false
  return now >= specialStartsAt(specialValidFrom) && now <= specialEndsAt(specialValidTo)
}

/**
 * Widened pre-filter: includes every row isSpecialActive could accept
 * (date-only starts up to 2h ahead, date-only ends up to 22h behind).
 * Callers must post-filter with isSpecialActive.
 */
function activeSpecialDateWhere(now: Date) {
  return {
    specialValidFrom: { not: null, lte: new Date(now.getTime() + SAST_OFFSET_MS) },
    specialValidTo: {
      not: null,
      gte: new Date(now.getTime() - (DAY_MS - SAST_OFFSET_MS)),
    },
  }
}

/** Prisma pre-filter for vehicle specials; post-filter with isSpecialActive. */
export function activeVehicleSpecialWhere(now: Date = new Date()) {
  return {
    specialPrice: { gt: 0 },
    ...activeSpecialDateWhere(now),
  }
}

/** Prisma pre-filter for spare specials; post-filter with isSpecialActive. */
export function activeSpareSpecialWhere(now: Date = new Date()) {
  return {
    specialPrice: { gt: 0 },
    ...activeSpecialDateWhere(now),
  }
}
