import { describe, expect, it } from 'vitest'
import { isOffThemeVehicle } from './off-theme'

describe('isOffThemeVehicle', () => {
  it('flags passenger cars, bakkies and vans', () => {
    expect(isOffThemeVehicle({ model: 'Golf 5 2.0' })).toBe(true)
    expect(isOffThemeVehicle({ model: 'NP300 2.5TDi Hirider DC' })).toBe(true)
    expect(isOffThemeVehicle({ model: 'NP200 1.5 CDi (Aircon) Safety Pack' })).toBe(true)
    expect(isOffThemeVehicle({ model: 'Transit 2.2TDCi' })).toBe(true)
  })

  it('keeps real trucks', () => {
    expect(isOffThemeVehicle({ model: '17-250', make: 'VW' })).toBe(false)
    expect(isOffThemeVehicle({ model: 'UD40L', make: 'Nissan' })).toBe(false)
    expect(isOffThemeVehicle({ model: 'Dyna 150', make: 'Toyota' })).toBe(false)
    expect(isOffThemeVehicle({ model: 'NPR400' })).toBe(false)
  })
})
