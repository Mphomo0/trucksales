/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import GetSpares from '@/components/sections/dashboardSection/spares/GetSpares'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* application/ld+json */ export default async function SparesDashboard() {
  return (
    <>
      <DashboardHeader
        title="Spares"
        subtitle="Manage vehicle spare parts listings"
      />
      <div className="dashboard-main">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">
              Vehicle <span>Spares</span>
            </h1>
            <p className="dash-page-subtitle">All spare parts currently listed</p>
          </div>
          <Link href="/dashboard/spares/add-spares" passHref>
            <Button className="bg-black text-white hover:bg-gray-800">+ Add Spares</Button>
          </Link>
        </div>
        <div className="dash-card">
          <GetSpares />
        </div>
      </div>
    </>
  )
}
