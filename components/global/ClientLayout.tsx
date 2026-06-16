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
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
      <ClientToast />
    </>
  )
}
