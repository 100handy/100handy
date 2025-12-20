import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, X, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/lib/api/categories'

interface CategoryFormData {
  name: string
  description: string
}

export default function EditCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (category: { id: string; name: string; description: string | null }) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || '',
    })
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({ name: '', description: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingId) {
        await updateCategory.mutateAsync({
          categoryId: editingId,
          name: formData.name,
          description: formData.description || undefined,
        })
      } else {
        await createCategory.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
        })
      }
      resetForm()
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory.mutateAsync(id)
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const isSaving = createCategory.isPending || updateCategory.isPending

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Edit Categories" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/tasks/categories" className="text-primary hover:underline text-sm">
              ← Back to Browse Categories
            </Link>
            <button
              onClick={handleCreate}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 mb-6">
              Failed to load categories: {error.message}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Manage Categories */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Manage Categories
                    </h3>

                    {categories?.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No categories yet. Click "Add Category" to create one.
                      </div>
                    )}

                    <ul className="space-y-3">
                      {categories?.map((category) => (
                        <li
                          key={category.id}
                          className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg ${
                            editingId === category.id
                              ? 'ring-2 ring-primary'
                              : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {category.name}
                            </span>
                            {category.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {category.description}
                              </p>
                            )}
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {category.tasks_count} tasks
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              disabled={deleteCategory.isPending}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingId
                        ? 'Edit Category'
                        : isCreating
                          ? 'Add Category'
                          : 'Select a Category'}
                    </h3>
                    {(editingId || isCreating) && (
                      <button
                        onClick={resetForm}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {!editingId && !isCreating ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Click on a category's edit button to modify it, or click "Add
                      Category" to create a new one.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g., Home Cleaning"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="category-description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Description (Optional)
                        </label>
                        <textarea
                          id="category-description"
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Briefly describe the category..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Error message */}
                      {(createCategory.error || updateCategory.error) && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
                          {createCategory.error?.message ||
                            updateCategory.error?.message}
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving || !formData.name.trim()}
                          className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {editingId ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
