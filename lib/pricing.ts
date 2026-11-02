import { isSpecialActive } from './specials'

export interface PriceInfo {
  currentPrice: number
  originalPrice: number
  isSpecial: boolean
  savings?: number
  campaign: string | null
}

export function getCurrentPrice(
  price: number,
  specialPrice: number | null,
  specialValidFrom: Date | string | null,
  specialValidTo: Date | string | null,
  campaign: string | null = null,
  now: Date = new Date()
): PriceInfo {
  if (
    specialPrice &&
    isSpecialActive({ specialPrice, specialValidFrom, specialValidTo }, now)
  ) {
    return {
      currentPrice: specialPrice,
      originalPrice: price,
      isSpecial: true,
      savings: price - specialPrice,
      campaign,
    }
  }

  return {
    currentPrice: price,
    originalPrice: price,
    isSpecial: false,
    campaign: null,
  }
}
