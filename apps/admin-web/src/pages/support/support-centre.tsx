import { useState } from 'react';
import Header from '../../components/header';
import { Search, Plus, ChevronDown } from 'lucide-react';

const tickets = [
  {
    id: '#78345',
    subject: 'Payment Issue with Credit Card',
    user: 'Alice Johnson',
    date: '2024-08-15 10:30 AM',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    status: 'Open',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    agent: 'John Doe',
    showRespond: true,
  },
  {
    id: '#78344',
    subject: 'Cannot reset password',
    user: 'Bob Williams',
    date: '2024-08-15 09:45 AM',
    priority: 'Medium',
    priorityColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    status: 'In Progress',
    statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    agent: 'Jane Smith',
    showRespond: true,
  },
  {
    id: '#78342',
    subject: 'Question about service fees',
    user: 'Charlie Brown',
    date: '2024-08-14 05:20 PM',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    status: 'Closed',
    statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    agent: 'John Doe',
    showRespond: false,
  },
  {
    id: '#78341',
    subject: 'Handy did not arrive',
    user: 'Diana Miller',
    date: '2024-08-14 02:00 PM',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    status: 'Open',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    agent: 'Unassigned',
    showRespond: true,
  },
];

export default function SupportCentre() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [priorityFilter, setPriorityFilter] = useState('Priority: All');
  const [agentFilter, setAgentFilter] = useState('Agent: All');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Support Centre" />

      <main className="flex-1 p-6 space-y-6">
        {/* Support Tickets */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Support Tickets</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <input
                  className="w-full md:w-48 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="search"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  type="text"
                  value={searchQuery}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  className="w-full md:w-auto appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                >
                  <option>Status: All</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  className="w-full md:w-auto appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  value={priorityFilter}
                >
                  <option>Priority: All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Agent Filter */}
              <div className="relative">
                <select
                  className="w-full md:w-auto appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setAgentFilter(e.target.value)}
                  value={agentFilter}
                >
                  <option>Agent: All</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* New Ticket Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                <Plus className="w-4 h-4" />
                <span>New Ticket</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3">Ticket ID</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Assigned Agent</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-primary">{ticket.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4">{ticket.user}</td>
                    <td className="px-6 py-4">{ticket.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.priorityColor}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.statusColor}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ticket.agent}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-primary hover:underline">View</button>
                      {ticket.showRespond && (
                        <button className="text-green-600 hover:underline">Respond</button>
                      )}
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
