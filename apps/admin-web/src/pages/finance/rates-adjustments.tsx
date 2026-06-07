import { useMemo, useState, type ReactNode } from 'react'
import { Loader2, Save, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import {
  useDeletePricingRule,
  usePricingRuleOptions,
  usePricingRules,
  useSavePricingRule,
} from '@/lib/api/finance-config'

const emptyForm = {
  id: '',
  category_id: '',
  location_area_id: '',
  currency_code: 'GBP',
  rate_kind: 'hourly' as 'hourly' | 'fixed',
  base_rate: '',
  active: true,
  notes: '',
}

export default function RatesAdjustments() {
  const { hasPermission } = useAuth()
  const canManageFinance = hasPermission('finance.manage')
  const [form, setForm] = useState(emptyForm)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const { data: rules = [], isLoading } = usePricingRules()
  const { data: options, isLoading: optionsLoading } = usePricingRuleOptions()
  const saveRule = useSavePricingRule()
  const deleteRule = useDeletePricingRule()

  const activeRules = useMemo(() => rules.filter((rule) => rule.active).length, [rules])

  function editRule(rule: (typeof rules)[number]) {
    setForm({
      id: rule.id,
      category_id: rule.category_id,
      location_area_id: rule.location_area_id ?? '',
      currency_code: rule.currency_code,
      rate_kind: rule.rate_kind,
      base_rate: (rule.base_rate_cents / 100).toFixed(2),
      active: rule.active,
      notes: rule.notes ?? '',
    })
  }

  function resetForm() {
    setForm(emptyForm)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number(form.base_rate)
    if (!form.category_id || !Number.isFinite(amount)) return
    setActionFeedback(null)
    try {
      await saveRule.mutateAsync({
        id: form.id || undefined,
        category_id: form.category_id,
        location_area_id: form.location_area_id || null,
        currency_code: form.currency_code,
        rate_kind: form.rate_kind,
        base_rate_cents: Math.round(amount * 100),
        active: form.active,
        notes: form.notes.trim() || null,
      })
      resetForm()
      setActionFeedback({ tone: 'success', message: 'Pricing rule saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save pricing rule.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Rates & Adjustments" />

      <main className="flex-1 p-6 space-y-6">
        {actionFeedback && (
          <div className={`rounded-xl px-4 py-3 text-sm ${
            actionFeedback.tone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
          }`}>
            {actionFeedback.message}
          </div>
        )}
        {!canManageFinance && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your admin role can view pricing rules, but it cannot change them.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Pricing rules" value={rules.length} />
          <MetricCard label="Active rules" value={activeRules} />
          <MetricCard label="Categories covered" value={new Set(rules.map((rule) => rule.category_id)).size} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing rules</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Base pricing rules by category and optional UK area.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></td></tr>
                  ) : rules.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">No pricing rules configured yet.</td></tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} className="border-t border-gray-200 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{rule.category_name}</td>
                        <td className="px-4 py-3">{rule.location_area_name ?? 'Global'}</td>
                        <td className="px-4 py-3">{rule.currency_code} {(rule.base_rate_cents / 100).toFixed(2)}</td>
                        <td className="px-4 py-3">{rule.rate_kind}</td>
                        <td className="px-4 py-3">{rule.active ? 'Active' : 'Inactive'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button disabled={!canManageFinance} onClick={() => editRule(rule)} className="rounded-lg px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50">Edit</button>
                            <button disabled={!canManageFinance} onClick={() => setDeleteTargetId(rule.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/20"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{form.id ? 'Edit pricing rule' : 'Add pricing rule'}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use area-specific pricing only where rollout or supply makes it necessary. Leave area blank for global category pricing.</p>

            {optionsLoading ? (
              <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <Field label="Category">
                  <select value={form.category_id} onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900">
                    <option value="">Select category</option>
                    {options?.categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}{category.active ? '' : ' (off)'}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Area override">
                  <select value={form.location_area_id} onChange={(e) => setForm((prev) => ({ ...prev, location_area_id: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900">
                    <option value="">Global category rule</option>
                    {options?.locations.map((location) => (
                      <option key={location.id} value={location.id}>{location.name}{location.enabled ? '' : ' (off)'}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Currency code"><input value={form.currency_code} onChange={(e) => setForm((prev) => ({ ...prev, currency_code: e.target.value.toUpperCase() }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
                  <Field label="Rate type">
                    <select value={form.rate_kind} onChange={(e) => setForm((prev) => ({ ...prev, rate_kind: e.target.value as 'hourly' | 'fixed' }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900">
                      <option value="hourly">Hourly</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </Field>
                </div>
                <Field label="Base rate"><input value={form.base_rate} onChange={(e) => setForm((prev) => ({ ...prev, base_rate: e.target.value }))} placeholder="45.00" className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
                <Field label="Notes"><textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />
                  Active pricing rule
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={!canManageFinance || saveRule.isPending || !form.category_id || !form.base_rate.trim()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                    <Save className="h-4 w-4" />
                    Save rule
                  </button>
                  <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700">Clear</button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete pricing rule</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the selected pricing rule from admin configuration.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = rules.find((rule) => rule.id === deleteTargetId)
                  if (!target) return
                  setActionFeedback(null)
                  try {
                    await deleteRule.mutateAsync(target)
                    setDeleteTargetId(null)
                    if (form.id === target.id) {
                      resetForm()
                    }
                    setActionFeedback({ tone: 'success', message: 'Pricing rule deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete pricing rule.' })
                  }
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      {children}
    </div>
  )
}
