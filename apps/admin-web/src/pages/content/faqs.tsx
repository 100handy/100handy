import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Edit, Loader2, Plus, Save, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useDeleteFaqItem, useFaqItems, useSaveFaqItem } from '@/lib/api/content-platform'

const emptyFaq = {
  faq_group: 'General',
  question: '',
  answer: '',
  sort_order: 0,
  visible: true,
}

export default function FAQsPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
  const { data: faqItems = [], isLoading } = useFaqItems()
  const saveFaq = useSaveFaqItem()
  const deleteFaq = useDeleteFaqItem()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyFaq)

  const selected = faqItems.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setForm(emptyFaq)
      return
    }

    setForm({
      faq_group: selected.faq_group,
      question: selected.question,
      answer: selected.answer,
      sort_order: selected.sort_order,
      visible: selected.visible,
    })
  }, [selected])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return faqItems
    return faqItems.filter((item) =>
      [item.faq_group, item.question, item.answer].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [faqItems, search])

  const isDirty = useMemo(() => {
    if (!selected) {
      return JSON.stringify(form) !== JSON.stringify(emptyFaq)
    }

    return JSON.stringify(form) !== JSON.stringify({
      faq_group: selected.faq_group,
      question: selected.question,
      answer: selected.answer,
      sort_order: selected.sort_order,
      visible: selected.visible,
    })
  }, [form, selected])

  useUnsavedChangesWarning(isDirty)

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!form.faq_group.trim()) errors.push('Category is required.')
    if (!form.question.trim()) errors.push('Question is required.')
    if (!form.answer.trim()) errors.push('Answer is required.')
    return errors
  }, [form.faq_group, form.question, form.answer])

  const canSaveFaq = canManageContent && validationErrors.length === 0

  const moveFaq = async (faqId: string, direction: 'up' | 'down') => {
    if (!canManageContent) return
    const sorted = [...filtered].sort((a, b) => a.sort_order - b.sort_order)
    const index = sorted.findIndex((item) => item.id === faqId)
    if (index === -1) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= sorted.length) return

    const current = sorted[index]
    const target = sorted[swapIndex]

    await Promise.all([
      saveFaq.mutateAsync({
        id: current.id,
        faq_group: current.faq_group,
        question: current.question,
        answer: current.answer,
        sort_order: target.sort_order,
        visible: current.visible,
      }),
      saveFaq.mutateAsync({
        id: target.id,
        faq_group: target.faq_group,
        question: target.question,
        answer: target.answer,
        sort_order: current.sort_order,
        visible: target.visible,
      }),
    ])
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="FAQs Management" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto space-y-8">
          <UnsavedChangesBanner show={isDirty} />
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view FAQs, but it cannot change them.
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => {
                setSelectedId(null)
                setForm(emptyFaq)
              }}
              disabled={!canManageContent}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New FAQ
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Question</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Visible</th>
                  <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      No FAQs found.
                    </td>
                  </tr>
                ) : filtered.map((faq) => (
                  <tr key={faq.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{faq.question}</td>
                    <td className="px-6 py-4">{faq.faq_group}</td>
                    <td className="px-6 py-4">{faq.sort_order}</td>
                    <td className="px-6 py-4">{faq.visible ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => moveFaq(faq.id, 'up')}
                        disabled={!canManageContent}
                        className="font-medium text-gray-600 hover:underline mr-2"
                      >
                        <ArrowUp className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => moveFaq(faq.id, 'down')}
                        disabled={!canManageContent}
                        className="font-medium text-gray-600 hover:underline mr-4"
                      >
                        <ArrowDown className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => setSelectedId(faq.id)} disabled={!canManageContent} className="font-medium text-primary hover:underline mr-4 disabled:opacity-50">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => deleteFaq.mutate(faq.id)} disabled={!canManageContent} className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            {validationErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {validationErrors.map((error) => <div key={error}>{error}</div>)}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedId ? 'Edit FAQ' : 'Create FAQ'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Category" value={form.faq_group} onChange={(value) => setForm((prev) => ({ ...prev, faq_group: value }))} />
              <Field
                label="Sort Order"
                value={String(form.sort_order)}
                onChange={(value) => setForm((prev) => ({ ...prev, sort_order: Number(value) || 0 }))}
              />
              <div className="md:col-span-2">
                <Field label="Question" value={form.question} onChange={(value) => setForm((prev) => ({ ...prev, question: value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
                />
                Visible
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null)
                  setForm(emptyFaq)
                }}
                className="px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveFaq.mutate({
                  id: selected?.id,
                  faq_group: form.faq_group,
                  question: form.question,
                  answer: form.answer,
                  sort_order: form.sort_order,
                  visible: form.visible,
                })}
                disabled={saveFaq.isPending || !canSaveFaq}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {saveFaq.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
      />
    </div>
  )
}
