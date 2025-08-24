import { auth } from '@/auth'
import Link from 'next/link'
import { AnalyticsDashboard } from '@/components/global/AnalyticsDashboard'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center h-screen gap-4 py-8">
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}
