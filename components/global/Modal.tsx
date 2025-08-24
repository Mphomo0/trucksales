import { FC, useState } from 'react'

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
  if (!isOpen) return null

  const [submitting, setSubmitting] = useState(false)

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Special</h2>
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
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
