import { useState } from 'react'
import Header from '../../components/header'
import { ChevronLeft, ChevronRight, UserPlus, AlertTriangle, Users } from 'lucide-react'
import { useHandysWithAvailability, type HandyWithAvailability } from '@/lib/api/handys'

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
}

function getHandyName(handy: HandyWithAvailability): string {
  const parts = [handy.first_name, handy.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown Handy'
}

export default function AvailabilityManagement() {
  const [currentMonth] = useState('July 2024')
  const [nextMonth] = useState('August 2024')

  const { data: handys, isLoading, error } = useHandysWithAvailability()

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
                  const isFirst = idx === 0
                  const isLast = idx === 25
                  return (
                    <button
                      key={day}
                      className={`py-2 bg-primary/20 text-primary ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                    >
                      {day}
                    </button>
                  )
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
                  const isLast = idx === 5
                  return (
                    <button
                      key={day}
                      className={`py-2 bg-primary/20 text-primary ${isLast ? 'rounded-r-full' : ''}`}
                    >
                      {day}
                    </button>
                  )
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

            {/* Error state */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300">
                      Failed to load handys
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
                      {error instanceof Error ? error.message : 'An unexpected error occurred'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Loading state */}
              {isLoading && (
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && handys && handys.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No handys found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    There are no handys registered in the system yet.
                  </p>
                </div>
              )}

              {/* Data table */}
              {!isLoading && !error && handys && handys.length > 0 && (
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
                        Time Slots
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {handys.map((handy) => (
                      <tr key={handy.user_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {handy.avatar_url ? (
                              <img
                                src={handy.avatar_url}
                                alt={getHandyName(handy)}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium text-sm">
                                  {(handy.first_name?.[0] || handy.last_name?.[0] || '?').toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {getHandyName(handy)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[handy.statusColor]}`}
                          >
                            {handy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {handy.activeSlots} / {handy.totalSlots} active
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
