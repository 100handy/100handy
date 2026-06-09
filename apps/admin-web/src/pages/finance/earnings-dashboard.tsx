import { useState, useMemo } from 'react'
import { Search, Download, ChevronDown, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useHandyEarnings, type HandyEarningsFilters } from '@/lib/api/earnings'
import Header from '@/components/header'

const statusColors = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
}

const statusLabels = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  none: 'No Payouts',
}

type SortOption = HandyEarningsFilters['sortBy']

export default function EarningsDashboardPage() {
  const [activeView, setActiveView] = useState<'earnings' | 'filters'>('earnings')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('earnings_desc')
  const [page, setPage] = useState(1)
  const limit = 10

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, error } = useHandyEarnings({
    search: debouncedSearch,
    sortBy,
    page,
    limit,
  })

  const handyEarnings = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption)
    setPage(1)
  }

  const handleExport = () => {
    // Export functionality - convert to CSV
    if (!handyEarnings.length) return

    const headers = ['ID', 'Name', 'Total Earnings', 'Tasks Completed', 'Last Payout', 'Status']
    const rows = handyEarnings.map((h) => [
      h.id,
      h.name,
      `£${h.totalEarnings.toFixed(2)}`,
      h.tasksCompleted.toString(),
      h.lastPayoutDate || 'N/A',
      statusLabels[h.payoutStatus],
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `handy-earnings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="flex-1">
      <Header title="Provider Earnings" />

      <div className="p-6 space-y-6">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {[
            { id: 'earnings', label: 'Earnings list' },
            { id: 'filters', label: 'Filters' },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id as typeof activeView)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === view.id
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {activeView === 'filters' ? (
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Handy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="earnings_desc">Sort by: Earnings (High to Low)</option>
                <option value="earnings_asc">Sort by: Earnings (Low to High)</option>
                <option value="name_asc">Sort by: Name (A-Z)</option>
                <option value="name_desc">Sort by: Name (Z-A)</option>
                <option value="tasks_desc">Sort by: Tasks (Most)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Use <span className="font-medium">Filters</span> to search providers or change the sort order.
          </div>
          )}
          <button
            onClick={handleExport}
            disabled={!handyEarnings.length}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
            Error loading earnings data. Please try again.
          </div>
        )}

        {activeView === 'earnings' ? (
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Handy
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Earnings
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tasks Completed
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Payout
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Loading earnings data...
                      </p>
                    </td>
                  </tr>
                ) : handyEarnings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {debouncedSearch
                        ? 'No handys found matching your search.'
                        : 'No handy earnings data available.'}
                    </td>
                  </tr>
                ) : (
                  handyEarnings.map((handy) => (
                    <tr
                      key={handy.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {handy.avatar_url ? (
                            <img
                              alt={handy.name}
                              className="w-10 h-10 rounded-full object-cover"
                              src={handy.avatar_url}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {handy.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {handy.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {handy.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                        £{handy.totalEarnings.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{handy.tasksCompleted}</td>
                      <td className="px-6 py-4">{handy.lastPayoutDate || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[handy.payoutStatus]
                          }`}
                        >
                          {statusLabels[handy.payoutStatus]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/handys/${handy.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        ) : null}

        {activeView === 'earnings' && !isLoading && total > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} Handys
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
