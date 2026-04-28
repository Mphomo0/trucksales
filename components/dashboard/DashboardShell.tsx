/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { cn } from '@/lib/utils'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="dashboard-shell">
      <div 
        className={cn(
          "dashboard-sidebar",
          isSidebarOpen && "sidebar-open"
        )}
      >
        <DashboardSidebar />
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="dashboard-body">
        {/* We'll inject the setter into children if needed, but for now 
            each page's DashboardHeader will need to know how to open the sidebar.
            Alternatively, we can use a Context or just handle the Menu button here.
        */}
        {/* Let's try a different approach: provide a context. */}
        {children}
      </div>
    </div>
  )
}
