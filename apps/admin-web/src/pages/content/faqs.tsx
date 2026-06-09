import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Search } from 'lucide-react'
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
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [groupFilter, setGroupFilter] = useState<string>('all')

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
    const base = groupFilter === 'all' ? faqItems : faqItems.filter((item) => item.faq_group === groupFilter)
    if (!q) return base
    return base.filter((item) =>
      [item.faq_group, item.question, item.answer].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [faqItems, search, groupFilter])
  const groups = useMemo(() => Array.from(new Set(faqItems.map((item) => item.faq_group))).sort(), [faqItems])

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

    setActionFeedback(null)
    try {
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
      setActionFeedback({ tone: 'success', message: 'FAQ order updated.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to reorder FAQs.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="FAQs" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto space-y-8">
          {actionFeedback && (
            <div className={`rounded-xl px-4 py-3 text-sm ${
              actionFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
            }`}>
              {actionFeedback.message}
            </div>
          )}
          <UnsavedChangesBanner show={isDirty} />
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view FAQs, but it cannot change them.
            </div>
          )}
          <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions..."
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
                  New
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGroupFilter('all')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    groupFilter === 'all'
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  All
                </button>
                {groups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setGroupFilter(group)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      groupFilter === group
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : filtered.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    No FAQs found.
                  </div>
                ) : filtered.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => setSelectedId(faq.id)}
                    className={`w-full rounded-lg border px-4 py-4 text-left transition ${
                      selectedId === faq.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{faq.question}</div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{faq.faq_group}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              {validationErrors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                  {validationErrors.map((error) => <div key={error}>{error}</div>)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedId ? 'Edit Question' : 'Create Question'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Write the question and answer shown on the public help and support pages.
                </p>
              </div>

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
                    rows={10}
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

              <div className="flex flex-wrap items-center justify-between gap-3">
                {selected ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveFaq(selected.id!, 'up')}
                      disabled={!canManageContent}
                      className="rounded-md border border-gray-200 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFaq(selected.id!, 'down')}
                      disabled={!canManageContent}
                      className="rounded-md border border-gray-200 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActionFeedback(null)
                        deleteFaq.mutate(selected.id!, {
                          onSuccess: () => setActionFeedback({ tone: 'success', message: 'FAQ deleted.' }),
                          onError: (error) => setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete FAQ.' }),
                        })
                      }}
                      disabled={!canManageContent}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                ) : <div />}
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
                    onClick={() => {
                      setActionFeedback(null)
                      saveFaq.mutate({
                        id: selected?.id,
                        faq_group: form.faq_group,
                        question: form.question,
                        answer: form.answer,
                        sort_order: form.sort_order,
                        visible: form.visible,
                      }, {
                        onSuccess: () => setActionFeedback({ tone: 'success', message: 'FAQ saved.' }),
                        onError: (error) => setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save FAQ.' }),
                      })
                    }}
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
