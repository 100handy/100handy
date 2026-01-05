import { useState } from 'react'
import Header from '../../components/header'
import { AlertTriangle, MapPin, Trash2, PauseCircle, Info } from 'lucide-react'
import { useUsersWithLocation, type UserWithLocation } from '@/lib/api/accounts'
import { format } from 'date-fns'

type FilterType = 'deleted' | 'paused' | 'location'

function getUserName(user: UserWithLocation): string {
  const parts = [user.first_name, user.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown User'
}

function formatLocation(user: UserWithLocation): string {
  if (!user.address) return 'No location set'
  const parts = [user.address.city, user.address.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : user.address.postcode
}

export default function AccountStatus() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('location')

  const { data: locationUsers, isLoading, error } = useUsersWithLocation()

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Status Filter" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View and manage accounts based on their status.
            </p>
          </header>

          {/* Filter Tabs */}
          <div className="bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter by:</h3>
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'deleted'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('deleted')}
                >
                  Deleted Accounts
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'paused'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('paused')}
                >
                  Paused Accounts
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'location'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('location')}
                >
                  Default Location
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-8">
            {/* Deleted Accounts - Feature not available */}
            {activeFilter === 'deleted' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Deleted Accounts
                </h3>
                <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Feature Not Available
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                      Deleted account tracking requires additional database setup. Currently, when users are deleted,
                      their data is permanently removed from the system.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        Enable soft-delete functionality to track deleted accounts
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Paused Accounts - Feature not available */}
            {activeFilter === 'paused' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Paused Accounts
                </h3>
                <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <PauseCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Feature Not Available
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                      Account pausing requires a status field to be added to the user profiles.
                      This feature is not yet implemented in the database schema.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        Add account status field to enable pause/unpause functionality
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Default Location - Connected to DB */}
            {activeFilter === 'location' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Default Location Settings
                </h3>

                {/* Error state */}
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-300">
                          Failed to load location data
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
                  <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && locationUsers && locationUsers.length === 0 && (
                  <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                        No location data found
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No users have set a primary address yet.
                      </p>
                    </div>
                  </div>
                )}

                {/* Data table */}
                {!isLoading && !error && locationUsers && locationUsers.length > 0 && (
                  <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                          <th className="px-6 py-3" scope="col">
                            User
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Email
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Default Location
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Set Date
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {locationUsers.map((user) => (
                          <tr
                            key={user.user_id}
                            className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                          >
                            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                              {getUserName(user)}
                            </td>
                            <td className="px-6 py-4">{user.email || 'N/A'}</td>
                            <td className="px-6 py-4">{formatLocation(user)}</td>
                            <td className="px-6 py-4">
                              {user.address?.created_at
                                ? format(new Date(user.address.created_at), 'yyyy-MM-dd')
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <a className="font-medium text-primary hover:underline" href="#">
                                Edit Location
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
