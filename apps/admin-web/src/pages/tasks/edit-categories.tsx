import { Plus, GripVertical, Edit, Trash2 } from 'lucide-react'
import Header from '@/components/header'

const categories = [
    { id: 1, name: 'Home Services', isParent: true, indent: 0 },
    { id: 2, name: 'Moving & Packing', isParent: true, indent: 0 },
    { id: 3, name: 'Packing & Unpacking', isParent: false, indent: 1 },
    { id: 4, name: 'Assembly', isParent: true, indent: 0 },
    { id: 5, name: 'Outdoor & Yard', isParent: true, indent: 0 },
]

export default function EditCategoriesPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Edit Categories" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 ml-auto">
                            <Plus className="w-5 h-5" />
                            Add Category
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Manage Categories */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Manage Categories
                                    </h3>
                                    <ul className="space-y-3">
                                        {categories.map((category) => (
                                            <li
                                                key={category.id}
                                                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg ${category.indent > 0 ? 'pl-10' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <button className="text-gray-400 dark:text-gray-500 cursor-grab">
                                                        <GripVertical className="w-5 h-5" />
                                                    </button>
                                                    <span
                                                        className={
                                                            category.isParent
                                                                ? 'font-medium text-gray-800 dark:text-gray-200'
                                                                : 'text-gray-600 dark:text-gray-400'
                                                        }
                                                    >
                                                        {category.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Add/Edit Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Add/Edit Category
                                </h3>
                                <form className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="category-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            id="category-name"
                                            placeholder="e.g., Home Cleaning"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="parent-category"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Parent Category (optional)
                                        </label>
                                        <select
                                            id="parent-category"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">None</option>
                                            <option>Home Services</option>
                                            <option>Moving & Packing</option>
                                            <option>Assembly</option>
                                            <option>Outdoor & Yard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="category-description"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="category-description"
                                            rows={3}
                                            placeholder="Briefly describe the category..."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="category-active"
                                            defaultChecked
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="category-active"
                                            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                        >
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
