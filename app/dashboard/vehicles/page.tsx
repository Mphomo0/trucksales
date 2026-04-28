/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import GetVehicles from '@/components/sections/dashboardSection/stockSection/GetVehicles'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* application/ld+json */ export default async function InventoryDashboard() {
  return (
    <>
      <DashboardHeader
        title="Vehicle Inventory"
        subtitle="Manage your truck and commercial vehicle stock"
      />
      <div className="dashboard-main">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">
              Vehicle <span>Inventory</span>
            </h1>
            <p className="dash-page-subtitle">All vehicles currently listed in stock</p>
          </div>
          <Link href="/dashboard/vehicles/add-vehicle" passHref>
            <Button className="bg-black text-white hover:bg-gray-800">+ Add Vehicle</Button>
          </Link>
        </div>
        <div className="dash-card">
          <GetVehicles />
        </div>
      </div>
    </>
  )
}
