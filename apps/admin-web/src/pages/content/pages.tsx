import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Header from '@/components/header'
import { pageRegistry } from '@/lib/cms/page-registry'
import { useAllPagesLastUpdated } from '@/lib/api/site-content'

export default function ContentPagesPage() {
  const { data: lastUpdated } = useAllPagesLastUpdated()

  const pages = Object.entries(pageRegistry).map(([key, def]) => ({
    key,
    title: def.label,
    slug: def.slug,
    sectionCount: Object.keys(def.sections).length,
    fieldCount: Object.values(def.sections).reduce(
      (sum, s) => sum + Object.keys(s.fields).length,
      0
    ),
    lastModified: lastUpdated?.[key] ?? null,
  }))

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Content Pages" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full">
          {/* Search */}
          <div className="flex items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3" scope="col">Page</th>
                  <th className="px-6 py-3" scope="col">URL</th>
                  <th className="px-6 py-3" scope="col">Sections</th>
                  <th className="px-6 py-3" scope="col">Fields</th>
                  <th className="px-6 py-3" scope="col">Last Modified</th>
                  <th className="px-6 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.key}
                    className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{page.slug}</td>
                    <td className="px-6 py-4">{page.sectionCount}</td>
                    <td className="px-6 py-4">{page.fieldCount}</td>
                    <td className="px-6 py-4">
                      {page.lastModified
                        ? format(new Date(page.lastModified), 'MMM d, yyyy')
                        : <span className="text-gray-400 italic">Not yet edited</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/content/pages/${page.key}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
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
