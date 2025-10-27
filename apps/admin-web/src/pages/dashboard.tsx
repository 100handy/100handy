import { DollarSign, CheckCircle, Users as UsersIcon, Wrench } from 'lucide-react'
import Header from '@/components/header'

const kpiData = [
  { label: 'Total Revenue', value: '$120,500', icon: DollarSign, iconColor: 'text-primary', bgColor: 'bg-primary/10' },
  { label: 'Tasks Completed', value: '3,450', icon: CheckCircle, iconColor: 'text-green-500', bgColor: 'bg-green-500/10' },
  { label: 'Total Users', value: '15,000', icon: UsersIcon, iconColor: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  { label: 'Total Handys', value: '5,000', icon: Wrench, iconColor: 'text-red-500', bgColor: 'bg-red-500/10' },
]

const quickStats = [
  { label: 'Customer Satisfaction', value: '4.8', suffix: '/5', change: '+5% from last month', changeColor: 'text-green-500' },
  { label: 'New Users This Month', value: '250', change: '+10% from last month', changeColor: 'text-green-500' },
  { label: 'Pending Payments', value: '$5,000', change: '12 pending transactions', changeColor: 'text-gray-500' },
]

const recentActivity = [
  { user: 'Sophia Clark', task: 'Plumbing Repair', status: 'Completed', date: '2024-07-26', statusColor: 'green' },
  { user: 'Ethan Carter', task: 'Furniture Assembly', status: 'In Progress', date: '2024-07-27', statusColor: 'yellow' },
  { user: 'Olivia Bennett', task: 'Cleaning Service', status: 'Scheduled', date: '2024-07-28', statusColor: 'blue' },
  { user: 'Liam Foster', task: 'Electrical Work', status: 'Completed', date: '2024-07-25', statusColor: 'green' },
  { user: 'Ava Hughes', task: 'Moving Help', status: 'Completed', date: '2024-07-24', statusColor: 'green' },
]

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
}

export default function DashboardPage() {
  return (
    <main className="flex-1">
      <Header title="Overview" />

      <div className="p-6 space-y-8">
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
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
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
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{activity.user}</td>
                      <td className="px-6 py-4">{activity.task}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[activity.statusColor as keyof typeof statusColors]
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{activity.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Statistics</h3>
            <div className="space-y-6">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {stat.value}
                    {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${stat.changeColor}`}>{stat.change}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
