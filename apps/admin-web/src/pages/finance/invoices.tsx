import { useState } from 'react';
import Header from '../../components/header';
import { Search, Download, Eye, AlertCircle, ChevronDown, Loader2, X } from 'lucide-react';
import { useInvoices, type Invoice } from '@/lib/api/finance-extended';
import { Link } from 'react-router-dom';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getStatusColor = (status: Invoice['status']): string => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'Overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending' | 'Overdue'>('all');
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const limit = 10;

  const { data, isLoading } = useInvoices(
    statusFilter,
    searchQuery || undefined,
    page * limit
  );

  const invoices = data?.invoices.slice((page - 1) * limit, page * limit) || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Invoices" />

      <main className="flex-1 p-6 space-y-6">
        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Invoices</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Search Input */}
              <div className="relative w-full sm:w-auto">
                <input
                  className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search invoices..."
                  type="text"
                  value={searchQuery}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    setStatusFilter(e.target.value as typeof statusFilter);
                    setPage(1);
                  }}
                  value={statusFilter}
                >
                  <option value="all">Status: All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Billed To</th>
                  <th className="px-6 py-3">Issued Date</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading invoices...</p>
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0 group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>{invoice.billedTo}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {invoice.billedType}
                        </div>
                      </td>
                      <td className="px-6 py-4">{invoice.issuedDate}</td>
                      <td className="px-6 py-4">{invoice.dueDate}</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => setSelectedInvoice(invoice)}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              const csv = [
                                ['Invoice ID', 'Payment ID', 'Booking ID', 'Billed To', 'Billed Type', 'Issued Date', 'Due Date', 'Amount', 'Status'].join(','),
                                [
                                  invoice.id,
                                  invoice.paymentId,
                                  invoice.bookingId || '',
                                  `"${invoice.billedTo}"`,
                                  invoice.billedType,
                                  invoice.issuedDate,
                                  invoice.dueDate,
                                  invoice.amount.toFixed(2),
                                  invoice.status,
                                ].join(','),
                              ].join('\n')

                              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                              const url = URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = url
                              link.download = `${invoice.id.replace('#', '').toLowerCase()}.csv`
                              link.click()
                              URL.revokeObjectURL(url)
                            }}
                            type="button"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {invoice.status === 'Overdue' && (
                            <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {invoices.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} invoices
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedInvoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Invoice Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvoice.id}</p>
              </div>
              <button
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSelectedInvoice(null)}
                type="button"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailRow label="Payment ID" value={selectedInvoice.paymentId} />
              <DetailRow label="Booking ID" value={selectedInvoice.bookingId || 'No booking linked'} />
              <DetailRow label="Billed To" value={selectedInvoice.billedTo} />
              <DetailRow label="Type" value={selectedInvoice.billedType} />
              <DetailRow label="Issued Date" value={selectedInvoice.issuedDate} />
              <DetailRow label="Due Date" value={selectedInvoice.dueDate} />
              <DetailRow label="Amount" value={formatCurrency(selectedInvoice.amount)} />
              <DetailRow label="Status" value={selectedInvoice.status} />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedInvoice.billedUserId ? (
                <Link
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  to={
                    selectedInvoice.billedType === 'Handy'
                      ? `/handys/${selectedInvoice.billedUserId}`
                      : `/users/profiles?id=${selectedInvoice.billedUserId}`
                  }
                >
                  View {selectedInvoice.billedType === 'Handy' ? 'Provider' : 'Customer'}
                </Link>
              ) : null}
              {selectedInvoice.bookingId ? (
                <Link
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  to={`/tasks/details/${selectedInvoice.bookingId}`}
                >
                  View Booking
                </Link>
              ) : null}
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                onClick={() => setSelectedInvoice(null)}
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
