import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Check, Loader2, Plus, Rocket, Save, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidHref } from '@/lib/editor-validation'
import {
  useAnnouncementRevisions,
  useAnnouncements,
  useDeleteAnnouncement,
  useLatestAnnouncementDraft,
  usePublishAnnouncementDraft,
  useRestoreAnnouncementRevision,
  useSaveAnnouncementDraft,
} from '@/lib/api/content-platform'

const emptyAnnouncement = {
  audience: 'all' as const,
  placement: 'dashboard' as const,
  channel_scope: 'both' as const,
  title: '',
  body: '',
  cta_label: '',
  cta_href: '',
  starts_at: '',
  ends_at: '',
  active: true,
}

export default function AnnouncementsPage() {
  const { hasPermission } = useAuth()
  const canManageNotifications = hasPermission('notifications.manage')
  const { data: announcements = [], isLoading } = useAnnouncements()
  const saveDraft = useSaveAnnouncementDraft()
  const publishDraft = usePublishAnnouncementDraft()
  const restoreRevision = useRestoreAnnouncementRevision()
  const deleteAnnouncement = useDeleteAnnouncement()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draftKey, setDraftKey] = useState<string>(`draft-${crypto.randomUUID()}`)
  const [form, setForm] = useState(emptyAnnouncement)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const draftSaved = actionFeedback?.tone === 'success' && actionFeedback.message === 'Draft saved.'
  const announcementPublished = actionFeedback?.tone === 'success' && actionFeedback.message === 'Announcement published.'

  const selected = announcements.find((item) => item.id === selectedId) ?? null
  const effectiveAnnouncementKey = selected?.id ?? draftKey
  const { data: latestDraft } = useLatestAnnouncementDraft(effectiveAnnouncementKey)
  const { data: revisions = [] } = useAnnouncementRevisions(effectiveAnnouncementKey)

  useEffect(() => {
    const draftAnnouncement = latestDraft?.announcement_json as Record<string, unknown> | undefined
    if (!selected && !latestDraft) {
      setForm(emptyAnnouncement)
      return
    }

    setForm({
      audience: (draftAnnouncement?.audience as typeof emptyAnnouncement.audience | undefined) ?? selected?.audience ?? 'all',
      placement: (draftAnnouncement?.placement as typeof emptyAnnouncement.placement | undefined) ?? selected?.placement ?? 'dashboard',
      channel_scope: (draftAnnouncement?.channel_scope as typeof emptyAnnouncement.channel_scope | undefined) ?? ((selected as { channel_scope?: typeof emptyAnnouncement.channel_scope } | null)?.channel_scope ?? 'both'),
      title: (draftAnnouncement?.title as string | undefined) ?? selected?.title ?? '',
      body: (draftAnnouncement?.body as string | undefined) ?? selected?.body ?? '',
      cta_label: (draftAnnouncement?.cta_label as string | undefined) ?? selected?.cta_label ?? '',
      cta_href: (draftAnnouncement?.cta_href as string | undefined) ?? selected?.cta_href ?? '',
      starts_at: typeof draftAnnouncement?.starts_at === 'string'
        ? draftAnnouncement.starts_at.slice(0, 16)
        : selected?.starts_at ? selected.starts_at.slice(0, 16) : '',
      ends_at: typeof draftAnnouncement?.ends_at === 'string'
        ? draftAnnouncement.ends_at.slice(0, 16)
        : selected?.ends_at ? selected.ends_at.slice(0, 16) : '',
      active: (draftAnnouncement?.active as boolean | undefined) ?? selected?.active ?? true,
    })
  }, [selected, latestDraft])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return announcements
    return announcements.filter((item) =>
      [item.title, item.body, item.audience, item.placement].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
  }, [announcements, search])

  const isDirty = useMemo(() => {
    if (!latestDraft) return false
    return JSON.stringify(form) !== JSON.stringify({
      audience: latestDraft.announcement_json?.audience ?? 'all',
      placement: latestDraft.announcement_json?.placement ?? 'dashboard',
      channel_scope: latestDraft.announcement_json?.channel_scope ?? 'both',
      title: latestDraft.announcement_json?.title ?? '',
      body: latestDraft.announcement_json?.body ?? '',
      cta_label: latestDraft.announcement_json?.cta_label ?? '',
      cta_href: latestDraft.announcement_json?.cta_href ?? '',
      starts_at: typeof latestDraft.announcement_json?.starts_at === 'string' ? String(latestDraft.announcement_json.starts_at).slice(0, 16) : '',
      ends_at: typeof latestDraft.announcement_json?.ends_at === 'string' ? String(latestDraft.announcement_json.ends_at).slice(0, 16) : '',
      active: latestDraft.announcement_json?.active ?? true,
    })
  }, [form, latestDraft])

  useUnsavedChangesWarning(isDirty)

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!form.title.trim()) errors.push('Title is required.')
    if (!form.body.trim()) errors.push('Body is required.')
    if (form.cta_label.trim() && !form.cta_href.trim()) errors.push('CTA href is required when a CTA label is set.')
    if (form.cta_href.trim() && !isValidHref(form.cta_href)) errors.push('CTA href must start with "/" or "http(s)://".')
    if (form.starts_at && form.ends_at && new Date(form.starts_at) > new Date(form.ends_at)) {
      errors.push('End date must be after the start date.')
    }
    return errors
  }, [form])

  const canSaveDraft = canManageNotifications && validationErrors.length === 0
  const canPublish = canManageNotifications && validationErrors.length === 0 && !!latestDraft

  const persistDraft = async () => {
    if (!canSaveDraft) return
    setActionFeedback(null)
    try {
      await saveDraft.mutateAsync({
        announcementKey: effectiveAnnouncementKey,
        announcementId: selected?.id,
        announcement: {
          id: selected?.id,
          audience: form.audience,
          placement: form.placement,
          channel_scope: form.channel_scope,
          title: form.title,
          body: form.body,
          cta_label: form.cta_label,
          cta_href: form.cta_href,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          active: form.active,
        },
      })
      setActionFeedback({ tone: 'success', message: 'Draft saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save draft.' })
    }
  }

  const publish = async () => {
    if (!canPublish) return
    setActionFeedback(null)
    try {
      await publishDraft.mutateAsync(effectiveAnnouncementKey)
      setActionFeedback({ tone: 'success', message: 'Announcement published.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to publish announcement.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Announcements & Notifications" />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {!canManageNotifications && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            Your admin role can view announcements, but it cannot change or publish them.
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <button
            disabled={!canManageNotifications}
            onClick={() => {
              setSelectedId(null)
              setDraftKey(`draft-${crypto.randomUUID()}`)
              setForm(emptyAnnouncement)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Audience</th>
                <th className="px-6 py-3">Placement</th>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-6 py-6" colSpan={7}>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={7}>
                    No announcements found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.title}</td>
                    <td className="px-6 py-4">{item.audience}</td>
                    <td className="px-6 py-4">{item.placement}</td>
                    <td className="px-6 py-4">{(item as { channel_scope?: string }).channel_scope ?? 'both'}</td>
                    <td className="px-6 py-4">{item.active ? 'active' : 'inactive'}</td>
                    <td className="px-6 py-4">{format(new Date(item.updated_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="mr-4 text-primary hover:underline" onClick={() => setSelectedId(item.id)}>
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteTargetId(item.id)}>
                        <Trash2 className="inline h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <UnsavedChangesBanner show={isDirty} />
          {validationErrors.length > 0 && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {validationErrors.map((error) => <div key={error}>{error}</div>)}
            </div>
          )}
          <div className="mb-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Announcement edits now stage as drafts before they reach live placements.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
              </div>
            </div>
            {actionFeedback && (
              <p className={`mt-3 text-sm font-medium ${actionFeedback.tone === 'success' ? 'text-emerald-600' : 'text-red-600 dark:text-red-300'}`}>
                {actionFeedback.message}
              </p>
            )}
          </div>

          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {selectedId ? 'Edit Announcement' : 'Create Announcement'}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
            <SelectField
              label="Audience"
              value={form.audience}
              onChange={(value) => setForm((prev) => ({ ...prev, audience: value as typeof prev.audience }))}
              options={['all', 'client', 'professional', 'web']}
            />
            <SelectField
              label="Placement"
              value={form.placement}
              onChange={(value) => setForm((prev) => ({ ...prev, placement: value as typeof prev.placement }))}
              options={['dashboard', 'banner', 'modal', 'support']}
            />
            <SelectField
              label="Channel"
              value={form.channel_scope}
              onChange={(value) => setForm((prev) => ({ ...prev, channel_scope: value as typeof prev.channel_scope }))}
              options={['both', 'web', 'app']}
            />
            <ToggleField label="Active" checked={form.active} onChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))} />
            <div className="md:col-span-2">
              <TextAreaField label="Body" value={form.body} onChange={(value) => setForm((prev) => ({ ...prev, body: value }))} rows={5} />
            </div>
            <Field label="CTA Label" value={form.cta_label} onChange={(value) => setForm((prev) => ({ ...prev, cta_label: value }))} />
            <Field label="CTA Href" value={form.cta_href} onChange={(value) => setForm((prev) => ({ ...prev, cta_href: value }))} />
            <DateTimeField label="Starts At" value={form.starts_at} onChange={(value) => setForm((prev) => ({ ...prev, starts_at: value }))} />
            <DateTimeField label="Ends At" value={form.ends_at} onChange={(value) => setForm((prev) => ({ ...prev, ends_at: value }))} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={persistDraft}
              disabled={saveDraft.isPending || publishDraft.isPending || !canSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : draftSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {draftSaved ? 'Draft Saved' : 'Save Draft'}
            </button>
            <button
              onClick={publish}
              disabled={publishDraft.isPending || saveDraft.isPending || !canPublish}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {publishDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : announcementPublished ? <Check className="h-4 w-4" /> : <Rocket className="h-4 w-4" />}
              {announcementPublished ? 'Published' : 'Publish'}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Revision History</h4>
            {revisions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No revisions yet.</p>
            ) : revisions.map((revision) => (
              <div key={revision.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">v{revision.version_number} · {revision.revision_state}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(revision.updated_at).toLocaleString()}</p>
                </div>
                {revision.revision_state === 'published' && (
                  <button
                    onClick={async () => {
                      setActionFeedback(null)
                      try {
                        await restoreRevision.mutateAsync({ announcementKey: effectiveAnnouncementKey, revisionId: revision.id })
                        setActionFeedback({ tone: 'success', message: 'Revision restored to draft.' })
                      } catch (error) {
                        setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to restore revision.' })
                      }
                    }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Restore to Draft
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete announcement</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the selected announcement from admin-managed content.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setActionFeedback(null)
                  try {
                    await deleteAnnouncement.mutateAsync(deleteTargetId)
                    if (selectedId === deleteTargetId) {
                      setSelectedId(null)
                      setDraftKey(`draft-${crypto.randomUUID()}`)
                      setForm(emptyAnnouncement)
                    }
                    setDeleteTargetId(null)
                    setActionFeedback({ tone: 'success', message: 'Announcement deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete announcement.' })
                  }
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

function DateTimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
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
