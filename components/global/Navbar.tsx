/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const NavLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Spares', href: '/spares' },
  { name: 'Specials', href: '/specials' },
  { name: 'Sell-Your-Truck', href: '/sell-your-truck' },
  { name: 'Contact Us', href: '/contact' },
]

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Clerk session cookie check instead of useUser() — keeps ClerkProvider (and
  // its middleware requirement) off public pages. Only gates the staff Dashboard link.
  const [isSignedIn, setIsSignedIn] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsSignedIn(document.cookie.includes('__session='))
  }, [])

  // Close the menu whenever the route changes
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsMobileMenuOpen(false)
  }

  // Lock page scroll while the menu is open, move focus into it, and close on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return
    document.body.style.overflow = 'hidden'
    mobileMenuRef.current?.querySelector<HTMLElement>('a')?.focus()

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt="A-Z Truck Sales logo"
                width={320}
                height={80}
                priority
                unoptimized
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:mx-auto lg:flex space-x-6">
            <ul className="flex space-x-6">
              {NavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                    className="text-gray-800 hover:text-gray-600 text-lg font-medium transition-colors rounded aria-[current=page]:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-gray-600 rounded-md transition-colors"
              >
                <User size={18} />
                <span>Dashboard</span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Click-away backdrop; keyboard users close with Escape or the menu button */}
            <div
              className="lg:hidden fixed inset-0 bg-transparent z-40"
              aria-hidden="true"
              onClick={closeMenu}
            />
            <div
              id="mobile-menu"
              ref={mobileMenuRef}
              className="lg:hidden fixed top-20 left-0 right-0 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-white shadow-lg z-50 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-1 px-4 py-4">
                {NavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                    className="text-gray-800 hover:text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base transition-colors aria-[current=page]:bg-amber-50 aria-[current=page]:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                {isSignedIn && (
                  <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col space-y-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
