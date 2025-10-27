import { Search, Plus } from 'lucide-react'
import Header from '@/components/header'

const tasks = [
  { id: '#12345', category: 'Furniture Assembly', location: 'San Francisco, CA', date: '2024-03-15', status: 'Open', statusColor: 'blue' },
  { id: '#12346', category: 'Moving Help', location: 'Los Angeles, CA', date: '2024-03-16', status: 'Scheduled', statusColor: 'yellow' },
  { id: '#12347', category: 'Cleaning', location: 'New York, NY', date: '2024-03-17', status: 'Completed', statusColor: 'green' },
  { id: '#12348', category: 'Yard Work', location: 'Chicago, IL', date: '2024-03-18', status: 'Cancelled', statusColor: 'red' },
  { id: '#12349', category: 'Errands', location: 'Houston, TX', date: '2024-03-19', status: 'Open', statusColor: 'blue' },
]

const statusColors = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

export default function TaskListPage() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title="Task List" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by ID, category, location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#"
                className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                All Tasks
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Open
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Scheduled
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Completed
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Cancelled
              </a>
            </nav>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-800">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {task.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {task.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {task.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {task.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.statusColor as keyof typeof statusColors]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary hover:text-primary/80">
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">25</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
