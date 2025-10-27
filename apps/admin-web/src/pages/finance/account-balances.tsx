import { useState } from 'react';
import Header from '../../components/header';
import { Wallet, Gift, TrendingUp, Download, ChevronDown } from 'lucide-react';

const summaryCards = [
  {
    label: 'Handy Payout Balances',
    value: '$215,430.50',
    icon: Wallet,
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Total funds awaiting payout to Handys.',
  },
  {
    label: 'Client Credit Balances',
    value: '$78,120.00',
    icon: Gift,
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400',
    description: 'Total unused credit held by clients.',
  },
  {
    label: 'Platform Revenue Account',
    value: '$1,234,567.89',
    icon: TrendingUp,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    description: 'Net earnings held by the platform.',
  },
];

const accounts = [
  {
    name: 'Platform Revenue',
    type: 'Platform Revenue',
    typeColor: 'bg-primary/10 text-primary dark:bg-primary/20',
    balance: '$1,234,567.89',
    pending: '$0.00',
    lastActivity: '2024-07-28',
    balanceColor: 'text-green-500',
  },
  {
    name: 'James Miller',
    type: 'Handy Payout',
    typeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    balance: '$2,450.75',
    pending: '$300.00',
    lastActivity: '2024-07-27',
    balanceColor: 'text-gray-800 dark:text-gray-200',
  },
  {
    name: 'Sarah Chen (Client)',
    type: 'Client Credit',
    typeColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    balance: '$50.00',
    pending: '$0.00',
    lastActivity: '2024-07-25',
    balanceColor: 'text-gray-800 dark:text-gray-200',
  },
  {
    name: 'Michael Brown',
    type: 'Handy Payout',
    typeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    balance: '$1,832.10',
    pending: '$150.50',
    lastActivity: '2024-07-28',
    balanceColor: 'text-gray-800 dark:text-gray-200',
  },
  {
    name: 'David Garcia (Client)',
    type: 'Client Credit',
    typeColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    balance: '$200.00',
    pending: '$0.00',
    lastActivity: '2024-07-22',
    balanceColor: 'text-gray-800 dark:text-gray-200',
  },
];

export default function AccountBalances() {
  const [filter, setFilter] = useState('Filter by type: All');

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
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {card.value}
                    </p>
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
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                >
                  <option>Filter by type: All</option>
                  <option>Handy Payout</option>
                  <option>Client Credit</option>
                  <option>Platform Revenue</option>
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
                {accounts.map((account, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {account.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.typeColor}`}
                      >
                        {account.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${account.balanceColor}`}>
                      {account.balance}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-500 dark:text-gray-400">
                      {account.pending}
                    </td>
                    <td className="px-6 py-4 text-center">{account.lastActivity}</td>
                    <td className="px-6 py-4 text-center">
                      <a className="text-primary hover:underline" href="#">
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
