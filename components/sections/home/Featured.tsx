import Link from 'next/link'
import dynamic from 'next/dynamic'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

const FeaturedMarquee = dynamic(() => import('./FeaturedMarquee'))

type FeaturedTruck = {
  id: string; name: string; make: string; model: string; year: number;
  vatPrice: number; mileage: number | null; fuelType: string | null;
  condition: string; transmission: string | null; slug: string;
  specialPrice: number | null; specialValidFrom: string | null; specialValidTo: string | null;
  thumbnail: { fileId?: string; url: string } | null;
}

const getFeaturedTrucks = unstable_cache(
  async (): Promise<FeaturedTruck[]> => {
    const vehicles = await prisma.inventory.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        vatPrice: true,
        mileage: true,
        fuelType: true,
        condition: true,
        transmission: true,
        slug: true,
        specialPrice: true,
        specialValidFrom: true,
        specialValidTo: true,
        images: true,
      },
    })

    return vehicles.map((v) => {
      const imgArray = Array.isArray(v.images) ? v.images : []
      return {
        id: v.id,
        name: v.name,
        make: v.make,
        model: v.model,
        year: v.year ?? 0,
        vatPrice: v.vatPrice ?? 0,
        mileage: v.mileage,
        fuelType: v.fuelType,
        condition: v.condition ?? '',
        transmission: v.transmission,
        slug: v.slug,
        specialPrice: v.specialPrice,
        specialValidFrom: v.specialValidFrom instanceof Date ? v.specialValidFrom.toISOString() : v.specialValidFrom ?? null,
        specialValidTo: v.specialValidTo instanceof Date ? v.specialValidTo.toISOString() : v.specialValidTo ?? null,
        thumbnail: (imgArray[0] as { fileId?: string; url: string } | undefined) ?? null,
      }
    })
  },
  ['featured-trucks'],
  { revalidate: 86400, tags: ['inventory'] }
)

export default async function Featured() {
  let trucks: FeaturedTruck[] = []

  try {
    trucks = await getFeaturedTrucks()
  } catch (error) {
    console.error('Featured vehicles fetch error:', error)
  }

  if (trucks.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600">
              Check out our most popular vehicles
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              No vehicles available at the moment. Please check back soon or{' '}
              <Link href="/inventory" className="text-amber-600 hover:underline">
                browse our full inventory
              </Link>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return <FeaturedMarquee trucks={trucks} />
}
