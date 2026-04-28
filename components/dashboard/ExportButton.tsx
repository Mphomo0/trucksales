/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface ExportButtonProps {
  type: 'spares' | 'vehicles' | 'all'
}

export function ExportButton({ type }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const exportToCSV = async (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = Object.keys(data[0]).filter(key => {
      const val = data[0][key]
      return typeof val !== 'object' || val === null
    })

    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header => {
            const val = row[header]
            if (val === null || val === undefined) return ''
            const str = String(val)
            return str.includes(',') || str.includes('"') || str.includes('\n')
              ? `"${str.replace(/"/g, '""')}"`
              : str
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const fetchAndExport = async (endpoint: string, filename: string) => {
    try {
      setLoading(true)
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Failed to fetch data')

      const result = await response.json()
      const data = result.spares || result.vehicles || result.data || result

      await exportToCSV(Array.isArray(data) ? data : [], filename)
      toast.success(`${filename} exported successfully`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Failed to export ${filename}`)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (type === 'spares') {
      await fetchAndExport('/api/spares?limit=1000', 'spares')
    } else if (type === 'vehicles') {
      await fetchAndExport('/api/vehicles?limit=1000', 'inventory')
    } else {
      await fetchAndExport('/api/spares?limit=1000', 'spares')
      await fetchAndExport('/api/vehicles?limit=1000', 'inventory')
    }
  }

  const getButtonLabel = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin mr-2" />
    return <Download className="h-4 w-4 mr-2" />
  }

  const getLabel = () => {
    switch (type) {
      case 'spares':
        return 'Export Spares'
      case 'vehicles':
        return 'Export Inventory'
      default:
        return 'Export All'
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      className="gap-2"
    >
      {getButtonLabel()}
      {getLabel()}
    </Button>
  )
}