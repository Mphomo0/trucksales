/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search, Menu } from 'lucide-react'
import { useState } from 'react'
import { useDashboard } from './DashboardContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const { toggleSidebar } = useDashboard()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AU'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/vehicles?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <form onSubmit={handleSearch} className={`header-search ${searchFocused ? 'header-search-focused' : ''}`}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search vehicles..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </form>

        {/* Notifications */}
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* Avatar */}
        <Link href="/dashboard/profile" className="header-avatar" title={session?.user?.name ?? 'User profile'}>
          {initials}
        </Link>
      </div>
    </header>
  )
}
