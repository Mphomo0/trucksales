/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import CreateVehicle from '@/components/sections/dashboardSection/stockSection/CreateVehicle'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/* application/ld+json */ export default async function AddVehicle() {
  return (
    <>
      <DashboardHeader
        title="Add New Vehicle"
        subtitle="List a new truck or commercial vehicle in the inventory"
      />
      <div className="dashboard-main">
        <div className="dash-page-header">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/vehicles" passHref>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="dash-page-title">
                Add <span>Vehicle</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="dash-card max-w-4xl">
          <CreateVehicle />
        </div>
      </div>
    </>
  )
}
