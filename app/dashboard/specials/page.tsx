/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import GetSpecials from '@/components/sections/dashboardSection/specials/GetSpecials'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* application/ld+json */ export default async function SpecialsDashboard() {
  return (
    <>
      <DashboardHeader
        title="Specials"
        subtitle="Manage promotional deals and featured listings"
      />
      <div className="dashboard-main">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">
              <span>Specials</span>
            </h1>
            <p className="dash-page-subtitle">Active promotions and deal listings</p>
          </div>
          <Link href="/dashboard/specials/add-special" passHref>
            <Button className="bg-black text-white hover:bg-gray-800">+ Add Special</Button>
          </Link>
        </div>
        <div className="dash-card">
          <GetSpecials />
        </div>
      </div>
    </>
  )
}
