/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { Button } from '../../ui/button'
import { useEffect, useState } from 'react'

interface WhatsAppButtonProps {
  vehicleSlug?: string
  /** Absolute URL of the item to enquire about. Defaults to the current page. */
  url?: string
  label?: string
  /** Smaller button for listing cards */
  compact?: boolean
}

export function WhatsAppButton({
  url,
  label = 'Chat on WhatsApp',
  compact = false,
}: WhatsAppButtonProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [url])

  const phoneNumber = '27781277393'
  const message = encodeURIComponent(
    `Hello, I'm interested in this vehicle: ${url ?? currentUrl}`
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button
        size={compact ? 'sm' : undefined}
        className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
      >
        {label}
      </Button>
    </a>
  )
}
