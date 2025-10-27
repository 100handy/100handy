import { useState } from 'react';
import Header from '../../components/header';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const handyData = [
  { name: 'Ethan Harper', status: 'Available', statusColor: 'green' },
  { name: 'Olivia Bennett', status: 'Unavailable', statusColor: 'red' },
  { name: 'Noah Carter', status: 'Available', statusColor: 'green' },
  { name: 'Ava Thompson', status: 'Partially Available', statusColor: 'yellow' },
  { name: 'Liam Foster', status: 'Available', statusColor: 'green' },
];

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

export default function AvailabilityManagement() {
  const [currentMonth] = useState('July 2024');
  const [nextMonth] = useState('August 2024');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Availability Management" />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <nav aria-label="Breadcrumb" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              <ol className="list-none p-0 inline-flex items-center">
                <li className="flex items-center">
                  <a className="hover:text-primary" href="/handys">
                    Handys
                  </a>
                  <ChevronRight className="w-4 h-4 mx-2" />
                </li>
                <li className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-200">Availability Management</span>
                </li>
              </ol>
            </nav>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage the availability of Handys for task assignments.
            </p>
          </div>

          {/* Dual Calendar View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* July Calendar */}
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 rounded-full hover:bg-primary/10">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{currentMonth}</h3>
                <button className="p-2 rounded-full hover:bg-primary/10 invisible">
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="font-bold text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {/* Empty cells for days before month starts */}
                <div className="col-start-4 text-gray-500 dark:text-gray-400 py-2">1</div>
                <div className="py-2 text-gray-500 dark:text-gray-400">2</div>
                <div className="py-2 text-gray-500 dark:text-gray-400">3</div>
                <div className="py-2 text-gray-500 dark:text-gray-400">4</div>
                {/* Selected range */}
                {Array.from({ length: 26 }, (_, i) => i + 5).map((day, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === 25;
                  return (
                    <button
                      key={day}
                      className={`py-2 bg-primary/20 text-primary ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
                <div className="py-2">31</div>
              </div>
            </div>

            {/* August Calendar */}
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 rounded-full hover:bg-primary/10 invisible">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{nextMonth}</h3>
                <button className="p-2 rounded-full hover:bg-primary/10">
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="font-bold text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {/* Empty cells for days before month starts */}
                <div className="col-start-5 py-2 bg-primary/20 text-primary">1</div>
                {Array.from({ length: 6 }, (_, i) => i + 2).map((day, idx) => {
                  const isLast = idx === 5;
                  return (
                    <button
                      key={day}
                      className={`py-2 bg-primary/20 text-primary ${isLast ? 'rounded-r-full' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
                {/* Rest of the month */}
                {Array.from({ length: 24 }, (_, i) => i + 8).map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Handy Availability Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Handy Availability</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                <UserPlus className="w-5 h-5" />
                <span>Invite a Handy</span>
              </button>
            </div>
            <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Handy Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {handyData.map((handy, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {handy.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[handy.statusColor as keyof typeof statusColors]
                          }`}
                        >
                          {handy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a className="text-primary hover:text-primary/80" href="#">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
