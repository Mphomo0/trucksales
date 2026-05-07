import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function auth() {
  const session = await clerkAuth()

  if (!session.userId) {
    return null
  }

  const user = await currentUser()

  return {
    user: {
      id: session.userId,
      email: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0],
      role: 'user',
    },
  }
}
