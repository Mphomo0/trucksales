/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import Loginform from '@/components/global/Loginform'
import { Metadata } from 'next'
import GeoHints from '@/components/global/GeoHints'

export const metadata: Metadata = {
  title: 'Login | Dashboard Access | A-Z Truck Sales',
  description: 'Secure login for A-Z Truck Sales administrative dashboard.',
  robots: { index: false, follow: false },
}

/* application/ld+json */ export default function Login() {
  return (
    <>
      <h1 className="sr-only">Login to A-Z Truck Sales</h1>
      <GeoHints />
      <Loginform />
    </>
  )
}
