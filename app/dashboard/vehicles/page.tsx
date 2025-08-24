import { auth } from '@/auth'
import GetVehicles from '@/components/sections/dashboardSection/stockSection/GetVehicles'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function InventoryDashboard() {
  const session = await auth()

  if (!session) {
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl">Not authenticated</p>
        <Link href="/login">
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Login
          </button>
        </Link>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-3xl py-6">Inventory</h1>
          <Link href="/dashboard/vehicles/add-vehicle">
            <Button className="font-bold py-6">Add Vehicle</Button>
          </Link>
        </div>

        <GetVehicles />
      </div>
    </div>
  )
}
