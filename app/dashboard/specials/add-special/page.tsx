import { auth } from '@/auth'
import Link from 'next/link'
import CreateSpecial from '@/components/sections/dashboardSection/specials/CreateSpecial'

export default async function AddSpecial() {
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
      <CreateSpecial />
    </div>
  )
}
