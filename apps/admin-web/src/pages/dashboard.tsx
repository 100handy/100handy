import { format } from 'date-fns'
import {
  Activity,
  AlertTriangle,
  CreditCard,
  LifeBuoy,
  Scale,
  TrendingUp,
  UserRound,
  Wrench,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Header from '@/components/header'
import { useDashboardOverview } from '@/lib/api/dashboard'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  in_progress: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

const CARD_ICONS = [
  UserRound,
  Wrench,
  Activity,
  Activity,
  TrendingUp,
  TrendingUp,
  CreditCard,
  Scale,
  CreditCard,
  AlertTriangle,
  LifeBuoy,
  CreditCard,
]

function formatMetric(value: number, formatType: 'number' | 'currency') {
  if (formatType === 'currency') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return new Intl.NumberFormat('en-GB').format(value)
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview()

  const metricCards = data ? Object.values(data.metrics) : []

  return (
    <main className="flex-1">
      <Header title="Admin Dashboard" />

      <div className="space-y-8 p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Failed to load dashboard data.'}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metricCards.map((metric, index) => {
            const Icon = CARD_ICONS[index] || Activity
            return (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                {isLoading ? (
                  <div className="mt-4 h-8 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                    {formatMetric(metric.value, metric.format)}
                  </p>
                )}
              </div>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bookings & Revenue</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Six-month booking and revenue trend.</p>
            </div>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ) : !data?.trends?.length ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No booking or revenue trend data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415522" />
                    <XAxis dataKey="label" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#64748b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bookings" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Marketplace Growth</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">New providers and customers per month.</p>
            </div>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ) : !data?.trends?.length ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No marketplace growth data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415522" />
                    <XAxis dataKey="label" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="providerGrowth" name="Providers" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="customerGrowth" name="Customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900/50">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Bookings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Latest customer jobs entering the marketplace.</p>
          </div>
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : !data || data.recentBookings.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">No bookings available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Job</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Provider</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Scheduled</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{booking.task_title}</td>
                      <td className="px-5 py-4">{booking.customer_name}</td>
                      <td className="px-5 py-4">{booking.provider_name}</td>
                      <td className="px-5 py-4">{booking.category_name}</td>
                      <td className="px-5 py-4">{format(new Date(booking.scheduled_date), 'dd MMM yyyy')}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {booking.status.replaceAll('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
