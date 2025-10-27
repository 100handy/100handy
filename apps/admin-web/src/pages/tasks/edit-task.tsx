import { Save } from 'lucide-react'
import Header from '@/components/header'

export default function EditTaskPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Edit Task #12346" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Modify the details of task #12346
                        </p>
                    </div>

                    <form className="space-y-8">
                        {/* Task Details */}
                        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                                Task Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        defaultValue="Need help moving a couch, a bed frame, and a few boxes from a 2nd-floor apartment to a moving truck. No stairs involved, but the couch is heavy."
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
                                        name="category"
                                        defaultValue="Moving Help"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option>General Help</option>
                                        <option>Moving Help</option>
                                        <option>Plumbing</option>
                                        <option>Electrical</option>
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
                                        name="status"
                                        defaultValue="Scheduled"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option>Open</option>
                                        <option>Scheduled</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option>
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
                                        name="date"
                                        defaultValue="2024-03-16"
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
                                        name="time"
                                        defaultValue="14:00"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="location"
                                        className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                                    >
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        defaultValue="123 Main St, Los Angeles, CA 90001"
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
                                        name="handy"
                                        defaultValue="Alex Parker"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option>Unassigned</option>
                                        <option>Alex Parker</option>
                                        <option>Ben Carter</option>
                                        <option>Chloe Davis</option>
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
                                        name="customer"
                                        defaultValue="Sarah Johnson"
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
