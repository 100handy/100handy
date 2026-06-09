import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CalendarClock, ExternalLink, Loader2, Play, Plus, Save, Search, Send, TestTube2, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { useAuth } from '@/contexts/AuthContext'
import {
  useDeleteEmailTemplate,
  useEmailDeliveryJobs,
  useEmailTemplates,
  useNotificationAudiencePreview,
  useNotificationAuditEvents,
  useRunScheduledEmailJobs,
  useSendEmailCampaign,
  useSendTestEmailCampaign,
  useSaveEmailTemplate,
} from '@/lib/api/content-platform'

const emptyTemplate = {
  template_key: '',
  title: '',
  template_kind: 'template' as const,
  recipient_group: 'all',
  subject: '',
  preview_text: '',
  body: '',
  active: true,
}

const emptyCampaignDraft = {
  template_key: '',
  title: '',
  recipient_group: 'all',
  subject: '',
  preview_text: '',
  body: '',
  active: false,
}

export default function EmailNotifications() {
  const { hasPermission } = useAuth()
  const canManageNotifications = hasPermission('notifications.manage')
  const { data: templates = [], isLoading } = useEmailTemplates()
  const { data: deliveryJobs = [] } = useEmailDeliveryJobs()
  const { data: auditEvents = [] } = useNotificationAuditEvents('email')
  const saveTemplate = useSaveEmailTemplate()
  const deleteTemplate = useDeleteEmailTemplate()
  const sendCampaign = useSendEmailCampaign()
  const sendTestEmail = useSendTestEmailCampaign()
  const runScheduledJobs = useRunScheduledEmailJobs()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyTemplate)
  const [draftForm, setDraftForm] = useState(emptyCampaignDraft)
  const [draftFilters, setDraftFilters] = useState({ postcode_prefix: '', require_marketing_opt_in: true })
  const [scheduledFor, setScheduledFor] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [editorTab, setEditorTab] = useState<'templates' | 'drafts' | 'jobs' | 'history'>('templates')

  const { data: audiencePreview, isLoading: previewLoading } = useNotificationAudiencePreview({
    channel: 'email',
    recipientGroup: draftForm.recipient_group,
    filters: {
      postcode_prefix: draftFilters.postcode_prefix || undefined,
      require_marketing_opt_in: draftFilters.require_marketing_opt_in,
    },
  })

  const selected = templates.find((template) => template.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setForm(emptyTemplate)
      return
    }

    setForm({
      template_key: selected.template_key,
      title: selected.title,
      template_kind: selected.template_kind,
      recipient_group: selected.recipient_group,
      subject: selected.subject,
      preview_text: selected.preview_text ?? '',
      body: selected.body,
      active: selected.active,
    })
  }, [selected])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return templates
    return templates.filter((item) =>
      [item.title, item.template_key, item.subject, item.recipient_group].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
  }, [templates, search])

  const templateRows = filtered.filter((item) => item.template_kind === 'template')
  const draftRows = filtered.filter((item) => item.template_kind === 'campaign_draft')
  const failedJobs = deliveryJobs.filter((job) => job.delivery_status === 'failed')
  const sentJobs = deliveryJobs.filter((job) => job.delivery_status === 'sent')
  const scheduledJobs = deliveryJobs.filter((job) => job.scheduled_for && job.delivery_status === 'queued')
  const isScheduled = Boolean(scheduledFor && new Date(scheduledFor).getTime() > Date.now())

  const templateErrors = {
    template_key: !form.template_key.trim() ? 'Template key is required.' : null,
    title: !form.title.trim() ? 'Title is required.' : null,
    subject: !form.subject.trim() ? 'Subject is required.' : null,
    body: !form.body.trim() ? 'Body is required.' : null,
  }

  const draftErrors = {
    template_key: !draftForm.template_key.trim() ? 'Draft key is required.' : null,
    title: !draftForm.title.trim() ? 'Draft title is required.' : null,
    subject: !draftForm.subject.trim() ? 'Subject is required.' : null,
    body: !draftForm.body.trim() ? 'Message is required.' : null,
  }

  const canSaveTemplate =
    canManageNotifications &&
    !templateErrors.template_key &&
    !templateErrors.title &&
    !templateErrors.subject &&
    !templateErrors.body

  const canSaveDraft =
    canManageNotifications &&
    !draftErrors.template_key &&
    !draftErrors.title &&
    !draftErrors.subject &&
    !draftErrors.body

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Email Notifications" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {actionFeedback && (
          <div className={`rounded-xl px-4 py-3 text-sm ${
            actionFeedback.tone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
          }`}>
            {actionFeedback.message}
          </div>
        )}
        {!canManageNotifications && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your admin role can view email templates and delivery history, but it cannot change or send them.
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email templates..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <button
            disabled={!canManageNotifications}
            onClick={() => {
              setSelectedId(null)
              setForm(emptyTemplate)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'templates', label: 'Templates' },
            { id: 'drafts', label: 'Campaign drafts' },
            { id: 'jobs', label: 'Delivery jobs' },
            { id: 'history', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setEditorTab(tab.id as typeof editorTab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                editorTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {editorTab === 'templates' && (
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Email Templates</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Templates are stored in the database and can be activated or revised without a deploy.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Email Type</th>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Modified</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-6" colSpan={5}>
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                ) : templateRows.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                      No templates found.
                    </td>
                  </tr>
                ) : (
                  templateRows.map((template) => (
                    <tr key={template.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{template.title}</td>
                      <td className="px-6 py-4">{template.recipient_group}</td>
                      <td className="px-6 py-4">{template.active ? 'active' : 'inactive'}</td>
                      <td className="px-6 py-4">{format(new Date(template.updated_at), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="mr-4 text-primary hover:underline" onClick={() => setSelectedId(template.id)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => setDeleteTargetId(template.id)}>
                          <Trash2 className="inline h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
          {editorTab === 'jobs' && (
          <>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <DeliveryStatCard label="Total jobs" value={deliveryJobs.length} />
            <DeliveryStatCard label="Sent jobs" value={sentJobs.length} />
            <DeliveryStatCard label="Scheduled jobs" value={scheduledJobs.length} />
            <DeliveryStatCard label="Failed jobs" value={failedJobs.length} tone={failedJobs.length > 0 ? 'danger' : 'default'} />
          </div>
          <div className="mb-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Jobs</h3>
              <button
                onClick={async () => {
                  setActionFeedback(null)
                  try {
                    await runScheduledJobs.mutateAsync()
                    setActionFeedback({ tone: 'success', message: 'Due email jobs processed.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to run due email jobs.' })
                  }
                }}
                disabled={runScheduledJobs.isPending || !canManageNotifications}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {runScheduledJobs.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run Due Jobs
              </button>
            </div>
            <div className="space-y-2">
              {deliveryJobs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No delivery jobs yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="py-2 pr-4">Campaign</th>
                        <th className="py-2 pr-4">Recipient</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Result</th>
                        <th className="py-2 pr-4">Triggered</th>
                        <th className="py-2 pr-4">Scheduled</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryJobs.slice(0, 10).map((job) => (
                        <tr key={job.id} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 pr-4">
                            <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                            {job.error_message && <div className="mt-1 text-xs text-red-600 dark:text-red-300">{job.error_message}</div>}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{job.recipient_group}</td>
                          <td className="py-3 pr-4"><StatusBadge status={job.delivery_status} /></td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{job.sent_count}/{job.recipient_count} sent</td>
                          <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{format(new Date(job.triggered_at), 'MMM d, yyyy HH:mm')}</td>
                          <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{job.scheduled_for ? format(new Date(job.scheduled_for), 'MMM d, yyyy HH:mm') : 'Now'}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={async () => {
                                setActionFeedback(null)
                                try {
                                  await sendCampaign.mutateAsync({
                                  templateId: job.template_id ?? undefined,
                                  templateKey: job.template_key,
                                  title: job.title,
                                  recipientGroup: job.recipient_group,
                                  subject: job.subject,
                                  previewText: job.preview_text ?? '',
                                  body: job.body,
                                  audienceFilters: (job.audience_filters as Record<string, unknown>) ?? {},
                                  })
                                  setActionFeedback({ tone: 'success', message: 'Email job retried.' })
                                } catch (error) {
                                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to retry email job.' })
                                }
                              }}
                              disabled={sendCampaign.isPending || !canManageNotifications}
                              className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                            >
                              Retry
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          </>
          )}

          {editorTab === 'templates' && (
          <>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {selectedId ? 'Edit Email Template' : 'Create Email Template'}
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Edit reusable email templates that can be loaded into one-time campaigns later.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Field label="Template Key" value={form.template_key} onChange={(value) => setForm((prev) => ({ ...prev, template_key: value }))} />
              <FieldErrorText error={templateErrors.template_key} />
            </div>
            <div>
              <Field label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
              <FieldErrorText error={templateErrors.title} />
            </div>
            <SelectField
              label="Recipient Group"
              value={form.recipient_group}
              onChange={(value) => setForm((prev) => ({ ...prev, recipient_group: value }))}
              options={['all', 'client', 'professional', 'new_users', 'new_handys']}
            />
            <ToggleField label="Active" checked={form.active} onChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))} />
            <div className="md:col-span-2">
              <Field label="Subject" value={form.subject} onChange={(value) => setForm((prev) => ({ ...prev, subject: value }))} />
              <FieldErrorText error={templateErrors.subject} />
            </div>
            <div className="md:col-span-2">
              <Field label="Preview Text" value={form.preview_text} onChange={(value) => setForm((prev) => ({ ...prev, preview_text: value }))} />
            </div>
            <div className="md:col-span-2">
              <TextAreaField label="Body" value={form.body} onChange={(value) => setForm((prev) => ({ ...prev, body: value }))} rows={10} />
              <FieldErrorText error={templateErrors.body} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={async () => {
                setActionFeedback(null)
                try {
                  await saveTemplate.mutateAsync({
                  id: selected?.id,
                  template_key: form.template_key,
                  title: form.title,
                  template_kind: 'template',
                  recipient_group: form.recipient_group,
                  subject: form.subject,
                  preview_text: form.preview_text,
                  body: form.body,
                  active: form.active,
                  })
                  setActionFeedback({ tone: 'success', message: 'Email template saved.' })
                } catch (error) {
                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save email template.' })
                }
              }}
              disabled={saveTemplate.isPending || !canSaveTemplate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveTemplate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Template
            </button>
          </div>
          </>
          )}

          {editorTab === 'drafts' && (
          <>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">One-Time Email Drafts</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            One-time campaigns can be sent now, scheduled, or saved for later reuse.
          </p>
          <div className="mb-6 space-y-3">
            {draftRows.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No saved campaign drafts.</p>
            ) : (
              draftRows.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{draft.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{draft.recipient_group} / {draft.subject}</p>
                  </div>
                  <div className="space-x-4">
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        setDraftForm({
                          template_key: draft.template_key,
                          title: draft.title,
                          recipient_group: draft.recipient_group,
                          subject: draft.subject,
                          preview_text: draft.preview_text ?? '',
                          body: draft.body,
                          active: draft.active,
                        })
                      }
                    >
                      Load
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => setDeleteTargetId(draft.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Field label="Draft Key" value={draftForm.template_key} onChange={(value) => setDraftForm((prev) => ({ ...prev, template_key: value }))} />
              <FieldErrorText error={draftErrors.template_key} />
            </div>
            <div>
              <Field label="Draft Title" value={draftForm.title} onChange={(value) => setDraftForm((prev) => ({ ...prev, title: value }))} />
              <FieldErrorText error={draftErrors.title} />
            </div>
            <SelectField
              label="Recipient Group"
              value={draftForm.recipient_group}
              onChange={(value) => setDraftForm((prev) => ({ ...prev, recipient_group: value }))}
              options={['all', 'client', 'professional', 'admin']}
            />
            <div>
              <Field label="Subject" value={draftForm.subject} onChange={(value) => setDraftForm((prev) => ({ ...prev, subject: value }))} />
              <FieldErrorText error={draftErrors.subject} />
            </div>
            <div className="md:col-span-2">
              <Field label="Preview Text" value={draftForm.preview_text} onChange={(value) => setDraftForm((prev) => ({ ...prev, preview_text: value }))} />
            </div>
            <div className="md:col-span-2">
              <TextAreaField label="Message" value={draftForm.body} onChange={(value) => setDraftForm((prev) => ({ ...prev, body: value }))} rows={8} />
              <FieldErrorText error={draftErrors.body} />
            </div>
            <div>
              <Field label="Postcode prefix filter" value={draftFilters.postcode_prefix} onChange={(value) => setDraftFilters((prev) => ({ ...prev, postcode_prefix: value }))} />
            </div>
            <ToggleField label="Require marketing opt-in" checked={draftFilters.require_marketing_opt_in} onChange={(checked) => setDraftFilters((prev) => ({ ...prev, require_marketing_opt_in: checked }))} />
            <DateTimeField label="Schedule for" value={scheduledFor} onChange={setScheduledFor} />
            <Field label="Test email address" value={testEmail} onChange={setTestEmail} />
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Recipient preview</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Current filters applied to the selected audience.</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-gray-400">Estimated recipients</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{previewLoading ? '...' : audiencePreview?.count ?? 0}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={async () => {
                setActionFeedback(null)
                try {
                  await sendTestEmail.mutateAsync({ testEmail, subject: draftForm.subject, body: draftForm.body })
                  setActionFeedback({ tone: 'success', message: 'Test email sent.' })
                } catch (error) {
                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to send test email.' })
                }
              }}
              disabled={sendTestEmail.isPending || !testEmail.trim() || !draftForm.subject.trim() || !draftForm.body.trim() || !canManageNotifications}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-950/20"
            >
              {sendTestEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
              Send Test
            </button>
            <button
              onClick={async () => {
                setActionFeedback(null)
                try {
                  await sendCampaign.mutateAsync({
                  templateKey: draftForm.template_key,
                  title: draftForm.title,
                  recipientGroup: draftForm.recipient_group,
                  subject: draftForm.subject,
                  previewText: draftForm.preview_text,
                  body: draftForm.body,
                  audienceFilters: {
                    postcode_prefix: draftFilters.postcode_prefix || undefined,
                    require_marketing_opt_in: draftFilters.require_marketing_opt_in,
                  },
                  scheduledFor: scheduledFor || null,
                  })
                  setActionFeedback({ tone: 'success', message: isScheduled ? 'Email draft scheduled.' : 'Email draft sent.' })
                } catch (error) {
                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to send email draft.' })
                }
              }}
              disabled={sendCampaign.isPending || !canSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            >
              {sendCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isScheduled ? 'Schedule Draft' : 'Send Draft'}
            </button>
            <button
              onClick={async () => {
                setActionFeedback(null)
                try {
                  await saveTemplate.mutateAsync({
                  template_key: draftForm.template_key,
                  title: draftForm.title,
                  template_kind: 'campaign_draft',
                  recipient_group: draftForm.recipient_group,
                  subject: draftForm.subject,
                  preview_text: draftForm.preview_text,
                  body: draftForm.body,
                  active: false,
                  })
                  setActionFeedback({ tone: 'success', message: 'Email draft saved.' })
                } catch (error) {
                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save email draft.' })
                }
              }}
              disabled={saveTemplate.isPending || !canSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveTemplate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>
          </div>

          {draftForm.body && (
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Preview</span>
                <a href="mailto:" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ExternalLink className="h-4 w-4" />
                  Preview Layout
                </a>
              </div>
              <div className="bg-white p-6 text-sm">
                <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">Subject</div>
                <div className="mb-4 font-semibold text-gray-900">{draftForm.subject || 'No subject'}</div>
                {draftForm.preview_text && (
                  <>
                    <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">Preview text</div>
                    <div className="mb-4 text-gray-600">{draftForm.preview_text}</div>
                  </>
                )}
                <div className="rounded-lg border border-gray-200 p-4 whitespace-pre-wrap text-gray-800">
                  {draftForm.body || 'No message body'}
                </div>
              </div>
            </div>
          )}
          </>
          )}

          {editorTab === 'history' && (
          <div className="mt-6 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Audit Trail</span>
            </div>
            <div className="space-y-2">
              {auditEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No email notification audit events yet.</p>
              ) : (
                auditEvents.slice(0, 8).map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{event.action.replaceAll('_', ' ')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{event.entity_type}</div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          )}
        </section>
      </main>

      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete email item</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the selected email template or campaign draft.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteTemplate.mutateAsync(deleteTargetId)
                    setActionFeedback({ tone: 'success', message: 'Email item deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete email item.' })
                    return
                  }
                  setDeleteTargetId(null)
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
    </label>
  )
}

function DateTimeField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
    </div>
  )
}

function DeliveryStatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'danger'
}) {
  return (
    <div className={`rounded-xl border p-4 ${tone === 'danger' ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950/20'}`}>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${tone === 'danger' ? 'text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'sent'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
      : status === 'failed'
        ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>
}
