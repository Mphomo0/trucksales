import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://us.i.posthog.com https://us-assets.i.posthog.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://ik.imagekit.io https://img.youtube.com https://i.ytimg.com https://img.clerk.com https://www.google.com https://maps.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://www.youtube.com https://www.google.com https://maps.google.com https://challenges.cloudflare.com; connect-src 'self' wss://us.i.posthog.com https://ik.imagekit.io https://api.imagekit.io https://us.i.posthog.com https://us-assets.i.posthog.com https://*.clerk.accounts.dev https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
        ],
      },
      {
        source: '/inventory(.*)',
        headers: [
          { key: 'Cache-Control', 'value': 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/spares(.*)',
        headers: [
          { key: 'Cache-Control', 'value': 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/specials(.*)',
        headers: [
          { key: 'Cache-Control', 'value': 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

export default nextConfig

module.exports = nextConfig
