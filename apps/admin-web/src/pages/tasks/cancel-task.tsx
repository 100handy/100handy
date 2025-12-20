import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/header'
import { useTask, useCancelTask } from '@/lib/api/tasks'

const cancellationReasons = [
  {
    value: 'customer_request',
    title: 'Customer Request',
    description: 'The customer requested to cancel the task.',
  },
  {
    value: 'handy_unavailable',
    title: 'Handy Unavailable',
    description: 'The assigned Handy is no longer available to complete the task.',
  },
  {
    value: 'scheduling_conflict',
    title: 'Scheduling Conflict',
    description: 'A scheduling conflict has arisen that prevents the task from being completed.',
  },
  {
    value: 'other',
    title: 'Other',
    description: 'Please provide more details below.',
  },
]

export default function CancelTaskPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()

  const { data: task, isLoading, error: taskError } = useTask(taskId)
  const cancelTask = useCancelTask()

  const [isConfirmed, setIsConfirmed] = useState(false)
  const [selectedReason, setSelectedReason] = useState('customer_request')
  const [additionalDetails, setAdditionalDetails] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskId || !isConfirmed) return

    try {
      await cancelTask.mutateAsync(taskId)
      navigate('/tasks')
    } catch (error) {
      console.error('Failed to cancel task:', error)
    }
  }

  const formatName = (firstName: string | null, lastName: string | null) => {
    const parts = [firstName, lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Cancel Task" />
        <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  if (taskError || !task) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Cancel Task" />
        <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              {taskError ? `Failed to load task: ${taskError.message}` : 'Task not found'}
            </div>
            <Link to="/tasks" className="mt-4 inline-block text-primary hover:underline">
              ← Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (task.status === 'cancelled') {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Cancel Task" />
        <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-400">
              This task has already been cancelled.
            </div>
            <Link to="/tasks" className="mt-4 inline-block text-primary hover:underline">
              ← Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Cancel Task #${task.id.slice(0, 8)}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to={`/tasks/details/${task.id}`} className="text-primary hover:underline text-sm">
              ← Back to Task Details
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Cancelling task "{task.category?.name || task.task_title}" for{' '}
              {task.customer
                ? formatName(task.customer.first_name, task.customer.last_name)
                : 'Unknown Customer'}
              .
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Reason for Cancellation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Please select a reason for cancelling this task. This information will be logged for
                administrative purposes.
              </p>

              <div className="space-y-4">
                {cancellationReasons.map((reason) => (
                  <label
                    key={reason.value}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedReason === reason.value
                        ? 'bg-primary/10 border-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellation_reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="form-radio h-5 w-5 text-primary focus:ring-primary mt-0.5"
                    />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{reason.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {reason.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="cancellation_details"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Additional Details (Optional)
                </label>
                <textarea
                  id="cancellation_details"
                  name="cancellation_details"
                  rows={4}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Provide any additional context for the cancellation..."
                  className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-primary focus:border-primary px-4 py-2"
                />
              </div>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Confirmation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you sure you want to permanently cancel this task? This action cannot be
                  undone.
                </p>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="confirmation_checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    I understand this action is irreversible.
                  </span>
                </label>
              </div>

              {/* Error message */}
              {cancelTask.error && (
                <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                  Failed to cancel task: {cancelTask.error.message}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-4">
                <Link
                  to={`/tasks/details/${task.id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Go Back
                </Link>
                <button
                  type="submit"
                  disabled={!isConfirmed || cancelTask.isPending}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {cancelTask.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
