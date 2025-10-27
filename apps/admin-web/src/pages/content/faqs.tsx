import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import Header from '@/components/header'

const faqItems = [
    {
        question: 'How do I reset my password?',
        category: 'Account',
        lastModified: '2023-10-29',
    },
    {
        question: 'What payment methods do you accept?',
        category: 'Payments',
        lastModified: '2023-10-28',
    },
    {
        question: 'How do I book a handyman?',
        category: 'Services',
        lastModified: '2023-10-27',
    },
    {
        question: 'What is your cancellation policy?',
        category: 'General',
        lastModified: '2023-10-26',
    },
    {
        question: 'How do I contact customer support?',
        category: 'General',
        lastModified: '2023-10-25',
    },
]

export default function FAQsPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="FAQs Management" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-full mx-auto">
                    {/* Search, Filter, and Add Button */}
                    <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                className="w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="relative">
                            <select className="w-48 pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                                <option>All Categories</option>
                                <option>General</option>
                                <option>Account</option>
                                <option>Payments</option>
                                <option>Services</option>
                            </select>
                        </div>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Add New FAQ
                    </button>
                </div>

                {/* FAQs Table */}
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Question
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Modified
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqItems.map((faq, index) => (
                                <tr
                                    key={index}
                                    className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {faq.question}
                                    </td>
                                    <td className="px-6 py-4">{faq.category}</td>
                                    <td className="px-6 py-4">{faq.lastModified}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-primary hover:underline mr-4">
                                            <Edit className="w-4 h-4 inline" />
                                        </button>
                                        <button className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add/Edit FAQ Form */}
                <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        Add / Edit FAQ
                    </h3>
                    <form>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="faq-question"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Question
                                </label>
                                <input
                                    type="text"
                                    id="faq-question"
                                    placeholder="Enter the question"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="faq-answer"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Answer
                                </label>
                                <textarea
                                    id="faq-answer"
                                    rows={6}
                                    placeholder="Enter the answer"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="faq-category"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="faq-category"
                                        className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    >
                                        <option>Select a category</option>
                                        <option>General</option>
                                        <option>Account</option>
                                        <option>Payments</option>
                                        <option>Services</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90"
                                >
                                    Save FAQ
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
