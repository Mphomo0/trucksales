import { isDemoMode } from '@/lib/black-friday'

/** Shown only on Vercel Preview with BLACK_FRIDAY_PREVIEW=1: prices are pretend. */
export default function PreviewPill() {
  if (!isDemoMode()) return null
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-lg ring-2 ring-white">
      Preview: sample prices
    </div>
  )
}
