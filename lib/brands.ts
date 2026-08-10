/**
 * Brand landing routes and the term each one matches against `inventory.make`.
 *
 * Stored make values are inconsistent — "UD" and "ud", "fuso" and "FUSO",
 * "mercedes benz" without the hyphen — so brand pages match with a
 * case-insensitive `contains` rather than an equality check.
 */
export const BRAND_ROUTES = [
  { slug: 'isuzu', match: 'Isuzu', label: 'Isuzu' },
  { slug: 'hino', match: 'Hino', label: 'Hino' },
  { slug: 'fuso', match: 'Fuso', label: 'Fuso' },
  { slug: 'ud-trucks', match: 'UD', label: 'UD' },
  { slug: 'man', match: 'MAN', label: 'MAN' },
  { slug: 'mercedes-benz', match: 'Mercedes', label: 'Mercedes-Benz' },
  { slug: 'tata', match: 'Tata', label: 'Tata' },
  { slug: 'toyota', match: 'Toyota', label: 'Toyota' },
  { slug: 'hyundai', match: 'Hyundai', label: 'Hyundai' },
] as const

export type BrandRoute = (typeof BRAND_ROUTES)[number]

/**
 * Resolves the brand landing page for an inventory record's `make`.
 * Mirrors the case-insensitive `contains` match each /brands/[slug] page
 * already uses to query its own stock, so a vehicle links to exactly the
 * brand page that would list it. Returns undefined for makes with no
 * brand page (Nissan, Volkswagen, Ford — no dedicated landing page exists).
 */
export function getBrandRouteByMake(make: string | null | undefined) {
  if (!make) return undefined
  const lower = make.toLowerCase()
  return BRAND_ROUTES.find((b) => lower.includes(b.match.toLowerCase()))
}
