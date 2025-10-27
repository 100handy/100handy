import { useState } from 'react';
import Header from '../../components/header';
import { DollarSign, Receipt, CreditCard, User, TrendingUp, TrendingDown, Download } from 'lucide-react';
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
} from 'recharts';

const kpiData = [
  {
    label: 'Total Revenue',
    value: '$1.2M',
    icon: DollarSign,
    change: '+12.5%',
    isPositive: true,
  },
  {
    label: 'Platform Fees',
    value: '$240K',
    icon: Receipt,
    change: '+10.2%',
    isPositive: true,
  },
  {
    label: 'Total Payouts to Handys',
    value: '$960K',
    icon: CreditCard,
    change: '-1.8%',
    isPositive: false,
  },
  {
    label: 'Avg. Income per Handy',
    value: '$9,600',
    icon: User,
    subtitle: 'Based on 100 active Handys',
  },
];

const incomeData = [
  { month: 'Jan', revenue: 562500, fees: 112500 },
  { month: 'Feb', revenue: 675000, fees: 135000 },
  { month: 'Mar', revenue: 825000, fees: 165000 },
  { month: 'Apr', revenue: 937500, fees: 187500 },
  { month: 'May', revenue: 1125000, fees: 225000 },
  { month: 'Jun', revenue: 1050000, fees: 210000 },
  { month: 'Jul', revenue: 1200000, fees: 240000 },
];

const categoryData = [
  { name: 'Plumbing', value: 350000, color: '#1173d4' },
  { name: 'Cleaning', value: 280000, color: '#16a34a' },
  { name: 'Assembly', value: 220000, color: '#f97316' },
  { name: 'Electrical', value: 180000, color: '#facc15' },
  { name: 'Moving', value: 170000, color: '#6b7280' },
];

const transactions = [
  {
    date: '2024-07-28',
    description: 'Payout to James M. (#12345)',
    type: 'Payout',
    amount: -1250.75,
  },
  {
    date: '2024-07-28',
    description: 'Platform Fee from Task #54321',
    type: 'Fee',
    amount: 25.0,
  },
  {
    date: '2024-07-27',
    description: 'Payout to Michael C. (#11223)',
    type: 'Payout',
    amount: -2110.2,
  },
  {
    date: '2024-07-27',
    description: 'Platform Fee from Task #98765',
    type: 'Fee',
    amount: 42.2,
  },
];

export default function TotalIncome() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Total Income: Overview for 100 Handys" />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {kpi.value}
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="text-primary w-6 h-6" />
                  </div>
                </div>
                {kpi.change && (
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
                {kpi.subtitle && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <span>{kpi.subtitle}</span>
                  </p>
                )}
              </div>
            );
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeData}>
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
            </div>
          </div>

          {/* Revenue by Category Chart */}
          <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue by Task Category
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                      `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
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
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                >
                  <option>Filter by: All</option>
                  <option>Filter by: Payout</option>
                  <option>Filter by: Fee</option>
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
                {transactions.map((transaction, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
