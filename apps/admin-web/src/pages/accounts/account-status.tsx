import { useState } from 'react';
import Header from '../../components/header';

type FilterType = 'deleted' | 'paused' | 'location';

const deletedAccounts = [
  {
    user: 'Alice Johnson',
    email: 'alice.j@example.com',
    date: '2023-10-15',
    reason: 'User request',
  },
  {
    user: 'Bob Williams',
    email: 'bob.w@example.com',
    date: '2023-09-20',
    reason: 'Violation of terms',
  },
  {
    user: 'Charlie Brown',
    email: 'charlie.b@example.com',
    date: '2023-08-01',
    reason: 'User request',
  },
];

const pausedAccounts = [
  {
    user: 'David Lee',
    email: 'david.l@example.com',
    date: '2023-10-20',
    reason: 'Temporary suspension',
  },
  {
    user: 'Emma Davis',
    email: 'emma.d@example.com',
    date: '2023-10-18',
    reason: 'User request',
  },
];

const locationAccounts = [
  {
    user: 'Frank Miller',
    email: 'frank.m@example.com',
    location: 'New York, USA',
    setDate: '2023-10-25',
  },
  {
    user: 'Grace Wilson',
    email: 'grace.w@example.com',
    location: 'London, UK',
    setDate: '2023-10-22',
  },
];

export default function AccountStatus() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('deleted');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Status Filter" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View and manage accounts based on their status.
            </p>
          </header>

          {/* Filter Tabs */}
          <div className="bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter by:</h3>
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'deleted'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('deleted')}
                >
                  Deleted Accounts
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'paused'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('paused')}
                >
                  Paused Accounts
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    activeFilter === 'location'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20'
                  }`}
                  onClick={() => setActiveFilter('location')}
                >
                  Default Location
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-8">
            {/* Deleted Accounts */}
            {activeFilter === 'deleted' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Deleted Accounts
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3" scope="col">
                          User
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Email
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Deletion Date
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Reason
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedAccounts.map((account, idx) => (
                        <tr
                          key={idx}
                          className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                            {account.user}
                          </td>
                          <td className="px-6 py-4">{account.email}</td>
                          <td className="px-6 py-4">{account.date}</td>
                          <td className="px-6 py-4">{account.reason}</td>
                          <td className="px-6 py-4">
                            <a className="font-medium text-primary hover:underline" href="#">
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Paused Accounts */}
            {activeFilter === 'paused' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Paused Accounts
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3" scope="col">
                          User
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Email
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Pause Date
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Reason
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pausedAccounts.map((account, idx) => (
                        <tr
                          key={idx}
                          className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                            {account.user}
                          </td>
                          <td className="px-6 py-4">{account.email}</td>
                          <td className="px-6 py-4">{account.date}</td>
                          <td className="px-6 py-4">{account.reason}</td>
                          <td className="px-6 py-4">
                            <a className="font-medium text-primary hover:underline" href="#">
                              Reactivate
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Default Location */}
            {activeFilter === 'location' && (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Default Location Settings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3" scope="col">
                          User
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Email
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Default Location
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Set Date
                        </th>
                        <th className="px-6 py-3" scope="col">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationAccounts.map((account, idx) => (
                        <tr
                          key={idx}
                          className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                            {account.user}
                          </td>
                          <td className="px-6 py-4">{account.email}</td>
                          <td className="px-6 py-4">{account.location}</td>
                          <td className="px-6 py-4">{account.setDate}</td>
                          <td className="px-6 py-4">
                            <a className="font-medium text-primary hover:underline" href="#">
                              Edit Location
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
