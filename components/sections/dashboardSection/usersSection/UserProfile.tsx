'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { Loader2, User, Mail, Lock, Save } from 'lucide-react'

interface FormData {
  name: string
  email: string
  password: string
}

export default function UserProfile() {
  const { data: session, update: updateSession } = useSession()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || '',
        email: session.user.email || '',
        password: '',
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
      // Only send fields that have been changed or are not empty
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

      // Check if there are any changes to make
      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save')
        return
      }

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully!')

        // Clear password field after successful update
        setForm((prev) => ({ ...prev, password: '' }))

        // Update session if email or name changed
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

        // Show re-login message if email was changed
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
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <User className="h-6 w-6" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password (optional)
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Leave empty to keep current password
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>

        {/* Current Session Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Current Session
          </h4>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Name: {session?.user?.name || 'Not set'}</p>
            <p>Email: {session?.user?.email || 'Not set'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
