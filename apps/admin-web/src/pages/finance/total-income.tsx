import { useState } from 'react'
import Header from '../../components/header'
import { DollarSign, Receipt, CreditCard, User, TrendingUp, TrendingDown, Download, Loader2 } from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  useIncomeMetrics,
  useMonthlyIncome,
  useIncomeByCategory,
  useRecentTransactions,
} from '@/lib/api/income'

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

export default function TotalIncome() {
  const [filter, setFilter] = useState<'All' | 'Payout' | 'Fee'>('All')

  const { data: metrics, isLoading: metricsLoading } = useIncomeMetrics()
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyIncome(7)
  const { data: categoryData, isLoading: categoryLoading } = useIncomeByCategory()
  const { data: transactions, isLoading: transactionsLoading } = useRecentTransactions(
    10,
    filter === 'All' ? undefined : filter
  )

  const kpiData = [
    {
      label: 'Total Revenue',
      value: metrics ? formatCurrency(metrics.totalRevenue) : '$0',
      icon: DollarSign,
      change: metrics ? `${metrics.revenueChange > 0 ? '+' : ''}${metrics.revenueChange}%` : '0%',
      isPositive: metrics ? metrics.revenueChange >= 0 : true,
    },
    {
      label: 'Platform Fees',
      value: metrics ? formatCurrency(metrics.platformFees) : '$0',
      icon: Receipt,
      change: metrics ? `${metrics.feesChange > 0 ? '+' : ''}${metrics.feesChange}%` : '0%',
      isPositive: metrics ? metrics.feesChange >= 0 : true,
    },
    {
      label: 'Total Payouts to Handys',
      value: metrics ? formatCurrency(metrics.totalPayouts) : '$0',
      icon: CreditCard,
      change: metrics ? `${metrics.payoutsChange > 0 ? '+' : ''}${metrics.payoutsChange}%` : '0%',
      isPositive: metrics ? metrics.payoutsChange <= 0 : true, // Less payouts relative to revenue is positive
    },
    {
      label: 'Avg. Income per Handy',
      value: metrics ? formatCurrency(metrics.avgIncomePerHandy) : '$0',
      icon: User,
      subtitle: metrics ? `Based on ${metrics.activeHandyCount} active Handys` : 'No data',
    },
  ]

  const isLoading = metricsLoading || monthlyLoading || categoryLoading

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Total Income: Overview${metrics ? ` for ${metrics.activeHandyCount} Handys` : ''}`} />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
                    {metricsLoading ? (
                      <div className="h-9 w-24 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {kpi.value}
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="text-primary w-6 h-6" />
                  </div>
                </div>
                {kpi.change && !metricsLoading && (
                  <p
                    className={`text-xs flex items-center gap-1 mt-2 ${
                      kpi.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {kpi.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{kpi.change} vs last month</span>
                  </p>
                )}
                {kpi.subtitle && !metricsLoading && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <span>{kpi.subtitle}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Breakdown Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Income Breakdown Over Time
            </h3>
            <div className="h-80">
              {monthlyLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : monthlyData && monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      tickFormatter={(value) => `$${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                      }}
                      formatter={(value: number) =>
                        `$${value.toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1173d4"
                      strokeWidth={2}
                      name="Total Revenue"
                      dot={{ fill: '#1173d4', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fees"
                      stroke="#16a34a"
                      strokeWidth={2}
                      name="Platform Fees"
                      dot={{ fill: '#16a34a', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No income data available
                </div>
              )}
            </div>
          </div>

          {/* Revenue by Category Chart */}
          <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue by Task Category
            </h3>
            <div className="h-80">
              {categoryLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : categoryData && categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.name} ${Math.round((entry.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                      }}
                      formatter={(value: number) =>
                        `$${value.toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setFilter(e.target.value as 'All' | 'Payout' | 'Fee')}
                  value={filter}
                >
                  <option value="All">Filter by: All</option>
                  <option value="Payout">Filter by: Payout</option>
                  <option value="Fee">Filter by: Fee</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactionsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : transactions && transactions.length > 0 ? (
                  transactions.map((transaction, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                    >
                      <td className="px-6 py-4">{transaction.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'Payout'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}$
                        {Math.abs(transaction.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
