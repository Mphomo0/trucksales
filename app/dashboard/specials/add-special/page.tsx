import { auth } from '@/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // Assuming you have a reusable Button
import CreateSpecial from '@/components/sections/dashboardSection/specials/CreateSpecial'

export default async function AddSpecial() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Auth error:', error)
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
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Special</h1>
        <CreateSpecial />
      </div>
    </div>
  )
}
