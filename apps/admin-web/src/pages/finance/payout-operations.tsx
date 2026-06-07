import { useMemo, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import Header from '@/components/header'
import { useMarkPayoutFailed, usePayoutQueue, usePayoutSummary, useProcessAdminPayout } from '@/lib/api/payouts'

export default function PayoutOperationsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'pending' | 'transferred' | 'failed'>('all')
  const [failedTarget, setFailedTarget] = useState<{ bookingId: string; taskTitle: string } | null>(null)
  const [failureReason, setFailureReason] = useState('')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const filters = useMemo(() => ({ search: search || undefined, status }), [search, status])

  const { data: summary, isLoading: summaryLoading } = usePayoutSummary()
  const { data: rows = [], isLoading, error } = usePayoutQueue(filters)
  const processPayout = useProcessAdminPayout()
  const markFailed = useMarkPayoutFailed()

  function exportCsv() {
    if (rows.length === 0) return
    const csv = [
      ['Booking', 'Provider', 'Task', 'Completed', 'Payout Status', 'Payment Status', 'Payout Amount', 'Platform Fee', 'Connect Ready'].join(','),
      ...rows.map((row) => [
        row.bookingId,
        `"${row.providerName}"`,
        `"${row.taskTitle}"`,
        row.completedAt || '',
        row.payoutStatus || '',
        row.paymentStatus || '',
        row.payoutAmount.toFixed(2),
        row.platformFee.toFixed(2),
        row.connectReady ? 'yes' : 'no',
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payout-queue-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleConfirmMarkFailed() {
    if (!failedTarget || !failureReason.trim()) return
    setActionFeedback(null)
    try {
      await markFailed.mutateAsync({ bookingId: failedTarget.bookingId, reason: failureReason.trim() })
      setFailedTarget(null)
      setFailureReason('')
      setActionFeedback({ tone: 'success', message: 'Payout marked as failed.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update payout.' })
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Payout Operations" />

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Pending payouts" value={summaryLoading ? '...' : String(summary?.pendingCount || 0)} />
          <SummaryCard label="Transferred" value={summaryLoading ? '...' : String(summary?.transferredCount || 0)} />
          <SummaryCard label="Failed" value={summaryLoading ? '...' : String(summary?.failedCount || 0)} />
          <SummaryCard label="Pending value" value={summaryLoading ? '...' : `£${(summary?.pendingAmount || 0).toFixed(0)}`} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
          {actionFeedback && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              actionFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300'
                : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300'
            }`}>
              {actionFeedback.message}
            </div>
          )}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Provider payout queue</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Process completed-job payouts and track transfer status.</p>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="mb-4 flex flex-col gap-3 lg:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by booking, task, provider..."
              className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 lg:w-48"
            >
              <option value="all">All payout states</option>
              <option value="pending">Pending</option>
              <option value="transferred">Transferred</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load payout queue.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Completed</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Payout</th>
                  <th className="px-5 py-3">Platform fee</th>
                  <th className="px-5 py-3">Connect</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No payouts found for the current filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.bookingId} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{row.taskTitle}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">#{row.bookingId}</div>
                      </td>
                      <td className="px-5 py-4">{row.providerName}</td>
                      <td className="px-5 py-4">{row.completedAt ? new Date(row.completedAt).toLocaleDateString() : '—'}</td>
                      <td className="px-5 py-4 capitalize">{row.paymentStatus || 'unknown'}</td>
                      <td className="px-5 py-4">
                        <div>£{row.payoutAmount.toFixed(2)}</div>
                        <div className="text-xs capitalize text-slate-500 dark:text-slate-400">{row.payoutStatus || 'pending'}</div>
                      </td>
                      <td className="px-5 py-4">£{row.platformFee.toFixed(2)}</td>
                      <td className="px-5 py-4">{row.connectReady ? 'Ready' : 'Missing'}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {row.payoutStatus !== 'transferred' && row.paymentStatus === 'captured' && row.connectReady ? (
                            <button
                              type="button"
                              onClick={async () => {
                                setActionFeedback(null)
                                try {
                                  await processPayout.mutateAsync({ bookingId: row.bookingId })
                                  setActionFeedback({ tone: 'success', message: 'Payout processed.' })
                                } catch (error) {
                                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to process payout.' })
                                }
                              }}
                              disabled={processPayout.isPending}
                              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                            >
                              Process
                            </button>
                          ) : null}
                          {row.payoutStatus !== 'transferred' ? (
                            <button
                              type="button"
                              onClick={() => setFailedTarget({ bookingId: row.bookingId, taskTitle: row.taskTitle })}
                              disabled={markFailed.isPending}
                              className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-900/60"
                            >
                              Mark failed
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">{row.transferId ? 'Transferred' : 'Done'}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {failedTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mark payout as failed</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Record why the payout for <span className="font-medium text-slate-900 dark:text-white">{failedTarget.taskTitle}</span> cannot be transferred.
            </p>
            <textarea
              value={failureReason}
              onChange={(event) => setFailureReason(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Failure reason..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFailedTarget(null)
                  setFailureReason('')
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!failureReason.trim() || markFailed.isPending}
                onClick={handleConfirmMarkFailed}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Mark failed
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
