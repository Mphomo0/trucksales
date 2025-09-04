import { auth } from '@/auth'
import GetVehicles from '@/components/sections/dashboardSection/stockSection/GetVehicles'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function InventoryDashboard() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Authentication error:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-red-600">
          Authentication error. Please try again.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-gray-700">You are not authenticated.</p>
        <Link href="/login" passHref>
          <Button className="mt-4 bg-black text-white hover:bg-gray-800 transition duration-200">
            Login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-scree px-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Vehicle <span className="text-yellow-500">Inventory</span>
          </h1>
          <Link href="/dashboard/vehicles/add-vehicle" passHref>
            <Button className="bg-black text-white hover:bg-gray-800">
              + Add Vehicle
            </Button>
          </Link>
        </div>
        <GetVehicles />
      </div>
    </div>
  )
}
