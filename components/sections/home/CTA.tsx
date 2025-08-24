import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-28 bg-gradient-to-r from-amber-600 to-yellow-300 text-accent-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Find Your Perfect Truck?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Let our expert team help you find the right commercial vehicle for
          your business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Contact Our Team</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-accent-foreground border-accent-foreground hover:bg-accent-foreground hover:text-accent"
          >
            <Link href="/sell-your-truck">Sell Your Truck</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
