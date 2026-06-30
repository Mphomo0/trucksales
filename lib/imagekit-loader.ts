import type { ImageLoaderProps } from 'next/image'

export default function imagekitLoader({ src, width, quality }: ImageLoaderProps): string {
  // Pass non-ImageKit URLs through unchanged (local /public assets use default Vercel optimization)
  if (!src.includes('ik.imagekit.io')) return src

  const url = new URL(src)
  // ImageKit transformation params: tr=w-{width},q-{quality}
  url.searchParams.set('tr', `w-${width},q-${quality ?? 75}`)
  return url.toString()
}
