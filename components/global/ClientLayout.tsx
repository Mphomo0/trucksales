'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'
import ClientToast from '@/components/global/ClientToast'
import dynamic from 'next/dynamic'
const ChatWidget = dynamic(
  () => import('@/components/chatbot/ChatWidget').then(m => ({ default: m.ChatWidget })),
  { ssr: false }
)

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
      <ClientToast />
    </>
  )
}
