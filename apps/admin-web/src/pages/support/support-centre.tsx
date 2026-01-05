import { useState, useMemo } from 'react'
import Header from '../../components/header'
import { Search, ChevronDown, Loader2, X, Send, MessageSquare } from 'lucide-react'
import {
  useSupportTickets,
  useSupportTicket,
  useCreateTicketResponse,
  useUpdateTicketStatus,
  useSupportStats,
  type SupportFilters,
} from '@/lib/api/support'

export default function SupportCentre() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SupportFilters['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<SupportFilters['priority']>('all')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: tickets, isLoading: ticketsLoading, error } = useSupportTickets({
    status: statusFilter,
    priority: priorityFilter,
    search: debouncedSearch,
  })

  const { data: stats } = useSupportStats()
  const { data: selectedTicket, isLoading: ticketLoading } = useSupportTicket(selectedTicketId || '')
  const createResponse = useCreateTicketResponse()
  const updateStatus = useUpdateTicketStatus()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'Status: All') {
      setStatusFilter('all')
    } else if (value === 'Open') {
      setStatusFilter('open')
    } else if (value === 'In Progress') {
      setStatusFilter('in_progress')
    } else if (value === 'Closed') {
      setStatusFilter('closed')
    }
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'Priority: All') {
      setPriorityFilter('all')
    } else if (value === 'High') {
      setPriorityFilter('high')
    } else if (value === 'Medium') {
      setPriorityFilter('medium')
    } else if (value === 'Low') {
      setPriorityFilter('low')
    } else if (value === 'Urgent') {
      setPriorityFilter('urgent')
    }
  }

  const handleSendResponse = async () => {
    if (!selectedTicketId || !responseText.trim()) return

    try {
      await createResponse.mutateAsync({
        ticketId: selectedTicketId,
        message: responseText.trim(),
      })
      setResponseText('')
    } catch (error) {
      console.error('Failed to send response:', error)
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicketId) return
    if (!confirm('Are you sure you want to close this ticket?')) return

    try {
      await updateStatus.mutateAsync({
        ticketId: selectedTicketId,
        status: 'closed',
      })
      setSelectedTicketId(null)
    } catch (error) {
      console.error('Failed to close ticket:', error)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Support Centre" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Open Tickets</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.openTickets || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.inProgressTickets || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
            <p className="text-2xl font-bold text-gray-600">{stats?.closedTickets || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
            <p className="text-2xl font-bold text-green-600">{stats?.avgResponseTime || 'N/A'}</p>
          </div>
        </div>

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
                  onChange={handleStatusChange}
                  value={
                    statusFilter === 'all'
                      ? 'Status: All'
                      : statusFilter === 'open'
                      ? 'Open'
                      : statusFilter === 'in_progress'
                      ? 'In Progress'
                      : 'Closed'
                  }
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
                  onChange={handlePriorityChange}
                  value={
                    priorityFilter === 'all'
                      ? 'Priority: All'
                      : priorityFilter === 'high'
                      ? 'High'
                      : priorityFilter === 'medium'
                      ? 'Medium'
                      : priorityFilter === 'low'
                      ? 'Low'
                      : 'Urgent'
                  }
                >
                  <option>Priority: All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                  <option>Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-700 dark:text-red-300">
              Error loading tickets. Please try again.
            </div>
          )}

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
                {ticketsLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading tickets...</p>
                    </td>
                  </tr>
                ) : tickets && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                    >
                      <td className="px-6 py-4 font-medium text-primary">
                        #{ticket.id.substring(0, 6)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">{ticket.userName}</td>
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
                        <button
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="text-primary hover:underline"
                        >
                          View
                        </button>
                        {ticket.showRespond && (
                          <button
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className="text-green-600 hover:underline"
                          >
                            Respond
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {debouncedSearch
                        ? 'No tickets found matching your search.'
                        : 'No support tickets found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticketLoading ? 'Loading...' : selectedTicket?.subject || 'Ticket Details'}
              </h3>
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {ticketLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : selectedTicket ? (
                <>
                  {/* Ticket Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">User</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.userName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedTicket.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Priority</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedTicket.priorityColor}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Status</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedTicket.statusColor}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </h4>
                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTicket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-lg ${
                              msg.fromUser
                                ? 'bg-gray-100 dark:bg-gray-800 mr-8'
                                : 'bg-primary/10 ml-8'
                            }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{msg.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {msg.fromUser ? 'Customer' : 'Support'} -{' '}
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">Ticket not found</p>
              )}
            </div>

            {/* Modal Footer - Response Input */}
            {selectedTicket?.showRespond && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                  />
                  <button
                    onClick={handleSendResponse}
                    disabled={!responseText.trim() || createResponse.isPending}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createResponse.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCloseTicket}
                    disabled={updateStatus.isPending}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    {updateStatus.isPending ? 'Closing...' : 'Close Ticket'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
