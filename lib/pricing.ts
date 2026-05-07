export interface PriceInfo {
  currentPrice: number
  originalPrice: number
  isSpecial: boolean
  savings?: number
}

export function getCurrentPrice(
  price: number,
  specialPrice: number | null,
  specialValidFrom: Date | string | null,
  specialValidTo: Date | string | null
): PriceInfo {
  const now = new Date()
  const to = specialValidTo ? new Date(specialValidTo) : null

  const hasSpecialPrice = specialPrice && specialPrice > 0
  const isExpired = to && now > to

  if (hasSpecialPrice && !isExpired) {
    return {
      currentPrice: specialPrice,
      originalPrice: price,
      isSpecial: true,
      savings: price - specialPrice,
    }
  }

  return {
    currentPrice: price,
    originalPrice: price,
    isSpecial: false,
  }
}