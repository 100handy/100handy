import { useState } from 'react';
import Header from '../../components/header';
import { Search, Download, Eye, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useInvoices, type Invoice } from '@/lib/api/finance-extended';

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
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
    </div>
  );
}
