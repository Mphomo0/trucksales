import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Programmatic client / scraper UA fragments — checked case-insensitively.
// Only GET requests to listing endpoints are blocked; POST (dashboard CRUD) is untouched.
const SCRAPER_UA_FRAGMENTS = [
  'python-requests',
  'go-http-client',
  'java/',
  'scrapy',
  'libwww-perl',
  'wget/',
  'curl/',
  'axios/',
  'okhttp',
  'ruby/',
  'php/',
  'postman',
  'insomnia',
  'httpx',
  'aiohttp',
  'urllib',
  'pycurl',
  'requests/',
  'httpclient',
  'apache-httpclient',
]

function isKnownScraper(ua: string): boolean {
  const lower = ua.toLowerCase()
  return SCRAPER_UA_FRAGMENTS.some((fragment) => lower.includes(fragment))
}

export const proxy = clerkMiddleware((_auth, request: NextRequest) => {
  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent') ?? ''

  // Block known scrapers from the public listing API endpoints (GET only)
  if (
    request.method === 'GET' &&
    isKnownScraper(ua) &&
    (pathname === '/api/vehicles' || pathname === '/api/spares')
  ) {
    return NextResponse.json(
      { error: 'Automated access not permitted' },
      { status: 403 },
    )
  }
})

export const config = {
  matcher: [
    // Run on everything except Next.js internals and static assets.
    // This gives Clerk the coverage it needs to provide auth() context
    // on /login, /dashboard/**, and all API routes.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
