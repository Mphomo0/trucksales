import { formatEndDayMonth } from '@/lib/black-friday'

const DEFAULT_WELCOME =
  "Hi, I'm the A-Z Truck Sales assistant.\n\nI can help you find available trucks, answer vehicle questions, and help you contact our sales team."

const BLACK_FRIDAY_WELCOME = `Hi, I'm the A-Z Truck Sales assistant.\n\nBlack November deals are live until ${formatEndDayMonth()}. What kind of truck are you looking for?`

/** The chat widget's opening assistant message. */
export function getWelcomeMessage(blackFridayLive: boolean): {
  role: 'assistant'
  message: string
} {
  return {
    role: 'assistant',
    message: blackFridayLive ? BLACK_FRIDAY_WELCOME : DEFAULT_WELCOME,
  }
}

/** Navigation links shown under the Black Friday greeting. */
export const BLACK_FRIDAY_CHAT_LINKS: readonly { label: string; href: string }[] = [
  { label: 'Trucks', href: '/specials?type=trucks' },
  { label: 'Spares', href: '/specials?type=spares' },
  { label: 'Show all deals', href: '/specials' },
]
