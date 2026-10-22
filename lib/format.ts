// Prices and mileage render on the server and again during hydration, so the
// format must not depend on the visitor's browser locale. Bare toLocaleString()
// printed "1,234,567" on the server and "1 234 567" in South African browsers.
const wholeNumber = new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 })

/**
 * Formats a whole number the South African way ("1 234 567"). ICU builds differ
 * on the grouping space (U+00A0 vs U+202F), so it is pinned to a no-break space
 * to keep server and client output identical. Returns null for null/undefined.
 */
export function formatNumber(value: number): string
export function formatNumber(value: number | null | undefined): string | null
export function formatNumber(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null
  return wholeNumber.format(value).replace(/[  ]/g, ' ')
}
