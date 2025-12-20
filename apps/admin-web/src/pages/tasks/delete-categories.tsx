import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/header'
import { useCategories, useDeleteCategories } from '@/lib/api/categories'

export default function DeleteCategoriesPage() {
  const navigate = useNavigate()
  const { data: categories, isLoading, error } = useCategories()
  const deleteCategories = useDeleteCategories()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked && categories) {
      setSelectedCategories(categories.map((c) => c.id))
    } else {
      setSelectedCategories([])
    }
  }

  const handleSelectCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cid) => cid !== id))
      setSelectAll(false)
    } else {
      const newSelected = [...selectedCategories, id]
      setSelectedCategories(newSelected)
      if (categories && newSelected.length === categories.length) {
        setSelectAll(true)
      }
    }
  }

  const handleDelete = async () => {
    if (selectedCategories.length === 0) return

    try {
      await deleteCategories.mutateAsync(selectedCategories)
      navigate('/tasks/categories')
    } catch (error) {
      console.error('Failed to delete categories:', error)
    }
  }

  const selectedCount = selectedCategories.length
  const totalTasksAffected =
    categories
      ?.filter((c) => selectedCategories.includes(c.id))
      .reduce((sum, c) => sum + c.tasks_count, 0) || 0

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Delete Categories" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/tasks/categories" className="text-primary hover:underline text-sm">
              ← Back to Browse Categories
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Select categories to delete. Deleting a category will disassociate any
              tasks linked to them.
            </p>
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

          {!isLoading && !error && categories && (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Select Categories
                  </h3>
                  {categories.length > 0 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="select-all"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Select All
                      </label>
                    </div>
                  )}
                </div>

                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No categories to delete.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg ${
                          selectedCategories.includes(category.id)
                            ? 'ring-2 ring-red-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleSelectCategory(category.id)}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                          />
                          <div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {category.name}
                            </span>
                            {category.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {category.tasks_count} Tasks
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
                {selectedCount > 0 && (
                  <div className="bg-red-100/50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-md mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                          Warning: Deletion is permanent
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                          <p>
                            You have selected{' '}
                            <strong>{selectedCount} categories</strong> for deletion
                            {totalTasksAffected > 0 && (
                              <>, affecting <strong>{totalTasksAffected} tasks</strong></>
                            )}
                            . This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete error */}
                {deleteCategories.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm mb-4">
                    Failed to delete categories: {deleteCategories.error.message}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Link
                    to="/tasks/categories"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={selectedCount === 0 || deleteCategories.isPending}
                    className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                  >
                    {deleteCategories.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete Selected ({selectedCount})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
