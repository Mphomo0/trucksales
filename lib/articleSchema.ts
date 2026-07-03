/** JSON-LD Article node for guide pages, linked to the sitewide organization. */
export function articleSchema({
  headline,
  description,
  url,
  datePublished = '2026-04-27',
  dateModified = '2026-06-21',
}: {
  headline: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
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
