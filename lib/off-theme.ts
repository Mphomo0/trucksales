/**
 * Stock that is not a truck: passenger cars, small bakkies and vans. These stay
 * visible to visitors but are kept out of the sitemap and marked noindex so
 * they don't dilute the site's focus on commercial trucks.
 */
const OFF_THEME_MODEL = /\b(golf|polo|np\s?200|np\s?300|hi-?rider|transit)\b/i

export function isOffThemeVehicle(vehicle: {
  make?: string | null
  model?: string | null
  name?: string | null
}): boolean {
  const text = `${vehicle.model ?? ''} ${vehicle.name ?? ''}`
  return OFF_THEME_MODEL.test(text)
}
