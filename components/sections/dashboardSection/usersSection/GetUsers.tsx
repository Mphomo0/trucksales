'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SquarePen, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'USER'
  password?: string // Add password as optional
}

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formUser, setFormUser] = useState<Partial<User> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: session } = useSession() // State for password visibility toggle

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data: User[] = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user: User) => {
    setFormUser(user)
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (session?.user?.id === id) {
      toast.error('You cannot delete your own account.')
      return
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error('Error deleting user')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formUser?.name || !formUser?.email || !formUser?.role) {
      toast.error('Please fill out all fields')
      return
    }

    try {
      const res = await fetch(
        isEditing ? `/api/users/${formUser.id}` : '/api/users',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser),
        }
      )
      if (!res.ok) throw new Error('Failed to save user')
      toast.success(`User ${isEditing ? 'updated' : 'added'}`)
      setShowForm(false)
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error('Error saving user')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No users found.</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableCaption>A list of your users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {session && session.user?.role === 'SUPER_ADMIN' && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            aria-label="Edit user"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            aria-label="Delete user"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={18} />
                          </button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4 mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border rounded-md p-4 shadow-sm bg-white"
              >
                <p>
                  <span className="font-semibold">ID:</span> {user.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> {user.role}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {session && session.user?.role === 'SUPER_ADMIN' && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        aria-label="Edit user"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        aria-label="Delete user"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                  {isEditing ? 'Edit User' : 'Add User'}
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formUser?.name || ''}
                    onChange={(e) =>
                      setFormUser({ ...formUser!, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formUser?.email || ''}
                    onChange={(e) =>
                      setFormUser({ ...formUser!, email: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formUser?.password || ''}
                      onChange={(e) =>
                        setFormUser({
                          ...formUser!,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <select
                    value={formUser?.role || 'admin'}
                    onChange={(e) =>
                      setFormUser({
                        ...formUser!,
                        role: e.target.value as User['role'],
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="USER">User</option>
                  </select>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
