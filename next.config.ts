import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/mbk8n6mrn/**',
      },
    ],
  },
}

module.exports = nextConfig
