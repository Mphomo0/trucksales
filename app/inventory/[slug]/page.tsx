import React from 'react'
import TruckDetail from '@/components/sections/inventorySection/TruckDetail'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function VehicleDetails({ params }: PageProps) {
  return (
    <div>
      <TruckDetail />
    </div>
  )
}
