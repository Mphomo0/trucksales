import { cn } from '@/lib/utils'

export default function BlackFridayTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded bg-amber-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-950',
        className
      )}
    >
      Black Friday
    </span>
  )
}
