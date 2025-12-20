import { Edit, Calendar, X, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '@/components/header'
import { useTask, statusDisplayMap } from '@/lib/api/tasks'

const statusColors = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { data: task, isLoading, error } = useTask(taskId)

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return `${date} ${time}`
    }
  }

  const formatLocation = (
    address: { street: string; city: string | null; postcode: string } | null
  ) => {
    if (!address) return 'No address provided'
    const parts = [address.street, address.city, address.postcode].filter(Boolean)
    return parts.join(', ')
  }

  const formatName = (firstName: string | null, lastName: string | null) => {
    const parts = [firstName, lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Task Details" />
        <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-500">Loading task details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Task Details" />
        <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              Failed to load task: {error.message}
            </div>
            <Link to="/tasks" className="mt-4 inline-block text-primary hover:underline">
              ← Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Task Details" />
        <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Task not found</p>
              <Link to="/tasks" className="mt-4 inline-block text-primary hover:underline">
                ← Back to Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusDisplay = statusDisplayMap[task.status]

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Task Details #${task.id.slice(0, 8)}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/tasks" className="text-primary hover:underline text-sm">
              ← Back to Tasks
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Viewing details for task #{task.id.slice(0, 8)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Task Information */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Task Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Task ID
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">
                      #{task.id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[statusDisplay.color]}`}
                      >
                        {statusDisplay.label}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {task.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Scheduled Date & Time
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {formatDateTime(task.scheduled_date, task.scheduled_time)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Location
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {formatLocation(task.address)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Title
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">
                      {task.task_title}
                    </p>
                  </div>
                  {task.task_details && (
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </label>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">{task.task_details}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Hourly Rate
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      ${(task.hourly_rate_cents / 100).toFixed(2)}/hr
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Estimated Hours
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">{task.estimated_hours} hrs</p>
                  </div>
                </div>
              </div>

              {/* Chat History - Placeholder */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  Chat History
                </h3>
                <div className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Chat history is not available for this task.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Assigned Handy */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Assigned Handy
                </h3>
                {task.handy ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center flex items-center justify-center"
                      style={
                        task.handy.avatar_url
                          ? { backgroundImage: `url('${task.handy.avatar_url}')` }
                          : {}
                      }
                    >
                      {!task.handy.avatar_url && (
                        <span className="text-2xl text-gray-500 dark:text-gray-400">
                          {(task.handy.first_name?.[0] || 'H').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatName(task.handy.first_name, task.handy.last_name)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <span>⭐</span>
                        <span>{task.handy.rating.toFixed(1)}</span>
                      </div>
                      {task.handy.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.handy.phone}
                        </p>
                      )}
                      <Link
                        to={`/users/profile/${task.handy.user_id}`}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No handy assigned yet</p>
                )}
              </div>

              {/* Customer */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Customer
                </h3>
                {task.customer ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center flex items-center justify-center"
                      style={
                        task.customer.avatar_url
                          ? { backgroundImage: `url('${task.customer.avatar_url}')` }
                          : {}
                      }
                    >
                      {!task.customer.avatar_url && (
                        <span className="text-2xl text-gray-500 dark:text-gray-400">
                          {(task.customer.first_name?.[0] || 'C').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatName(task.customer.first_name, task.customer.last_name)}
                      </p>
                      {task.customer.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.customer.phone}
                        </p>
                      )}
                      <Link
                        to={`/users/profile/${task.customer.user_id}`}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No customer information</p>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Actions</h3>
                <div className="space-y-3">
                  <Link
                    to={`/tasks/edit/${task.id}`}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Task
                  </Link>
                  {task.status !== 'completed' && task.status !== 'cancelled' && (
                    <>
                      <Link
                        to={`/tasks/reschedule/${task.id}`}
                        className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-yellow-600"
                      >
                        <Calendar className="w-5 h-5" />
                        Reschedule Task
                      </Link>
                      <Link
                        to={`/tasks/cancel/${task.id}`}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                        Cancel Task
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
