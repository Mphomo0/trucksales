import { describe, expect, it } from 'vitest'
import {
  isDefaultInventoryQuery,
  readInventoryQuery,
  toVehicleApiParams,
  updateInventorySearch,
} from './inventory-query'

const options = {
  makes: ['Isuzu', 'Hino'],
  models: ['NPR 400', 'Dutro'],
  bodyTypes: ['Dropside Truck'],
  truckSizes: ['3 to 5 Ton'],
}

describe('readInventoryQuery', () => {
  it('defaults to the first unfiltered page', () => {
    const query = readInventoryQuery(new URLSearchParams(''), options)
    expect(isDefaultInventoryQuery(query)).toBe(true)
  })

  it('matches filter values to stored options case-insensitively', () => {
    const query = readInventoryQuery(
      new URLSearchParams('make=isuzu&size=3%20to%205%20ton'),
      options,
    )
    expect(query.make).toBe('Isuzu')
    expect(query.truckSize).toBe('3 to 5 Ton')
    expect(isDefaultInventoryQuery(query)).toBe(false)
  })

  it('ignores invalid page and limit values', () => {
    const query = readInventoryQuery(new URLSearchParams('page=-2&limit=999'))
    expect(query.page).toBe(1)
    expect(query.limit).toBe(25)
  })
})

describe('updateInventorySearch', () => {
  it('resets to page 1 when a filter changes', () => {
    expect(updateInventorySearch('page=3&make=Hino', { bodyType: 'Dropside Truck' })).toBe(
      'make=Hino&bodyType=Dropside+Truck',
    )
  })

  it('keeps the page when the page itself changes', () => {
    expect(updateInventorySearch('make=Hino', { page: 2 })).toBe('make=Hino&page=2')
  })

  it('clears the model when the make changes', () => {
    expect(updateInventorySearch('make=Hino&model=Dutro', { make: 'Isuzu' })).toBe('make=Isuzu')
  })

  it('drops default values and keeps unrelated params', () => {
    expect(updateInventorySearch('utm_source=fb&make=Hino', { make: 'all', search: '' })).toBe(
      'utm_source=fb',
    )
  })
})

describe('toVehicleApiParams', () => {
  it('maps the query to the API parameter names', () => {
    const query = readInventoryQuery(new URLSearchParams('size=3%20to%205%20Ton&page=2'))
    expect(toVehicleApiParams(query).toString()).toBe(
      'page=2&limit=25&truckSize=3+to+5+Ton',
    )
  })
})
