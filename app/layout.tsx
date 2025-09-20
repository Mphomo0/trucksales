import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from 'next-auth/react'
import GlobalWhatsAppButton from '@/components/global/GlobalWhatsAppButton'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'
import { PostHogProvider } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'A&ndash;Z Truck Sales | Quality Used Commercial Vehicles in Gauteng',
  description:
    'A&ndash;Z Truck Sales are your commercial vehicle specialists in Alberton North, Gauteng. With over 20 years of experience, we sell and restore quality used rigid trucks (1.5&ndash;16 ton), backed by full workshop servicing. Browse our current inventory and find your next truck today.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <PostHogProvider>
            <Navbar />
            {children}
            <ToastContainer />
            <Footer />
            <GlobalWhatsAppButton />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
