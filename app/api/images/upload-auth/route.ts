import { getUploadAuthParams } from '@imagekit/next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = uuidv4()
  const expireTimestamp = Math.floor(Date.now() / 1000) + 30 * 60

  const { expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    token,
    expire: expireTimestamp,
  })

  

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  })
}
