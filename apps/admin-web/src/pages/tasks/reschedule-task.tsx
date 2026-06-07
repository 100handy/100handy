import { useState, useEffect } from 'react'
import { Save, Calendar, Clock, UserSearch, Loader2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/header'
import { emitAdminToast } from '@/lib/admin-toast'
import { useTask, useRescheduleTask } from '@/lib/api/tasks'
import { useAvailableHandys } from '@/lib/api/handys'

export default function RescheduleTaskPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()

  const { data: task, isLoading: taskLoading, error: taskError } = useTask(taskId)
  const { data: handys, isLoading: handysLoading } = useAvailableHandys()
  const rescheduleTask = useRescheduleTask()

  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    handy_id: '',
    reason: '',
  })

  useEffect(() => {
    if (task) {
      setFormData({
        scheduled_date: task.scheduled_date || '',
        scheduled_time: task.scheduled_time || '',
        handy_id: task.handy_id || '',
        reason: '',
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskId) return

    try {
      await rescheduleTask.mutateAsync({
        taskId,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        handy_id: formData.handy_id || undefined,
      })
      navigate(`/tasks/details/${taskId}`)
    } catch (error) {
      emitAdminToast({
        tone: 'error',
        title: 'Failed to reschedule booking',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`)
      return dateObj.toLocaleDateString('en-GB', {
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

  const formatName = (firstName: string | null, lastName: string | null) => {
    const parts = [firstName, lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown'
  }

  const isLoading = taskLoading || handysLoading

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Reschedule Task" />
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
        <Header title="Reschedule Task" />
        <div className="flex-1 p-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-4xl mx-auto">
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

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Reschedule Task #${task.id.slice(0, 8)}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to={`/tasks/details/${task.id}`} className="text-primary hover:underline text-sm">
              ← Back to Task Details
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Update the date, time, or assigned Handy for this task.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Task Summary */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Task Summary</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Task
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {task.category?.name || task.task_title}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Customer
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {task.customer
                      ? formatName(task.customer.first_name, task.customer.last_name)
                      : 'No customer'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Handy
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {task.handy
                      ? formatName(task.handy.first_name, task.handy.last_name)
                      : 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Schedule
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {formatDateTime(task.scheduled_date, task.scheduled_time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reschedule Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="new-date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  New Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="new-date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-time"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  New Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="new-time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="assign-handy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Reassign Handy (Optional)
                </label>
                <div className="relative">
                  <select
                    id="assign-handy"
                    value={formData.handy_id}
                    onChange={(e) => setFormData({ ...formData, handy_id: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="">
                      {task.handy
                        ? `Keep ${formatName(task.handy.first_name, task.handy.last_name)}`
                        : 'Select a handy'}
                    </option>
                    {handys
                      ?.filter((h) => h.user_id !== task.handy_id)
                      .map((handy) => (
                        <option key={handy.user_id} value={handy.user_id}>
                          {handy.name} ({handy.rating.toFixed(1)} ⭐)
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Reason for Rescheduling (Optional)
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Customer requested a different time."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Error message */}
              {rescheduleTask.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                  Failed to reschedule task: {rescheduleTask.error.message}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Link
                  to={`/tasks/details/${task.id}`}
                  className="px-6 py-2 rounded-lg font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={rescheduleTask.isPending}
                  className="px-6 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {rescheduleTask.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
