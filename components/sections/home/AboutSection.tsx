import Image from 'next/image'

export default function AboutSection() {
  return (
    <section className="py-26 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About A-Z Truck Sales
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We are the commercial vehicle Specialists. We have over 25 years
              experience in selling quality previously owned commercial
              vehicles. We specialize in rigid trucks from 1.5 ton to 18 ton and
              source only the best stock that we can lay our hands on. We have a
              complete workshop where we service and restore our vehicles before
              putting them up for sale.
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
              src="/images/workshop.webp"
              alt="Dealership Image"
              width={500}
              height={400}
              className="w-full h-full rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
