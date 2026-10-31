import { describe, expect, it } from 'vitest'
import { spareSchema, vehicleSchema } from './schemas'

const image = { url: 'https://example.com/a.jpg', fileId: 'file-1' }

const baseVehicle = {
  name: 'Hino 500',
  make: 'Hino',
  model: '500',
  year: 2020,
  vatPrice: 500000,
  pricenoVat: 434783,
  mileage: 100000,
  fuelType: 'Diesel',
  condition: 'Used',
  transmission: 'Manual',
  description: 'Good truck',
  registrationNo: 'ABC123GP',
  bodyType: 'Dropside',
  truckSize: '8 ton',
  images: [image],
}

const baseSpare = {
  name: 'Brake pad',
  make: 'Hino',
  price: 1000,
  noVatPrice: 870,
  condition: 'New',
  category: 'Brakes',
  description: 'Brake pad set',
  images: [image],
}

describe('vehicleSchema', () => {
  it("accepts specialCampaign 'black-friday'", () => {
    const result = vehicleSchema.safeParse({
      ...baseVehicle,
      specialCampaign: 'black-friday',
    })
    expect(result.success).toBe(true)
    expect(result.data?.specialCampaign).toBe('black-friday')
  })

  it('accepts null and omitted', () => {
    expect(
      vehicleSchema.safeParse({ ...baseVehicle, specialCampaign: null })
        .success,
    ).toBe(true)
    expect(vehicleSchema.safeParse(baseVehicle).success).toBe(true)
  })

  it('rejects any other string', () => {
    expect(
      vehicleSchema.safeParse({ ...baseVehicle, specialCampaign: 'christmas' })
        .success,
    ).toBe(false)
  })
})

describe('spareSchema', () => {
  it("accepts specialCampaign 'black-friday'", () => {
    const result = spareSchema.safeParse({
      ...baseSpare,
      specialCampaign: 'black-friday',
    })
    expect(result.success).toBe(true)
    expect(result.data?.specialCampaign).toBe('black-friday')
  })

  it('accepts null and omitted', () => {
    expect(
      spareSchema.safeParse({ ...baseSpare, specialCampaign: null }).success,
    ).toBe(true)
    expect(spareSchema.safeParse(baseSpare).success).toBe(true)
  })

  it('rejects any other string', () => {
    expect(
      spareSchema.safeParse({ ...baseSpare, specialCampaign: 'christmas' })
        .success,
    ).toBe(false)
  })
})
