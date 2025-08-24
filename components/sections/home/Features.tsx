import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Shield, Wrench, Star } from 'lucide-react'

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose A-Z Truck Sales?
          </h2>
          <p className="text-lg text-gray-600">
            We&lsquo;re committed to the best Pre-Owned Truck buying experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <CardTitle>Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Each truck is thoroughly serviced and restored in-house before
                sale, ensuring top performance and reliability.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Wrench className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <CardTitle>Expert Service</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Our qualified technicians inspect, service, and restore each
                truck to ensure reliability you can count on.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <CardTitle>4.1-Star Reviews</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Our 4.1 customer rating reflects our commitment to quality and
                reliability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
