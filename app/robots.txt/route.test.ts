import { describe, expect, it } from 'vitest'
import { GET } from './route'

describe('robots.txt', () => {
  it('names every AI crawler explicitly, declares content signals and the sitemap', async () => {
    const res = GET()
    const body = await res.text()

    expect(res.headers.get('content-type')).toContain('text/plain')
    for (const ua of [
      'ClaudeBot',
      'Claude-SearchBot',
      'Claude-User',
      'PerplexityBot',
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      '*',
    ]) {
      expect(body).toContain(`User-Agent: ${ua}\n`)
    }
    expect(body).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes')
    expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/)
  })

  it('keeps private and parameterised paths disallowed for every agent', async () => {
    const body = await GET().text()
    const groups = body.split('\n\n').filter((g) => g.startsWith('User-Agent'))

    for (const g of groups) {
      expect(g).toContain('Disallow: /dashboard/')
      expect(g).toContain('Disallow: /api/')
      expect(g).toContain('Disallow: /*?utm_')
    }
  })
})
