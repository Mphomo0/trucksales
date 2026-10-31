import { revalidatePath, revalidateTag } from 'next/cache'

// Called by Vercel Cron at the Black Friday window edges (00:00 SAST on 9 Nov
// and 1 Dec) so cached pages and the deals query pick up the new state.
export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  // expire: 0 = no stale content served; the next request blocks on fresh data.
  revalidateTag('black-friday', { expire: 0 })

  return Response.json({ revalidated: true })
}
