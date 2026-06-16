/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import dynamic from 'next/dynamic'
const AnalyticsDashboard = dynamic(
  () => import('@/components/global/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500">Loading analytics...</div>,
  }
)
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

/* application/ld+json */ export default async function Dashboard() {
  return (
    <>
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back — here's what's happening on your site"
      />
      <div className="dashboard-main">
        <AnalyticsDashboard />
      </div>
    </>
  )
}
