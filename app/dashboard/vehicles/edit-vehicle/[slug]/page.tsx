import { auth } from '@/auth'
import EditVehicle from '@/components/sections/dashboardSection/stockSection/EditVehicle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronsLeft } from 'lucide-react'

export default async function EditVehiclePage() {
  const session = await auth()

  if (!session) {
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl">Not authenticated</p>
        <Link href="/login">
          <Button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Login
          </Button>
        </Link>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard/vehicles"
          className="w-48 bg-black text-white px-4 py-2 rounded-sm flex"
        >
          <ChevronsLeft /> Back to Inventory
        </Link>
        <div className=" mb-6">
          <h1 className="font-bold text-3xl py-6 text-center">
            Edit <span className="text-yellow-500 font-bold">Vehicle</span>
          </h1>
        </div>

        <EditVehicle />
      </div>
    </div>
  )
}
