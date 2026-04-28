/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import GetUsers from '@/components/sections/dashboardSection/usersSection/GetUsers'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* application/ld+json */ export default async function Users() {
  return (
    <>
      <DashboardHeader
        title="Users"
        subtitle="Manage admin and staff access"
      />
      <div className="dashboard-main">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">
              <span>Users</span>
            </h1>
            <p className="dash-page-subtitle">All registered admin accounts</p>
          </div>
          <Link href="/dashboard/users/add-user" passHref>
            <Button className="bg-black text-white hover:bg-gray-800">+ Add User</Button>
          </Link>
        </div>
        <div className="dash-card">
          <GetUsers />
        </div>
      </div>
    </>
  )
}
