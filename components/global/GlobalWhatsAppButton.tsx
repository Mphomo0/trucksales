'use client'

import { FloatingWhatsApp } from 'react-floating-whatsapp'

export default function GlobalWhatsAppButton() {
  return (
    <FloatingWhatsApp
      phoneNumber="0832345377"
      accountName="AZ Truck Sales"
      avatar="/images/whatsapp.svg"
      chatMessage="Hello! How can we help you?"
    />
  )
}
