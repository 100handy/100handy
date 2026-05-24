import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { BellRing, CalendarClock, Loader2, Play, Plus, Save, Search, Send, TestTube2, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { useAuth } from '@/contexts/AuthContext'
import {
  useDeletePushNotificationCampaign,
  useNotificationAudiencePreview,
  useNotificationAuditEvents,
  usePushDeliveryJobs,
  usePushNotificationCampaigns,
  useRunScheduledPushJobs,
  useSavePushNotificationCampaign,
  useSendPushCampaign,
  useSendTestPushCampaign,
} from '@/lib/api/content-platform'

const emptyTemplate = {
  campaign_key: '',
  title: '',
  campaign_kind: 'template' as const,
  recipient_group: 'all',
  message_title: '',
  message_body: '',
  route: '/',
  active: true,
}

const emptyDraft = {
  campaign_key: '',
  title: '',
  recipient_group: 'all',
  message_title: '',
  message_body: '',
  route: '/',
  active: false,
}

export default function PushNotificationsPage() {
  const { hasPermission } = useAuth()
  const canManageNotifications = hasPermission('notifications.manage')
  const { data: campaigns = [], isLoading } = usePushNotificationCampaigns()
  const { data: deliveryJobs = [] } = usePushDeliveryJobs()
  const { data: auditEvents = [] } = useNotificationAuditEvents('push')
  const saveCampaign = useSavePushNotificationCampaign()
  const deleteCampaign = useDeletePushNotificationCampaign()
  const sendCampaign = useSendPushCampaign()
  const sendTestPush = useSendTestPushCampaign()
  const runScheduledJobs = useRunScheduledPushJobs()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyTemplate)
  const [draftForm, setDraftForm] = useState(emptyDraft)
  const [draftFilters, setDraftFilters] = useState({
    postcode_prefix: '',
    require_push_enabled: true,
    require_device_token: true,
  })
  const [scheduledFor, setScheduledFor] = useState('')
  const [testRecipientEmail, setTestRecipientEmail] = useState('')

  const { data: audiencePreview, isLoading: previewLoading } = useNotificationAudiencePreview({
    channel: 'push',
    recipientGroup: draftForm.recipient_group,
    filters: {
      postcode_prefix: draftFilters.postcode_prefix || undefined,
      require_push_enabled: draftFilters.require_push_enabled,
      require_device_token: draftFilters.require_device_token,
    },
  })

  const selected = campaigns.find((campaign) => campaign.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setForm(emptyTemplate)
      return
    }

    setForm({
      campaign_key: selected.campaign_key,
      title: selected.title,
      campaign_kind: selected.campaign_kind,
      recipient_group: selected.recipient_group,
      message_title: selected.message_title,
      message_body: selected.message_body,
      route: selected.route ?? '/',
      active: selected.active,
    })
  }, [selected])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return campaigns
    return campaigns.filter((item) =>
      [item.title, item.campaign_key, item.message_title, item.recipient_group].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
  }, [campaigns, search])

  const templateRows = filtered.filter((item) => item.campaign_kind === 'template')
  const draftRows = filtered.filter((item) => item.campaign_kind === 'campaign_draft')
  const failedJobs = deliveryJobs.filter((job) => job.delivery_status === 'failed')
  const sentJobs = deliveryJobs.filter((job) => job.delivery_status === 'sent')
  const scheduledJobs = deliveryJobs.filter((job) => job.scheduled_for && job.delivery_status === 'queued')
  const isScheduled = Boolean(scheduledFor && new Date(scheduledFor).getTime() > Date.now())

  const templateErrors = {
    campaign_key: !form.campaign_key.trim() ? 'Campaign key is required.' : null,
    title: !form.title.trim() ? 'Title is required.' : null,
    message_title: !form.message_title.trim() ? 'Push title is required.' : null,
    message_body: !form.message_body.trim() ? 'Push body is required.' : null,
    route: form.route.trim() && !form.route.startsWith('/') ? 'Route must start with "/".' : null,
  }

  const draftErrors = {
    campaign_key: !draftForm.campaign_key.trim() ? 'Draft key is required.' : null,
    title: !draftForm.title.trim() ? 'Draft title is required.' : null,
    message_title: !draftForm.message_title.trim() ? 'Push title is required.' : null,
    message_body: !draftForm.message_body.trim() ? 'Push body is required.' : null,
    route: draftForm.route.trim() && !draftForm.route.startsWith('/') ? 'Route must start with "/".' : null,
  }

  const canSaveTemplate =
    canManageNotifications &&
    !templateErrors.campaign_key &&
    !templateErrors.title &&
    !templateErrors.message_title &&
    !templateErrors.message_body &&
    !templateErrors.route

  const canSaveDraft =
    canManageNotifications &&
    !draftErrors.campaign_key &&
    !draftErrors.title &&
    !draftErrors.message_title &&
    !draftErrors.message_body &&
    !draftErrors.route

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Push Notifications" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {!canManageNotifications && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your admin role can view push campaigns and delivery history, but it cannot change or send them.
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search push campaigns..."
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

        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Push Templates</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Templates define reusable push notifications for web and app audiences.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Push Campaign</th>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Last Modified</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-6" colSpan={6}>
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                ) : templateRows.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>
                      No push templates found.
                    </td>
                  </tr>
                ) : (
                  templateRows.map((campaign) => (
                    <tr key={campaign.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{campaign.title}</td>
                      <td className="px-6 py-4">{campaign.recipient_group}</td>
                      <td className="px-6 py-4">{campaign.active ? 'active' : 'inactive'}</td>
                      <td className="px-6 py-4">{campaign.route ?? '/'}</td>
                      <td className="px-6 py-4">{format(new Date(campaign.updated_at), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="mr-4 text-primary hover:underline" onClick={() => setSelectedId(campaign.id)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => deleteCampaign.mutate(campaign.id)}>
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

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
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
                onClick={() => runScheduledJobs.mutate()}
                disabled={runScheduledJobs.isPending || !canManageNotifications}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {runScheduledJobs.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run Due Jobs
              </button>
            </div>
            <div className="space-y-2">
              {deliveryJobs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No push delivery jobs yet.</p>
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
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{job.sent_count}/{job.recipient_count} delivered</td>
                          <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{format(new Date(job.triggered_at), 'MMM d, yyyy HH:mm')}</td>
                          <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{job.scheduled_for ? format(new Date(job.scheduled_for), 'MMM d, yyyy HH:mm') : 'Now'}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() =>
                                sendCampaign.mutate({
                                  campaignId: job.campaign_id ?? undefined,
                                  campaignKey: job.campaign_key,
                                  title: job.title,
                                  recipientGroup: job.recipient_group,
                                  messageTitle: job.message_title,
                                  messageBody: job.message_body,
                                  route: job.route ?? '/',
                                  audienceFilters: (job.audience_filters as Record<string, unknown>) ?? {},
                                })
                              }
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

          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {selectedId ? 'Edit Push Template' : 'Create Push Template'}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Field label="Campaign Key" value={form.campaign_key} onChange={(value) => setForm((prev) => ({ ...prev, campaign_key: value }))} />
              <FieldErrorText error={templateErrors.campaign_key} />
            </div>
            <div>
              <Field label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
              <FieldErrorText error={templateErrors.title} />
            </div>
            <SelectField
              label="Recipient Group"
              value={form.recipient_group}
              onChange={(value) => setForm((prev) => ({ ...prev, recipient_group: value }))}
              options={['all', 'client', 'professional', 'admin']}
            />
            <ToggleField label="Active" checked={form.active} onChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))} />
            <div>
              <Field label="Push Title" value={form.message_title} onChange={(value) => setForm((prev) => ({ ...prev, message_title: value }))} />
              <FieldErrorText error={templateErrors.message_title} />
            </div>
            <div>
              <Field label="Open Route" value={form.route} onChange={(value) => setForm((prev) => ({ ...prev, route: value }))} />
              <FieldErrorText error={templateErrors.route} />
            </div>
            <div className="md:col-span-2">
              <TextAreaField label="Push Body" value={form.message_body} onChange={(value) => setForm((prev) => ({ ...prev, message_body: value }))} rows={6} />
              <FieldErrorText error={templateErrors.message_body} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                saveCampaign.mutate({
                  id: selected?.id,
                  campaign_key: form.campaign_key,
                  title: form.title,
                  campaign_kind: 'template',
                  recipient_group: form.recipient_group,
                  message_title: form.message_title,
                  message_body: form.message_body,
                  route: form.route,
                  active: form.active,
                })
              }
              disabled={saveCampaign.isPending || !canSaveTemplate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Template
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">One-Time Push Drafts</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Save reusable push drafts, send a test, or schedule a campaign for later.
          </p>
          <div className="mb-6 space-y-3">
            {draftRows.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No saved push drafts.</p>
            ) : (
              draftRows.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{draft.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{draft.recipient_group} / {draft.message_title}</p>
                  </div>
                  <div className="space-x-4">
                    <button
                      className="text-primary hover:underline"
                      onClick={() =>
                        setDraftForm({
                          campaign_key: draft.campaign_key,
                          title: draft.title,
                          recipient_group: draft.recipient_group,
                          message_title: draft.message_title,
                          message_body: draft.message_body,
                          route: draft.route ?? '/',
                          active: draft.active,
                        })
                      }
                    >
                      Load
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteCampaign.mutate(draft.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Field label="Draft Key" value={draftForm.campaign_key} onChange={(value) => setDraftForm((prev) => ({ ...prev, campaign_key: value }))} />
              <FieldErrorText error={draftErrors.campaign_key} />
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
              <Field label="Push Title" value={draftForm.message_title} onChange={(value) => setDraftForm((prev) => ({ ...prev, message_title: value }))} />
              <FieldErrorText error={draftErrors.message_title} />
            </div>
            <div className="md:col-span-2">
              <Field label="Open Route" value={draftForm.route} onChange={(value) => setDraftForm((prev) => ({ ...prev, route: value }))} />
              <FieldErrorText error={draftErrors.route} />
            </div>
            <div className="md:col-span-2">
              <TextAreaField label="Push Body" value={draftForm.message_body} onChange={(value) => setDraftForm((prev) => ({ ...prev, message_body: value }))} rows={6} />
              <FieldErrorText error={draftErrors.message_body} />
            </div>
            <div>
              <Field label="Postcode prefix filter" value={draftFilters.postcode_prefix} onChange={(value) => setDraftFilters((prev) => ({ ...prev, postcode_prefix: value }))} />
            </div>
            <ToggleField label="Require push enabled" checked={draftFilters.require_push_enabled} onChange={(checked) => setDraftFilters((prev) => ({ ...prev, require_push_enabled: checked }))} />
            <ToggleField label="Require device token" checked={draftFilters.require_device_token} onChange={(checked) => setDraftFilters((prev) => ({ ...prev, require_device_token: checked }))} />
            <DateTimeField label="Schedule for" value={scheduledFor} onChange={setScheduledFor} />
            <div className="md:col-span-2">
              <Field label="Test recipient email" value={testRecipientEmail} onChange={setTestRecipientEmail} />
            </div>
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
              onClick={() =>
                sendTestPush.mutate({
                  recipientEmail: testRecipientEmail,
                  title: draftForm.message_title,
                  body: draftForm.message_body,
                  route: draftForm.route || '/',
                })
              }
              disabled={sendTestPush.isPending || !testRecipientEmail.trim() || !draftForm.message_title.trim() || !draftForm.message_body.trim() || !canManageNotifications}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-950/20"
            >
              {sendTestPush.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
              Send Test
            </button>
            <button
              onClick={() =>
                sendCampaign.mutate({
                  campaignKey: draftForm.campaign_key,
                  title: draftForm.title,
                  recipientGroup: draftForm.recipient_group,
                  messageTitle: draftForm.message_title,
                  messageBody: draftForm.message_body,
                  route: draftForm.route,
                  audienceFilters: {
                    postcode_prefix: draftFilters.postcode_prefix || undefined,
                    require_push_enabled: draftFilters.require_push_enabled,
                    require_device_token: draftFilters.require_device_token,
                  },
                  scheduledFor: scheduledFor || null,
                })
              }
              disabled={sendCampaign.isPending || !canSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            >
              {sendCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isScheduled ? 'Schedule Draft' : 'Send Draft'}
            </button>
            <button
              onClick={() =>
                saveCampaign.mutate({
                  campaign_key: draftForm.campaign_key,
                  title: draftForm.title,
                  campaign_kind: 'campaign_draft',
                  recipient_group: draftForm.recipient_group,
                  message_title: draftForm.message_title,
                  message_body: draftForm.message_body,
                  route: draftForm.route,
                  active: false,
                })
              }
              disabled={saveCampaign.isPending || !canSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>
          </div>

          {draftForm.message_body && (
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Preview</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{draftForm.route || '/'}</span>
              </div>
              <div className="bg-slate-100 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">100Handy</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">now</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{draftForm.message_title || 'No title'}</div>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">{draftForm.message_body || 'No message body'}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Audit Trail</span>
            </div>
            <div className="space-y-2">
              {auditEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No push notification audit events yet.</p>
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
        </section>
      </main>
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
