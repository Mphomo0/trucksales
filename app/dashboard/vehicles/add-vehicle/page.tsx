import { auth } from '@/auth'
import CreateVehicle from '@/components/sections/dashboardSection/stockSection/CreateVehicle'
import Link from 'next/link'
import { ChevronsLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AddVehicle() {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/vehicles" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronsLeft size={18} />
              Back to Inventory
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add <span className="text-yellow-500">Vehicle</span>
        </h1>
        <CreateVehicle />
      </div>
    </div>
  )
}
