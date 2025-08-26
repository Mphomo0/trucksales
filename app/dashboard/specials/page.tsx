import { auth } from '@/auth'
import GetSpecials from '@/components/sections/dashboardSection/specials/GetSpecials'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SpecialsDashboard() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Auth error:', error)
    // Optionally render error message
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl text-red-500">Authentication error</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl">Not authenticated</p>
        <Link href="/login" passHref>
          <Button className="bg-black text-white hover:bg-gray-800">
            Login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-3xl py-6">Specials</h1>
          <Link href="/dashboard/specials/add-special" passHref>
            <Button className="font-bold py-6">Add Special</Button>
          </Link>
        </div>

        <GetSpecials />
      </div>
    </div>
  )
}
