import { useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Save, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useCategoryFormFields,
  useDeleteCategoryFormField,
  useSaveCategoryFormField,
  useTaskCategories,
} from '@/lib/api/content-platform'

const emptyField = {
  category_id: '',
  field_key: '',
  field_type: 'text' as const,
  label: '',
  description: '',
  placeholder: '',
  options_json: '[]',
  required: false,
  min_value: '',
  max_value: '',
  min_length: '',
  max_length: '',
  pattern: '',
  show_if_json: '{}',
  display_order: '0',
  section: '',
}

export default function TaskQuestionsPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useTaskCategories()
  const [categoryId, setCategoryId] = useState('')
  const { data: fields = [], isLoading: fieldsLoading } = useCategoryFormFields(categoryId)
  const saveField = useSaveCategoryFormField()
  const deleteField = useDeleteCategoryFormField()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyField)

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  const selected = fields.find((field) => field.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setForm((prev) => ({ ...emptyField, category_id: categoryId || prev.category_id }))
      return
    }

    setForm({
      category_id: selected.category_id,
      field_key: selected.field_key,
      field_type: selected.field_type,
      label: selected.label,
      description: selected.description ?? '',
      placeholder: selected.placeholder ?? '',
      options_json: JSON.stringify(selected.options ?? [], null, 2),
      required: selected.required,
      min_value: selected.min_value?.toString() ?? '',
      max_value: selected.max_value?.toString() ?? '',
      min_length: selected.min_length?.toString() ?? '',
      max_length: selected.max_length?.toString() ?? '',
      pattern: selected.pattern ?? '',
      show_if_json: JSON.stringify(selected.show_if ?? {}, null, 2),
      display_order: String(selected.display_order ?? 0),
      section: selected.section ?? '',
    })
  }, [selected, categoryId])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return fields
    return fields.filter((item) =>
      [item.field_key, item.label, item.field_type, item.section ?? ''].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [fields, search])

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Task Questions" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px,1fr,auto] md:items-end">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value)
                    setSelectedId(null)
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fields..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <button
                onClick={() => {
                  setSelectedId(null)
                  setForm((prev) => ({ ...emptyField, category_id: categoryId || prev.category_id }))
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Field
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Field Key</th>
                  <th className="px-6 py-3">Label</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Section</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Required</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesLoading || fieldsLoading ? (
                  <tr>
                    <td className="px-6 py-6" colSpan={7}>
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500" colSpan={7}>
                      No fields found for this category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((field) => (
                    <tr key={field.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4 font-mono text-xs text-gray-900 dark:text-white">{field.field_key}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{field.label}</td>
                      <td className="px-6 py-4">{field.field_type}</td>
                      <td className="px-6 py-4">{field.section ?? '-'}</td>
                      <td className="px-6 py-4">{field.display_order}</td>
                      <td className="px-6 py-4">{field.required ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="mr-4 text-primary hover:underline" onClick={() => setSelectedId(field.id)}>
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => deleteField.mutate({ id: field.id, categoryId: field.category_id })}
                        >
                          <Trash2 className="inline h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {selectedId ? 'Edit Task Question' : 'Create Task Question'}
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Field Key" value={form.field_key} onChange={(value) => setForm((prev) => ({ ...prev, field_key: value }))} />
              <SelectField
                label="Field Type"
                value={form.field_type}
                onChange={(value) => setForm((prev) => ({ ...prev, field_type: value as typeof prev.field_type }))}
                options={['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'address', 'date', 'time']}
              />
              <Field label="Label" value={form.label} onChange={(value) => setForm((prev) => ({ ...prev, label: value }))} />
              <Field label="Section" value={form.section} onChange={(value) => setForm((prev) => ({ ...prev, section: value }))} />
              <Field label="Placeholder" value={form.placeholder} onChange={(value) => setForm((prev) => ({ ...prev, placeholder: value }))} />
              <Field label="Pattern" value={form.pattern} onChange={(value) => setForm((prev) => ({ ...prev, pattern: value }))} />
              <Field label="Display Order" value={form.display_order} onChange={(value) => setForm((prev) => ({ ...prev, display_order: value }))} />
              <ToggleField label="Required" checked={form.required} onChange={(checked) => setForm((prev) => ({ ...prev, required: checked }))} />
              <Field label="Min Value" value={form.min_value} onChange={(value) => setForm((prev) => ({ ...prev, min_value: value }))} />
              <Field label="Max Value" value={form.max_value} onChange={(value) => setForm((prev) => ({ ...prev, max_value: value }))} />
              <Field label="Min Length" value={form.min_length} onChange={(value) => setForm((prev) => ({ ...prev, min_length: value }))} />
              <Field label="Max Length" value={form.max_length} onChange={(value) => setForm((prev) => ({ ...prev, max_length: value }))} />
              <div className="md:col-span-2">
                <TextAreaField label="Description" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} rows={3} />
              </div>
              <div className="md:col-span-2">
                <JsonField label="Options JSON" value={form.options_json} onChange={(value) => setForm((prev) => ({ ...prev, options_json: value }))} />
              </div>
              <div className="md:col-span-2">
                <JsonField label="Conditional Visibility JSON" value={form.show_if_json} onChange={(value) => setForm((prev) => ({ ...prev, show_if_json: value }))} />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  saveField.mutate({
                    id: selected?.id,
                    category_id: categoryId,
                    field_key: form.field_key,
                    field_type: form.field_type,
                    label: form.label,
                    description: form.description,
                    placeholder: form.placeholder,
                    options: parseJsonArray(form.options_json),
                    required: form.required,
                    min_value: parseNullableNumber(form.min_value),
                    max_value: parseNullableNumber(form.max_value),
                    min_length: parseNullableNumber(form.min_length),
                    max_length: parseNullableNumber(form.max_length),
                    pattern: form.pattern,
                    show_if: parseJsonObject(form.show_if_json),
                    display_order: Number(form.display_order) || 0,
                    section: form.section,
                  })
                }
                disabled={saveField.isPending || !categoryId}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {saveField.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Task Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function JsonField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={6} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 font-mono text-xs dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 pt-8 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

function parseNullableNumber(value: string) {
  if (!value.trim()) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function parseJsonObject(value: string) {
  try {
    const parsed = JSON.parse(value || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}
