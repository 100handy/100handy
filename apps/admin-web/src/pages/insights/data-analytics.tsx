import { Download, TrendingUp, Users, Wrench, CheckCircle2, Star } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const userGrowthData = [
  { month: 'Jan', users: 1200, handys: 200 },
  { month: 'Feb', users: 1500, handys: 250 },
  { month: 'Mar', users: 1800, handys: 300 },
  { month: 'Apr', users: 1700, handys: 280 },
  { month: 'May', users: 2100, handys: 350 },
  { month: 'Jun', users: 2400, handys: 400 },
  { month: 'Jul', users: 2300, handys: 380 },
]

const completionData = [
  { name: 'Completed', value: 85, color: '#16a34a' },
  { name: 'Cancelled', value: 10, color: '#ef4444' },
  { name: 'Pending', value: 5, color: '#f97316' },
]

const reports = [
  {
    name: 'Monthly User Acquisition',
    description: 'Detailed breakdown of new user and handy sign-ups.',
    lastGenerated: '2024-07-01',
  },
  {
    name: 'Task Category Performance',
    description: 'Analysis of task volume and revenue per category.',
    lastGenerated: '2024-07-28',
  },
  {
    name: 'Handy Engagement & Retention',
    description: 'Metrics on handy activity, earnings, and churn rate.',
    lastGenerated: '2024-07-25',
  },
  {
    name: 'Platform Fee Analysis',
    description: 'In-depth report on collected platform fees vs. payouts.',
    lastGenerated: '2024-07-29',
  },
]

export default function DataAnalyticsPage() {
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
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">15,789</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>5.2% vs last month</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Handys</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1,234</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>3.1% vs last month</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">22,456</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>8.7% vs last month</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">4.85</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>+0.02 vs last month</span>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="users" name="New Users" fill="#1173d4" />
                <Bar dataKey="handys" name="New Handys" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completion Rate
          </h3>
          <div className="h-80 flex items-center justify-center">
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
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">85%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            {completionData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Reports Table */}
      <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Reports
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3">Report Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Last Generated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </td>
                  <td className="px-6 py-4">{report.description}</td>
                  <td className="px-6 py-4">{report.lastGenerated}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">View</button>
                    <button className="ml-4 text-primary hover:underline">Download</button>
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
