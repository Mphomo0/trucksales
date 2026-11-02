import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/format'
import { ikCard, ikHero } from '@/lib/imagekit'
import { formatDisplayName } from '@/lib/text'
import { formatEndShort } from '@/lib/black-friday'
import type { BlackFridayDeals, DealVehicle } from '@/lib/black-friday'

const SITE = 'https://www.a-ztrucksales.com'

function truckLabel(v: DealVehicle): string {
  return `${v.year} ${formatDisplayName(v.make)} ${formatDisplayName(v.model)}`
}

function firstImageUrl(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null
  const first = images[0] as { url?: unknown } | null
  return first && typeof first.url === 'string' && first.url ? first.url : null
}

function NoImage({ className }: { className: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center bg-gray-200 text-sm text-gray-700`}
    >
      No Image Available
    </div>
  )
}

export default function BlackFridayHero({
  deals,
}: {
  deals: BlackFridayDeals
}) {
  const featured = deals.featured
  if (!featured) return null

  const name = truckLabel(featured)
  const wasPrice = featured.vatPrice
  const nowPrice = featured.specialPrice ?? featured.vatPrice
  const saving = wasPrice - nowPrice
  const photo = firstImageUrl(featured.images)
  const remaining = deals.count - 1 - deals.more.length
  const more = deals.more.slice(0, 3)

  const whatsappText = `Hello, I'm interested in the Black November deal on the ${name}: ${SITE}/inventory/${featured.slug}`
  const whatsappHref = `https://wa.me/27781277393?text=${encodeURIComponent(whatsappText)}`

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-[#1c1007] to-[#3b1d08] text-white"
      aria-label="Black November deals"
    >
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-6">
        <h1 className="mb-4 text-lg font-bold leading-tight text-gray-200 sm:text-xl">
          Used Trucks for Sale in Gauteng
        </h1>

        <div className="flex flex-col items-stretch gap-6 pb-6 md:flex-row md:items-center md:gap-8 lg:gap-10">
          <Link
            href={`/inventory/${featured.slug}`}
            prefetch={false}
            aria-label={`View ${name}`}
            className="relative block aspect-3/2 w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1007] md:aspect-auto md:h-64 md:flex-[1.1] lg:h-72"
          >
            {photo ? (
              <Image
                src={ikHero(photo)}
                alt={name}
                fill
                priority
                sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <NoImage className="h-full w-full" />
            )}
            <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-extrabold tracking-wider text-gray-950">
              BLACK NOVEMBER
            </span>
          </Link>

          <div className="md:flex-1">
            <p className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-gray-950 sm:text-sm">
              Black November · prices valid until {formatEndShort()}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
              <Link
                href={`/inventory/${featured.slug}`}
                prefetch={false}
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {name}
              </Link>
            </h2>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2 tabular-nums">
              <span className="text-lg text-gray-300 line-through">
                R{formatNumber(wasPrice)}
              </span>
              <span className="text-4xl font-black text-amber-400 sm:text-5xl">
                R{formatNumber(nowPrice)}
              </span>
              {saving > 0 && (
                <span className="rounded-md bg-red-600 px-2.5 py-1 text-sm font-bold text-white">
                  {`Save R ${formatNumber(saving)}`}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-300">incl. VAT</p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-amber-500 p-6 text-base font-bold text-gray-950 hover:bg-amber-400 sm:w-auto"
              >
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enquire on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white bg-transparent p-6 text-base text-white hover:bg-white hover:text-black sm:w-auto"
              >
                <a href="tel:+27119026071">Call Us Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {(more.length > 0 || remaining > 0) && (
        <div className="border-t border-white/15 bg-black/45">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 md:w-24 md:flex-none">
              More deals
            </h2>
            <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((v) => {
                const thumb = firstImageUrl(v.images)
                const label = truckLabel(v)
                return (
                  <li key={v.id} className="min-w-0">
                    <Link
                      href={`/inventory/${v.slug}`}
                      prefetch={false}
                      className="flex h-full items-center gap-3 overflow-hidden rounded-lg bg-white text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <div className="relative h-16 w-24 flex-none">
                        {thumb ? (
                          <Image
                            src={ikCard(thumb)}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <NoImage className="h-full w-full text-xs" />
                        )}
                      </div>
                      <div className="min-w-0 py-2 pr-3">
                        <p className="line-clamp-2 text-sm font-bold leading-tight">{label}</p>
                        <p className="text-base font-black tabular-nums">
                          R{formatNumber(v.specialPrice ?? v.vatPrice)}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
              {remaining > 0 && (
                <li className="min-w-0">
                  <Link
                    href="/specials"
                    className="flex h-full min-h-16 items-center justify-center rounded-lg border border-dashed border-white/60 bg-white/10 px-3 py-3 text-sm font-bold hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    {`+ ${remaining} more deals →`}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
