import { GripVertical, Edit, Trash2, Plus } from 'lucide-react'
import Header from '@/components/header'

const menuItems = [
    {
        label: 'Home',
        link: '/',
    },
    {
        label: 'Services',
        link: '/services',
    },
    {
        label: 'About Us',
        link: '/about',
    },
    {
        label: 'Blog',
        link: '/blog',
    },
    {
        label: 'Contact',
        link: '/contact',
    },
]

export default function NavigationPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Navigation Menu Editor" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto">
                    {/* Main Navigation Items */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Main Navigation Items
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Drag and drop to reorder menu items.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                                >
                                    <GripVertical className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-grab mr-4" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Links to: {item.link}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-full text-red-500 hover:bg-red-500/10">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add/Edit Menu Item Form */}
                    <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Add / Edit Menu Item
                        </h3>
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="menu-item-label"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Label
                                    </label>
                                    <input
                                        type="text"
                                        id="menu-item-label"
                                        placeholder="e.g. Home"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="menu-item-link"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Link
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <select
                                                id="menu-item-page"
                                                className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                            >
                                                <option>Link to a page</option>
                                                <option>/ (Home)</option>
                                                <option>/services (Services)</option>
                                                <option>/about (About Us)</option>
                                                <option>/blog (Blog)</option>
                                                <option>/contact (Contact)</option>
                                                <option>/faq (FAQs)</option>
                                            </select>
                                        </div>
                                        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            or
                                        </span>
                                        <input
                                            type="url"
                                            id="menu-item-url"
                                            placeholder="Enter an external URL"
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Menu Item
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
