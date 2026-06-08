import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { format } from 'date-fns'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import { useFinanceSummary, useFinanceTransactions, useRefundPayment } from '@/lib/api/finance'
import { trackAdminEvent } from '@/lib/analytics'
import type { PaymentStatus } from '@/lib/database.types'
import { Link } from 'react-router-dom'

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}

export default function TransactionsRefundsPage() {
  const { hasPermission } = useAuth()
  const canManageFinance = hasPermission('finance.manage')
  const [activeView, setActiveView] = useState<'ledger' | 'performance'>('ledger')
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all')
  const [refundTarget, setRefundTarget] = useState<{ paymentId: string; taskTitle: string; amount: number; bookingId: string | null } | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const filters = useMemo(
    () => ({
      search: searchQuery || undefined,
      status,
    }),
    [searchQuery, status],
  )

  const { data: summary, isLoading: summaryLoading } = useFinanceSummary()
  const { data: transactions = [], isLoading, error } = useFinanceTransactions(filters)
  const refundPayment = useRefundPayment()

  function handleExport() {
    if (transactions.length === 0) return
    const csv = [
      ['Payment ID', 'Booking ID', 'Customer', 'Provider', 'Task', 'Category', 'Amount', 'Status', 'Created'].join(','),
      ...transactions.map((row) =>
        [
          row.id,
          row.booking_id || '',
          `"${row.customer_name}"`,
          `"${row.provider_name}"`,
          `"${row.task_title}"`,
          `"${row.category_name}"`,
          row.amount.toFixed(2),
          row.status,
          row.created_at,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleRefund() {
    if (!refundTarget || !refundReason.trim()) return
    setActionFeedback(null)
    try {
      await refundPayment.mutateAsync({ paymentId: refundTarget.paymentId, reason: refundReason.trim() })
      trackAdminEvent('admin_refund_completed', {
        payment_id: refundTarget.paymentId,
        booking_id: refundTarget.bookingId,
        amount: refundTarget.amount,
      })
      setRefundTarget(null)
      setRefundReason('')
      setActionFeedback({ tone: 'success', message: 'Refund completed.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Refund failed.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Transactions & Refunds" />

      <main className="flex-1 p-6 space-y-5">
        {!canManageFinance && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your admin role can view transactions, but it cannot issue refunds.
          </div>
        )}
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {[
            { id: 'ledger', label: 'Ledger' },
            { id: 'performance', label: 'Performance' },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id as typeof activeView)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === view.id
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {activeView === 'performance' ? (
          <div className="grid gap-4 md:grid-cols-4">
            <SummaryCard title="Paid revenue" value={summary ? `£${summary.paid.toFixed(0)}` : '—'} loading={summaryLoading} />
            <SummaryCard title="Refunded" value={summary ? `£${summary.refunded.toFixed(0)}` : '—'} loading={summaryLoading} />
            <SummaryCard title="Pending" value={summary ? `£${summary.pending.toFixed(0)}` : '—'} loading={summaryLoading} />
            <SummaryCard title="Failed payments" value={summary ? String(summary.failedCount) : '—'} loading={summaryLoading} />
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction ledger</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Search payments, inspect failed charges, and refund completed transactions when needed.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={transactions.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {activeView === 'ledger' ? (
            <div className="mb-4 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by payment, customer, provider, or task..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as PaymentStatus | 'all')}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 lg:w-52"
              >
                <option value="all">All payment states</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Switch back to <span className="font-medium">Ledger</span> to search, refund, or inspect individual payments.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load transactions.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Task</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No transactions for the current filter.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">#{transaction.id}</td>
                      <td className="px-5 py-4">{transaction.customer_name}</td>
                      <td className="px-5 py-4">{transaction.provider_name}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{transaction.task_title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{transaction.category_name}</div>
                      </td>
                      <td className="px-5 py-4">£{transaction.amount.toFixed(2)}</td>
                      <td className="px-5 py-4">{STATUS_LABELS[transaction.status]}</td>
                      <td className="px-5 py-4">{format(new Date(transaction.created_at), 'dd MMM yyyy')}</td>
                      <td className="px-5 py-4 text-right">
                        {transaction.status === 'paid' ? (
                          <button
                            type="button"
                            disabled={refundPayment.isPending || !canManageFinance}
                            onClick={() =>
                              setRefundTarget({
                                paymentId: transaction.id,
                                taskTitle: transaction.task_title,
                                amount: transaction.amount,
                                bookingId: transaction.booking_id,
                              })
                            }
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-900/60"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">No action</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {refundTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm refund</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You are refunding <span className="font-medium text-slate-900 dark:text-white">£{refundTarget.amount.toFixed(2)}</span> for {refundTarget.taskTitle}.
            </p>
            <textarea
              value={refundReason}
              onChange={(event) => setRefundReason(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Explain why this refund is being issued..."
            />
            <div className="mt-4 flex flex-wrap justify-between gap-3">
              <div className="flex gap-3">
                {refundTarget.bookingId ? (
                  <Link
                    to={`/tasks/details/${refundTarget.bookingId}`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    View booking
                  </Link>
                ) : null}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRefundTarget(null)
                    setRefundReason('')
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={refundPayment.isPending || !refundReason.trim()}
                  onClick={handleRefund}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm refund
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SummaryCard({ title, value, loading }: { title: string; value: string; loading: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
        {loading ? '...' : value}
      </div>
    </div>
  )
}
