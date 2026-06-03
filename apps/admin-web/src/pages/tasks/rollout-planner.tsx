import { useMemo, useState, type ReactNode } from 'react'
import { CalendarDays, Copy, Loader2, Rocket, Save } from 'lucide-react'
import Header from '@/components/header'
import {
  useApplyRolloutPreset,
  useCurrentRolloutSnapshot,
  useRolloutPresets,
  useSaveRolloutPreset,
  type RolloutPreset,
  type RolloutPresetStatus,
  type RolloutSnapshot,
} from '@/lib/api/rollouts'

const emptySnapshot: RolloutSnapshot = {
  categoryStates: [],
  serviceAreaStates: [],
  areaCategoryStates: [],
}

export default function RolloutPlannerPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rolloutMonth, setRolloutMonth] = useState(defaultMonth())
  const [status, setStatus] = useState<RolloutPresetStatus>('draft')
  const [notes, setNotes] = useState('')
  const [snapshot, setSnapshot] = useState<RolloutSnapshot>(emptySnapshot)

  const { data: currentSnapshot, isLoading: currentLoading } = useCurrentRolloutSnapshot()
  const { data: presets = [], isLoading: presetsLoading } = useRolloutPresets()
  const savePreset = useSaveRolloutPreset()
  const applyPreset = useApplyRolloutPreset()

  const currentSummary = useMemo(() => summarizeSnapshot(currentSnapshot ?? emptySnapshot), [currentSnapshot])
  const editingSummary = useMemo(() => summarizeSnapshot(snapshot), [snapshot])
  const diffSummary = useMemo(
    () => diffSnapshots(currentSnapshot ?? emptySnapshot, snapshot),
    [currentSnapshot, snapshot],
  )

  function loadPreset(preset: RolloutPreset) {
    setEditingId(preset.id)
    setName(preset.name)
    setDescription(preset.description ?? '')
    setRolloutMonth(preset.rollout_month.slice(0, 7))
    setStatus(preset.status)
    setNotes(preset.notes ?? '')
    setSnapshot({
      categoryStates: preset.categoryStates,
      serviceAreaStates: preset.serviceAreaStates,
      areaCategoryStates: preset.areaCategoryStates,
    })
  }

  function resetEditor() {
    setEditingId(null)
    setName('')
    setDescription('')
    setRolloutMonth(defaultMonth())
    setStatus('draft')
    setNotes('')
    setSnapshot(currentSnapshot ?? emptySnapshot)
  }

  function captureCurrentState() {
    if (!currentSnapshot) return
    setSnapshot(currentSnapshot)
  }

  async function handleSave() {
    if (!name.trim() || !rolloutMonth) return

    const saved = await savePreset.mutateAsync({
      id: editingId ?? undefined,
      name: name.trim(),
      description: description.trim() || null,
      rolloutMonth: `${rolloutMonth}-01`,
      status,
      notes: notes.trim() || null,
      snapshot,
    })

    loadPreset(saved)
  }

  async function handleApply(preset: RolloutPreset) {
    const confirmed = window.confirm(`Apply rollout preset "${preset.name}" now? This will update live category, area, and area-level rollout states.`)
    if (!confirmed) return
    await applyPreset.mutateAsync(preset)
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <Header title="Rollout Planner" />

      <div className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-200">
            This is an admin-only planning layer. Presets capture the current category, service-area, and area-level category rollout state so you can plan month-to-month changes and apply them intentionally.
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
            <section className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Current live rollout</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">What is live right now across categories, areas, and area overrides.</p>
                  </div>
                  <button
                    type="button"
                    onClick={captureCurrentState}
                    disabled={!currentSnapshot}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    <Copy className="h-4 w-4" />
                    Capture current
                  </button>
                </div>

                {currentLoading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <SummaryGrid summary={currentSummary} />
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {editingId ? 'Edit rollout preset' : 'New rollout preset'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Save a monthly rollout snapshot, review the changes, then apply when ready.</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetEditor}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Preset name">
                    <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="July rollout" />
                  </Field>
                  <Field label="Rollout month">
                    <input value={rolloutMonth} onChange={(e) => setRolloutMonth(e.target.value)} type="month" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Description">
                    <input value={description} onChange={(e) => setDescription(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="London + Manchester expansion" />
                  </Field>
                  <Field label="Status">
                    <select value={status} onChange={(e) => setStatus(e.target.value as RolloutPresetStatus)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="applied">Applied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </Field>
                </div>
                <Field label="Notes">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Keep cleaning off outside London until next month." />
                </Field>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Preset snapshot</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Counts from the rollout state saved in this preset.</p>
                    </div>
                  </div>
                  <SummaryGrid summary={editingSummary} compact />
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Delta from live</h4>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <DeltaCard label="Category changes" value={diffSummary.categoryChanges} />
                    <DeltaCard label="Area changes" value={diffSummary.areaChanges} />
                    <DeltaCard label="Area override changes" value={diffSummary.overrideChanges} />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={savePreset.isPending || !name.trim() || !rolloutMonth}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    Save preset
                  </button>
                  <button
                    type="button"
                    onClick={captureCurrentState}
                    disabled={!currentSnapshot}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Refresh from live state
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Saved presets</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use these for month-to-month launch planning and controlled expansion.</p>

                {presetsLoading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : presets.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No rollout presets saved yet.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {presets.map((preset) => {
                      const summary = summarizeSnapshot({
                        categoryStates: preset.categoryStates,
                        serviceAreaStates: preset.serviceAreaStates,
                        areaCategoryStates: preset.areaCategoryStates,
                      })

                      return (
                        <div key={preset.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">{preset.name}</div>
                              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {formatMonth(preset.rollout_month)} • {preset.description || 'No description'}
                              </div>
                            </div>
                            <StatusBadge status={preset.status} />
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <MiniStat label="Active categories" value={summary.activeCategories} />
                            <MiniStat label="Enabled areas" value={summary.enabledAreas} />
                            <MiniStat label="Area overrides" value={summary.areaOverrides} />
                          </div>

                          {preset.notes ? (
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{preset.notes}</div>
                          ) : null}

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => loadPreset(preset)}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                            >
                              Load
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApply(preset)}
                              disabled={applyPreset.isPending}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Rocket className="h-4 w-4" />
                              Apply now
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

function summarizeSnapshot(snapshot: RolloutSnapshot) {
  return {
    activeCategories: snapshot.categoryStates.filter((row) => row.active).length,
    totalCategories: snapshot.categoryStates.length,
    enabledAreas: snapshot.serviceAreaStates.filter((row) => row.enabled).length,
    totalAreas: snapshot.serviceAreaStates.length,
    areaOverrides: snapshot.areaCategoryStates.length,
  }
}

function diffSnapshots(current: RolloutSnapshot, next: RolloutSnapshot) {
  const currentCategoryMap = new Map(current.categoryStates.map((row) => [row.categoryId, row.active]))
  const nextCategoryMap = new Map(next.categoryStates.map((row) => [row.categoryId, row.active]))
  const currentAreaMap = new Map(current.serviceAreaStates.map((row) => [row.serviceAreaId, row.enabled]))
  const nextAreaMap = new Map(next.serviceAreaStates.map((row) => [row.serviceAreaId, row.enabled]))
  const currentOverrideMap = new Map(current.areaCategoryStates.map((row) => [`${row.serviceAreaId}:${row.categoryId}`, row.enabled]))
  const nextOverrideMap = new Map(next.areaCategoryStates.map((row) => [`${row.serviceAreaId}:${row.categoryId}`, row.enabled]))

  let categoryChanges = 0
  for (const [categoryId, active] of nextCategoryMap) {
    if (currentCategoryMap.get(categoryId) !== active) categoryChanges += 1
  }

  let areaChanges = 0
  for (const [serviceAreaId, enabled] of nextAreaMap) {
    if (currentAreaMap.get(serviceAreaId) !== enabled) areaChanges += 1
  }

  const allOverrideKeys = new Set([...currentOverrideMap.keys(), ...nextOverrideMap.keys()])
  let overrideChanges = 0
  for (const key of allOverrideKeys) {
    if (currentOverrideMap.get(key) !== nextOverrideMap.get(key)) overrideChanges += 1
  }

  return { categoryChanges, areaChanges, overrideChanges }
}

function SummaryGrid({ summary, compact = false }: { summary: ReturnType<typeof summarizeSnapshot>; compact?: boolean }) {
  const classes = compact ? 'text-base' : 'text-lg'

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MiniStat label="Active categories" value={`${summary.activeCategories}/${summary.totalCategories}`} valueClassName={classes} />
      <MiniStat label="Enabled areas" value={`${summary.enabledAreas}/${summary.totalAreas}`} valueClassName={classes} />
      <MiniStat label="Area overrides" value={summary.areaOverrides} valueClassName={classes} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</div>
      {children}
    </div>
  )
}

function MiniStat({
  label,
  value,
  valueClassName = 'text-lg',
}: {
  label: string
  value: string | number
  valueClassName?: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 font-semibold text-slate-900 dark:text-white ${valueClassName}`}>{value}</div>
    </div>
  )
}

function DeltaCard({ label, value }: { label: string; value: number }) {
  return <MiniStat label={label} value={value} valueClassName={value > 0 ? 'text-lg text-amber-600 dark:text-amber-300' : 'text-lg'} />
}

function StatusBadge({ status }: { status: RolloutPresetStatus }) {
  const classes =
    status === 'applied'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : status === 'scheduled'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : status === 'archived'
          ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>
}

function defaultMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function formatMonth(value: string) {
  const date = new Date(value)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
