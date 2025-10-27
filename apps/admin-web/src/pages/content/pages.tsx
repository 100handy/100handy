import { Search, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'

const pages = [
  {
    title: 'Home',
    slug: '/home',
    status: 'Published',
    statusColor: 'green',
    lastModified: '2023-10-27',
  },
  {
    title: 'About Us',
    slug: '/about',
    status: 'Published',
    statusColor: 'green',
    lastModified: '2023-10-25',
  },
  {
    title: 'Services',
    slug: '/services',
    status: 'Draft',
    statusColor: 'blue',
    lastModified: '2023-10-28',
  },
  {
    title: 'Contact Us',
    slug: '/contact',
    status: 'Published',
    statusColor: 'green',
    lastModified: '2023-10-22',
  },
  {
    title: 'Privacy Policy',
    slug: '/privacy-policy',
    status: 'Pending Review',
    statusColor: 'yellow',
    lastModified: '2023-10-29',
  },
  {
    title: 'Terms of Service',
    slug: '/terms-of-service',
    status: 'Published',
    statusColor: 'green',
    lastModified: '2023-10-20',
  },
]

export default function ContentPagesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="All Pages" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full">

          {/* Filters and Actions */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Status Filter */}
              <select className="pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Pending Review</option>
              </select>
            </div>

            {/* Create Button */}
            <Link
              to="/content/pages/create"
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Create New Page
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3" scope="col">Page Title</th>
                  <th className="px-6 py-3" scope="col">URL Slug</th>
                  <th className="px-6 py-3" scope="col">Status</th>
                  <th className="px-6 py-3" scope="col">Last Modified</th>
                  <th className="px-6 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <tr
                    key={index}
                    className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {page.title}
                    </td>
                    <td className="px-6 py-4">{page.slug}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.statusColor === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : page.statusColor === 'blue'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{page.lastModified}</td>
                    <td className="px-6 py-4 text-right">
                      <a className="font-medium text-primary hover:underline" href="#">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
