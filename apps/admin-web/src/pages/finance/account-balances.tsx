import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import { Wallet, Gift, TrendingUp, Download, ChevronDown, Loader2 } from 'lucide-react';
import {
  useAccountBalancesSummary,
  useAccountBalances,
  type AccountBalance,
} from '@/lib/api/finance-extended';

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getTypeColor = (type: AccountBalance['type']): string => {
  switch (type) {
    case 'Platform Revenue':
      return 'bg-primary/10 text-primary dark:bg-primary/20';
    case 'Handy Payout':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Client Credit':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getBalanceColor = (type: AccountBalance['type']): string => {
  return type === 'Platform Revenue'
    ? 'text-green-500'
    : 'text-gray-800 dark:text-gray-200';
};

export default function AccountBalances() {
  const [filter, setFilter] = useState<'all' | 'Handy Payout' | 'Client Credit' | 'Platform Revenue'>('all');

  const { data: summary, isLoading: summaryLoading } = useAccountBalancesSummary();
  const { data: accounts, isLoading: accountsLoading } = useAccountBalances(filter);

  const summaryCards = [
    {
      label: 'Handy Payout Balances',
      value: summary ? formatCurrency(summary.handyPayoutBalances) : '$0.00',
      icon: Wallet,
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: 'Total funds awaiting payout to Handys.',
    },
    {
      label: 'Client Credit Balances',
      value: summary ? formatCurrency(summary.clientCreditBalances) : '$0.00',
      icon: Gift,
      iconBg: 'bg-green-100 dark:bg-green-900/50',
      iconColor: 'text-green-600 dark:text-green-400',
      description: 'Total unused credit held by clients.',
    },
    {
      label: 'Platform Revenue Account',
      value: summary ? formatCurrency(summary.platformRevenue) : '$0.00',
      icon: TrendingUp,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      description: 'Net earnings held by the platform.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Balances" />

      <main className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    {summaryLoading ? (
                      <div className="h-9 w-32 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {card.value}
                      </p>
                    )}
                  </div>
                  <div className={`p-2 ${card.iconBg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* All Accounts Table */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Accounts</h3>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <select
                  className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  value={filter}
                >
                  <option value="all">Filter by type: All</option>
                  <option value="Handy Payout">Handy Payout</option>
                  <option value="Client Credit">Client Credit</option>
                  <option value="Platform Revenue">Platform Revenue</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3">Account Name / Holder</th>
                  <th className="px-6 py-3">Account Type</th>
                  <th className="px-6 py-3 text-right">Current Balance</th>
                  <th className="px-6 py-3 text-right">Pending</th>
                  <th className="px-6 py-3 text-center">Last Activity</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accountsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading accounts...</p>
                    </td>
                  </tr>
                ) : accounts && accounts.length > 0 ? (
                  accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {account.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}
                        >
                          {account.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${getBalanceColor(account.type)}`}>
                        {formatCurrency(account.balance)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-500 dark:text-gray-400">
                        {formatCurrency(account.pending)}
                      </td>
                      <td className="px-6 py-4 text-center">{account.lastActivity}</td>
                      <td className="px-6 py-4 text-center">
                        {account.type === 'Handy Payout' ? (
                          <Link className="text-primary hover:underline" to={`/handys/${account.id}`}>
                            View Provider
                          </Link>
                        ) : account.type === 'Client Credit' ? (
                          <Link className="text-primary hover:underline" to={`/users/profiles?id=${account.id}`}>
                            View Customer
                          </Link>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Platform account</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
