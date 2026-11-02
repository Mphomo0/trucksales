export type SpecialsFilter =
  | { kind: 'all' }
  | { kind: 'trucks' }
  | { kind: 'spares' }
  | { kind: 'bodyType'; value: string }

/** Fired on window after the chat widget pushes a new ?type on /specials. */
export const SPECIALS_TYPE_CHANGE_EVENT = 'specials:type-change'

export function parseTypeParam(value: string | null | undefined): SpecialsFilter {
  if (value === 'trucks') return { kind: 'trucks' }
  if (value === 'spares') return { kind: 'spares' }
  return { kind: 'all' }
}

const norm = (s: string) => s.trim().toLowerCase()

export function filterSpecials<
  V extends { bodyType?: string | null },
  S,
>(vehicles: V[], spares: S[], filter: SpecialsFilter): { vehicles: V[]; spares: S[] } {
  switch (filter.kind) {
    case 'trucks':
      return { vehicles, spares: [] }
    case 'spares':
      return { vehicles: [], spares }
    case 'bodyType': {
      const target = norm(filter.value)
      return {
        vehicles: vehicles.filter((v) => !!v.bodyType && norm(v.bodyType) === target),
        spares: [],
      }
    }
    default:
      return { vehicles, spares }
  }
}

/** Distinct non-empty body types (case-insensitive, first spelling kept), sorted. */
export function getBodyTypes(vehicles: { bodyType?: string | null }[]): string[] {
  const seen = new Map<string, string>()
  for (const v of vehicles) {
    const raw = v.bodyType?.trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    if (!seen.has(key)) seen.set(key, raw)
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}
