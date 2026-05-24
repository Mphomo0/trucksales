import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import FeaturedMarquee from './FeaturedMarquee'

export default async function Featured() {
  let trucks: any[] = []

  try {
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

    trucks = vehicles.map((v) => {
      const imgArray = Array.isArray(v.images) ? v.images : []
      return {
        id: v.id,
        name: v.name,
        make: v.make,
        model: v.model,
        year: v.year,
        vatPrice: v.vatPrice,
        mileage: v.mileage,
        fuelType: v.fuelType,
        condition: v.condition,
        transmission: v.transmission,
        slug: v.slug,
        specialPrice: v.specialPrice,
        specialValidFrom: v.specialValidFrom,
        specialValidTo: v.specialValidTo,
        thumbnail: (imgArray[0] as any) ?? null,
      }
    })
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
