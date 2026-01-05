import { useState } from 'react'
import { Search, Trash2, AlertTriangle, Loader2, X } from 'lucide-react'
import Header from '@/components/header'
import { useUsers, useDeleteUser, type UserWithDetails } from '@/lib/api/users'

export default function RemoveUsersPage() {
  const [search, setSearch] = useState('')
  const [userToDelete, setUserToDelete] = useState<UserWithDetails | null>(null)

  const { data: users, isLoading, error } = useUsers({ search: search || undefined })
  const deleteUserMutation = useDeleteUser()

  const handleDeleteClick = (user: UserWithDetails) => {
    setUserToDelete(user)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUserMutation.mutateAsync(userToDelete.user_id)
      setUserToDelete(null)
    } catch (err) {
      // Error is handled by mutation state
      console.error('Failed to delete user:', err)
    }
  }

  const handleCancelDelete = () => {
    setUserToDelete(null)
  }

  const getUserName = (user: UserWithDetails) => {
    const parts = [user.first_name, user.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown User'
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Remove Users" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            {/* Search input */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users by name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                />
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300">
                      Failed to load users
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
                      {error instanceof Error ? error.message : 'An unexpected error occurred'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    </div>
                    <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && users && users.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {search
                    ? `No users match "${search}". Try a different search term.`
                    : 'There are no users in the system yet.'}
                </p>
              </div>
            )}

            {/* Users list */}
            {!isLoading && !error && users && users.length > 0 && (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={getUserName(user)}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium text-sm">
                            {(user.first_name?.[0] || user.last_name?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {getUserName(user)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email || user.phone || 'No contact info'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      disabled={deleteUserMutation.isPending}
                      className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Warning notice */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                    Confirmation Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400/80 mt-1">
                    Removing a user is a permanent action and cannot be undone. Please
                    be certain before proceeding. A confirmation prompt will appear
                    after clicking the 'Remove' button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Confirm User Removal
              </h3>
              <button
                onClick={handleCancelDelete}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-4">
                {userToDelete.avatar_url ? (
                  <img
                    src={userToDelete.avatar_url}
                    alt={getUserName(userToDelete)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {(userToDelete.first_name?.[0] || userToDelete.last_name?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {getUserName(userToDelete)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {userToDelete.email || userToDelete.phone || 'No contact info'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to permanently remove this user? This action cannot be undone
                and will delete all associated data.
              </p>

              {deleteUserMutation.error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {deleteUserMutation.error instanceof Error
                      ? deleteUserMutation.error.message
                      : 'Failed to delete user. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleteUserMutation.isPending}
                className="px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteUserMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Remove User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
