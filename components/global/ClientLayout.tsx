'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'
import dynamic from 'next/dynamic'
import { afterLoadIdle } from '@/lib/after-load'

// Neither is needed for first paint: the chat bubble is opt-in and toasts only
// appear after a form action (react-toastify queues any toast fired before the
// container mounts). Fetch them once the page has loaded and gone idle.
const ChatWidget = dynamic(
  () => import('@/components/chatbot/ChatWidget').then(m => ({ default: m.ChatWidget })),
  { ssr: false }
)
const ClientToast = dynamic(() => import('@/components/global/ClientToast'), {
  ssr: false,
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const [secondaryReady, setSecondaryReady] = useState(false)

  useEffect(() => afterLoadIdle(() => setSecondaryReady(true)), [])

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
      {secondaryReady && (
        <>
          <ChatWidget />
          <ClientToast />
        </>
      )}
    </>
  )
}
