/**
 * Single definition of "this special is live", shared by the /specials listing
 * and the /specials/[slug] detail page so the two can never disagree.
 * A vehicle special needs both dates and a positive price, and now must fall
 * inside the window.
 */
export const SPECIALS_REVALIDATE_SECONDS = 3600

type SpecialWindow = {
  specialPrice?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
}

export function isSpecialActive(
  special: SpecialWindow,
  now: Date = new Date(),
): boolean {
  const { specialPrice, specialValidFrom, specialValidTo } = special
  if (!specialPrice || specialPrice <= 0) return false
  if (!specialValidFrom || !specialValidTo) return false
  return now >= new Date(specialValidFrom) && now <= new Date(specialValidTo)
}

/** Prisma `where` equivalent of isSpecialActive for vehicle specials. */
export function activeVehicleSpecialWhere(now: Date = new Date()) {
  return {
    specialPrice: { gt: 0 },
    specialValidFrom: { not: null, lte: now },
    specialValidTo: { not: null, gte: now },
  }
}
