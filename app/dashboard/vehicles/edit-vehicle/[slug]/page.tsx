/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import EditVehicle from '@/components/sections/dashboardSection/stockSection/EditVehicle'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/* application/ld+json */ export default async function EditVehiclePage() {
  return (
    <>
      <DashboardHeader
        title="Edit Vehicle"
        subtitle="Update vehicle details and specifications"
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
                Edit <span>Vehicle</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="dash-card max-w-4xl">
          <EditVehicle />
        </div>
      </div>
    </>
  )
}
