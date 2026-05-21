/**
 * ImageKit URL transformer.
 *
 * All images stored in ImageKit (ik.imagekit.io) can be transformed by
 * appending query-string or path-based transformation parameters.
 * We use this instead of Next.js <Image> optimization so we don't burn
 * Vercel Image Optimization credits (Transformations, Cache Writes, Cache Reads).
 *
 * ImageKit docs: https://docs.imagekit.io/features/image-transformations
 */

export interface IKTransformOptions {
  /** Target width in px */
  w?: number
  /** Target height in px */
  h?: number
  /** Crop strategy: maintain_ratio | force | at_least | at_max */
  c?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max'
  /** Output format: auto | webp | avif | jpg | png */
  f?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  /** Quality 1–100 */
  q?: number
  /** Focus for crop: auto | face | center */
  fo?: 'auto' | 'face' | 'center'
}

/**
 * Returns an ImageKit URL with transformation params appended.
 * If the URL is not from ik.imagekit.io the original URL is returned unchanged.
 */
export function ikUrl(src: string, opts: IKTransformOptions = {}): string {
  if (!src || !src.includes('ik.imagekit.io')) return src

  // Build transformation string: e.g. "w-400,h-300,f-auto,q-80"
  const parts: string[] = []
  if (opts.w) parts.push(`w-${opts.w}`)
  if (opts.h) parts.push(`h-${opts.h}`)
  if (opts.c) parts.push(`c-${opts.c}`)
  if (opts.f) parts.push(`f-${opts.f}`)
  if (opts.q) parts.push(`q-${opts.q}`)
  if (opts.fo) parts.push(`fo-${opts.fo}`)

  if (parts.length === 0) return src

  try {
    const url = new URL(src)
    url.searchParams.set('tr', parts.join(','))
    return url.toString()
  } catch {
    return src
  }
}

/** Card thumbnail: 400×300, WebP, q-75 */
export const ikCard = (src: string) =>
  ikUrl(src, { w: 400, h: 300, f: 'webp', q: 75, c: 'maintain_ratio', fo: 'auto' })

/** Detail hero image: 1200×800, WebP, q-80 */
export const ikHero = (src: string) =>
  ikUrl(src, { w: 1200, h: 800, f: 'webp', q: 80, c: 'maintain_ratio', fo: 'auto' })

/** Thumbnail strip: 300×200, WebP, q-65 */
export const ikThumb = (src: string) =>
  ikUrl(src, { w: 300, h: 200, f: 'webp', q: 65, c: 'maintain_ratio', fo: 'auto' })
