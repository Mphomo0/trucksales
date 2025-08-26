import { auth } from '@/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // assuming you're using a shared button component
import UserProfile from '@/components/sections/dashboardSection/usersSection/UserProfile'

export default async function Profile() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Auth error:', error)
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-red-500">Authentication error</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen gap-4">
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <UserProfile />
      </div>
    </div>
  )
}
