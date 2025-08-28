'use client'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'

const NavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Specials', href: '/specials' },
  { name: 'Sell-Your-Truck', href: '/sell-your-truck' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset'
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Cleanup overflow style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        document.body.style.overflow = 'unset'
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={300}
                height={150}
                priority
                className="h-auto w-auto"
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
                    className="text-gray-800 hover:text-gray-600 text-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-gray-600 rounded-md transition-colors">
                  <User size={18} />
                  <span>Account</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 mt-2 bg-white shadow-lg rounded-md border border-gray-200">
                  <DropdownMenuLabel>
                    {session.user?.name || session.user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/users">
                    <DropdownMenuItem>Users</DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/vehicles">
                    <DropdownMenuItem>Vehicles</DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/specials">
                    <DropdownMenuItem>Specials</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => {
                setIsMobileMenuOpen(false)
                document.body.style.overflow = 'unset'
              }}
            />
            <div className="lg:hidden fixed top-20 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
              <div className="flex flex-col space-y-1 px-4 py-4">
                {NavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-800 hover:text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      document.body.style.overflow = 'unset'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                {status === 'loading' ? (
                  <div className="w-full h-10 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : session ? (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 w-full text-left text-gray-800 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                        <User size={18} />
                        <span>Account</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 mt-2 bg-white shadow-lg rounded-md border border-gray-200">
                        <DropdownMenuLabel>
                          {session.user?.name || session.user?.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/dashboard">
                          <DropdownMenuItem>Dashboard</DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/profile">
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/users">
                          <DropdownMenuItem>Users</DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/vehicles">
                          <DropdownMenuItem>Inventory</DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/specials">
                          <DropdownMenuItem>Specials</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
