import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ExternalLink, Loader2, Plus, Save, Search, Send, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { useAuth } from '@/contexts/AuthContext'
import {
  useDeleteEmailTemplate,
  useEmailDeliveryJobs,
  useEmailTemplates,
  useSendEmailCampaign,
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
  const saveTemplate = useSaveEmailTemplate()
  const deleteTemplate = useDeleteEmailTemplate()
  const sendCampaign = useSendEmailCampaign()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyTemplate)
  const [draftForm, setDraftForm] = useState(emptyCampaignDraft)

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
        value.toLowerCase().includes(q)
      )
    )
  }, [templates, search])

  const templateRows = filtered.filter((item) => item.template_kind === 'template')
  const draftRows = filtered.filter((item) => item.template_kind === 'campaign_draft')

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
  const canSaveTemplate = canManageNotifications && !templateErrors.template_key && !templateErrors.title && !templateErrors.subject && !templateErrors.body
  const canSaveDraft = canManageNotifications && !draftErrors.template_key && !draftErrors.title && !draftErrors.subject && !draftErrors.body
  const canSendDraft = canSaveDraft

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Email Notifications" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>

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
                        <button className="text-red-600 hover:underline" onClick={() => deleteTemplate.mutate(template.id)}>
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
          <div className="mb-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Jobs</h3>
            <div className="mt-3 space-y-2">
              {deliveryJobs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No delivery jobs yet.</p>
              ) : deliveryJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {job.recipient_group} · {job.delivery_status} · {job.sent_count}/{job.recipient_count} sent
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(job.triggered_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {selectedId ? 'Edit Email Template' : 'Create Email Template'}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Template Key" value={form.template_key} onChange={(value) => setForm((prev) => ({ ...prev, template_key: value }))} />
            <FieldErrorText error={templateErrors.template_key} />
            <Field label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
            <FieldErrorText error={templateErrors.title} />
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
              onClick={() =>
                saveTemplate.mutate({
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
              }
              disabled={saveTemplate.isPending || !canSaveTemplate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveTemplate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Template
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">One-Time Email Drafts</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            One-time campaigns are stored as database drafts so they can be reviewed and reused later.
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
                    <button className="text-red-600 hover:underline" onClick={() => deleteTemplate.mutate(draft.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Draft Key" value={draftForm.template_key} onChange={(value) => setDraftForm((prev) => ({ ...prev, template_key: value }))} />
            <FieldErrorText error={draftErrors.template_key} />
            <Field label="Draft Title" value={draftForm.title} onChange={(value) => setDraftForm((prev) => ({ ...prev, title: value }))} />
            <FieldErrorText error={draftErrors.title} />
            <SelectField
              label="Recipient Group"
              value={draftForm.recipient_group}
              onChange={(value) => setDraftForm((prev) => ({ ...prev, recipient_group: value }))}
              options={['all', 'client', 'professional']}
            />
            <Field label="Subject" value={draftForm.subject} onChange={(value) => setDraftForm((prev) => ({ ...prev, subject: value }))} />
            <FieldErrorText error={draftErrors.subject} />
            <div className="md:col-span-2">
              <Field label="Preview Text" value={draftForm.preview_text} onChange={(value) => setDraftForm((prev) => ({ ...prev, preview_text: value }))} />
            </div>
            <div className="md:col-span-2">
              <TextAreaField label="Message" value={draftForm.body} onChange={(value) => setDraftForm((prev) => ({ ...prev, body: value }))} rows={8} />
              <FieldErrorText error={draftErrors.body} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() =>
                sendCampaign.mutate({
                  templateKey: draftForm.template_key,
                  title: draftForm.title,
                  recipientGroup: draftForm.recipient_group,
                  subject: draftForm.subject,
                  previewText: draftForm.preview_text,
                  body: draftForm.body,
                })
              }
              disabled={sendCampaign.isPending || !canSendDraft}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            >
              {sendCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Draft
            </button>
            <button
              onClick={() =>
                saveTemplate.mutate({
                  template_key: draftForm.template_key,
                  title: draftForm.title,
                  template_kind: 'campaign_draft',
                  recipient_group: draftForm.recipient_group,
                  subject: draftForm.subject,
                  preview_text: draftForm.preview_text,
                  body: draftForm.body,
                  active: false,
                })
              }
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
                <a
                  href="mailto:"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
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

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 pt-8 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}
