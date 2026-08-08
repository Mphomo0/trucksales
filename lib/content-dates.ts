/**
 * Publish and last-edit dates for editorial pages — the pages whose content
 * lives in the codebase rather than the database.
 *
 * This is the single place a human updates when a page's copy changes. Both
 * the sitemap and the pages' Article schema read from here, so the two can't
 * drift apart the way they previously did (the sitemap was reporting guides as
 * last modified 2026-06-21 while the pages themselves claimed 2026-08-05).
 *
 * These are deliberately NOT derived from build time. `published` is a
 * historical fact, and regenerating `modified` on every deploy would claim
 * freshness that didn't happen — a signal search engines discount.
 *
 * Database-backed routes (inventory, spares, specials, brands, tonnage) are
 * not listed here; their timestamps come from the records themselves.
 */
export interface ContentDate {
  published: string
  modified: string
}

export const CONTENT_DATES = {
  '/about': { published: '2026-06-21', modified: '2026-06-21' },
  '/contact': { published: '2026-06-21', modified: '2026-06-21' },
  '/locations': { published: '2026-06-17', modified: '2026-06-17' },
  '/locations/alberton': { published: '2026-06-21', modified: '2026-06-21' },
  '/locations/boksburg': { published: '2026-06-21', modified: '2026-06-21' },
  '/sell-your-truck': { published: '2026-06-21', modified: '2026-06-21' },
  '/guides': { published: '2026-06-21', modified: '2026-06-21' },
  '/guides/buying-guide': { published: '2026-06-16', modified: '2026-07-03' },
  '/guides/truck-body-types': { published: '2026-06-16', modified: '2026-08-05' },
  '/guides/cof-ready-trucks': { published: '2026-06-21', modified: '2026-08-05' },
  '/guides/isuzu-vs-hino-vs-fuso': { published: '2026-06-21', modified: '2026-08-05' },
  '/guides/choose-truck-for-construction-delivery-cold-storage': {
    published: '2026-06-21',
    modified: '2026-08-05',
  },
  '/guides/what-to-check-before-buying': { published: '2026-06-21', modified: '2026-08-05' },
  '/guides/finance-trade-ins-export': { published: '2026-06-21', modified: '2026-08-05' },
} as const satisfies Record<string, ContentDate>

export type EditorialRoute = keyof typeof CONTENT_DATES

export function getContentDates(route: EditorialRoute): ContentDate {
  return CONTENT_DATES[route]
}
