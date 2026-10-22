/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useId } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** When given, pages render as real links (crawlable, Cmd/Ctrl+click opens a tab). */
  getPageHref?: (page: number) => string
  limit: number
  onLimitChange?: (limit: number) => void
  showLimitSelector?: boolean
}

const PAGE_SIZES = [10, 25, 50, 100, 150]

const itemClass =
  'px-3 py-1 rounded text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-1'

// Calculate which page numbers to show
function getPageNumbers(currentPage: number, totalPages: number): (number | '…')[] {
  const maxPagesToShow = 5
  if (totalPages <= maxPagesToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Always show first page
  const pages: (number | '…')[] = [1]

  // Calculate start and end of page range around current page
  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  // Adjust if we're near the beginning
  if (currentPage <= 3) end = Math.min(totalPages - 1, 4)

  // Adjust if we're near the end
  if (currentPage >= totalPages - 2) start = Math.max(2, totalPages - 3)

  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('…')

  // Always show last page
  pages.push(totalPages)
  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  limit = 10,
  onLimitChange,
  showLimitSelector = false,
}: PaginationProps) {
  const limitId = useId()

  // Renders a page control: a link when hrefs are available, otherwise a button.
  // Plain clicks stay client-side; modified clicks fall through to the browser.
  const renderControl = (
    page: number,
    label: React.ReactNode,
    className: string,
    extra: { disabled?: boolean; ariaLabel?: string; current?: boolean } = {}
  ) => {
    const { disabled, ariaLabel, current } = extra
    if (getPageHref && !disabled) {
      return (
        <a
          href={getPageHref(page)}
          aria-label={ariaLabel}
          aria-current={current ? 'page' : undefined}
          className={className}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
            e.preventDefault()
            onPageChange(page)
          }}
        >
          {label}
        </a>
      )
    }
    return (
      <button
        type="button"
        onClick={() => onPageChange(page)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-current={current ? 'page' : undefined}
        className={className}
      >
        {label}
      </button>
    )
  }

  const navClass = `${itemClass} bg-gray-200 hover:bg-gray-300`
  const disabledClass = `${itemClass} bg-gray-200 opacity-50 cursor-not-allowed`

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
    >
      {showLimitSelector && onLimitChange && (
        <div className="flex items-center gap-2">
          <label htmlFor={limitId} className="text-sm">
            Items per page:
          </label>
          <select
            id={limitId}
            name="limit"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm bg-white text-gray-900"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        {renderControl(
          currentPage - 1,
          'Previous',
          currentPage <= 1 ? disabledClass : navClass,
          { disabled: currentPage <= 1, ariaLabel: 'Previous page' }
        )}

        <ul className="flex gap-1">
          {getPageNumbers(currentPage, totalPages).map((page, index) => (
            <li key={typeof page === 'number' ? page : `gap-${index}`}>
              {typeof page === 'number' ? (
                renderControl(
                  page,
                  page,
                  `${itemClass} ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`,
                  { ariaLabel: `Page ${page}`, current: currentPage === page }
                )
              ) : (
                <span className="px-2 py-1 text-sm" aria-hidden="true">
                  {page}
                </span>
              )}
            </li>
          ))}
        </ul>

        {renderControl(
          currentPage + 1,
          'Next',
          currentPage >= totalPages ? disabledClass : navClass,
          { disabled: currentPage >= totalPages, ariaLabel: 'Next page' }
        )}
      </div>
    </nav>
  )
}
