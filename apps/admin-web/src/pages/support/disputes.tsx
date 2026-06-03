import { useMemo, useState } from 'react'
import { ChevronDown, Loader2, MessageSquare, Scale, ShieldCheck } from 'lucide-react'
import Header from '@/components/header'
import {
  useAssignDisputeToCurrentAdmin,
  useCreateDisputeMessage,
  useDispute,
  useDisputes,
  useDisputeStats,
  useUpdateDisputeStatus,
  type DisputeFilters,
} from '@/lib/api/disputes'

export default function DisputesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<DisputeFilters['status']>('all')
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [internalOnly, setInternalOnly] = useState(false)
  const [resolveDraft, setResolveDraft] = useState<{
    status: 'resolved' | 'rejected' | 'refunded'
    summary: string
    refundAmount: string
  } | null>(null)

  const filters = useMemo(() => ({ search: search || undefined, status }), [search, status])

  const { data: disputes = [], isLoading, error } = useDisputes(filters)
  const { data: stats } = useDisputeStats()
  const { data: dispute, isLoading: disputeLoading } = useDispute(selectedDisputeId)
  const assignToMe = useAssignDisputeToCurrentAdmin()
  const createMessage = useCreateDisputeMessage()
  const updateStatus = useUpdateDisputeStatus()

  async function handleSendMessage() {
    if (!selectedDisputeId || !message.trim()) return
    await createMessage.mutateAsync({
      disputeId: selectedDisputeId,
      message: message.trim(),
      internalOnly,
    })
    setMessage('')
    setInternalOnly(false)
  }

  async function handleResolve() {
    if (!selectedDisputeId || !resolveDraft || !resolveDraft.summary.trim()) return

    await updateStatus.mutateAsync({
      disputeId: selectedDisputeId,
      status: resolveDraft.status,
      resolutionSummary: resolveDraft.summary.trim(),
      refundAmount:
        resolveDraft.status === 'refunded' && resolveDraft.refundAmount.trim()
          ? Number(resolveDraft.refundAmount)
          : undefined,
    })
    setResolveDraft(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Disputes" />

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Open" value={stats?.open || 0} accent="text-blue-600" icon={Scale} />
          <MetricCard label="Investigating" value={stats?.investigating || 0} accent="text-amber-600" icon={MessageSquare} />
          <MetricCard label="Resolved" value={stats?.resolved || 0} accent="text-emerald-600" icon={ShieldCheck} />
          <MetricCard label="Refunded" value={`£${(stats?.refundedAmount || 0).toFixed(0)}`} accent="text-primary" icon={Scale} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dispute inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Investigate disputes, document decisions, and issue refunds when required.</p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by dispute, booking, customer, provider..."
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 lg:w-80"
              />
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as DisputeFilters['status'])}
                  className="h-11 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900 lg:w-48"
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="refunded">Refunded</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load disputes.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Dispute</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Assigned</th>
                  <th className="px-5 py-3">Opened</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : disputes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No disputes match the current filters.
                    </td>
                  </tr>
                ) : (
                  disputes.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{item.subject}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">#{item.id} • booking {item.bookingId}</div>
                      </td>
                      <td className="px-5 py-4">{item.customerName}</td>
                      <td className="px-5 py-4">{item.providerName}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {item.status.replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">{item.assignedTo}</td>
                      <td className="px-5 py-4">{new Date(item.openedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDisputeId(item.id)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedDisputeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {disputeLoading ? 'Loading dispute...' : dispute?.subject || 'Dispute details'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDisputeId(null)}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid flex-1 overflow-hidden lg:grid-cols-[1.3fr,1fr]">
              <div className="overflow-y-auto border-r border-slate-200 p-4 dark:border-slate-800">
                {disputeLoading || !dispute ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Detail label="Booking" value={`${dispute.bookingTitle} (${dispute.bookingStatus})`} />
                      <Detail label="Assigned" value={dispute.assignedTo} />
                      <Detail label="Customer" value={dispute.customerName} />
                      <Detail label="Provider" value={dispute.providerName} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</h4>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{dispute.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Conversation</h4>
                      <div className="mt-3 space-y-3">
                        {dispute.messages.map((entry) => (
                          <div
                            key={entry.id}
                            className={`rounded-lg border p-3 text-sm ${
                              entry.internalOnly
                                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20'
                                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium text-slate-900 dark:text-white">{entry.senderName}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(entry.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {entry.internalOnly && (
                              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                                Internal note
                              </div>
                            )}
                            <p className="mt-2 text-slate-700 dark:text-slate-300">{entry.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto p-4">
                {dispute && (
                  <div className="space-y-5">
                    <div className="grid gap-2">
                      <button
                        type="button"
                        onClick={() => assignToMe.mutate({ disputeId: dispute.id })}
                        disabled={assignToMe.isPending}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                      >
                        Assign to me
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus.mutate({ disputeId: dispute.id, status: 'investigating' })}
                        disabled={updateStatus.isPending}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                      >
                        Mark investigating
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolveDraft({ status: 'resolved', summary: '', refundAmount: '' })}
                        disabled={updateStatus.isPending}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                      >
                        Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolveDraft({ status: 'refunded', summary: '', refundAmount: '' })}
                        disabled={updateStatus.isPending}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Refund and close
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolveDraft({ status: 'rejected', summary: '', refundAmount: '' })}
                        disabled={updateStatus.isPending}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60"
                      >
                        Reject
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Reply / note</h4>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={5}
                        className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                        placeholder="Write a response or internal note..."
                      />
                      <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={internalOnly}
                          onChange={(event) => setInternalOnly(event.target.checked)}
                        />
                        Internal admin note only
                      </label>
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={createMessage.isPending || !message.trim()}
                        className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDisputeId && resolveDraft ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">
              {resolveDraft.status.replaceAll('_', ' ')} dispute
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Record the decision summary before updating the dispute.
            </p>
            <textarea
              value={resolveDraft.summary}
              onChange={(event) => setResolveDraft((prev) => (prev ? { ...prev, summary: event.target.value } : prev))}
              rows={4}
              className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Decision summary..."
            />
            {resolveDraft.status === 'refunded' ? (
              <input
                value={resolveDraft.refundAmount}
                onChange={(event) => setResolveDraft((prev) => (prev ? { ...prev, refundAmount: event.target.value } : prev))}
                className="mt-4 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="Refund amount in GBP (leave blank for full refund)"
              />
            ) : null}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setResolveDraft(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatus.isPending || !resolveDraft.summary.trim()}
                onClick={handleResolve}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Save decision
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string
  value: string | number
  accent: string
  icon: typeof Scale
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
