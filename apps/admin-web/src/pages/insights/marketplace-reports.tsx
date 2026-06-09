import { Download, Loader2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useCategoryPerformanceReport,
  useCityCoverageReport,
  useMarketplaceReportSummary,
} from '@/lib/api/reports'
import { useState } from 'react'

export default function MarketplaceReportsPage() {
  const [activeView, setActiveView] = useState<'overview' | 'categories' | 'cities'>('overview')
  const { data: summary, isLoading: summaryLoading } = useMarketplaceReportSummary()
  const { data: categories = [], isLoading: categoriesLoading } = useCategoryPerformanceReport()
  const { data: cities = [], isLoading: citiesLoading } = useCityCoverageReport()

  function exportSectionCsv(kind: 'categories' | 'cities') {
    const rows = kind === 'categories'
      ? [
          ['Category', 'Bookings', 'Revenue'].join(','),
          ...categories.map((row) => [`"${row.category}"`, row.bookings, row.revenue.toFixed(2)].join(',')),
        ]
      : [
          ['City', 'Providers', 'Customers'].join(','),
          ...cities.map((row) => [`"${row.city}"`, row.providers, row.customers].join(',')),
        ]

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${kind}-report-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Marketplace Reports" />

      <main className="flex-1 space-y-6 p-6">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'categories', label: 'Categories' },
            { id: 'cities', label: 'Cities' },
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

        {activeView === 'overview' ? (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <SummaryCard label="Gross revenue" value={summaryLoading ? '...' : `£${(summary?.grossRevenue || 0).toFixed(0)}`} />
          <SummaryCard label="Refunded" value={summaryLoading ? '...' : `£${(summary?.refundedRevenue || 0).toFixed(0)}`} />
          <SummaryCard label="Completed jobs" value={summaryLoading ? '...' : String(summary?.completedBookings || 0)} />
          <SummaryCard label="Active providers" value={summaryLoading ? '...' : String(summary?.activeProviders || 0)} />
          <SummaryCard label="Open disputes" value={summaryLoading ? '...' : String(summary?.openDisputes || 0)} />
          <SummaryCard label="Open tickets" value={summaryLoading ? '...' : String(summary?.openTickets || 0)} />
        </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          {activeView === 'categories' ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Category performance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bookings and paid revenue grouped by category.</p>
              </div>
              <button
                type="button"
                onClick={() => exportSectionCsv('categories')}
                disabled={categories.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-700"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <ReportTable
              loading={categoriesLoading}
              emptyMessage="No category performance data available."
              columns={['Category', 'Bookings', 'Revenue']}
              rows={categories.map((row) => [row.category, String(row.bookings), `£${row.revenue.toFixed(2)}`])}
            />
          </section>
          ) : null}

          {activeView === 'cities' ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">City coverage</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Provider and customer concentration across enabled service areas.</p>
              </div>
              <button
                type="button"
                onClick={() => exportSectionCsv('cities')}
                disabled={cities.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-700"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <ReportTable
              loading={citiesLoading}
              emptyMessage="No city coverage data available."
              columns={['City', 'Providers', 'Customers']}
              rows={cities.map((row) => [row.city, String(row.providers), String(row.customers)])}
            />
          </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function ReportTable({
  loading,
  emptyMessage,
  columns,
  rows,
}: {
  loading: boolean
  emptyMessage: string
  columns: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-200 dark:border-slate-800">
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="px-5 py-4">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
