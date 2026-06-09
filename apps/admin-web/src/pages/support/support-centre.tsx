import { useMemo, useState } from 'react'
import Header from '../../components/header'
import { Search, ChevronDown, Loader2, X, Send, MessageSquare, StickyNote, UserCheck } from 'lucide-react'
import {
  useCreateSupportInternalNote,
  useCreateTicketResponse,
  useSupportStats,
  useSupportTicket,
  useSupportTickets,
  useUpdateTicketStatus,
  type SupportFilters,
} from '@/lib/api/support'
import { useAuth } from '@/contexts/AuthContext'

export default function SupportCentre() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'inbox' | 'performance'>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SupportFilters['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<SupportFilters['priority']>('all')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const [debouncedSearch, setDebouncedSearch] = useState('')
  useMemo(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
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
  const createInternalNote = useCreateSupportInternalNote()
  const updateStatus = useUpdateTicketStatus()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as SupportFilters['status'])
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value as SupportFilters['priority'])
  }

  async function handleSendResponse() {
    if (!selectedTicketId || !responseText.trim()) return
    setActionFeedback(null)
    try {
      await createResponse.mutateAsync({ ticketId: selectedTicketId, message: responseText.trim() })
      setResponseText('')
      setActionFeedback({ tone: 'success', message: 'Support response sent.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to send response.' })
    }
  }

  async function handleInternalNote() {
    if (!selectedTicketId || !internalNote.trim()) return
    setActionFeedback(null)
    try {
      await createInternalNote.mutateAsync({ ticketId: selectedTicketId, note: internalNote.trim() })
      setInternalNote('')
      setActionFeedback({ tone: 'success', message: 'Internal note saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save internal note.' })
    }
  }

  async function handleCloseTicket() {
    if (!selectedTicketId) return
    setActionFeedback(null)
    try {
      await updateStatus.mutateAsync({ ticketId: selectedTicketId, status: 'closed' })
      setShowCloseModal(false)
      setSelectedTicketId(null)
      setActionFeedback({ tone: 'success', message: 'Ticket closed.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to close ticket.' })
    }
  }

  async function handleAssignToMe() {
    if (!selectedTicketId || !user?.id) return
    setActionFeedback(null)
    try {
      await updateStatus.mutateAsync({ ticketId: selectedTicketId, assignedTo: user.id, status: 'in_progress' })
      setActionFeedback({ tone: 'success', message: 'Ticket assigned to you.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to assign ticket.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Support Tickets" />

      <main className="flex-1 p-6 space-y-5">
        {actionFeedback && (
          <div className={`rounded-xl px-4 py-3 text-sm ${
            actionFeedback.tone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300'
              : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300'
          }`}>
            {actionFeedback.message}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review customer support conversations, assignments, and ticket status in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'inbox', label: 'Inbox' },
              { id: 'performance', label: 'Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id as typeof viewMode)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'performance' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard label="Open Tickets" value={stats?.openTickets || 0} accent="text-blue-600" />
            <StatCard label="In Progress" value={stats?.inProgressTickets || 0} accent="text-purple-600" />
            <StatCard label="Resolved / Closed" value={stats?.closedTickets || 0} accent="text-emerald-600" />
            <StatCard label="Avg Response Time" value={stats?.avgResponseTime || 'N/A'} accent="text-primary" />
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ticket inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Search tickets, filter by status or priority, and open a conversation to reply.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-gray-300 bg-background-light py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-background-dark dark:text-gray-300 md:w-56"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  type="text"
                  value={searchQuery}
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none rounded-lg border border-gray-300 bg-background-light py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-background-dark dark:text-gray-300"
                  onChange={handleStatusChange}
                  value={statusFilter}
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none rounded-lg border border-gray-300 bg-background-light py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-background-dark dark:text-gray-300"
                  onChange={handlePriorityChange}
                  value={priorityFilter}
                >
                  <option value="all">All priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Error loading tickets.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Ticket ID</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Assigned Agent</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ticketsLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : tickets && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/20">
                      <td className="px-6 py-4 font-medium text-primary">#{ticket.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ticket.subject}</td>
                      <td className="px-6 py-4">{ticket.userName}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${ticket.priorityColor}`}>{ticket.priority}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${ticket.statusColor}`}>{ticket.status}</span>
                      </td>
                      <td className="px-6 py-4">{ticket.agent}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No support tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticketLoading ? 'Loading...' : selectedTicket?.subject || 'Ticket Details'}
              </h3>
              <button onClick={() => setSelectedTicketId(null)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[1.4fr,1fr]">
              <div className="overflow-y-auto border-r border-gray-200 p-4 dark:border-gray-800">
                {ticketLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : selectedTicket ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <Info label="User" value={selectedTicket.userName} />
                      <Info label="Created" value={selectedTicket.date} />
                      <Info label="Priority" value={selectedTicket.priority} />
                      <Info label="Status" value={selectedTicket.status} />
                      <Info label="Assigned" value={selectedTicket.agent} />
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
                      <h4 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                        <MessageSquare className="h-4 w-4" />
                        Conversation
                      </h4>
                      <div className="space-y-3">
                        {selectedTicket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`rounded-lg p-3 ${
                              msg.fromUser ? 'mr-8 bg-gray-100 dark:bg-gray-800' : 'ml-8 bg-primary/10'
                            }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{msg.message}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {msg.fromUser ? 'Customer / Provider' : 'Support'} • {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="overflow-y-auto p-4">
                {selectedTicket ? (
                  <div className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAssignToMe}
                        disabled={updateStatus.isPending}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700"
                      >
                        <UserCheck className="h-4 w-4" />
                        Assign to me
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setActionFeedback(null)
                          try {
                            await updateStatus.mutateAsync({ ticketId: selectedTicket.id, status: 'resolved' })
                            setActionFeedback({ tone: 'success', message: 'Ticket marked resolved.' })
                          } catch (error) {
                            setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to resolve ticket.' })
                          }
                        }}
                        disabled={updateStatus.isPending}
                        className="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/60"
                      >
                        Mark resolved
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCloseModal(true)}
                        disabled={updateStatus.isPending}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/60"
                      >
                        Close ticket
                      </button>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Send response
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response..."
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                          onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                        />
                        <button
                          onClick={handleSendResponse}
                          disabled={!responseText.trim() || createResponse.isPending}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
                        >
                          {createResponse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Send
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Internal note
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          placeholder="Add an internal note..."
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                          onKeyDown={(e) => e.key === 'Enter' && handleInternalNote()}
                        />
                        <button
                          onClick={handleInternalNote}
                          disabled={!internalNote.trim() || createInternalNote.isPending}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700 disabled:opacity-50"
                        >
                          {createInternalNote.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <StickyNote className="h-4 w-4" />}
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                      <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Internal notes</h4>
                      <div className="space-y-3">
                        {selectedTicket.internalNotes.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No internal notes yet.</p>
                        ) : (
                          selectedTicket.internalNotes.map((note) => (
                            <div key={note.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
                              <div className="font-medium text-slate-900 dark:text-white">{note.adminName}</div>
                              <div className="mt-1 text-slate-600 dark:text-slate-300">{note.note}</div>
                              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                {new Date(note.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCloseModal && selectedTicket ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Close ticket</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Close <span className="font-medium text-slate-900 dark:text-white">{selectedTicket.subject}</span>. The conversation will remain in history, but the ticket will leave the active queue.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Keep open
              </button>
              <button
                type="button"
                onClick={handleCloseTicket}
                disabled={updateStatus.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
