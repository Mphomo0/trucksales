import Link from 'next/link'
import { getBlackFridayDeals } from '@/lib/black-friday-deals'
import { formatEndLong, shouldShowBlackFriday } from '@/lib/black-friday'

/** Pure presentation: the slim announcement bar above the header. */
export function BlackFridayBarView() {
  return (
    <div className="bg-black px-4 py-2 text-center text-[13px] leading-5 text-white sm:text-sm">
      <p className="mx-auto max-w-7xl">
        <span className="font-bold tracking-widest text-amber-400">BLACK NOVEMBER</span>
        <span aria-hidden="true"> · </span>
        <span>Prices valid until {formatEndLong()}</span>
        <span aria-hidden="true"> · </span>
        <Link
          href="/specials"
          prefetch={false}
          className="whitespace-nowrap font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          See all deals →
        </Link>
      </p>
    </div>
  )
}

/** Server wrapper: renders the bar only while the campaign is live. */
export default async function BlackFridayBar() {
  const deals = await getBlackFridayDeals()
  return shouldShowBlackFriday(deals) ? <BlackFridayBarView /> : null
}
