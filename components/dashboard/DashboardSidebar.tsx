/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  Tag,
  ChevronRight,
  Zap,
  LogOut,
  X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useDashboard } from './DashboardContext'

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Vehicles',
    href: '/dashboard/vehicles',
    icon: Truck,
  },
  {
    label: 'Spares',
    href: '/dashboard/spares',
    icon: Wrench,
  },
  {
    label: 'Specials',
    href: '/dashboard/specials',
    icon: Tag,
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className={cn("dashboard-sidebar", isSidebarOpen && "sidebar-open")}>
      {/* Mobile Close Button */}
      <button 
        className="md:hidden absolute top-4 right-4 p-2 text-dash-text-muted hover:text-dash-text-primary"
        onClick={() => setIsSidebarOpen(false)}
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <Link href="/dashboard" className="sidebar-logo">
        <div className="logo-icon">
          <Truck className="logo-truck" />
        </div>
        <div className="logo-text">
          <span className="logo-title">A-Z Trucks</span>
          <span className="logo-sub">Admin Panel</span>
        </div>
      </Link>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">Main Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('nav-item', active && 'nav-item-active')}
              onClick={() => setIsSidebarOpen(false)} // Close on mobile navigation
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {active && <ChevronRight className="nav-chevron" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <Link href="/" className="nav-item">
          <Zap className="nav-icon" />
          <span className="nav-label">View Site</span>
        </Link>
        <button
          className="nav-item nav-item-danger"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="nav-icon" />
          <span className="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
