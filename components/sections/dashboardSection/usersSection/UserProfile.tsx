/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import { Loader2, User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react'

interface FormData {
  name: string
  email: string
  password: string
  currentPassword: string
}

/* <h1>A-Z Truck Sales Components</h1> */ export default function UserProfile() {
  const { data: session, update: updateSession } = useSession()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    currentPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || '',
        email: session.user.email || '',
        password: '',
        currentPassword: '',
      })
      setInitializing(false)
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData: Partial<FormData> = {}

      if (form.name.trim() && form.name !== session?.user?.name) {
        updateData.name = form.name.trim()
      }

      if (form.email.trim() && form.email !== session?.user?.email) {
        updateData.email = form.email.trim()
      }

      if (form.password.trim()) {
        updateData.password = form.password
      }

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save')
        setLoading(false)
        return
      }

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully!')
        setForm((prev) => ({ ...prev, password: '', currentPassword: '' }))

        if (updateData.name || updateData.email) {
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: data.user.name,
              email: data.user.email,
            },
          })
        }

        if (data.message) {
          toast.warning(data.message)
        }
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('An error occurred while updating your profile')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            disabled={loading}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={loading}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Current Password Field */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
          Current Password
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={handleInputChange}
            placeholder="Enter current password to make changes"
            disabled={loading}
            className="pl-10 pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Required to change your name, email, or password
        </p>
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          New Password
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            disabled={loading}
            className="pl-10 pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Leave empty to keep your current password
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
