import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminState'
import { AdminTableBody, AdminTableHead, AdminTableShell } from '@/components/admin/AdminTable'
import { useTasks, useTaskStatusCounts, statusDisplayMap } from '@/lib/api/tasks'
import type { BookingStatus } from '@/lib/database.types'

const statusColors = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

type StatusFilter = 'all' | BookingStatus

const ITEMS_PER_PAGE = 10

interface TaskListPageProps {
  pageTitle?: string
  forcedStatus?: Exclude<StatusFilter, 'all'>
}

export default function TaskListPage({
  pageTitle = 'Bookings',
  forcedStatus,
}: TaskListPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(forcedStatus ?? 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const effectiveStatusFilter = forcedStatus ?? statusFilter

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch tasks with filters
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useTasks({
    search: debouncedSearch || undefined,
    status: effectiveStatusFilter === 'all' ? undefined : effectiveStatusFilter,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  })

  // Fetch status counts for tabs
  const { data: statusCounts } = useTaskStatusCounts()

  const handleStatusFilterChange = (status: StatusFilter) => {
    if (forcedStatus) return
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatLocation = (address: { city: string | null; postcode: string } | null) => {
    if (!address) return 'No address'
    const parts = [address.city, address.postcode].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'No address'
  }

  const totalCount =
    effectiveStatusFilter === 'all'
      ? statusCounts?.all || 0
      : statusCounts?.[effectiveStatusFilter as keyof typeof statusCounts] || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title={pageTitle} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review bookings, booking status, assigned providers, and scheduled work.
            </p>
          </div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings by ID, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {!forcedStatus && (
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => handleStatusFilterChange('all')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  effectiveStatusFilter === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                All Bookings {statusCounts?.all !== undefined && `(${statusCounts.all})`}
              </button>
              <button
                onClick={() => handleStatusFilterChange('pending')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  effectiveStatusFilter === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Open {statusCounts?.pending !== undefined && `(${statusCounts.pending})`}
              </button>
              <button
                onClick={() => handleStatusFilterChange('accepted')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  effectiveStatusFilter === 'accepted'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Scheduled {statusCounts?.accepted !== undefined && `(${statusCounts.accepted})`}
              </button>
              <button
                onClick={() => handleStatusFilterChange('completed')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  effectiveStatusFilter === 'completed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Completed {statusCounts?.completed !== undefined && `(${statusCounts.completed})`}
              </button>
              <button
                onClick={() => handleStatusFilterChange('cancelled')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  effectiveStatusFilter === 'cancelled'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Cancelled {statusCounts?.cancelled !== undefined && `(${statusCounts.cancelled})`}
              </button>
              </nav>
            </div>
          )}

          {isLoading && (
            <AdminLoadingState label="Loading bookings..." />
          )}

          {error && (
            <AdminErrorState
              title="Failed to load bookings"
              description={error.message}
              onRetry={() => void refetch()}
            />
          )}

          {!isLoading && !error && tasks?.length === 0 && (
            <AdminEmptyState
              title="No bookings found"
              description={searchQuery ? 'Try adjusting your search or filter.' : 'Bookings will appear here as customers request work.'}
            />
          )}

          {!isLoading && !error && tasks && tasks.length > 0 && (
            <AdminTableShell minWidth={900}>
                <AdminTableHead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Task ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Scheduled Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </AdminTableHead>
                <AdminTableBody>
                  {tasks.map((task) => {
                    const statusDisplay = statusDisplayMap[task.status]
                    return (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{task.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {task.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatLocation(task.address)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(task.scheduled_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[statusDisplay.color]}`}
                          >
                            {statusDisplay.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/tasks/details/${task.id}`}
                            className="text-primary hover:text-primary/80"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </AdminTableBody>
            </AdminTableShell>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalCount > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                </span>{' '}
                of <span className="font-medium">{totalCount}</span> results
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
                  disabled={currentPage >= totalPages}
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
