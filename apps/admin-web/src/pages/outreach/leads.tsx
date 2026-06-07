import { useMemo, useState, type ReactNode } from 'react'
import { CalendarPlus, CheckCircle2, Loader2, MailPlus, Plus, Send, Sparkles, XCircle } from 'lucide-react'
import Header from '@/components/header'
import {
  useCreateOutreachFollowUp,
  useCreateOutreachLead,
  useCreateOutreachMessage,
  useGenerateOutreachDraft,
  useOutreachLeads,
  useOutreachSummary,
  useRunOutreachAgent,
  useUpdateOutreachFollowUp,
  useUpdateOutreachLead,
  useUpdateOutreachMessage,
  type OutreachApprovalStatus,
  type OutreachLeadStatus,
  type OutreachLeadType,
  type OutreachLeadWithMessages,
} from '@/lib/api/outreach'

type LeadFormState = {
  leadType: OutreachLeadType
  sourcePlatform: string
  sourceUrl: string
  profileName: string
  businessName: string
  location: string
  serviceType: string
  urgency: 'low' | 'medium' | 'high'
  rawText: string
}

const defaultLeadForm: LeadFormState = {
  leadType: 'customer',
  sourcePlatform: 'Facebook',
  sourceUrl: '',
  profileName: '',
  businessName: '',
  location: '',
  serviceType: 'Handyman',
  urgency: 'medium',
  rawText: '',
}

export default function OutreachLeadsPage() {
  const [leadType, setLeadType] = useState<OutreachLeadType | 'all'>('all')
  const [status, setStatus] = useState<OutreachLeadStatus | 'all'>('all')
  const [approvalStatus, setApprovalStatus] = useState<OutreachApprovalStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [leadForm, setLeadForm] = useState<LeadFormState>(defaultLeadForm)
  const [draftText, setDraftText] = useState('')
  const [followUpDate, setFollowUpDate] = useState(defaultTomorrowDate())
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [agentType, setAgentType] = useState<'customer_finder' | 'worker_finder'>('customer_finder')
  const [agentSource, setAgentSource] = useState('Facebook')
  const [agentService, setAgentService] = useState('Handyman')
  const [agentBatchText, setAgentBatchText] = useState('')

  const filters = useMemo(() => ({ leadType, status, approvalStatus, search }), [leadType, status, approvalStatus, search])
  const { data: leads = [], isLoading } = useOutreachLeads(filters)
  const { data: summary } = useOutreachSummary()
  const createLead = useCreateOutreachLead()
  const updateLead = useUpdateOutreachLead()
  const createMessage = useCreateOutreachMessage()
  const updateMessage = useUpdateOutreachMessage()
  const generateDraft = useGenerateOutreachDraft()
  const createFollowUp = useCreateOutreachFollowUp()
  const updateFollowUp = useUpdateOutreachFollowUp()
  const runAgent = useRunOutreachAgent()

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? leads[0] ?? null

  async function handleCreateLead() {
    if (!leadForm.sourcePlatform.trim() || !leadForm.serviceType.trim() || !leadForm.rawText.trim()) return

    const created = await createLead.mutateAsync({
      lead_type: leadForm.leadType,
      source_platform: leadForm.sourcePlatform.trim(),
      source_url: leadForm.sourceUrl.trim() || null,
      profile_name: leadForm.profileName.trim() || null,
      business_name: leadForm.businessName.trim() || null,
      location: leadForm.location.trim() || null,
      service_type: leadForm.serviceType.trim(),
      urgency: leadForm.urgency,
      intent_strength: leadForm.urgency,
      source_confidence: 'medium',
      raw_text: leadForm.rawText.trim(),
      contact_allowed: 'unknown',
      duplicate_check_key: buildDuplicateKey(leadForm),
      status: 'new',
      approval_status: 'pending',
    })

    setSelectedLeadId(created.id)
    setLeadForm(defaultLeadForm)
  }

  async function handleCreateMessage(lead: OutreachLeadWithMessages) {
    if (!draftText.trim()) return

    await createMessage.mutateAsync({
      lead_id: lead.id,
      message_type: lead.messages.length > 0 ? 'follow_up' : 'initial',
      channel: 'manual',
      draft_text: draftText.trim(),
      approval_status: 'pending',
      delivery_status: 'not_sent',
    })

    setDraftText('')
  }

  async function handleGenerateDraft(lead: OutreachLeadWithMessages) {
    await generateDraft.mutateAsync(lead.id)
  }

  async function handleCreateFollowUp(lead: OutreachLeadWithMessages) {
    if (!followUpDate) return

    await createFollowUp.mutateAsync({
      lead_id: lead.id,
      due_at: new Date(`${followUpDate}T09:00:00`).toISOString(),
      status: 'pending',
      notes: followUpNotes.trim() || null,
    })

    setFollowUpDate(defaultTomorrowDate())
    setFollowUpNotes('')
  }

  async function handleRunAgent() {
    const items = agentBatchText
      .split(/\n\s*\n/)
      .map((rawText) => rawText.trim())
      .filter(Boolean)
      .map((raw_text) => ({ raw_text }))

    if (!agentSource.trim() || items.length === 0) return

    await runAgent.mutateAsync({
      agentType,
      sourcePlatform: agentSource.trim(),
      defaultServiceType: agentService.trim() || 'Local service',
      items,
    })

    setAgentBatchText('')
  }

  async function completeFollowUp(followUpId: string) {
    await updateFollowUp.mutateAsync({
      id: followUpId,
      updates: {
        status: 'completed',
      },
    })
  }

  async function approveLead(lead: OutreachLeadWithMessages) {
    await updateLead.mutateAsync({
      id: lead.id,
      updates: {
        approval_status: 'approved',
        status: lead.status === 'new' ? 'approved' : lead.status,
      },
    })
  }

  async function rejectLead(lead: OutreachLeadWithMessages) {
    await updateLead.mutateAsync({
      id: lead.id,
      updates: {
        approval_status: 'rejected',
        status: 'rejected',
        do_not_contact_reason: 'Rejected during admin review',
      },
    })
  }

  async function approveMessage(messageId: string) {
    await updateMessage.mutateAsync({
      id: messageId,
      updates: {
        approval_status: 'approved',
      },
    })
  }

  async function markMessageSent(lead: OutreachLeadWithMessages, messageId: string) {
    await updateMessage.mutateAsync({
      id: messageId,
      updates: {
        delivery_status: 'sent',
      },
    })
    await updateLead.mutateAsync({
      id: lead.id,
      updates: {
        status: 'contacted',
      },
    })

    if (!lead.followUps.some((followUp) => followUp.status === 'pending')) {
      const dueAt = new Date()
      dueAt.setDate(dueAt.getDate() + 3)
      dueAt.setHours(9, 0, 0, 0)

      await createFollowUp.mutateAsync({
        lead_id: lead.id,
        message_id: messageId,
        due_at: dueAt.toISOString(),
        status: 'pending',
        notes: 'Check for response and decide whether a manual follow-up is appropriate.',
      })
    }
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <Header title="Outreach" />

      <div className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <SummaryCard label="Total leads" value={summary?.total ?? 0} />
            <SummaryCard label="Customers" value={summary?.customers ?? 0} />
            <SummaryCard label="Workers" value={summary?.workers ?? 0} />
            <SummaryCard label="Pending" value={summary?.pendingApproval ?? 0} />
            <SummaryCard label="Approved" value={summary?.approved ?? 0} />
            <SummaryCard label="Contacted" value={summary?.contacted ?? 0} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
            <section className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead queue</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review customer and worker opportunities before outreach.</p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <select value={leadType} onChange={(event) => setLeadType(event.target.value as OutreachLeadType | 'all')} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option value="all">All lead types</option>
                    <option value="customer">Customers</option>
                    <option value="worker">Workers</option>
                  </select>
                  <select value={approvalStatus} onChange={(event) => setApprovalStatus(event.target.value as OutreachApprovalStatus | 'all')} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option value="all">All approval states</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select value={status} onChange={(event) => setStatus(event.target.value as OutreachLeadStatus | 'all')} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option value="all">All lead statuses</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="contacted">Contacted</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Search leads" />
                </div>

                <div className="mt-4 max-h-[680px] space-y-3 overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      No outreach leads found.
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                          selectedLead?.id === lead.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 bg-white hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {lead.business_name || lead.profile_name || 'Unnamed lead'}
                            </div>
                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {lead.service_type} {lead.location ? `in ${lead.location}` : ''} • {lead.source_platform}
                            </div>
                          </div>
                          <StatusBadge value={lead.approval_status} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Pill>{lead.lead_type}</Pill>
                          <Pill>{lead.status}</Pill>
                          <Pill>Score {lead.ai_score ?? '-'}</Pill>
                          <Pill>{lead.messages.length} messages</Pill>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <LeadCreatePanel
                form={leadForm}
                setForm={setLeadForm}
                onCreate={handleCreateLead}
                saving={createLead.isPending}
              />
              <AgentRunnerPanel
                agentType={agentType}
                setAgentType={setAgentType}
                source={agentSource}
                setSource={setAgentSource}
                service={agentService}
                setService={setAgentService}
                batchText={agentBatchText}
                setBatchText={setAgentBatchText}
                onRun={handleRunAgent}
                running={runAgent.isPending}
              />
            </section>

            <section className="space-y-6">
              {selectedLead ? (
                <LeadDetailPanel
                  lead={selectedLead}
                  draftText={draftText}
                  setDraftText={setDraftText}
                  onApproveLead={() => approveLead(selectedLead)}
                  onRejectLead={() => rejectLead(selectedLead)}
                  onCreateMessage={() => handleCreateMessage(selectedLead)}
                  onGenerateDraft={() => handleGenerateDraft(selectedLead)}
                  onApproveMessage={approveMessage}
                  onMarkMessageSent={(messageId) => markMessageSent(selectedLead, messageId)}
                  followUpDate={followUpDate}
                  setFollowUpDate={setFollowUpDate}
                  followUpNotes={followUpNotes}
                  setFollowUpNotes={setFollowUpNotes}
                  onCreateFollowUp={() => handleCreateFollowUp(selectedLead)}
                  onCompleteFollowUp={completeFollowUp}
                  busy={
                    updateLead.isPending ||
                    createMessage.isPending ||
                    updateMessage.isPending ||
                    generateDraft.isPending ||
                    createFollowUp.isPending ||
                    updateFollowUp.isPending
                  }
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-gray-900/50 dark:text-slate-400">
                  Select a lead to review details.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

function LeadCreatePanel({
  form,
  setForm,
  onCreate,
  saving,
}: {
  form: LeadFormState
  setForm: (next: LeadFormState) => void
  onCreate: () => void
  saving: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add lead</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manual entry for reviewed posts, profiles, and directories.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Lead type">
          <select value={form.leadType} onChange={(event) => setForm({ ...form, leadType: event.target.value as OutreachLeadType })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="customer">Customer</option>
            <option value="worker">Worker</option>
          </select>
        </Field>
        <Field label="Source">
          <input value={form.sourcePlatform} onChange={(event) => setForm({ ...form, sourcePlatform: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Name">
          <input value={form.profileName} onChange={(event) => setForm({ ...form, profileName: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Business">
          <input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Location">
          <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Service">
          <input value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Urgency">
          <select value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value as LeadFormState['urgency'] })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>
        <Field label="Source URL">
          <input value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
      </div>

      <Field label="Raw text">
        <textarea value={form.rawText} onChange={(event) => setForm({ ...form, rawText: event.target.value })} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
      </Field>

      <button
        type="button"
        onClick={onCreate}
        disabled={saving || !form.sourcePlatform.trim() || !form.serviceType.trim() || !form.rawText.trim()}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add lead
      </button>
    </div>
  )
}

function AgentRunnerPanel({
  agentType,
  setAgentType,
  source,
  setSource,
  service,
  setService,
  batchText,
  setBatchText,
  onRun,
  running,
}: {
  agentType: 'customer_finder' | 'worker_finder'
  setAgentType: (value: 'customer_finder' | 'worker_finder') => void
  source: string
  setSource: (value: string) => void
  service: string
  setService: (value: string) => void
  batchText: string
  setBatchText: (value: string) => void
  onRun: () => void
  running: boolean
}) {
  const itemCount = batchText.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean).length

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Run AI finder</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste reviewed posts or profiles. Items are separated by a blank line and queued for human approval.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Agent">
          <select value={agentType} onChange={(event) => setAgentType(event.target.value as 'customer_finder' | 'worker_finder')} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="customer_finder">Customer Finder</option>
            <option value="worker_finder">Worker Finder</option>
          </select>
        </Field>
        <Field label="Source">
          <input value={source} onChange={(event) => setSource(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
        <Field label="Default service">
          <input value={service} onChange={(event) => setService(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </Field>
      </div>

      <Field label="Posts or profiles">
        <textarea
          value={batchText}
          onChange={(event) => setBatchText(event.target.value)}
          rows={7}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          placeholder={'Can anyone recommend a cleaner in Liverpool?\n\nJohn Smith - handyman services in Warrington, shelves, repairs, furniture assembly.'}
        />
      </Field>

      <button
        type="button"
        onClick={onRun}
        disabled={running || !source.trim() || itemCount === 0}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Run finder{itemCount > 0 ? ` (${itemCount})` : ''}
      </button>
    </div>
  )
}

function LeadDetailPanel({
  lead,
  draftText,
  setDraftText,
  onApproveLead,
  onRejectLead,
  onCreateMessage,
  onGenerateDraft,
  onApproveMessage,
  onMarkMessageSent,
  followUpDate,
  setFollowUpDate,
  followUpNotes,
  setFollowUpNotes,
  onCreateFollowUp,
  onCompleteFollowUp,
  busy,
}: {
  lead: OutreachLeadWithMessages
  draftText: string
  setDraftText: (value: string) => void
  onApproveLead: () => void
  onRejectLead: () => void
  onCreateMessage: () => void
  onGenerateDraft: () => void
  onApproveMessage: (messageId: string) => void
  onMarkMessageSent: (messageId: string) => void
  followUpDate: string
  setFollowUpDate: (value: string) => void
  followUpNotes: string
  setFollowUpNotes: (value: string) => void
  onCreateFollowUp: () => void
  onCompleteFollowUp: (followUpId: string) => void
  busy: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {lead.business_name || lead.profile_name || 'Unnamed lead'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {lead.lead_type} • {lead.service_type} • {lead.source_platform}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={lead.approval_status} />
            <StatusBadge value={lead.status} muted />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <MiniStat label="Location" value={lead.location || '-'} />
          <MiniStat label="Urgency" value={lead.urgency || '-'} />
          <MiniStat label="AI score" value={lead.ai_score ?? '-'} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoBlock label="Profile URL" value={lead.profile_url || lead.source_url || '-'} />
          <InfoBlock label="Contact" value={`${lead.public_contact_method || 'unknown'}${lead.contact_detail ? `: ${lead.contact_detail}` : ''}`} />
          <InfoBlock label="AI summary" value={lead.ai_summary || '-'} />
          <InfoBlock label="Evidence" value={lead.evidence_text || lead.raw_text} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGenerateDraft}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate AI draft
          </button>
          <button
            type="button"
            onClick={onApproveLead}
            disabled={busy || lead.approval_status === 'approved'}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve lead
          </button>
          <button
            type="button"
            onClick={onRejectLead}
            disabled={busy || lead.approval_status === 'rejected'}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/20"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Follow ups</h3>
        <div className="mt-4 space-y-3">
          {lead.followUps.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No follow-ups scheduled.
            </div>
          ) : (
            lead.followUps.map((followUp) => (
              <div key={followUp.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{formatDateTime(followUp.due_at)}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{followUp.notes || 'No notes'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={followUp.status} muted={followUp.status !== 'pending'} />
                  {followUp.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => onCompleteFollowUp(followUp.id)}
                      disabled={busy}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Complete
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[180px,1fr,auto]">
          <input
            type="date"
            value={followUpDate}
            onChange={(event) => setFollowUpDate(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={followUpNotes}
            onChange={(event) => setFollowUpNotes(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Follow-up note"
          />
          <button
            type="button"
            onClick={onCreateFollowUp}
            disabled={busy || !followUpDate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Messages</h3>
        <div className="mt-4 space-y-3">
          {lead.messages.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No draft messages yet.
            </div>
          ) : (
            lead.messages.map((message) => (
              <div key={message.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={message.approval_status} />
                    <StatusBadge value={message.delivery_status} muted />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onApproveMessage(message.id)}
                      disabled={busy || message.approval_status === 'approved'}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onMarkMessageSent(message.id)}
                      disabled={busy || message.delivery_status === 'sent' || message.approval_status !== 'approved'}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Mark sent
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{message.draft_text}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-5">
          <textarea
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder={buildDraftPlaceholder(lead)}
          />
          <button
            type="button"
            onClick={onCreateMessage}
            disabled={busy || !draftText.trim()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <MailPlus className="h-4 w-4" />
            Add draft
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{children}</span>
}

function StatusBadge({ value, muted = false }: { value: string; muted?: boolean }) {
  const classes = muted
    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
    : value === 'approved' || value === 'sent' || value === 'contacted'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : value === 'rejected' || value === 'failed'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${classes}`}>{value.replaceAll('_', ' ')}</span>
}

function buildDuplicateKey(form: LeadFormState) {
  return [form.leadType, form.sourcePlatform, form.sourceUrl || form.profileName || form.businessName, form.serviceType, form.location]
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join(':')
}

function buildDraftPlaceholder(lead: OutreachLeadWithMessages) {
  const name = lead.profile_name || lead.business_name || 'there'
  if (lead.lead_type === 'worker') {
    return `Hi ${name}, I noticed you provide ${lead.service_type.toLowerCase()} services${lead.location ? ` in ${lead.location}` : ''}. We're expanding 100Handy and are looking for trusted professionals in your area. Would you be interested in receiving additional local work opportunities?`
  }

  return `Hi ${name}, if you're still looking for help with ${lead.service_type.toLowerCase()}${lead.location ? ` in ${lead.location}` : ''}, 100Handy can connect you with a vetted local professional. Let me know if you'd like more information.`
}

function defaultTomorrowDate() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
