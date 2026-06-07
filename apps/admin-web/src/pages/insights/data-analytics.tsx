import { Download, TrendingUp, Users, Wrench, CheckCircle2, Star, Loader2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  useAnalyticsKPIs,
  useUserGrowthData,
  useTaskCompletionRate,
} from '@/lib/api/analytics'

export default function DataAnalyticsPage() {
  const { data: kpis, isLoading: kpisLoading } = useAnalyticsKPIs()
  const { data: userGrowthData, isLoading: growthLoading } = useUserGrowthData(7)
  const { data: completionData, isLoading: completionLoading } = useTaskCompletionRate()

  // Calculate completion rate percentage for display
  const completionRate = completionData?.find((d) => d.name === 'Completed')?.value || 0
  const generatedOn = new Date().toISOString().slice(0, 10)

  function downloadCsv(filename: string, rows: string[][]) {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const analyticsReports = [
    {
      name: 'Marketplace KPI Snapshot',
      description: 'Totals for users, providers, completed jobs, and rating trends.',
      lastGenerated: generatedOn,
      download: () =>
        downloadCsv(`analytics-kpis-${generatedOn}.csv`, [
          ['Metric', 'Value'],
          ['Total Users', kpis?.totalUsers ?? 0],
          ['Active Handys', kpis?.activeHandys ?? 0],
          ['Completed Tasks', kpis?.completedTasks ?? 0],
          ['Average Rating', kpis?.averageRating ?? 0],
          ['Users Change %', kpis?.usersChange ?? 0],
          ['Handys Change %', kpis?.handysChange ?? 0],
          ['Tasks Change %', kpis?.tasksChange ?? 0],
        ]),
    },
    {
      name: 'User Growth Trend',
      description: 'Monthly new-customer and new-provider growth over the selected window.',
      lastGenerated: generatedOn,
      download: () =>
        downloadCsv(`analytics-user-growth-${generatedOn}.csv`, [
          ['Month', 'Users', 'Handys'],
          ...(userGrowthData ?? []).map((row) => [row.month, row.users, row.handys]),
        ]),
    },
    {
      name: 'Task Completion Mix',
      description: 'Completed, cancelled, and pending share across bookings.',
      lastGenerated: generatedOn,
      download: () =>
        downloadCsv(`analytics-completion-${generatedOn}.csv`, [
          ['Status', 'Percentage'],
          ...(completionData ?? []).map((row) => [row.name, row.value]),
        ]),
    },
  ]

  function exportAllData() {
    downloadCsv(`analytics-overview-${generatedOn}.csv`, [
      ['Section', 'Key', 'Value'],
      ['KPI', 'Total Users', kpis?.totalUsers ?? 0],
      ['KPI', 'Active Handys', kpis?.activeHandys ?? 0],
      ['KPI', 'Completed Tasks', kpis?.completedTasks ?? 0],
      ['KPI', 'Average Rating', kpis?.averageRating ?? 0],
      ['Growth', 'Generated On', generatedOn],
      ...((userGrowthData ?? []).map((row) => ['Growth', row.month, `${row.users} users / ${row.handys} handys`])),
      ...((completionData ?? []).map((row) => ['Completion', row.name, row.value])),
    ])
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          All Metrics & Performance Reports
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          <button
            type="button"
            onClick={exportAllData}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export All Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              {kpisLoading ? (
                <div className="h-9 w-20 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {kpis?.totalUsers.toLocaleString() || 0}
                </p>
              )}
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          {!kpisLoading && kpis && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>{kpis.usersChange > 0 ? '+' : ''}{kpis.usersChange}% vs last month</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Handys</p>
              {kpisLoading ? (
                <div className="h-9 w-16 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {kpis?.activeHandys.toLocaleString() || 0}
                </p>
              )}
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
          </div>
          {!kpisLoading && kpis && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>{kpis.handysChange > 0 ? '+' : ''}{kpis.handysChange}% vs last month</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
              {kpisLoading ? (
                <div className="h-9 w-20 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {kpis?.completedTasks.toLocaleString() || 0}
                </p>
              )}
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          {!kpisLoading && kpis && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>{kpis.tasksChange > 0 ? '+' : ''}{kpis.tasksChange}% vs last month</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
              {kpisLoading ? (
                <div className="h-9 w-14 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {kpis?.averageRating.toFixed(2) || '0.00'}
                </p>
              )}
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Based on all reviews</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth Over Time
          </h3>
          <div className="h-80">
            {growthLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : userGrowthData && userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="users" name="New Users" fill="#1173d4" />
                  <Bar dataKey="handys" name="New Handys" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No growth data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completion Rate
          </h3>
          <div className="h-80 flex items-center justify-center">
            {completionLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : completionData && completionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No completion data available</p>
            )}
          </div>
          {!completionLoading && (
            <>
              <div className="text-center mt-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                {completionData?.map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Exports */}
      <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Exports
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3">Export</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Last Generated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyticsReports.map((report) => (
                <tr
                  key={report.name}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </td>
                  <td className="px-6 py-4">{report.description}</td>
                  <td className="px-6 py-4">{report.lastGenerated}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={report.download} className="text-primary hover:underline">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
