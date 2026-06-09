import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Header from '../../components/header'
import { AlertTriangle, Clock3, Loader2, Users, CalendarClock, CircleOff, Save, Trash2 } from 'lucide-react'
import {
  useAdminAvailabilitySlots,
  useAvailabilityOverview,
  useDeleteAdminAvailabilitySlot,
  useHandysWithAvailability,
  useSaveAdminAvailabilitySlot,
  type AdminAvailabilitySlot,
  type HandyWithAvailability,
} from '@/lib/api/handys'

function getHandyName(handy: HandyWithAvailability): string {
  const parts = [handy.first_name, handy.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown Handy'
}

const statusColors = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
}

export default function AvailabilityManagement() {
  const [activeView, setActiveView] = useState<'overview' | 'handys' | 'editor'>('overview')
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useAvailabilityOverview()
  const { data: handys, isLoading: handysLoading, error: handysError } = useHandysWithAvailability()
  const [selectedHandyId, setSelectedHandyId] = useState<string | null>(null)
  const { data: selectedSlots = [], isLoading: slotsLoading } = useAdminAvailabilitySlots(selectedHandyId)
  const saveSlot = useSaveAdminAvailabilitySlot()
  const deleteSlot = useDeleteAdminAvailabilitySlot()
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
  const [form, setForm] = useState({
    day_of_week: 1,
    start_time: '09:00:00',
    end_time: '17:00:00',
    recurrence_type: 'weekly' as AdminAvailabilitySlot['recurrence_type'],
    starts_on: new Date().toISOString().slice(0, 10),
    ends_on: '',
    timezone: 'Europe/London',
    is_active: true,
  })

  const loading = summaryLoading || handysLoading
  const error = summaryError || handysError
  const handysNeedingSetup = (handys ?? []).filter((handy) => handy.activeSlots === 0)
  const selectedHandy = useMemo(
    () => (handys ?? []).find((handy) => handy.user_id === selectedHandyId) ?? null,
    [handys, selectedHandyId],
  )

  useEffect(() => {
    if (!selectedHandyId && handys && handys.length > 0) {
      setSelectedHandyId(handys[0].user_id)
    }
  }, [handys, selectedHandyId])

  useEffect(() => {
    if (!editingSlotId) {
      setForm({
        day_of_week: 1,
        start_time: '09:00:00',
        end_time: '17:00:00',
        recurrence_type: 'weekly',
        starts_on: new Date().toISOString().slice(0, 10),
        ends_on: '',
        timezone: 'Europe/London',
        is_active: true,
      })
      return
    }

    const slot = selectedSlots.find((item) => item.id === editingSlotId)
    if (!slot) return
    setForm({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time.slice(0, 8),
      end_time: slot.end_time.slice(0, 8),
      recurrence_type: slot.recurrence_type,
      starts_on: slot.starts_on,
      ends_on: slot.ends_on ?? '',
      timezone: slot.timezone,
      is_active: slot.is_active,
    })
  }, [editingSlotId, selectedSlots])

  const saveCurrentSlot = async () => {
    if (!selectedHandyId) return
    setActionFeedback(null)
    try {
      await saveSlot.mutateAsync({
        id: editingSlotId ?? `avail_admin_${crypto.randomUUID()}`,
        user_id: selectedHandyId,
        day_of_week: form.day_of_week,
        start_time: form.start_time.length === 5 ? `${form.start_time}:00` : form.start_time,
        end_time: form.end_time.length === 5 ? `${form.end_time}:00` : form.end_time,
        recurrence_type: form.recurrence_type,
        starts_on: form.starts_on,
        ends_on: form.ends_on || null,
        ends_after_occurrences: null,
        day_of_month: form.recurrence_type === 'monthly' ? Number(form.starts_on.slice(8, 10)) : null,
        timezone: form.timezone,
        is_active: form.is_active,
      })
      setEditingSlotId(null)
      setActionFeedback({ tone: 'success', message: 'Availability slot saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save availability slot.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Availability Management" />

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {actionFeedback && (
            <div className={`rounded-xl px-4 py-3 text-sm ${
              actionFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
            }`}>
              {actionFeedback.message}
            </div>
          )}
          <div>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Monitor real Handy availability coverage, spot missing setup, and review weekly capacity without relying on static calendar mocks.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'handys', label: 'Handy list' },
              { id: 'editor', label: 'Slot editor' },
            ].map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id as typeof activeView)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeView === view.id
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">Failed to load availability</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400/80">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'overview' ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Handys with Availability"
              value={summary?.handysWithAvailability ?? 0}
              helper={`${summary?.totalHandys ?? 0} total handys`}
              icon={Users}
              loading={loading}
            />
            <MetricCard
              title="Active Slots"
              value={summary?.activeSlots ?? 0}
              helper={`${summary?.inactiveSlots ?? 0} inactive slots`}
              icon={Clock3}
              loading={loading}
            />
            <MetricCard
              title="Weekly Slots"
              value={summary?.weeklySlots ?? 0}
              helper={`${summary?.oneTimeSlots ?? 0} one-time slots`}
              icon={CalendarClock}
              loading={loading}
            />
            <MetricCard
              title="Needs Setup"
              value={summary?.handysWithoutAvailability ?? 0}
              helper="Handys without any availability"
              icon={CircleOff}
              loading={loading}
            />
          </section>
          ) : null}

          {activeView === 'overview' ? (
          <section className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Weekly Coverage</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Active recurring availability slots grouped by weekday.
                </p>
              </div>
              <div className="space-y-4 p-6">
                {(summary?.weekdayCoverage ?? []).map((row) => {
                  const max = Math.max(...(summary?.weekdayCoverage ?? []).map((item) => item.activeSlots), 1)
                  const width = `${(row.activeSlots / max) * 100}%`
                  return (
                    <div key={row.dayIndex} className="grid grid-cols-[56px_1fr_48px] items-center gap-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-3 rounded-full bg-primary" style={{ width }} />
                      </div>
                      <span className="text-right text-sm text-slate-500 dark:text-slate-400">{row.activeSlots}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Handys Needing Attention</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Handys with no active availability configured.
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : handysNeedingSetup.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Every current Handy has at least one active availability slot.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {handysNeedingSetup.slice(0, 8).map((handy) => (
                      <div
                        key={handy.user_id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{getHandyName(handy)}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {handy.totalSlots === 0 ? 'No availability slots created' : 'All slots are inactive'}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[handy.statusColor]}`}>
                          {handy.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
          ) : null}

          {activeView === 'handys' ? (
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Handy Availability</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Per-handy availability health based on `professional_availability`.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Handy</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Active Slots</th>
                    <th className="px-6 py-3">Total Slots</th>
                    <th className="px-6 py-3">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-6" colSpan={5}>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : (handys ?? []).length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={5}>
                        No handys found.
                      </td>
                    </tr>
                  ) : (
                    handys!.map((handy) => {
                      const coverage =
                        handy.totalSlots > 0 ? `${Math.round((handy.activeSlots / handy.totalSlots) * 100)}%` : '0%'
                      return (
                        <tr key={handy.user_id} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{getHandyName(handy)}</td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[handy.statusColor]}`}>
                              {handy.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{handy.activeSlots}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{handy.totalSlots}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{coverage}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
          ) : null}

          {activeView === 'editor' ? (
          <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Admin Slot Editor</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select a Handy and directly manage `professional_availability` records.
                </p>
              </div>
              <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr]">
                <div className="space-y-2">
                  {(handys ?? []).map((handy) => (
                    <button
                      key={handy.user_id}
                      onClick={() => {
                        setSelectedHandyId(handy.user_id)
                        setEditingSlotId(null)
                      }}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                        selectedHandyId === handy.user_id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary/40 dark:border-slate-800'
                      }`}
                    >
                      <p className="font-medium text-slate-900 dark:text-white">{getHandyName(handy)}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {handy.activeSlots} active / {handy.totalSlots} total
                      </p>
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Day of week">
                      <select
                        value={form.day_of_week}
                        onChange={(e) => setForm((prev) => ({ ...prev, day_of_week: Number(e.target.value) }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((label, index) => (
                          <option key={label} value={index}>{label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Recurrence">
                      <select
                        value={form.recurrence_type}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            recurrence_type: e.target.value as AdminAvailabilitySlot['recurrence_type'],
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="none">One-time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </Field>
                    <Field label="Start time">
                      <input
                        type="time"
                        step={900}
                        value={form.start_time.slice(0, 5)}
                        onChange={(e) => setForm((prev) => ({ ...prev, start_time: `${e.target.value}:00` }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </Field>
                    <Field label="End time">
                      <input
                        type="time"
                        step={900}
                        value={form.end_time.slice(0, 5)}
                        onChange={(e) => setForm((prev) => ({ ...prev, end_time: `${e.target.value}:00` }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </Field>
                    <Field label="Starts on">
                      <input
                        type="date"
                        value={form.starts_on}
                        onChange={(e) => setForm((prev) => ({ ...prev, starts_on: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </Field>
                    <Field label="Ends on">
                      <input
                        type="date"
                        value={form.ends_on}
                        onChange={(e) => setForm((prev) => ({ ...prev, ends_on: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </Field>
                    <Field label="Timezone">
                      <input
                        value={form.timezone}
                        onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </Field>
                    <Field label="Active">
                      <select
                        value={form.is_active ? 'true' : 'false'}
                        onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </Field>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={saveCurrentSlot}
                      disabled={!selectedHandyId || saveSlot.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      {saveSlot.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingSlotId ? 'Update Slot' : 'Create Slot'}
                    </button>
                    {editingSlotId && (
                      <button
                        onClick={() => setEditingSlotId(null)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {selectedHandy ? `${getHandyName(selectedHandy)} slots` : 'Slots'}
                    </h4>
                    {slotsLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : selectedSlots.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No slots for this Handy yet.</p>
                    ) : (
                      selectedSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
                        >
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][slot.day_of_week]} {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {slot.recurrence_type} / {slot.is_active ? 'active' : 'inactive'} / starts {slot.starts_on}
                              {slot.ends_on ? ` / ends ${slot.ends_on}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setEditingSlotId(slot.id)}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setActionFeedback(null)
                                deleteSlot.mutate({ id: slot.id, userId: slot.user_id }, {
                                  onSuccess: () => setActionFeedback({ tone: 'success', message: 'Availability slot deleted.' }),
                                  onError: (error) => setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete availability slot.' }),
                                })
                              }}
                              className="text-sm font-medium text-red-600 hover:underline"
                            >
                              <Trash2 className="inline h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  loading,
}: {
  title: string
  value: number
  helper: string
  icon: typeof Users
  loading: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-background-dark">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        )}
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
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
