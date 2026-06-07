import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/header'
import { AlertTriangle, Loader2, MapPin, PauseCircle, RotateCcw, Trash2 } from 'lucide-react'
import {
  useAccountStatusUsers,
  useUpdateAccountLifecycleStatus,
  useUsersWithLocation,
  type AccountLifecycleStatus,
  type AccountStatusUser,
  type UserWithLocation,
} from '@/lib/api/accounts'
import { format } from 'date-fns'
import { useLocation } from 'react-router-dom'

type FilterType = 'deleted' | 'paused' | 'location'

function getUserName(user: Pick<AccountStatusUser, 'first_name' | 'last_name'> | UserWithLocation): string {
  const parts = [user.first_name, user.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown User'
}

function formatLocation(user: UserWithLocation): string {
  if (!user.address) return 'No location set'
  const parts = [user.address.city, user.address.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : user.address.postcode
}

function getInitialFilter(pathname: string): FilterType {
  if (pathname.includes('/accounts/deleted')) return 'deleted'
  if (pathname.includes('/accounts/paused')) return 'paused'
  return 'location'
}

export default function AccountStatus() {
  const location = useLocation()
  const [activeFilter, setActiveFilter] = useState<FilterType>(() => getInitialFilter(location.pathname))
  const { data: pausedUsers, isLoading: pausedLoading, error: pausedError } = useAccountStatusUsers('paused')
  const { data: deletedUsers, isLoading: deletedLoading, error: deletedError } = useAccountStatusUsers('deleted')
  const { data: locationUsers, isLoading: locationLoading, error: locationError } = useUsersWithLocation()
  const updateStatus = useUpdateAccountLifecycleStatus()
  const [reasonDrafts, setReasonDrafts] = useState<Record<string, string>>({})
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setActiveFilter(getInitialFilter(location.pathname))
  }, [location.pathname])

  const currentUsers = useMemo(() => {
    if (activeFilter === 'paused') return pausedUsers ?? []
    if (activeFilter === 'deleted') return deletedUsers ?? []
    return []
  }, [activeFilter, pausedUsers, deletedUsers])

  const currentLoading =
    activeFilter === 'paused'
      ? pausedLoading
      : activeFilter === 'deleted'
        ? deletedLoading
        : locationLoading

  const currentError =
    activeFilter === 'paused'
      ? pausedError
      : activeFilter === 'deleted'
        ? deletedError
        : locationError

  const handleStatusChange = async (
    user: AccountStatusUser,
    nextStatus: AccountLifecycleStatus,
  ) => {
    const reason = reasonDrafts[user.user_id] || user.status_reason || ''
    try {
      await updateStatus.mutateAsync({
        userId: user.user_id,
        status: nextStatus,
        reason,
      })
      const label =
        nextStatus === 'active'
          ? 'restored'
          : nextStatus === 'paused'
            ? 'paused'
            : 'soft-deleted'
      setActionFeedback({
        tone: 'success',
        message: `${getUserName(user)} was ${label} successfully.`,
      })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to update account status.',
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Status Filter" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View and manage lifecycle status and default-location coverage for platform accounts.
            </p>
          </header>

          {actionFeedback && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                actionFeedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
              }`}
            >
              {actionFeedback.message}
            </div>
          )}

          <div className="bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter by:</h3>
              <div className="flex items-center gap-2">
                {(['deleted', 'paused', 'location'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      activeFilter === filter
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === 'deleted'
                      ? 'Deleted Accounts'
                      : filter === 'paused'
                        ? 'Paused Accounts'
                        : 'Default Location'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {currentError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300">Failed to load account data</h4>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
                      {currentError instanceof Error ? currentError.message : 'An unexpected error occurred'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeFilter === 'location' ? (
              <LocationTable users={locationUsers ?? []} isLoading={locationLoading} />
            ) : (
              <StatusTable
                filter={activeFilter}
                users={currentUsers}
                isLoading={currentLoading}
                isMutating={updateStatus.isPending}
                reasonDrafts={reasonDrafts}
                onReasonChange={(userId, value) => setReasonDrafts((prev) => ({ ...prev, [userId]: value }))}
                onRestore={(user) => handleStatusChange(user, 'active')}
                onPause={(user) => handleStatusChange(user, 'paused')}
                onDelete={(user) => handleStatusChange(user, 'deleted')}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatusTable({
  filter,
  users,
  isLoading,
  isMutating,
  reasonDrafts,
  onReasonChange,
  onRestore,
  onPause,
  onDelete,
}: {
  filter: 'deleted' | 'paused'
  users: AccountStatusUser[]
  isLoading: boolean
  isMutating: boolean
  reasonDrafts: Record<string, string>
  onReasonChange: (userId: string, value: string) => void
  onRestore: (user: AccountStatusUser) => void
  onPause: (user: AccountStatusUser) => void
  onDelete: (user: AccountStatusUser) => void
}) {
  const title = filter === 'deleted' ? 'Deleted Accounts' : 'Paused Accounts'

  return (
    <>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Updated</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No {filter} accounts found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {getUserName(user)}
                  </td>
                  <td className="px-6 py-4">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 min-w-[260px]">
                    <input
                      value={reasonDrafts[user.user_id] ?? user.status_reason ?? ''}
                      onChange={(e) => onReasonChange(user.user_id, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Reason"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(user.deleted_at ?? user.status_updated_at), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onRestore(user)}
                        disabled={isMutating}
                        className="inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </button>
                      {filter === 'paused' && (
                        <button
                          onClick={() => onDelete(user)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Soft delete
                        </button>
                      )}
                      {filter === 'deleted' && (
                        <button
                          onClick={() => onPause(user)}
                          disabled={isMutating}
                          className="inline-flex items-center gap-1 text-amber-700 hover:underline disabled:opacity-50"
                        >
                          <PauseCircle className="h-4 w-4" />
                          Pause instead
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function LocationTable({
  users,
  isLoading,
}: {
  users: UserWithLocation[]
  isLoading: boolean
}) {
  return (
    <>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Default Location Settings</h3>
      {isLoading ? (
        <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No location data found</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">No users have set a primary address yet.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Default Location</th>
                <th className="px-6 py-3">Set Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {getUserName(user)}
                  </td>
                  <td className="px-6 py-4">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4">{formatLocation(user)}</td>
                  <td className="px-6 py-4">
                    {user.address?.created_at ? format(new Date(user.address.created_at), 'yyyy-MM-dd') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
