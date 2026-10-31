import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { revalidatePath, revalidateTag } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath, revalidateTag }))

import { GET } from './route'

const ORIGINAL_SECRET = process.env.CRON_SECRET

function req(authorization?: string): Request {
  return new Request('https://example.com/api/cron/black-friday', {
    headers: {
      'user-agent': 'vercel-cron/1.0',
      ...(authorization ? { authorization } : {}),
    },
  })
}

describe('GET /api/cron/black-friday', () => {
  beforeEach(() => {
    revalidatePath.mockClear()
    revalidateTag.mockClear()
    process.env.CRON_SECRET = 's3cret'
  })

  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = ORIGINAL_SECRET
  })

  it('returns 401 without the bearer token and does not revalidate', async () => {
    for (const r of [req(), req('Bearer wrong')]) {
      const res = await GET(r)
      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ error: 'Unauthorized' })
    }
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('returns 401 when CRON_SECRET is unset', async () => {
    delete process.env.CRON_SECRET
    for (const r of [req('Bearer undefined'), req('Bearer '), req()]) {
      const res = await GET(r)
      expect(res.status).toBe(401)
    }
    process.env.CRON_SECRET = ''
    expect((await GET(req('Bearer '))).status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('revalidates the root layout with the correct token', async () => {
    const res = await GET(req('Bearer s3cret'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ revalidated: true })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(revalidateTag).toHaveBeenCalledWith('black-friday', { expire: 0 })
  })
})
