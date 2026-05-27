'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
