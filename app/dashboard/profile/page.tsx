/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

import UserProfile from '@/components/sections/dashboardSection/usersSection/UserProfile'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

/* application/ld+json */ export default async function Profile() {
  return (
    <>
      <DashboardHeader
        title="Your Profile"
        subtitle="Manage your personal information and settings"
      />
      <div className="dashboard-main">
        <div className="dash-card max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="dash-page-title">
              Your <span>Profile</span>
            </h1>
            <p className="dash-page-subtitle">View and update your account details</p>
          </div>
          <div className="max-w-md mx-auto">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  )
}
