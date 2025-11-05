import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Trash2, User } from 'lucide-react'
import Header from '@/components/header'
import { useUsers, useDeleteUsers } from '@/lib/api/users'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Fetch users with search filter
  const { data: users, isLoading, error } = useUsers({
    search: searchQuery,
    role: 'customer', // Only show customers by default
  })

  const deleteUsersMutation = useDeleteUsers()

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

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      await deleteUsersMutation.mutateAsync(selectedUsers)
      setSelectedUsers([])
    } catch (error) {
      console.error('Failed to delete users:', error)
      alert('Failed to delete some users. Please try again.')
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
              <Link
                to="/users/add"
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </Link>
              <button
                onClick={handleDeleteSelected}
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

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search users by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-background-dark border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
              />
            </div>
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
                <Link
                  to="/users/add"
                  className="inline-block mt-4 text-primary hover:underline font-medium"
                >
                  Add your first user
                </Link>
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
    </main>
  )
}
