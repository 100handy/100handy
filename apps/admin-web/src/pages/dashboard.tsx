import { DollarSign, CheckCircle, Users as UsersIcon, Wrench } from 'lucide-react'
import { format } from 'date-fns'
import Header from '@/components/header'
import { useDashboardMetrics, useRecentActivity, useQuickStats } from '@/lib/api/dashboard'

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics()
  const { data: activity, isLoading: activityLoading, error: activityError } = useRecentActivity(5)
  const { data: quickStats, isLoading: statsLoading, error: statsError } = useQuickStats()

  // KPI data structure with real values
  const kpiData = [
    {
      label: 'Total Revenue',
      value: metrics ? `$${metrics.totalRevenue.toLocaleString()}` : '$0',
      icon: DollarSign,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Tasks Completed',
      value: metrics ? metrics.tasksCompleted.toLocaleString() : '0',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Users',
      value: metrics ? metrics.totalUsers.toLocaleString() : '0',
      icon: UsersIcon,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Total Handys',
      value: metrics ? metrics.totalHandys.toLocaleString() : '0',
      icon: Wrench,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <main className="flex-1">
      <Header title="Overview" />

      <div className="p-6 space-y-8">
        {/* Error state */}
        {metricsError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-red-500">Failed to load dashboard metrics. Please try refreshing the page.</p>
          </div>
        )}

        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div
                  key={kpi.label}
                  className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4"
                >
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <Icon className={`${kpi.iconColor} w-7 h-7`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                    {metricsLoading ? (
                      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <section className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
            {activityError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-500">Failed to load recent activity.</p>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
              {activityLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded flex-1"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : activity && activity.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {item.user.name}
                        </td>
                        <td className="px-6 py-4">{item.task}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[item.statusColor]
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(item.date), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Statistics */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Statistics</h3>
            {statsError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-500">Failed to load statistics.</p>
              </div>
            )}
            <div className="space-y-6">
              {statsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
                  </div>
                ))
              ) : quickStats ? (
                <>
                  <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customer Satisfaction
                    </p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {quickStats.customerSatisfaction.value}
                      <span className="text-lg">{quickStats.customerSatisfaction.suffix}</span>
                    </p>
                    <p className={`text-sm font-medium mt-1 text-${quickStats.customerSatisfaction.changeColor}-500`}>
                      {quickStats.customerSatisfaction.change}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      New Users This Month
                    </p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {quickStats.newUsersThisMonth.value}
                    </p>
                    <p className={`text-sm font-medium mt-1 text-${quickStats.newUsersThisMonth.changeColor}-500`}>
                      {quickStats.newUsersThisMonth.change}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {quickStats.pendingPayments.value}
                    </p>
                    <p className={`text-sm font-medium mt-1 text-${quickStats.pendingPayments.changeColor}-500`}>
                      {quickStats.pendingPayments.change}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
