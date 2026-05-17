import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

const BLOCKED_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'MegaIndex',
  'rogerbot',
  'Screaming Frog',
  'Baiduspider',
  'YandexBot',
  'DuckDuckBot',
  'SeznamBot',
  'Exabot',
  'facebookexternalhit',
  'Twitterbot',
  'Applebot',
  'Slackbot',
  'WhatsApp',
]

const CRAWLER_BOTS = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'GPTBot',
  'Claude-Web',
  'Applebot-Extended',
]

function isBlockedBot(userAgent: string): boolean {
  return BLOCKED_BOTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

function isCrawlerBot(userAgent: string): boolean {
  return CRAWLER_BOTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || ''

  if (isBlockedBot(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const isCrawler = isCrawlerBot(userAgent)

  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const response = NextResponse.next()

  if (isCrawler) {
    response.headers.set('X-Robots-Tag', 'index, follow')
  } else {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}