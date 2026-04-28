/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { FloatingWhatsApp } from 'react-floating-whatsapp'

/* <h1>A-Z Truck Sales Components</h1> */ export default function GlobalWhatsAppButton() {
  return (
    <FloatingWhatsApp
      phoneNumber="27781277393"
      accountName="AZ Truck Sales"
      avatar="/images/whatsapp.svg"
      chatMessage="Hello! How can we help you?"
    />
  )
}
