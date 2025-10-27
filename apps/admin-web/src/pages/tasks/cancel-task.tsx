import { useState } from 'react'
import { X } from 'lucide-react'
import Header from '@/components/header'

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
    description:
      'A scheduling conflict has arisen that prevents the task from being completed.',
  },
  {
    value: 'other',
    title: 'Other',
    description: 'Please provide more details below.',
  },
]

export default function CancelTaskPage() {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Cancel Task #12346" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Cancelling task "Moving Help" for Sarah Johnson.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Reason for Cancellation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please select a reason for cancelling this task. This information will
              be logged for administrative purposes.
            </p>

            <div className="space-y-4">
              {cancellationReasons.map((reason, index) => (
                <label
                  key={reason.value}
                  className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary dark:has-[:checked]:bg-primary/20 dark:has-[:checked]:border-primary"
                >
                  <input
                    type="radio"
                    name="cancellation_reason"
                    value={reason.value}
                    defaultChecked={index === 0}
                    className="form-radio h-5 w-5 text-primary focus:ring-primary mt-0.5"
                  />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {reason.title}
                    </h4>
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
                placeholder="Provide any additional context for the cancellation..."
                className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Confirmation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Are you sure you want to permanently cancel this task? This action
                cannot be undone.
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

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={!isConfirmed}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
