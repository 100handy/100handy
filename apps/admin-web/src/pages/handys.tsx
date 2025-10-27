import { Search, Plus } from 'lucide-react'
import Header from '@/components/header'

const handys = [
    { name: 'Sophia Carter', status: 'Active', email: 'sophia.carter@email.com', phone: '(555) 123-4567', location: 'New York', tasks: '125', rating: '4.8', statusColor: 'green' },
    { name: 'Ethan Bennett', status: 'Inactive', email: 'ethan.bennett@email.com', phone: '(555) 987-6543', location: 'Los Angeles', tasks: '80', rating: '4.5', statusColor: 'gray' },
    { name: 'Olivia Hayes', status: 'Active', email: 'olivia.hayes@email.com', phone: '(555) 246-8013', location: 'Chicago', tasks: '200', rating: '4.9', statusColor: 'green' },
    { name: 'Liam Foster', status: 'Active', email: 'liam.foster@email.com', phone: '(555) 369-1470', location: 'San Francisco', tasks: '150', rating: '4.7', statusColor: 'green' },
    { name: 'Ava Morgan', status: 'Inactive', email: 'ava.morgan@email.com', phone: '(555) 789-0123', location: 'Houston', tasks: '50', rating: '4.2', statusColor: 'gray' },
]

const statusColors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export default function HandysPage() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Handys Management" />

            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">All Handys</h2>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
                            <Plus className="w-5 h-5" />
                            <span>Add Handy</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="search"
                                placeholder="Search Handys by name, email, or city..."
                                className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                        Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        Status
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">
                                        Contact
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white md:table-cell">
                                        Location
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                                        Tasks
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">
                                        Rating
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-background-dark">
                                {handys.map((handy) => (
                                    <tr key={handy.email}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                            {handy.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[handy.statusColor as keyof typeof statusColors]}`}>
                                                <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                                                    <circle cx="4" cy="4" r="3" />
                                                </svg>
                                                {handy.status}
                                            </span>
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                                            <div>{handy.email}</div>
                                            <div>{handy.phone}</div>
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                                            {handy.location}
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                                            {handy.tasks}
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                                            {handy.rating}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <a href="#" className="text-primary hover:text-primary/80">
                                                View Profile
                                                <span className="sr-only">, {handy.name}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}
