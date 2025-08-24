import { auth } from '@/auth'
import Link from 'next/link'
import GetUsers from '@/components/sections/dashboardSection/usersSection/GetUsers'
import { Button } from '@/components/ui/button'

export default async function Users() {
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-amber-600">Users</h1>
        </div>
        <div className="float-right">
          <Link href="/dashboard/users/add-user">
            <Button>ADD USER</Button>
          </Link>
        </div>
      </div>

      <GetUsers />
    </section>
  )
}
