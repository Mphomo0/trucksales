'use client'

import { useState } from 'react'
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
  const { data: session } = useSession()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset'
  }

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/', // Redirect to homepage after logout
    })
  }

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
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-gray-600 text-lg font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 relative">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-gray-600 rounded-md transition">
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
            ) : (
              ''
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 right-0 w-full bg-white shadow-md z-50">
            <div className="flex flex-col items-center space-y-4 px-4 py-4">
              {NavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-800 hover:text-gray-600 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-800 hover:text-gray-600 rounded-md transition">
                    <User size={18} />
                    <span>Account</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96 mt-2 bg-white shadow-lg rounded-md border border-gray-200">
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
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
