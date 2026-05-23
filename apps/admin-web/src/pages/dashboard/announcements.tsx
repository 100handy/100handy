import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Plus, Save, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useAnnouncements,
  useDeleteAnnouncement,
  useSaveAnnouncement,
} from '@/lib/api/content-platform'

const emptyAnnouncement = {
  audience: 'all' as const,
  placement: 'dashboard' as const,
  title: '',
  body: '',
  cta_label: '',
  cta_href: '',
  starts_at: '',
  ends_at: '',
  active: true,
}

export default function AnnouncementsPage() {
  const { data: announcements = [], isLoading } = useAnnouncements()
  const saveAnnouncement = useSaveAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyAnnouncement)

  const selected = announcements.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setForm(emptyAnnouncement)
      return
    }

    setForm({
      audience: selected.audience,
      placement: selected.placement,
      title: selected.title,
      body: selected.body,
      cta_label: selected.cta_label ?? '',
      cta_href: selected.cta_href ?? '',
      starts_at: selected.starts_at ? selected.starts_at.slice(0, 16) : '',
      ends_at: selected.ends_at ? selected.ends_at.slice(0, 16) : '',
      active: selected.active,
    })
  }, [selected])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return announcements
    return announcements.filter((item) =>
      [item.title, item.body, item.audience, item.placement].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [announcements, search])

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Announcements & Notifications" />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
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
            onClick={() => {
              setSelectedId(null)
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
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Updated</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>
                    No announcements found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.title}</td>
                    <td className="px-6 py-4">{item.audience}</td>
                    <td className="px-6 py-4">{item.placement}</td>
                    <td className="px-6 py-4">{item.active ? 'active' : 'inactive'}</td>
                    <td className="px-6 py-4">{format(new Date(item.updated_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="mr-4 text-primary hover:underline" onClick={() => setSelectedId(item.id)}>
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline" onClick={() => deleteAnnouncement.mutate(item.id)}>
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
            <ToggleField
              label="Active"
              checked={form.active}
              onChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
            />
            <div className="md:col-span-2">
              <TextAreaField label="Body" value={form.body} onChange={(value) => setForm((prev) => ({ ...prev, body: value }))} rows={5} />
            </div>
            <Field label="CTA Label" value={form.cta_label} onChange={(value) => setForm((prev) => ({ ...prev, cta_label: value }))} />
            <Field label="CTA Href" value={form.cta_href} onChange={(value) => setForm((prev) => ({ ...prev, cta_href: value }))} />
            <DateTimeField label="Starts At" value={form.starts_at} onChange={(value) => setForm((prev) => ({ ...prev, starts_at: value }))} />
            <DateTimeField label="Ends At" value={form.ends_at} onChange={(value) => setForm((prev) => ({ ...prev, ends_at: value }))} />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                saveAnnouncement.mutate({
                  id: selected?.id,
                  audience: form.audience,
                  placement: form.placement,
                  title: form.title,
                  body: form.body,
                  cta_label: form.cta_label,
                  cta_href: form.cta_href,
                  starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
                  ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
                  active: form.active,
                })
              }
              disabled={saveAnnouncement.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saveAnnouncement.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Announcement
            </button>
          </div>
        </div>
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
