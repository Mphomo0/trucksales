/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import { Geist_Mono } from 'next/font/google'
import { auth } from '@/auth'

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardProvider } from '@/components/dashboard/DashboardContext'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session

  try {
    session = await auth()
  } catch {
    redirect('/login')
  }

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardProvider>
      <div className={`dashboard-shell ${geistMono.variable}`}>
        <DashboardSidebar />
        <div className="dashboard-body">
          {children}
        </div>
      </div>
    </DashboardProvider>
  )
}
