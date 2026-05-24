import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Trash2, Loader2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import { useCategories, useUpdateCategory } from '@/lib/api/categories'

const ITEMS_PER_PAGE = 10

export default function BrowseCategoriesPage() {
  const { hasPermission } = useAuth()
  const canManageTasks = hasPermission('tasks.manage')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: categories,
    isLoading,
    error,
  } = useCategories({
    search: debouncedSearch || undefined,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  })
  const updateCategory = useUpdateCategory()

  // Get top categories by task count for trending
  const trendingCategories = useMemo(() => {
    if (!categories) return []
    return [...categories].sort((a, b) => b.tasks_count - a.tasks_count).slice(0, 4)
  }, [categories])

  const trendingColors = ['blue', 'green', 'yellow', 'purple'] as const

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    if (!canManageTasks) return
    if (!categories) return
    const sorted = [...categories].sort((a, b) => a.display_order - b.display_order)
    const index = sorted.findIndex((item) => item.id === categoryId)
    if (index === -1) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= sorted.length) return

    const current = sorted[index]
    const target = sorted[swapIndex]

    await Promise.all([
      updateCategory.mutateAsync({
        categoryId: current.id,
        display_order: target.display_order,
      }),
      updateCategory.mutateAsync({
        categoryId: target.id,
        display_order: current.display_order,
      }),
    ])
  }

  const levelLabels = {
    0: 'Main',
    1: 'Sub',
  } as const

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title="Browse Categories" />

      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {!canManageTasks && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view categories, but it cannot change visibility, order, or catalog data.
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link
                to="/tasks/categories/edit"
                className={`bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Edit className="w-5 h-5" />
                Edit Categories
              </Link>
              <Link
                to="/tasks/categories/delete"
                className={`bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Trash2 className="w-5 h-5" />
                Delete Categories
              </Link>
            </div>
            <Link
              to="/tasks/categories/edit"
              className={`bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Plus className="w-5 h-5" />
              Add Category
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Top Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingCategories.map((category, index) => (
                    <span
                      key={category.id}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeColors[trendingColors[index % trendingColors.length]]}`}
                    >
                      {category.name}
                    </span>
                  ))}
                  {trendingCategories.length === 0 && !isLoading && (
                    <span className="text-sm text-gray-500">No categories yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading categories...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              Failed to load categories: {error.message}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && categories?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No categories found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try adjusting your search
                </p>
              )}
            </div>
          )}

          {/* Categories table */}
          {!isLoading && !error && categories && categories.length > 0 && (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Category Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Media
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Public Routing
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Total Tasks
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-800">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex flex-col gap-1">
                          <span>{category.name}</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {levelLabels[category.level as 0 | 1] ?? `Level ${category.level}`}
                            </span>
                            {category.supports_recurring && (
                              <span className="text-xs rounded-full px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                Recurring
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MediaThumb src={category.icon_url} alt={`${category.name} icon`} label="Icon" />
                          <MediaThumb src={category.hero_image_url} alt={`${category.name} hero`} label="Hero" />
                          <MediaThumb src={category.content_image_url} alt={`${category.name} content`} label="Content" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                        <div className="space-y-1">
                          <div>{category.route_slug ? `/services/${category.route_slug}` : 'No route slug'}</div>
                          <div className="truncate">
                            {category.marketing_title || category.marketing_description || category.description || 'No public copy'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              category.active
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {category.active ? 'Live' : 'Hidden'}
                          </span>
                          <button
                            type="button"
                            disabled={updateCategory.isPending || !canManageTasks}
                            onClick={() =>
                              updateCategory.mutate({
                                categoryId: category.id,
                                active: !category.active,
                              })
                            }
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              category.active
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300'
                            } disabled:opacity-50`}
                          >
                            {category.active ? 'Turn off' : 'Turn on'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {category.tasks_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          disabled={!canManageTasks}
                          onClick={() => moveCategory(category.id, 'up')}
                          className="text-gray-600 hover:text-gray-900 mr-2 disabled:opacity-50"
                        >
                          <ArrowUp className="w-4 h-4 inline" />
                        </button>
                        <button
                          type="button"
                          disabled={!canManageTasks}
                          onClick={() => moveCategory(category.id, 'down')}
                          className="text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50"
                        >
                          <ArrowDown className="w-4 h-4 inline" />
                        </button>
                        <Link
                          to="/tasks/categories/edit"
                          className={`text-primary hover:text-primary/80 mr-4 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
                        >
                          Edit Media
                        </Link>
                        <Link
                          to="/tasks/categories/delete"
                          className={`text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && categories && categories.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{categories.length}</span> categories
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={categories.length < ITEMS_PER_PAGE}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function MediaThumb({
  src,
  alt,
  label,
}: {
  src?: string | null
  alt: string
  label: string
}) {
  if (!src) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-500" title={`${label}: not set`}>
        <ImageIcon className="h-4 w-4" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      title={label}
      className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
    />
  )
}
