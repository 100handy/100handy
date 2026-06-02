import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { format } from 'date-fns'
import Header from '@/components/header'
import { useFinanceSummary, useFinanceTransactions, useRefundPayment } from '@/lib/api/finance'
import type { PaymentStatus } from '@/lib/database.types'

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}

export default function TransactionsRefundsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all')

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

  async function handleRefund(paymentId: string) {
    const reason = window.prompt('Refund reason')
    if (!reason) return
    await refundPayment.mutateAsync({ paymentId, reason })
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Transactions & Refunds" />

      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="Paid Revenue" value={summary ? `£${summary.paid.toFixed(0)}` : '—'} loading={summaryLoading} />
          <SummaryCard title="Refunded" value={summary ? `£${summary.refunded.toFixed(0)}` : '—'} loading={summaryLoading} />
          <SummaryCard title="Pending" value={summary ? `£${summary.pending.toFixed(0)}` : '—'} loading={summaryLoading} />
          <SummaryCard title="Failed Payments" value={summary ? String(summary.failedCount) : '—'} loading={summaryLoading} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction ledger</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Filter payments, investigate failures, and refund transactions.</p>
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

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load transactions.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
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
                            disabled={refundPayment.isPending}
                            onClick={() => handleRefund(transaction.id)}
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
