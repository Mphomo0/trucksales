import { auth as clerkAuth } from '@clerk/nextjs/server'

export async function auth() {
  const session = await clerkAuth()
  if (!session.userId) return null
  return { user: { id: session.userId } }
}
