import { useMemo, useState } from 'react'
import { ExternalLink, Plus, Edit, Trash2, Loader2, X, Save, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidSlug, isValidUrl } from '@/lib/editor-validation'
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
  const { hasPermission } = useAuth()
  const canManageTasks = hasPermission('tasks.manage')
  const { data: categories, isLoading, error } = useCategories()
  const { data: mediaAssets = [] } = useMediaAssets()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithStats | null>(null)

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
        ? (category.benefits_json as unknown as TitleDescriptionItem[])
        : [],
      tasks: Array.isArray(category.tasks_json)
        ? (category.tasks_json as unknown as TitleDescriptionItem[])
        : [],
      faqs: Array.isArray(category.faqs_json)
        ? (category.faqs_json as unknown as FaqItem[])
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
    if (!canSaveCategory) return

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
    if (!canManageTasks) return

    try {
      await deleteCategory.mutateAsync(id)
      if (editingId === id) {
        resetForm()
      }
      setDeleteTarget(null)
    } catch (deleteError) {
      console.error('Failed to delete category:', deleteError)
    }
  }

  const isSaving = createCategory.isPending || updateCategory.isPending
  const isEditing = Boolean(editingId || isCreating)
  const baselineForm = useMemo(() => {
    if (!editingId) return emptyForm
    const category = categories?.find((item) => item.id === editingId)
    if (!category) return emptyForm
    return {
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
      benefits: Array.isArray(category.benefits_json) ? (category.benefits_json as unknown as TitleDescriptionItem[]) : [],
      tasks: Array.isArray(category.tasks_json) ? (category.tasks_json as unknown as TitleDescriptionItem[]) : [],
      faqs: Array.isArray(category.faqs_json) ? (category.faqs_json as unknown as FaqItem[]) : [],
    }
  }, [categories, editingId])
  const isDirty = isEditing && JSON.stringify(formData) !== JSON.stringify(isCreating ? emptyForm : baselineForm)
  useUnsavedChangesWarning(isDirty)

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!formData.name.trim()) errors.push('Category name is required.')
    if (formData.route_slug.trim() && !isValidSlug(formData.route_slug.trim())) {
      errors.push('Route slug must use lowercase letters, numbers, and hyphens only.')
    }
    if (formData.icon_url.trim() && !isValidUrl(formData.icon_url)) errors.push('Icon URL must be a valid absolute URL.')
    if (formData.hero_image_url.trim() && !isValidUrl(formData.hero_image_url)) errors.push('Hero image URL must be a valid absolute URL.')
    if (formData.content_image_url.trim() && !isValidUrl(formData.content_image_url)) errors.push('Content image URL must be a valid absolute URL.')
    if (editingId && formData.parent_id === editingId) errors.push('A category cannot be its own parent.')
    return errors
  }, [formData, editingId])
  const canSaveCategory = canManageTasks && validationErrors.length === 0
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
          <UnsavedChangesBanner show={isDirty} />
          {!canManageTasks && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view category setup, but it cannot change the service catalog.
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <Link to="/tasks/categories" className="text-primary hover:underline text-sm">
              ← Back to Browse Categories
            </Link>
            <button
              onClick={handleCreate}
              disabled={!canManageTasks}
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
                              <div className="mt-3 flex items-center gap-2">
                                <MediaThumb src={category.icon_url} alt={`${category.name} icon`} label="Icon" />
                                <MediaThumb src={category.hero_image_url} alt={`${category.name} hero`} label="Hero" />
                                <MediaThumb src={category.content_image_url} alt={`${category.name} content`} label="Content" />
                              </div>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Order {category.display_order} · {category.tasks_count} tasks
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(category)}
                                disabled={!canManageTasks}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(category)}
                                disabled={deleteCategory.isPending || !canManageTasks}
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
                      {validationErrors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                          {validationErrors.map((error) => <div key={error}>{error}</div>)}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!canManageTasks}
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
                          <FieldErrorText error={formData.route_slug.trim() && !isValidSlug(formData.route_slug.trim()) ? 'Use lowercase letters, numbers, and hyphens only.' : null} />
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

                      <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Category Media</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            These assets control how the category looks across the admin-managed web and app surfaces.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <MediaInputCard
                            label="Icon"
                            value={formData.icon_url}
                            onChange={(value) => setFormData({ ...formData, icon_url: value })}
                            options={imageOptions}
                            error={formData.icon_url.trim() && !isValidUrl(formData.icon_url) ? 'Enter a valid absolute URL.' : null}
                          />
                          <MediaInputCard
                            label="Hero Image"
                            value={formData.hero_image_url}
                            onChange={(value) => setFormData({ ...formData, hero_image_url: value })}
                            options={imageOptions}
                            error={formData.hero_image_url.trim() && !isValidUrl(formData.hero_image_url) ? 'Enter a valid absolute URL.' : null}
                          />
                          <MediaInputCard
                            label="Content Image"
                            value={formData.content_image_url}
                            onChange={(value) => setFormData({ ...formData, content_image_url: value })}
                            options={imageOptions}
                            error={formData.content_image_url.trim() && !isValidUrl(formData.content_image_url) ? 'Enter a valid absolute URL.' : null}
                          />
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

                      {formData.route_slug.trim() && (
                        <div className="space-y-3">
                          <div className="flex justify-end">
                            <a
                              href={`${import.meta.env.VITE_SITE_URL || ''}/services/${formData.route_slug.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Preview Category Page
                            </a>
                          </div>
                          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                              Preview
                            </div>
                            <iframe
                              title="Category preview"
                              src={`${import.meta.env.VITE_SITE_URL || ''}/services/${formData.route_slug.trim()}`}
                              className="h-[520px] w-full bg-white"
                            />
                          </div>
                        </div>
                      )}

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

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete category</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Delete <span className="font-medium text-slate-900 dark:text-white">{deleteTarget.name}</span> from the service catalog.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget.id)}
                disabled={deleteCategory.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
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
  return src ? (
    <img
      src={src}
      alt={alt}
      title={label}
      className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
    />
  ) : (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-500"
      title={`${label}: not set`}
    >
      <ImageIcon className="h-4 w-4" />
    </div>
  )
}

function MediaInputCard({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  error: string | null
}) {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <MediaThumb src={value} alt={label} label={label} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <FieldErrorText error={error} />
      <select
        value=""
        onChange={(e) => {
          if (!e.target.value) return
          onChange(e.target.value)
        }}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Choose from media library</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
