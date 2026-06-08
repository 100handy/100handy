import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import { useBulkUpdateCategories, useCategories, useUpdateCategory } from '@/lib/api/categories'
import { trackAdminEvent } from '@/lib/analytics'

const ITEMS_PER_PAGE = 10
export default function BrowseCategoriesPage() {
  const { hasPermission } = useAuth()
  const canManageTasks = hasPermission('tasks.manage')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [levelFilter, setLevelFilter] = useState<'all' | 'main' | 'sub'>('all')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

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
    level: levelFilter === 'all' ? undefined : levelFilter === 'main' ? 0 : 1,
  })
  const updateCategory = useUpdateCategory()
  const bulkUpdateCategories = useBulkUpdateCategories()
  const selectedCategories = useMemo(
    () => (categories || []).filter((category) => selectedCategoryIds.includes(category.id)),
    [categories, selectedCategoryIds],
  )
  const allVisibleSelected = categories?.length ? categories.every((category) => selectedCategoryIds.includes(category.id)) : false

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

    setActionFeedback(null)
    try {
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
      trackAdminEvent('admin_category_order_updated', {
        category_id: current.id,
        swapped_with: target.id,
        direction,
      })
      setActionFeedback({ tone: 'success', message: 'Category order updated.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update order.' })
    }
  }

  const levelLabels = {
    0: 'Main',
    1: 'Sub',
  } as const

  const toggleSelectedCategory = (categoryId: string, checked: boolean) => {
    setSelectedCategoryIds((prev) =>
      checked ? [...new Set([...prev, categoryId])] : prev.filter((id) => id !== categoryId),
    )
  }

  const toggleSelectAllVisible = (checked: boolean) => {
    if (!categories) return
    setSelectedCategoryIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...categories.map((category) => category.id)])]
      }
      const visibleIds = new Set(categories.map((category) => category.id))
      return prev.filter((id) => !visibleIds.has(id))
    })
  }

  const handleBulkToggle = async (active: boolean) => {
    if (!canManageTasks || selectedCategoryIds.length === 0) return
    const categoryIds = selectedCategoryIds
    setActionFeedback(null)
    try {
      await bulkUpdateCategories.mutateAsync({
        categoryIds,
        updates: { active },
      })
      trackAdminEvent('admin_category_bulk_visibility_updated', {
        category_ids: categoryIds,
        active,
        count: categoryIds.length,
      })
      setSelectedCategoryIds([])
      setActionFeedback({ tone: 'success', message: `${active ? 'Enabled' : 'Disabled'} ${categoryIds.length} categories.` })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update categories.' })
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title="Service Categories" />

      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="mx-auto w-full max-w-none">
          {actionFeedback && (
            <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              actionFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300'
                : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300'
            }`}>
              {actionFeedback.message}
            </div>
          )}
          {!canManageTasks && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view categories, but it cannot change visibility, order, or catalog data.
            </div>
          )}
          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage the service catalog customers see across web and app.
            </p>
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/tasks/categories/edit"
                className={`bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Edit className="w-5 h-5" />
                Open editor
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

          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value as 'all' | 'main' | 'sub')
                setCurrentPage(1)
              }}
              className="min-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="all">All levels</option>
              <option value="main">Main categories</option>
              <option value="sub">Subcategories</option>
            </select>
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Bulk visibility</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Turn selected categories on or off across web and app.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                    disabled={!categories?.length}
                  />
                  Select visible
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedCategoryIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => handleBulkToggle(true)}
                  disabled={!canManageTasks || selectedCategoryIds.length === 0 || bulkUpdateCategories.isPending}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Turn on selected
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkToggle(false)}
                  disabled={!canManageTasks || selectedCategoryIds.length === 0 || bulkUpdateCategories.isPending}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Turn off selected
                </button>
              </div>
            </div>
            {selectedCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategories.slice(0, 12).map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {category.name}
                  </span>
                ))}
                {selectedCategories.length > 12 && (
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    +{selectedCategories.length - 12} more
                  </span>
                )}
              </div>
            )}
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
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
              <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
                <colgroup>
                  <col className="w-12" />
                  <col className="w-[46%]" />
                  <col className="w-[16%]" />
                  <col className="w-[12%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3">
                      <span className="sr-only">Select</span>
                    </th>
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
                      Availability
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Tasks
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-800">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(category.id)}
                          onChange={(e) => toggleSelectedCategory(category.id, e.target.checked)}
                          disabled={!canManageTasks}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex flex-col gap-1">
                          <span>{category.name}</span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {category.route_slug ? `/services/${category.route_slug}` : 'No route slug'}
                          </div>
                          <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {category.marketing_title || category.marketing_description || category.description || 'No public copy'}
                          </div>
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
                              updateCategory.mutate(
                                {
                                  categoryId: category.id,
                                  active: !category.active,
                                },
                                {
                                  onSuccess: () =>
                                    (() => {
                                      trackAdminEvent('admin_category_visibility_updated', {
                                        category_id: category.id,
                                        category_name: category.name,
                                        active: !category.active,
                                      })
                                      setActionFeedback({
                                        tone: 'success',
                                        message: `${category.name} was turned ${category.active ? 'off' : 'on'} successfully.`,
                                      })
                                    })(),
                                  onError: (error) =>
                                    setActionFeedback({
                                      tone: 'error',
                                      message: error instanceof Error ? error.message : 'Failed to update category visibility.',
                                    }),
                                },
                              )
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
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="font-medium text-gray-900 dark:text-white">{category.tasks_count}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="ml-auto flex max-w-[180px] flex-wrap items-center justify-end gap-x-3 gap-y-2">
                          <button
                            type="button"
                            disabled={!canManageTasks}
                            onClick={() => moveCategory(category.id, 'up')}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Move up"
                          >
                            <ArrowUp className="inline h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={!canManageTasks}
                            onClick={() => moveCategory(category.id, 'down')}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Move down"
                          >
                            <ArrowDown className="inline h-4 w-4" />
                          </button>
                          <Link
                            to="/tasks/categories/edit"
                            className={`text-primary hover:text-primary/80 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
                          >
                            Edit
                          </Link>
                        </div>
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
