import { useMemo, useState } from 'react'
import { Edit2, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import {
  useDeletePaymentMethodConfig,
  usePaymentMethodConfigs,
  useSavePaymentMethodConfig,
  type PaymentMethodConfig,
} from '@/lib/api/finance-config'

const emptyForm = {
  id: '',
  display_name: '',
  provider_key: '',
  method_type: 'gateway' as PaymentMethodConfig['method_type'],
  status: 'pending' as PaymentMethodConfig['status'],
  public_enabled: false,
  supported_currencies: 'GBP',
  config_reference: '',
  notes: '',
  sort_order: 0,
}

export default function PaymentMethods() {
  const { hasPermission } = useAuth()
  const canManageFinance = hasPermission('finance.manage')
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethodConfig | null>(null)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const { data: methods = [], isLoading } = usePaymentMethodConfigs()
  const saveMethod = useSavePaymentMethodConfig()
  const deleteMethod = useDeletePaymentMethodConfig()

  const activeCount = useMemo(() => methods.filter((method) => method.status === 'active').length, [methods])

  function startEdit(method: PaymentMethodConfig) {
    setForm({
      id: method.id,
      display_name: method.display_name,
      provider_key: method.provider_key,
      method_type: method.method_type,
      status: method.status,
      public_enabled: method.public_enabled,
      supported_currencies: method.supported_currencies.join(', '),
      config_reference: method.config_reference ?? '',
      notes: method.notes ?? '',
      sort_order: method.sort_order,
    })
  }

  function resetForm() {
    setForm(emptyForm)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.display_name.trim() || !form.provider_key.trim()) return
    setActionFeedback(null)
    try {
      await saveMethod.mutateAsync({
        id: form.id || undefined,
        display_name: form.display_name.trim(),
        provider_key: form.provider_key.trim(),
        method_type: form.method_type,
        status: form.status,
        public_enabled: form.public_enabled,
        supported_currencies: form.supported_currencies
          .split(',')
          .map((value) => value.trim().toUpperCase())
          .filter(Boolean),
        config_reference: form.config_reference.trim() || null,
        notes: form.notes.trim() || null,
        sort_order: form.sort_order,
      })
      resetForm()
      setActionFeedback({ tone: 'success', message: 'Payment method saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save payment method.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Payment Methods" />

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
            Your admin role can view payment method settings, but it cannot change them.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Configured methods" value={methods.length} />
          <MetricCard label="Active methods" value={activeCount} />
          <MetricCard label="Public checkout methods" value={methods.filter((m) => m.public_enabled).length} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configured payment methods</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Operational payment and payout methods used by web and mobile flows.</p>
              </div>
              <button disabled={!canManageFinance} onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-700">
                <Plus className="h-4 w-4" />
                New method
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Public</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></td></tr>
                  ) : methods.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">No payment methods configured yet.</td></tr>
                  ) : (
                    methods.map((method) => (
                      <tr key={method.id} className="border-t border-gray-200 dark:border-gray-800">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{method.display_name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{method.provider_key}</td>
                        <td className="px-4 py-3">{method.method_type}</td>
                        <td className="px-4 py-3"><StatusBadge status={method.status} /></td>
                        <td className="px-4 py-3">{method.public_enabled ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button disabled={!canManageFinance} onClick={() => startEdit(method)} className="rounded-lg p-2 text-primary hover:bg-primary/10 disabled:opacity-50"><Edit2 className="h-4 w-4" /></button>
                            <button disabled={!canManageFinance} onClick={() => setDeleteTarget(method)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/20"><Trash2 className="h-4 w-4" /></button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{form.id ? 'Edit payment method' : 'Add payment method'}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This stores operational method status and references only. Keep live API secrets in server-side env or provider dashboards.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <Field label="Display name"><input value={form.display_name} onChange={(e) => setForm((prev) => ({ ...prev, display_name: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
              <Field label="Provider key"><input value={form.provider_key} onChange={(e) => setForm((prev) => ({ ...prev, provider_key: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Method type">
                  <select value={form.method_type} onChange={(e) => setForm((prev) => ({ ...prev, method_type: e.target.value as PaymentMethodConfig['method_type'] }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900">
                    <option value="gateway">Gateway</option>
                    <option value="wallet">Wallet</option>
                    <option value="payout">Payout</option>
                    <option value="bank_transfer">Bank transfer</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PaymentMethodConfig['status'] }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </Field>
              </div>
              <Field label="Supported currencies"><input value={form.supported_currencies} onChange={(e) => setForm((prev) => ({ ...prev, supported_currencies: e.target.value }))} placeholder="GBP" className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
              <Field label="Config reference"><input value={form.config_reference} onChange={(e) => setForm((prev) => ({ ...prev, config_reference: e.target.value }))} placeholder="Supabase secrets / Stripe dashboard" className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
              <Field label="Operational notes"><textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} rows={4} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-900" /></Field>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={form.public_enabled} onChange={(e) => setForm((prev) => ({ ...prev, public_enabled: e.target.checked }))} />
                Enabled in public checkout
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={!canManageFinance || saveMethod.isPending || !form.display_name.trim() || !form.provider_key.trim()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                  <Save className="h-4 w-4" />
                  Save method
                </button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700">Clear</button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete payment method</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Delete <span className="font-medium text-slate-900 dark:text-white">{deleteTarget.display_name}</span> from admin configuration.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setActionFeedback(null)
                  try {
                    await deleteMethod.mutateAsync(deleteTarget)
                    setDeleteTarget(null)
                    if (form.id === deleteTarget.id) {
                      resetForm()
                    }
                    setActionFeedback({ tone: 'success', message: 'Payment method deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete payment method.' })
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: PaymentMethodConfig['status'] }) {
  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      : status === 'pending'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{status}</span>
}
