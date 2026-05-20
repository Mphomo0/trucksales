import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-token')
    
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
    }

    

    revalidatePath(path)

    return NextResponse.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    })
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}