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
  'SeznamBot',
  'Exabot',
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
]

const CRAWLER_BOTS = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'Claude-Web',
  'Applebot-Extended',
  'facebookexternalhit',
  'Twitterbot',
  'Applebot',
  'Slackbot',
  'WhatsApp',
  'LinkedInBot',
]

function getBotType(userAgent: string): 'blocked' | 'crawler' | 'human' {
  const ua = userAgent.toLowerCase()
  if (BLOCKED_BOTS.some((bot) => ua.includes(bot.toLowerCase())))
    return 'blocked'
  if (CRAWLER_BOTS.some((bot) => ua.includes(bot.toLowerCase())))
    return 'crawler'
  return 'human'
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || ''
  const botType = getBotType(userAgent)

  if (botType === 'blocked') {
    return new NextResponse(null, { status: 403 })
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  if (botType === 'crawler') {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'index, follow')
    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)).*)',
    '/(api|trpc)(.*)',
  ],
}
