import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase, Edit, Save, X } from 'lucide-react'
import Header from '@/components/header'
import { useUser, useUpdateUser, useDeleteUser } from '@/lib/api/users'
import type { UserRole } from '@/lib/database.types'
import { format } from 'date-fns'

export default function UserProfilePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const userId = searchParams.get('id')

  const { data: user, isLoading, error } = useUser(userId || undefined)
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    postcode: '',
    role: 'customer' as UserRole,
  })

  // Initialize form data when user loads
  useState(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        postcode: user.postcode || '',
        role: user.role,
      })
    }
  })

  const handleEdit = () => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        postcode: user.postcode || '',
        role: user.role,
      })
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!userId) return

    try {
      await updateUser.mutateAsync({
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        postcode: formData.postcode,
        role: formData.role,
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error('Failed to update user:', error)
      alert('Failed to update user. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!userId || !user) return

    if (
      !window.confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      await deleteUser.mutateAsync(userId)
      navigate('/users', { replace: true })
    } catch (error: any) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user. Please try again.')
    }
  }

  if (!userId) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="User Profile" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-500">Invalid user ID</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="User Profile" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="User Profile" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/users"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Link>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-500">Failed to load user profile. Please try again.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Profile" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>

          {/* Profile Header */}
          <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                <div>
                  {isEditing ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First name"
                        className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last name"
                        className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {user.first_name} {user.last_name}
                    </h1>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={updateUser.isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateUser.isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updateUser.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail className="w-5 h-5" />
                <span>{user.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone className="w-5 h-5" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="flex-1 px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                ) : (
                  <span>{user.phone || 'No phone'}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <MapPin className="w-5 h-5" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="Postcode"
                    className="flex-1 px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                ) : (
                  <span>{user.postcode || 'No postcode'}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Calendar className="w-5 h-5" />
                <span>Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Bookings</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.bookings_count || 0}</p>
            </div>
            <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${(user.total_spent || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <User className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Status</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Active</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-background-dark rounded-lg border border-red-500/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Deleting this user will permanently remove all their data including bookings and reviews. This action
              cannot be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
