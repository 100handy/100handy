import { useEffect, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Plus, Trash2, User } from 'lucide-react'
import Header from '@/components/header'
import { useCreateUser, useUsers, useDeleteUsers } from '@/lib/api/users'
import type { UserRole } from '@/lib/database.types'

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [accountStatus, setAccountStatus] = useState<'active' | 'paused' | 'deleted' | ''>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(searchParams.get('mode') === 'add')
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
    role: 'customer' as UserRole,
  })

  // Fetch users with search filter
  const { data: users, isLoading, error } = useUsers({
    search: searchQuery,
    role: 'customer', // Only show customers by default
    accountStatus: accountStatus || undefined,
  })

  const deleteUsersMutation = useDeleteUsers()
  const createUserMutation = useCreateUser()

  useEffect(() => {
    const wantsAdd = searchParams.get('mode') === 'add'
    if (wantsAdd !== showCreateModal) {
      setShowCreateModal(wantsAdd)
    }
  }, [searchParams, showCreateModal])

  function updateRouteMode(mode: 'add' | null) {
    const next = new URLSearchParams(searchParams)
    if (mode) next.set('mode', mode)
    else next.delete('mode')
    setSearchParams(next, { replace: true })
  }

  const resetCreateForm = () => {
    setCreateForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      postcode: '',
      role: 'customer',
    })
    setCreateErrors({})
  }

  const validateCreateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!createForm.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!createForm.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!createForm.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) newErrors.email = 'Invalid email format'
    if (!createForm.password) newErrors.password = 'Password is required'
    else if (createForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setCreateErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCreateUser() {
    if (!validateCreateForm()) return
    try {
      await createUserMutation.mutateAsync(createForm)
      resetCreateForm()
      setShowCreateModal(false)
      updateRouteMode(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user.'
      setCreateErrors({ submit: message })
    }
  }

  function openCreateModal() {
    setShowCreateModal(true)
    updateRouteMode('add')
  }

  function closeCreateModal() {
    setShowCreateModal(false)
    updateRouteMode(null)
    resetCreateForm()
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users?.map((u) => u.user_id) || [])
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return

    try {
      await deleteUsersMutation.mutateAsync(selectedUsers)
      setSelectedUsers([])
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Failed to delete users:', error)
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header title="Users Management" />

      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-sm text-red-500">Failed to load users. Please try refreshing the page.</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Users</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {users ? `${users.length} user${users.length !== 1 ? 's' : ''} found` : 'Loading...'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedUsers.length === 0 || deleteUsersMutation.isPending}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-primary/30 text-slate-700 dark:text-slate-200 bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {deleteUsersMutation.isPending
                    ? 'Deleting...'
                    : selectedUsers.length > 0
                    ? `Remove ${selectedUsers.length}`
                    : 'Remove Users'}
                </span>
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search users by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-background-dark border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
              />
            </div>
            <select
              value={accountStatus}
              onChange={(event) => setAccountStatus(event.target.value as 'active' | 'paused' | 'deleted' | '')}
              className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-background-dark dark:text-white lg:w-56"
            >
              <option value="">All account states</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading users...</p>
              </div>
            ) : users && users.length > 0 ? (
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Bookings
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Account
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.user_id)}
                          onChange={() => handleSelectUser(user.user_id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </p>
                            {user.email && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.phone || '-'}</td>
                      <td className="px-6 py-4">{user.bookings_count || 0}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 capitalize">
                          {user.account_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/users/profiles?id=${user.user_id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <User className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'No users found matching your search.' : 'No users yet.'}
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-block mt-4 text-primary hover:underline font-medium"
                >
                  Add your first user
                </button>
              </div>
            )}
          </div>

          {users && users.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Showing {users.length} user{users.length !== 1 ? 's' : ''}
                {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete selected users</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Delete {selectedUsers.length} selected user account{selectedUsers.length === 1 ? '' : 's'}. This removes the auth users and cascades dependent data.
            </p>
            {deleteUsersMutation.error ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                {deleteUsersMutation.error instanceof Error
                  ? deleteUsersMutation.error.message
                  : 'Failed to delete selected users.'}
              </div>
            ) : null}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={deleteUsersMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create user</h3>
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium dark:border-slate-700"
              >
                Close
              </button>
            </div>

            {createErrors.submit ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                {createErrors.submit}
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="First name" error={createErrors.firstName}>
                <input value={createForm.firstName} onChange={(e) => setCreateForm((prev) => ({ ...prev, firstName: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="John" />
              </Field>
              <Field label="Last name" error={createErrors.lastName}>
                <input value={createForm.lastName} onChange={(e) => setCreateForm((prev) => ({ ...prev, lastName: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Doe" />
              </Field>
              <Field label="Email" error={createErrors.email}>
                <input value={createForm.email} onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="john@example.com" />
              </Field>
              <Field label="Password" error={createErrors.password}>
                <input type="password" value={createForm.password} onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Minimum 6 characters" />
              </Field>
              <Field label="Phone">
                <input value={createForm.phone} onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="+44..." />
              </Field>
              <Field label="Postcode">
                <input value={createForm.postcode} onChange={(e) => setCreateForm((prev) => ({ ...prev, postcode: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="SW1A 1AA" />
              </Field>
              <Field label="Role">
                <select value={createForm.role} onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value as UserRole }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="customer">Customer</option>
                  <option value="handy">Handy</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create user'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}
