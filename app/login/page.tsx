/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  title: 'Login | Dashboard Access | A-Z Truck Sales',
  description: 'Secure login for A-Z Truck Sales administrative dashboard.',
  robots: { index: false, follow: false },
}

export default async function Login() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <>
      <h1 className="sr-only">Login to A-Z Truck Sales</h1>
      <GeoHints />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-md rounded-lg',
              footer: 'hidden',
            },
          }}
          routing="hash"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </>
  )
}
