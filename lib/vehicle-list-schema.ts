import { formatDisplayName } from './text'

export interface ListedVehicle {
  slug: string
  name: string
  make?: string | null
  mileage: number | null
  fuelType: string | null
  transmission: string | null
  vatPrice: number | null
  images: unknown
}

const SITE = 'https://www.a-ztrucksales.com'

/** ItemList of Vehicle/Offer entries for listing pages (inventory, tonnage). */
export function buildVehicleItemList(params: {
  id: string
  name: string
  vehicles: ListedVehicle[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': params.id,
    name: params.name,
    itemListElement: params.vehicles.map((truck, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/inventory/${truck.slug}`,
      item: {
        '@type': ['Vehicle', 'Product'],
        '@id': `${SITE}/inventory/${truck.slug}#product`,
        name: truck.name,
        url: `${SITE}/inventory/${truck.slug}`,
        image: (truck.images as { url: string }[] | null)?.[0]?.url,
        ...(truck.make && {
          brand: { '@type': 'Brand', name: formatDisplayName(truck.make) },
        }),
        ...(truck.mileage != null && {
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: truck.mileage,
            unitCode: 'KMT',
          },
        }),
        ...(truck.transmission && { vehicleTransmission: truck.transmission }),
        ...(truck.fuelType && { fuelType: truck.fuelType }),
        offers: {
          '@type': 'Offer',
          url: `${SITE}/inventory/${truck.slug}`,
          priceCurrency: 'ZAR',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/UsedCondition',
          seller: { '@id': `${SITE}/#org` },
          ...(truck.vatPrice != null && { price: truck.vatPrice }),
        },
      },
    })),
  }
}
