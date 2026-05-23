import { useMemo, useState } from 'react'
import { Plus, Edit, Trash2, Loader2, X, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type CategoryWithStats,
} from '@/lib/api/categories'
import { useMediaAssets } from '@/lib/api/content-platform'

interface TitleDescriptionItem {
  title: string
  description: string
}

interface FaqItem {
  question: string
  answer: string
}

interface CategoryFormData {
  name: string
  description: string
  parent_id: string
  display_order: string
  route_slug: string
  marketing_title: string
  marketing_description: string
  icon_url: string
  active: boolean
  supports_recurring: boolean
  long_description: string
  hero_image_url: string
  content_image_url: string
  benefits: TitleDescriptionItem[]
  tasks: TitleDescriptionItem[]
  faqs: FaqItem[]
}

const emptyForm: CategoryFormData = {
  name: '',
  description: '',
  parent_id: '',
  display_order: '0',
  route_slug: '',
  marketing_title: '',
  marketing_description: '',
  icon_url: '',
  active: true,
  supports_recurring: false,
  long_description: '',
  hero_image_url: '',
  content_image_url: '',
  benefits: [],
  tasks: [],
  faqs: [],
}

function getCategoryDepthLabel(category: CategoryWithStats) {
  if (category.level === 0) return 'Main category'
  if (category.level === 1) return 'Subcategory'
  return `Level ${category.level}`
}

export default function EditCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const { data: mediaAssets = [] } = useMediaAssets()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm)
  const [isCreating, setIsCreating] = useState(false)

  const parentOptions = useMemo(
    () => (categories || []).filter((category) => category.level === 0),
    [categories]
  )

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (category: CategoryWithStats) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id || '',
      display_order: String(category.display_order ?? 0),
      route_slug: category.route_slug || '',
      marketing_title: category.marketing_title || '',
      marketing_description: category.marketing_description || '',
      icon_url: category.icon_url || '',
      active: category.active,
      supports_recurring: category.supports_recurring,
      long_description: category.long_description || '',
      hero_image_url: category.hero_image_url || '',
      content_image_url: category.content_image_url || '',
      benefits: Array.isArray(category.benefits_json)
        ? (category.benefits_json as TitleDescriptionItem[])
        : [],
      tasks: Array.isArray(category.tasks_json)
        ? (category.tasks_json as TitleDescriptionItem[])
        : [],
      faqs: Array.isArray(category.faqs_json)
        ? (category.faqs_json as FaqItem[])
        : [],
    })
    setIsCreating(false)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData(emptyForm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon_url: formData.icon_url.trim() || undefined,
        parent_id: formData.parent_id || null,
        display_order: Number(formData.display_order) || 0,
        route_slug: formData.route_slug.trim() || undefined,
        marketing_title: formData.marketing_title.trim() || undefined,
        marketing_description: formData.marketing_description.trim() || undefined,
        active: formData.active,
        supports_recurring: formData.supports_recurring,
        long_description: formData.long_description.trim() || undefined,
        hero_image_url: formData.hero_image_url.trim() || undefined,
        content_image_url: formData.content_image_url.trim() || undefined,
        benefits_json: formData.benefits.filter(
          (item) => item.title.trim() || item.description.trim()
        ),
        tasks_json: formData.tasks.filter(
          (item) => item.title.trim() || item.description.trim()
        ),
        faqs_json: formData.faqs.filter(
          (item) => item.question.trim() || item.answer.trim()
        ),
      }

      if (editingId) {
        await updateCategory.mutateAsync({
          categoryId: editingId,
          ...payload,
        })
      } else {
        await createCategory.mutateAsync(payload)
      }
      resetForm()
    } catch (saveError) {
      console.error('Failed to save category:', saveError)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory.mutateAsync(id)
      if (editingId === id) {
        resetForm()
      }
    } catch (deleteError) {
      console.error('Failed to delete category:', deleteError)
    }
  }

  const isSaving = createCategory.isPending || updateCategory.isPending
  const imageOptions = useMemo(
    () =>
      mediaAssets
        .filter((asset) => asset.asset_type === 'image' && asset.active)
        .map((asset) => ({
          label: asset.title || asset.asset_key,
          value: asset.url,
        })),
    [mediaAssets]
  )

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

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading categories...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 mb-6">
              Failed to load categories: {error.message}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Category Catalog
                    </h3>

                    {categories?.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No categories yet. Click &quot;Add Category&quot; to create one.
                      </div>
                    )}

                    <ul className="space-y-3">
                      {categories?.map((category) => (
                        <li
                          key={category.id}
                          className={`p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg ${
                            editingId === category.id ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {category.name}
                                </span>
                                <span className="text-xs rounded-full px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  {getCategoryDepthLabel(category)}
                                </span>
                                {!category.active && (
                                  <span className="text-xs rounded-full px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                    Hidden
                                  </span>
                                )}
                                {category.supports_recurring && (
                                  <span className="text-xs rounded-full px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                    Recurring
                                  </span>
                                )}
                              </div>
                              {category.marketing_title && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Public title: {category.marketing_title}
                                </p>
                              )}
                              {category.route_slug && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  /services/{category.route_slug}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Order {category.display_order} · {category.tasks_count} tasks
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
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
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingId ? 'Edit Category' : isCreating ? 'Add Category' : 'Select a Category'}
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
                      Select a category to manage routing, marketing copy, visibility, order,
                      and recurring-booking support.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Parent Category
                          </label>
                          <select
                            value={formData.parent_id}
                            onChange={(e) =>
                              setFormData({ ...formData, parent_id: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Top-level category</option>
                            {parentOptions
                              .filter((item) => item.id !== editingId)
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Route Slug
                          </label>
                          <input
                            type="text"
                            value={formData.route_slug}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                route_slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                              })
                            }
                            placeholder="cleaning"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={formData.display_order}
                            onChange={(e) =>
                              setFormData({ ...formData, display_order: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Internal Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Public Marketing Title
                        </label>
                        <input
                          type="text"
                          value={formData.marketing_title}
                          onChange={(e) =>
                            setFormData({ ...formData, marketing_title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Public Marketing Description
                        </label>
                        <textarea
                          rows={4}
                          value={formData.marketing_description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              marketing_description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon URL
                        </label>
                        <input
                          type="text"
                          value={formData.icon_url}
                          onChange={(e) =>
                            setFormData({ ...formData, icon_url: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hero Image URL
                          </label>
                          <input
                            type="text"
                            value={formData.hero_image_url}
                            onChange={(e) =>
                              setFormData({ ...formData, hero_image_url: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <select
                            value=""
                            onChange={(e) => {
                              if (!e.target.value) return
                              setFormData({ ...formData, hero_image_url: e.target.value })
                            }}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Choose from media library</option>
                            {imageOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content Image URL
                          </label>
                          <input
                            type="text"
                            value={formData.content_image_url}
                            onChange={(e) =>
                              setFormData({ ...formData, content_image_url: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <select
                            value=""
                            onChange={(e) => {
                              if (!e.target.value) return
                              setFormData({ ...formData, content_image_url: e.target.value })
                            }}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Choose from media library</option>
                            {imageOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Long Description
                        </label>
                        <textarea
                          rows={6}
                          value={formData.long_description}
                          onChange={(e) =>
                            setFormData({ ...formData, long_description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <StructuredListEditor
                        title="Benefits"
                        items={formData.benefits}
                        onChange={(benefits) => setFormData({ ...formData, benefits })}
                        addLabel="Add benefit"
                        firstLabel="Title"
                        secondLabel="Description"
                      />

                      <StructuredListEditor
                        title="Tasks"
                        items={formData.tasks}
                        onChange={(tasks) => setFormData({ ...formData, tasks })}
                        addLabel="Add task"
                        firstLabel="Title"
                        secondLabel="Description"
                      />

                      <FaqListEditor
                        items={formData.faqs}
                        onChange={(faqs) => setFormData({ ...formData, faqs })}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Visible on web and app
                          </span>
                          <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) =>
                              setFormData({ ...formData, active: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                          />
                        </label>

                        <label className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Supports recurring bookings
                          </span>
                          <input
                            type="checkbox"
                            checked={formData.supports_recurring}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                supports_recurring: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                          />
                        </label>
                      </div>

                      {(createCategory.error || updateCategory.error) && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
                          {createCategory.error?.message || updateCategory.error?.message}
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
                          disabled={isSaving}
                          className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Category
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

function StructuredListEditor({
  title,
  items,
  onChange,
  addLabel,
  firstLabel,
  secondLabel,
}: {
  title: string
  items: TitleDescriptionItem[]
  onChange: (items: TitleDescriptionItem[]) => void
  addLabel: string
  firstLabel: string
  secondLabel: string
}) {
  const updateItem = (
    index: number,
    key: keyof TitleDescriptionItem,
    value: string
  ) => {
    const next = [...items]
    next[index] = { ...next[index], [key]: value }
    onChange(next)
  }

  const addItem = () => onChange([...items, { title: '', description: '' }])
  const removeItem = (index: number) =>
    onChange(items.filter((_, itemIndex) => itemIndex !== index))

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-primary hover:underline"
        >
          {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No items yet.</p>
      ) : (
        items.map((item, index) => (
          <div key={`${title}-${index}`} className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 p-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {firstLabel}
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {secondLabel}
              </label>
              <textarea
                rows={3}
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function FaqListEditor({
  items,
  onChange,
}: {
  items: FaqItem[]
  onChange: (items: FaqItem[]) => void
}) {
  const updateItem = (index: number, key: keyof FaqItem, value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [key]: value }
    onChange(next)
  }

  const addItem = () => onChange([...items, { question: '', answer: '' }])
  const removeItem = (index: number) =>
    onChange(items.filter((_, itemIndex) => itemIndex !== index))

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">FAQs</h4>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-primary hover:underline"
        >
          Add FAQ
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No FAQs yet.</p>
      ) : (
        items.map((item, index) => (
          <div key={`faq-${index}`} className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 p-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question
              </label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateItem(index, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Answer
              </label>
              <textarea
                rows={3}
                value={item.answer}
                onChange={(e) => updateItem(index, 'answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
