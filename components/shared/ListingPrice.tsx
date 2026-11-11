import BlackFridayTag from '@/components/shared/BlackFridayTag'
import { formatNumber } from '@/lib/format'
import { getCurrentPrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export interface ListingPriceFields {
  vatPrice: number | null
  specialPrice?: number | null
  specialValidFrom?: Date | string | null
  specialValidTo?: Date | string | null
  specialCampaign?: string | null
}

/** Prisma select fragment so every listing query asks for the same fields. */
export const listingPriceSelect = {
  vatPrice: true,
  specialPrice: true,
  specialValidFrom: true,
  specialValidTo: true,
  specialCampaign: true,
} as const

interface Props {
  truck: ListingPriceFields
  /** Show the "Black November" tag above a campaign price. */
  showTag?: boolean
  className?: string
  compact?: boolean
}

/**
 * Price line for listing cards (brand, tonnage, related trucks).
 * Evaluated at render time, so it honours the special's dates.
 */
export default function ListingPrice({
  truck,
  showTag = true,
  className,
  compact = false,
}: Props) {
  if (!truck.vatPrice) {
    return (
      <p className={cn('font-bold text-amber-600', className)}>Call for price</p>
    )
  }

  const info = getCurrentPrice(
    truck.vatPrice,
    truck.specialPrice ?? null,
    truck.specialValidFrom ?? null,
    truck.specialValidTo ?? null,
    truck.specialCampaign ?? null,
  )

  if (!info.isSpecial) {
    return (
      <p className={cn('font-bold text-amber-600', className)}>
        R{formatNumber(truck.vatPrice)}
        <span className="ml-1 text-xs font-normal text-gray-500">incl. VAT</span>
      </p>
    )
  }

  const saving = info.originalPrice - info.currentPrice

  return (
    <div className={cn('tabular-nums', className)}>
      {showTag && info.campaign === 'black-friday' && (
        <BlackFridayTag className="mb-1" />
      )}
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            'text-red-500 line-through',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          R{formatNumber(info.originalPrice)}
        </span>
        <span className="font-bold text-amber-600">
          R{formatNumber(info.currentPrice)}
          <span className="ml-1 text-xs font-normal text-gray-500">incl. VAT</span>
        </span>
      </p>
      {saving > 0 && (
        <p className="text-xs font-bold text-red-600">
          Save R{formatNumber(saving)}
        </p>
      )}
    </div>
  )
}
