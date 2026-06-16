/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AnalyticsDashboardClient } from '@/components/dashboard/AnalyticsDashboardClient'

/* application/ld+json */ export default async function Dashboard() {
  return (
    <>
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back — here's what's happening on your site"
      />
      <div className="dashboard-main">
        <AnalyticsDashboardClient />
      </div>
    </>
  )
}
