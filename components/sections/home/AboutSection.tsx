/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import Image from 'next/image'
import Link from 'next/link'

/* <h1>A-Z Truck Sales Components</h1> */ export default function AboutSection() {
  return (
    <section className="py-26 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Used Trucks for Sale in Gauteng and South Africa
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              A-Z Truck Sales is a Gauteng used truck dealer for businesses,
              fleet owners, contractors, logistics operators and owner-drivers
              looking for reliable commercial vehicles. From Alberton and
              Boksburg, A-Z Truck Sales helps buyers compare rigid trucks, body
              types, payload needs, mileage, condition, spares availability and
              roadworthy preparation before choosing a vehicle.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Whether you are searching for{' '}
              <Link href="/brands/isuzu" className="font-bold hover:underline"><strong>Isuzu trucks for sale in Gauteng</strong></Link>,{' '}
              <Link href="/brands/hino" className="font-bold hover:underline"><strong>Hino trucks for sale in Gauteng</strong></Link>,{' '}
              <Link href="/brands/mercedes-benz" className="font-bold hover:underline"><strong>Mercedes-Benz trucks in Gauteng</strong></Link>,{' '}
              <Link href="/brands/fuso" className="font-bold hover:underline"><strong>Fuso trucks for sale in South Africa</strong></Link>,{' '}
              <Link href="/brands/man" className="font-bold hover:underline"><strong>MAN trucks for sale in Gauteng</strong></Link>, or{' '}
              <Link href="/spares" className="font-bold hover:underline"><strong>truck spares in South Africa</strong></Link>, the best starting
              point is a dealer that understands both the truck and the work it
              needs to do.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">100+</div>
                <div className="text-gray-600">Trucks in Stock</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/images/dealer.webp"
              alt="Dealership Image"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg shadow-lg"

            />
          </div>
        </div>
      </div>
    </section>
  )
}
