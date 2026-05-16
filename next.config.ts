import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // unoptimized: true, // Removed to enable Vercel's image optimization
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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://us.i.posthog.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://ik.imagekit.io https://img.youtube.com https://i.ytimg.com https://img.clerk.com; font-src 'self' data:; frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com; connect-src 'self' wss://us.i.posthog.com https://ik.imagekit.io https://api.imagekit.io https://us.i.posthog.com https://*.clerk.accounts.dev; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
        ],
      },
    ]
  },
}

export default nextConfig

module.exports = nextConfig
