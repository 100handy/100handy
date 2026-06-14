import { useMemo, useState, type ReactNode } from 'react'
import { Loader2, Pencil, Play, Plus, Save, Sparkles, Trash2, X } from 'lucide-react'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminState'
import Header from '@/components/header'
import OutreachNav from '@/components/outreach/OutreachNav'
import { emitAdminToast } from '@/lib/admin-toast'
import {
  CADENCE_OPTIONS,
  REDDIT_PRESET,
  buildSourceKey,
  cadenceLabel,
  useCreateOutreachSource,
  useDeleteOutreachSource,
  useOutreachSources,
  useRunSourceNow,
  useUpdateOutreachSource,
  type OutreachCadence,
  type OutreachSource,
  type OutreachSourceFormInput,
  type OutreachSourceType,
} from '@/lib/api/outreach-sources'
import type { Json } from '@/lib/database.types'

const adminToast = {
  success: (title: string) => emitAdminToast({ tone: 'success', title }),
  error: (title: string) => emitAdminToast({ tone: 'error', title }),
}

type FormState = {
  name: string
  platform: string
  sourceType: OutreachSourceType
  apifyActorId: string
  apifyInputText: string
  fieldMappingText: string
  defaultServiceType: string
  location: string
  maxItems: number
  cadence: OutreachCadence
  scheduleEnabled: boolean
  active: boolean
  notes: string
}

const emptyForm: FormState = {
  name: '',
  platform: '',
  sourceType: 'customer_finder',
  apifyActorId: '',
  apifyInputText: '{}',
  fieldMappingText: '{}',
  defaultServiceType: '',
  location: '',
  maxItems: 50,
  cadence: 'off',
  scheduleEnabled: false,
  active: true,
  notes: '',
}

function sourceToForm(source: OutreachSource): FormState {
  return {
    name: source.name,
    platform: source.platform,
    sourceType: source.source_type,
    apifyActorId: source.apify_actor_id ?? '',
    apifyInputText: JSON.stringify(source.apify_input ?? {}, null, 2),
    fieldMappingText: JSON.stringify(source.field_mapping ?? {}, null, 2),
    defaultServiceType: source.default_service_type ?? '',
    location: source.location ?? '',
    maxItems: source.max_items ?? 50,
    cadence: source.schedule_cadence,
    scheduleEnabled: source.schedule_enabled,
    active: source.active,
    notes: source.notes ?? '',
  }
}

function parseJsonObject(text: string): { value: Json; error: string | null } {
  try {
    const parsed = JSON.parse(text || '{}')
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { value: {}, error: 'Must be a JSON object' }
    }
    return { value: parsed as Json, error: null }
  } catch (error) {
    return { value: {}, error: error instanceof Error ? error.message : 'Invalid JSON' }
  }
}

export default function OutreachSourcesPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const { data: sources = [], isLoading, error, refetch } = useOutreachSources()
  const createSource = useCreateOutreachSource()
  const updateSource = useUpdateOutreachSource()
  const deleteSource = useDeleteOutreachSource()
  const runNow = useRunSourceNow()

  const inputParse = useMemo(() => parseJsonObject(form.apifyInputText), [form.apifyInputText])
  const mappingParse = useMemo(() => parseJsonObject(form.fieldMappingText), [form.fieldMappingText])

  const busy = createSource.isPending || updateSource.isPending

  function startNew() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function startEdit(source: OutreachSource) {
    setEditingId(source.id)
    setForm(sourceToForm(source))
  }

  function applyRedditPreset() {
    setForm((prev) => ({
      ...prev,
      name: prev.name || 'Reddit – service requests',
      platform: REDDIT_PRESET.platform,
      sourceType: REDDIT_PRESET.source_type,
      apifyActorId: REDDIT_PRESET.apify_actor_id,
      apifyInputText: JSON.stringify(REDDIT_PRESET.apify_input, null, 2),
      fieldMappingText: JSON.stringify(REDDIT_PRESET.field_mapping, null, 2),
      defaultServiceType: prev.defaultServiceType || REDDIT_PRESET.default_service_type,
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.platform.trim()) {
      adminToast.error('Name and platform are required')
      return
    }
    if (inputParse.error) {
      adminToast.error(`Apify input JSON: ${inputParse.error}`)
      return
    }
    if (mappingParse.error) {
      adminToast.error(`Field mapping JSON: ${mappingParse.error}`)
      return
    }

    const payload: OutreachSourceFormInput = {
      name: form.name,
      platform: form.platform,
      source_type: form.sourceType,
      apify_actor_id: form.apifyActorId,
      apify_input: inputParse.value,
      field_mapping: mappingParse.value,
      default_service_type: form.defaultServiceType || null,
      location: form.location || null,
      max_items: Number.isFinite(form.maxItems) ? Math.max(1, Math.min(500, form.maxItems)) : 50,
      schedule_cadence: form.cadence,
      schedule_enabled: form.scheduleEnabled,
      active: form.active,
      notes: form.notes || null,
    }

    try {
      if (editingId) {
        await updateSource.mutateAsync({
          id: editingId,
          updates: {
            name: payload.name.trim(),
            source_key: buildSourceKey(payload.name),
            platform: payload.platform.trim(),
            source_type: payload.source_type,
            apify_actor_id: payload.apify_actor_id.trim() || null,
            apify_input: payload.apify_input,
            field_mapping: payload.field_mapping,
            default_service_type: payload.default_service_type?.trim() || null,
            service_type: payload.default_service_type?.trim() || null,
            location: payload.location?.trim() || null,
            max_items: payload.max_items,
            schedule_cadence: payload.schedule_cadence,
            schedule_enabled: payload.schedule_enabled,
            active: payload.active,
            notes: payload.notes?.trim() || null,
          },
        })
        adminToast.success('Source updated')
      } else {
        const created = await createSource.mutateAsync(payload)
        setEditingId(created.id)
        adminToast.success('Source created')
      }
    } catch (saveError) {
      adminToast.error(saveError instanceof Error ? saveError.message : 'Failed to save source')
    }
  }

  async function handleRunNow(source: OutreachSource) {
    try {
      await runNow.mutateAsync({ id: source.id, name: source.name })
      adminToast.success(`Discovery run started for ${source.name}`)
    } catch (runError) {
      adminToast.error(runError instanceof Error ? runError.message : 'Failed to start run')
    }
  }

  async function handleDelete(source: OutreachSource) {
    if (!window.confirm(`Delete source "${source.name}"? Runs and staged items are removed too.`)) return
    try {
      await deleteSource.mutateAsync({ id: source.id, name: source.name })
      if (editingId === source.id) startNew()
      adminToast.success('Source deleted')
    } catch (deleteError) {
      adminToast.error(deleteError instanceof Error ? deleteError.message : 'Failed to delete source')
    }
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <Header title="Outreach" />
      <div className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <OutreachNav />
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> New source
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Discovery sources</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Each source runs an Apify scraper and feeds new posts/profiles into the AI lead queue.
                </p>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  <AdminLoadingState label="Loading sources..." />
                ) : error ? (
                  <AdminErrorState
                    title="Failed to load sources"
                    description={error instanceof Error ? error.message : 'Please try again.'}
                    onRetry={() => void refetch()}
                  />
                ) : sources.length === 0 ? (
                  <AdminEmptyState
                    title="No discovery sources yet"
                    description="Create a source (try the Reddit preset) to start finding leads automatically."
                  />
                ) : (
                  sources.map((source) => (
                    <div
                      key={source.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        editingId === source.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{source.name}</span>
                            {!source.active ? <Pill>inactive</Pill> : null}
                          </div>
                          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {source.platform} • {source.source_type.replace('_', ' ')} • {cadenceLabel(source.schedule_cadence)}
                            {source.schedule_enabled ? ' (auto)' : ''}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Pill>actor: {source.apify_actor_id || 'none'}</Pill>
                            <Pill>max {source.max_items}</Pill>
                            {source.last_run_status ? <Pill>last: {source.last_run_status}</Pill> : null}
                          </div>
                        </div>
                        <div className="flex flex-none flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRunNow(source)}
                            disabled={runNow.isPending || !source.apify_actor_id || !source.active}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                            title={!source.apify_actor_id ? 'Configure an Apify actor first' : 'Run now'}
                          >
                            {runNow.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                            Run now
                          </button>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(source)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium dark:border-slate-700"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(source)}
                              disabled={deleteSource.isPending}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/70 dark:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {editingId ? 'Edit source' : 'New source'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure the Apify actor and how results map to leads.</p>
                </div>
                <button
                  type="button"
                  onClick={applyRedditPreset}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <Sparkles className="h-4 w-4" /> Use Reddit preset
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Platform">
                  <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Type">
                  <select value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value as OutreachSourceType })} className={inputClass}>
                    <option value="customer_finder">Customer finder</option>
                    <option value="worker_finder">Worker finder</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </Field>
                <Field label="Apify actor id">
                  <input value={form.apifyActorId} onChange={(e) => setForm({ ...form, apifyActorId: e.target.value })} className={inputClass} placeholder="user/actor-name" />
                </Field>
                <Field label="Default service">
                  <input value={form.defaultServiceType} onChange={(e) => setForm({ ...form, defaultServiceType: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Location">
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Max items">
                  <input type="number" min={1} max={500} value={form.maxItems} onChange={(e) => setForm({ ...form, maxItems: Number(e.target.value) })} className={inputClass} />
                </Field>
                <Field label="Cadence">
                  <select value={form.cadence} onChange={(e) => setForm({ ...form, cadence: e.target.value as OutreachCadence })} className={inputClass}>
                    {CADENCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{cadenceLabel(option)}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4 flex flex-wrap gap-6">
                <Toggle label="Schedule enabled" checked={form.scheduleEnabled} onChange={(v) => setForm({ ...form, scheduleEnabled: v })} />
                <Toggle label="Active" checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
              </div>

              <Field label="Apify input (JSON)">
                <textarea
                  value={form.apifyInputText}
                  onChange={(e) => setForm({ ...form, apifyInputText: e.target.value })}
                  rows={6}
                  className={`${inputClass} font-mono text-xs`}
                />
                {inputParse.error ? <span className="mt-1 block text-xs text-red-600">{inputParse.error}</span> : null}
              </Field>

              <Field label="Field mapping (JSON: lead field → scraped field path)">
                <textarea
                  value={form.fieldMappingText}
                  onChange={(e) => setForm({ ...form, fieldMappingText: e.target.value })}
                  rows={5}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder={'{ "raw_text": "body", "profile_name": "username", "source_url": "url", "external_id": "id" }'}
                />
                {mappingParse.error ? <span className="mt-1 block text-xs text-red-600">{mappingParse.error}</span> : null}
              </Field>

              <Field label="Notes">
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={inputClass} />
              </Field>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingId ? 'Save changes' : 'Create source'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={startNew}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

const inputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
      {label}
    </label>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{children}</span>
}
