/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import { AnalyticsDashboard } from '@/components/global/AnalyticsDashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ExportButton } from '@/components/dashboard/ExportButton'
import GeoHints from '@/components/global/GeoHints'

/* application/ld+json */ export default async function Dashboard() {
  return (
    <>
      <h1 className="sr-only">Dashboard Overview</h1>
      <GeoHints />
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back — here's what's happening on your site"
      />
      <div className="dashboard-main">
        <div className="flex justify-end gap-2 mb-4">
          <ExportButton type="spares" />
          <ExportButton type="vehicles" />
        </div>
        <AnalyticsDashboard />
      </div>
    </>
  )
}
