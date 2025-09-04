'use client'

import { Button } from '../../ui/button'
import { useEffect, useState } from 'react'

interface WhatsAppButtonProps {
  vehicleSlug?: string
}

export function WhatsAppButton({ vehicleSlug }: WhatsAppButtonProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const phoneNumber = '27781277393'
  const message = encodeURIComponent(
    `Hello, I'm interested in this vehicle: ${currentUrl}`
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 510 512.459"
        >
          <path fill="#ffffff" d="M435.689 74.468C387.754 26.471 324 .025..." />
        </svg>
        Chat on WhatsApp
      </Button>
    </a>
  )
}
