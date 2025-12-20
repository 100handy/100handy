import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/header'
import { useTask, useUpdateTask } from '@/lib/api/tasks'
import { useCategories } from '@/lib/api/categories'
import { useAvailableHandys } from '@/lib/api/handys'
import type { BookingStatus } from '@/lib/database.types'

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: 'Open' },
  { value: 'accepted', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()

  const { data: task, isLoading: taskLoading, error: taskError } = useTask(taskId)
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: handys, isLoading: handysLoading } = useAvailableHandys()
  const updateTask = useUpdateTask()

  // Form state
  const [formData, setFormData] = useState({
    task_title: '',
    task_details: '',
    category_id: '',
    status: 'pending' as BookingStatus,
    scheduled_date: '',
    scheduled_time: '',
    handy_id: '',
  })

  // Initialize form data when task loads
  useEffect(() => {
    if (task) {
      setFormData({
        task_title: task.task_title || '',
        task_details: task.task_details || '',
        category_id: task.category_id || '',
        status: task.status,
        scheduled_date: task.scheduled_date || '',
        scheduled_time: task.scheduled_time || '',
        handy_id: task.handy_id || '',
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskId) return

    try {
      await updateTask.mutateAsync({
        taskId,
        task_title: formData.task_title,
        task_details: formData.task_details || undefined,
        category_id: formData.category_id || undefined,
        status: formData.status,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        handy_id: formData.handy_id || undefined,
      })
      navigate(`/tasks/details/${taskId}`)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const formatName = (firstName: string | null, lastName: string | null) => {
    const parts = [firstName, lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Unknown'
  }

  const isLoading = taskLoading || categoriesLoading || handysLoading

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Edit Task" />
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
        <Header title="Edit Task" />
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
      <Header title={`Edit Task #${task.id.slice(0, 8)}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to={`/tasks/details/${task.id}`} className="text-primary hover:underline text-sm">
              ← Back to Task Details
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Modify the details of task #{task.id.slice(0, 8)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Details */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Task Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="task_title"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="task_title"
                    value={formData.task_title}
                    onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="task_details"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="task_details"
                    rows={4}
                    value={formData.task_details}
                    onChange={(e) => setFormData({ ...formData, task_details: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as BookingStatus })
                    }
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="handy"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Assigned Handy
                  </label>
                  <select
                    id="handy"
                    value={formData.handy_id}
                    onChange={(e) => setFormData({ ...formData, handy_id: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Unassigned</option>
                    {handys?.map((handy) => (
                      <option key={handy.user_id} value={handy.user_id}>
                        {handy.name} ({handy.rating.toFixed(1)} ⭐)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="customer"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    Customer
                  </label>
                  <input
                    type="text"
                    id="customer"
                    value={
                      task.customer
                        ? formatName(task.customer.first_name, task.customer.last_name)
                        : 'No customer'
                    }
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {updateTask.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                Failed to update task: {updateTask.error.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Link
                to={`/tasks/details/${task.id}`}
                className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateTask.isPending}
                className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {updateTask.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
