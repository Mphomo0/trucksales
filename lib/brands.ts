/**
 * Brand landing routes and the term each one matches against `inventory.make`.
 *
 * Stored make values are inconsistent — "UD" and "ud", "fuso" and "FUSO",
 * "mercedes benz" without the hyphen — so brand pages match with a
 * case-insensitive `contains` rather than an equality check.
 */
export const BRAND_ROUTES = [
  { slug: 'isuzu', match: 'Isuzu' },
  { slug: 'hino', match: 'Hino' },
  { slug: 'fuso', match: 'Fuso' },
  { slug: 'ud-trucks', match: 'UD' },
  { slug: 'man', match: 'MAN' },
  { slug: 'mercedes-benz', match: 'Mercedes' },
  { slug: 'tata', match: 'Tata' },
  { slug: 'toyota', match: 'Toyota' },
  { slug: 'hyundai', match: 'Hyundai' },
] as const

export type BrandRoute = (typeof BRAND_ROUTES)[number]
