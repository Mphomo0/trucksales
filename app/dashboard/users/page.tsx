import { auth } from '@/auth'
import Link from 'next/link'
import GetUsers from '@/components/sections/dashboardSection/usersSection/GetUsers'
import { Button } from '@/components/ui/button'

export default async function Users() {
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <h1 className="text-4xl font-bold text-amber-600">Users</h1>
        <Link href="/dashboard/users/add-user" passHref>
          <Button className="w-full sm:w-auto">Add User</Button>
        </Link>
      </div>

      <GetUsers />
    </section>
  )
}
