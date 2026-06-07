import { useState, useMemo } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { useHandys } from '@/lib/api/handys'

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

const ITEMS_PER_PAGE = 10

export default function HandysPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch handys
  const {
    data: handys,
    isLoading,
    error,
  } = useHandys({
    search: debouncedSearch || undefined,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  })

  const formatName = (firstName: string | null, lastName: string | null) => {
    const parts = [firstName, lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown'
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title="Handys Management" />

      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              All Handys
            </h2>
            <Link
              to="/handys/selection-process"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              Review Applicants
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="search"
                placeholder="Search Handys by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading handys...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              Failed to load handys: {error.message}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && handys?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No handys found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try adjusting your search
                </p>
              )}
            </div>
          )}

          {/* Handys table */}
          {!isLoading && !error && handys && handys.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white md:table-cell"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white sm:table-cell"
                    >
                      Tasks
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white lg:table-cell"
                    >
                      Rating
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-background-dark">
                  {handys.map((handy) => {
                    const verificationStatus = (handy.handy_profile as { verification_status?: string | null } | null)?.verification_status
                    const isVerified = handy.handy_profile?.verified ?? false
                    const statusColor = isVerified ? 'green' : 'gray'
                    const statusLabel = isVerified
                      ? 'Verified'
                      : verificationStatus === 'submitted'
                      ? 'Pending Review'
                      : 'Needs Setup'

                    return (
                      <tr key={handy.user_id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {formatName(handy.first_name, handy.last_name)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[statusColor]}`}
                          >
                            <svg
                              className="-ml-0.5 mr-1.5 h-2 w-2"
                              fill="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                          <div>{handy.email || 'No email'}</div>
                          <div>{handy.phone || 'No phone'}</div>
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                          {handy.postcode || 'Unknown'}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                          {handy.jobs_completed}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                          {handy.rating.toFixed(1)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/handys/${handy.user_id}`} className="text-primary hover:text-primary/80">
                            View Profile
                            <span className="sr-only">
                              , {formatName(handy.first_name, handy.last_name)}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && handys && handys.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{handys.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={handys.length < ITEMS_PER_PAGE}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
