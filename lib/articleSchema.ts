/**
 * JSON-LD Article node for guide pages, linked to the sitewide organization.
 * datePublished/dateModified are required (no shared default) so each guide
 * reports its own real dates instead of silently inheriting a stale one —
 * use each file's actual git history when adding or updating a guide.
 */
export function articleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
}: {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: 'https://www.a-ztrucksales.com/og-image.webp',
    inLanguage: 'en-ZA',
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'A-Z Truck Sales',
      url: 'https://www.a-ztrucksales.com',
    },
    publisher: { '@id': 'https://www.a-ztrucksales.com/#org' },
  }
}
