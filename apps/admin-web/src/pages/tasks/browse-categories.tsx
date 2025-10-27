import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'

const categories = [
    { name: 'Home Services', subcategories: 'Cleaning, Plumbing, Electrical', totalTasks: '1,250', status: 'Active', statusColor: 'green' },
    { name: 'Moving & Packing', subcategories: 'Packing, Unpacking, Heavy Lifting', totalTasks: '890', status: 'Active', statusColor: 'green' },
    { name: 'Assembly', subcategories: 'Furniture Assembly, TV Mounting', totalTasks: '720', status: 'Active', statusColor: 'green' },
    { name: 'Outdoor & Yard', subcategories: 'Gardening, Lawn Mowing', totalTasks: '550', status: 'Inactive', statusColor: 'yellow' },
    { name: 'Shopping & Delivery', subcategories: 'Grocery Shopping, Errand Running', totalTasks: '980', status: 'Active', statusColor: 'green' },
]

const trendingServices = ['Cleaning', 'Plumbing', 'Handyman', 'Mounting']
const trendingColors = ['blue', 'green', 'yellow', 'purple']

const statusColors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
}

const badgeColors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
}

export default function BrowseCategoriesPage() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Browse Categories" />

            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/tasks/categories/edit"
                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <Edit className="w-5 h-5" />
                                Edit Categories
                            </Link>
                            <Link
                                to="/tasks/categories/delete"
                                className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete Categories
                            </Link>
                        </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
                            <Plus className="w-5 h-5" />
                            Add Category
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Trending Services</h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingServices.map((service, index) => (
                                        <span
                                            key={service}
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeColors[trendingColors[index] as keyof typeof badgeColors]}`}
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Subcategories
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total Tasks
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
                                {categories.map((category) => (
                                    <tr key={category.name}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {category.subcategories}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {category.totalTasks}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[category.statusColor as keyof typeof statusColors]}`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary hover:text-primary/80 mr-4">Edit</button>
                                            <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                            <span className="font-medium">12</span> categories
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
