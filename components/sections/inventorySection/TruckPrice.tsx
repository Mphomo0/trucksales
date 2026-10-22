'use client'

import { getCurrentPrice } from '@/lib/pricing'
import { formatNumber } from '@/lib/format'

interface TruckPriceProps {
  vatPrice: number
  pricenoVat: number
  specialPrice: number | null
  specialValidFrom: Date | string | null
  specialValidTo: Date | string | null
}

const validUntilFormat = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Africa/Johannesburg',
})

/**
 * Kept on the client so an expired special stops showing as soon as it ends,
 * rather than when the page next revalidates (once a day).
 */
export default function TruckPrice({
  vatPrice,
  pricenoVat,
  specialPrice,
  specialValidFrom,
  specialValidTo,
}: TruckPriceProps) {
  const priceInfo = getCurrentPrice(vatPrice, specialPrice, specialValidFrom, specialValidTo)
  const validUntil = specialValidTo ? validUntilFormat.format(new Date(specialValidTo)) : null

  return (
    <div className="text-center tabular-nums">
      {priceInfo.isSpecial ? (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-red-500 line-through">
            R{formatNumber(vatPrice)}
          </span>
          <span className="text-3xl font-bold text-amber-600">
            R{formatNumber(priceInfo.currentPrice)}
          </span>
          {validUntil && (
            <span className="text-sm text-gray-500">Valid until {validUntil}</span>
          )}
        </div>
      ) : (
        <div className="text-3xl font-bold text-amber-600 mb-2">R{formatNumber(vatPrice)}</div>
      )}
      <p className="text-gray-600">R{formatNumber(pricenoVat)} excl. VAT</p>
    </div>
  )
}
