'use client'

/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

import { FC, useEffect, useId, useRef, useState } from 'react'

// Define the Special type if not imported from elsewhere
export interface Special {
  amount: number
  validFrom: string
  validTo: string
  inventoryId: string
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    amount: number
    validFrom: string
    validTo: string
    inventoryId: string
  }) => void
  initialData: Partial<Special>
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus the first field on open and close on Escape
  useEffect(() => {
    if (!isOpen) return
    dialogRef.current?.querySelector<HTMLElement>('input')?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, submitting])

  if (!isOpen) return null

  // Format dates for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const formData = new FormData(event.target as HTMLFormElement)
    const data = {
      amount: parseFloat(formData.get('amount') as string),
      validFrom: (formData.get('validFrom') as string) || '',
      validTo: (formData.get('validTo') as string) || '',
      inventoryId: initialData.inventoryId || '',
    }

    try {
      await onSubmit(data) // Make sure `onSubmit` returns a Promise
    } finally {
      setSubmitting(false) // Optional if the modal will close
    }
  }

  // Get today's date
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overscroll-contain">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white p-8 rounded-lg max-w-md w-full"
      >
        <h3 id={titleId} className="text-xl font-semibold mb-4">Edit Special</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              defaultValue={initialData.amount}
              className="w-full p-2 border rounded"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="validFrom" className="block">
              Valid From
            </label>
            <input
              type="date"
              id="validFrom"
              name="validFrom"
              defaultValue={formatDateForInput(initialData.validFrom)}
              className="w-full p-2 border rounded"
              min={today}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="validTo" className="block">
              Valid To
            </label>
            <input
              type="date"
              id="validTo"
              name="validTo"
              defaultValue={formatDateForInput(initialData.validTo)}
              className="w-full p-2 border rounded"
              min={today} // Min date is today
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
