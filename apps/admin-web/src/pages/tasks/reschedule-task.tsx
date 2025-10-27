import { Save, Calendar, Clock, UserSearch } from 'lucide-react'
import Header from '@/components/header'

export default function RescheduleTaskPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Reschedule Task #12346" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Update the date, time, or assigned Handy for this task.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        {/* Task Summary */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Task Summary
                            </h3>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Task
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white font-medium">
                                        Moving Help
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Customer
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">Sarah Johnson</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Current Handy
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">Alex Parker</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Current Schedule
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        March 16, 2024, 2:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reschedule Form */}
                        <form className="p-6 space-y-6">
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
                                        defaultValue="2024-03-18"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        defaultValue="10:00"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    >
                                        <option>Keep Alex Parker</option>
                                        <option>Find another available Handy</option>
                                        <option>Ben Carter (4.8 stars)</option>
                                        <option>Chloe Davis (4.9 stars)</option>
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
                                    Reason for Rescheduling
                                </label>
                                <textarea
                                    id="reason"
                                    rows={3}
                                    placeholder="e.g., Customer requested a different time."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    className="px-6 py-2 rounded-lg font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
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
