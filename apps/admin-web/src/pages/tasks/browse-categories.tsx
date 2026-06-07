import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Loader2, ArrowUp, ArrowDown, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import { useBulkUpdateCategories, useCategories, useCategoryAreaCoverageMatrix, useUpdateCategory } from '@/lib/api/categories'

const ITEMS_PER_PAGE = 10
const SITE_ASSET_BASE = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

function resolvePreviewUrl(src?: string | null) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/')) {
    return SITE_ASSET_BASE ? `${SITE_ASSET_BASE}${src}` : src
  }
  return SITE_ASSET_BASE ? `${SITE_ASSET_BASE}/${src}` : src
}

export default function BrowseCategoriesPage() {
  const { hasPermission } = useAuth()
  const canManageTasks = hasPermission('tasks.manage')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [levelFilter, setLevelFilter] = useState<'all' | 'main' | 'sub'>('all')
  const [includeChildrenForBulk, setIncludeChildrenForBulk] = useState(true)
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
  const { data: coverageMatrix, isLoading: coverageMatrixLoading } = useCategoryAreaCoverageMatrix()

  // Get top categories by task count for trending
  const trendingCategories = useMemo(() => {
    if (!categories) return []
    return [...categories].sort((a, b) => b.tasks_count - a.tasks_count).slice(0, 4)
  }, [categories])

  const trendingColors = ['blue', 'green', 'yellow', 'purple'] as const
  const selectedCategories = useMemo(
    () => (categories || []).filter((category) => selectedCategoryIds.includes(category.id)),
    [categories, selectedCategoryIds],
  )
  const allVisibleSelected = categories?.length ? categories.every((category) => selectedCategoryIds.includes(category.id)) : false
  const categoryChildrenMap = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const category of categories || []) {
      if (!category.parent_id) continue
      const existing = map.get(category.parent_id) || []
      existing.push(category.id)
      map.set(category.parent_id, existing)
    }
    return map
  }, [categories])

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
      setActionFeedback({ tone: 'success', message: 'Category order updated.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update order.' })
    }
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
    const categoryIds = includeChildrenForBulk
      ? Array.from(
          new Set(
            selectedCategoryIds.flatMap((categoryId) => [
              categoryId,
              ...(categoryChildrenMap.get(categoryId) || []),
            ]),
          ),
        )
      : selectedCategoryIds
    setActionFeedback(null)
    try {
      await bulkUpdateCategories.mutateAsync({
        categoryIds,
        updates: { active },
      })
      setSelectedCategoryIds([])
      setActionFeedback({ tone: 'success', message: `${active ? 'Enabled' : 'Disabled'} ${categoryIds.length} categories.` })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update categories.' })
    }
  }

  const handleFamilyToggle = async (categoryId: string, active: boolean) => {
    if (!canManageTasks) return
    const categoryIds = Array.from(new Set([categoryId, ...(categoryChildrenMap.get(categoryId) || [])]))
    setActionFeedback(null)
    try {
      await bulkUpdateCategories.mutateAsync({
        categoryIds,
        updates: { active },
      })
      setActionFeedback({ tone: 'success', message: `${active ? 'Enabled' : 'Disabled'} group.` })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update category group.' })
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header title="Browse Categories" />

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link
                to="/tasks/categories/edit"
                className={`bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Edit className="w-5 h-5" />
                Edit Categories
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
              <div className="flex gap-3">
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
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeChildrenForBulk}
                    onChange={(e) => setIncludeChildrenForBulk(e.target.checked)}
                  />
                  Include subcategories
                </label>
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
                  <col className="w-[28%]" />
                  <col className="w-[14%]" />
                  <col className="w-[14%]" />
                  <col className="w-[10%]" />
                  <col className="w-[24%]" />
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
                      Media
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
                      Usage
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
                        <div className="flex items-center gap-2">
                          <MediaThumb src={category.icon_url} alt={`${category.name} icon`} label="Icon" />
                          <MediaThumb src={category.content_image_url} alt={`${category.name} content`} label="Content" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="space-y-2">
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
                          {category.level === 0 && (categoryChildrenMap.get(category.id)?.length ?? 0) > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Group action affects this main category and its subcategories.
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-white">{category.tasks_count}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {category.tasks_count === 1 ? 'linked task' : 'linked tasks'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="ml-auto flex max-w-[300px] flex-wrap items-center justify-end gap-x-3 gap-y-2">
                          {category.level === 0 && (categoryChildrenMap.get(category.id)?.length ?? 0) > 0 && (
                            <>
                              <button
                                type="button"
                                disabled={!canManageTasks || bulkUpdateCategories.isPending}
                                onClick={() => handleFamilyToggle(category.id, true)}
                                className="text-green-700 hover:text-green-900 disabled:opacity-50"
                              >
                                Enable group
                              </button>
                              <button
                                type="button"
                                disabled={!canManageTasks || bulkUpdateCategories.isPending}
                                onClick={() => handleFamilyToggle(category.id, false)}
                                className="text-red-700 hover:text-red-900 disabled:opacity-50"
                              >
                                Disable group
                              </button>
                            </>
                          )}
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
                          <Link
                            to="/tasks/categories/delete"
                            className={`text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 ${!canManageTasks ? 'pointer-events-none opacity-50' : ''}`}
                          >
                            Delete
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

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Category by area coverage</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active assigned provider counts for enabled service areas. Use this to decide which categories can launch in which areas.
              </p>
            </div>

            {coverageMatrixLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !coverageMatrix || coverageMatrix.rows.length === 0 || coverageMatrix.serviceAreas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No category coverage matrix available yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Category
                      </th>
                      {coverageMatrix.serviceAreas.map((area) => (
                        <th
                          key={area.id}
                          className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                        >
                          <div>{area.city}</div>
                          <div className="mt-1 text-[10px] normal-case text-gray-400 dark:text-gray-500">{area.postcode_prefix}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-800/50">
                    {coverageMatrix.rows
                      .filter((row) => row.active)
                      .map((row) => (
                        <tr key={row.categoryId}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                            {row.categoryName}
                          </td>
                          {row.cells.map((cell) => (
                            <td key={`${row.categoryId}-${cell.serviceAreaId}`} className="px-4 py-3 text-center text-sm">
                              <span
                                className={`inline-flex min-w-[2rem] justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  cell.providerCount > 0
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {cell.providerCount}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
  const [failed, setFailed] = useState(false)
  const resolvedSrc = resolvePreviewUrl(src)

  if (!resolvedSrc || failed) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-500" title={`${label}: not set`}>
        <ImageIcon className="h-4 w-4" />
      </div>
    )
  }

  return (
    <a href={resolvedSrc} target="_blank" rel="noreferrer" className="group relative block">
      <img
        src={resolvedSrc}
        alt={alt}
        title={label}
        className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
        onError={() => setFailed(true)}
      />
      <span className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded-lg bg-black/45 text-white group-hover:flex">
        <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </a>
  )
}
