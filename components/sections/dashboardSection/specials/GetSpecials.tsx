'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Trash2, SquarePen } from 'lucide-react'
import { toast } from 'react-toastify'
import { Modal } from '@/components/global/Modal'
import { Pagination } from '@/components/global/Pagination'

interface Special {
  id: string
  amount: number
  slug: string
  validFrom: string
  validTo: string
  inventoryId: string
  inventory: {
    name: string
  }
}

export default function GetSpecials() {
  const [specials, setSpecials] = useState<Special[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSpecial, setCurrentSpecial] = useState<Special | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const GetAllSpecials = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      const response = await fetch(`/api/specials?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch specials')
      }
      const data = await response.json()
      setSpecials(data.data)
      if (data.meta) {
        setMeta(data.meta)
        setCurrentPage(data.meta.page)
      }
    } catch (error) {
      console.error('Error fetching specials:', error)
      toast.error('Error fetching specials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GetAllSpecials(1)
  }, [])

  // Handle the deletion of a special
  const handleDeleteSpecial = async (slug: string) => {
    try {
      const response = await fetch(`/api/specials/${slug}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSpecials((prevSpecials) =>
          prevSpecials.filter((special) => special.slug !== slug)
        )
        toast.success('Special deleted successfully')
      } else {
        throw new Error('Failed to delete special')
      }
    } catch (error) {
      console.error('Error deleting special:', error)
      toast.error('Error deleting special')
    }
  }

  // Handle opening the modal
  const openEditModal = (special: Special) => {
    setCurrentSpecial(special)
    setIsModalOpen(true)
  }

  // Handle form submission to update the special
  const handleEditSpecial = async (updatedData: {
    amount: number
    validFrom: string
    validTo: string
    inventoryId: string
  }) => {
    if (!currentSpecial) return
    try {
      const response = await fetch(`/api/specials/${currentSpecial.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedData,
          inventoryId: currentSpecial.inventoryId, // Preserve the original inventoryId
        }),
      })
      if (response.ok) {
        const { updatedSpecial } = await response.json()
        await GetAllSpecials()
        toast.success('Special updated successfully')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update special')
      }
    } catch (error) {
      console.error('Error updating special:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error updating special'
      )
    } finally {
      setIsModalOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading specials...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid To</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specials?.map((special) => (
              <TableRow key={special.slug}>
                <TableCell>{special.inventory.name.toUpperCase()}</TableCell>
                <TableCell>R{special.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(special.validFrom)}</TableCell>
                <TableCell>{formatDate(special.validTo)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteSpecial(special.slug)}
                      aria-label="Delete Special"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openEditModal(special)}
                      aria-label="Edit Special"
                    >
                      <SquarePen size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-4">
          {specials.map((special) => (
            <Card key={special.slug} className="p-4 shadow-md rounded-lg">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {special.inventory.name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> R{special.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Valid From:</strong> {formatDate(special.validFrom)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Valid To:</strong> {formatDate(special.validTo)}
                </p>
                <div className="flex gap-4 mt-3">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSpecial(special.slug)}
                    aria-label="Delete Special"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(special)}
                    aria-label="Edit Special"
                  >
                    <SquarePen size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={(page) => GetAllSpecials(page)}
            limit={meta.limit}
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditSpecial}
        initialData={currentSpecial || {}}
      />
    </div>
  )
}
