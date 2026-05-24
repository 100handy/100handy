import Header from '../../components/header'
import { AlertTriangle, Bell, CalendarRange, CheckCircle2, Loader2, Settings2 } from 'lucide-react'
import { useAvailabilityOverview, useHandysWithAvailability } from '@/lib/api/handys'

export default function CalendarSettings() {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useAvailabilityOverview()
  const { data: handys, isLoading: handysLoading, error: handysError } = useHandysWithAvailability()

  const loading = summaryLoading || handysLoading
  const error = summaryError || handysError

  const fullyConfigured = (handys ?? []).filter((handy) => handy.activeSlots > 0)
  const partiallyConfigured = (handys ?? []).filter(
    (handy) => handy.totalSlots > 0 && handy.activeSlots < handy.totalSlots,
  )
  const notConfigured = (handys ?? []).filter((handy) => handy.totalSlots === 0)

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Calendar & Settings" />

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Operational overview for Handy scheduling. This page now reflects live availability coverage instead of a static calendar mock.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">Failed to load scheduling overview</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400/80">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="Weekly Slot Coverage"
              value={summary?.weeklySlots ?? 0}
              helper="Recurring weekly slots configured"
              icon={CalendarRange}
              loading={loading}
            />
            <Card
              title="One-Time Slots"
              value={summary?.oneTimeSlots ?? 0}
              helper="Date-specific availability overrides"
              icon={Settings2}
              loading={loading}
            />
            <Card
              title="Fully Configured Handys"
              value={fullyConfigured.length}
              helper="At least one active slot"
              icon={CheckCircle2}
              loading={loading}
            />
            <Card
              title="Needs Attention"
              value={partiallyConfigured.length + notConfigured.length}
              helper="Partial or missing setup"
              icon={Bell}
              loading={loading}
            />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Configuration Health</h3>
              </div>
              <div className="space-y-4 p-6">
                <HealthRow label="Fully configured" value={fullyConfigured.length} tone="green" />
                <HealthRow label="Partially configured" value={partiallyConfigured.length} tone="yellow" />
                <HealthRow label="No slots configured" value={notConfigured.length} tone="red" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Platform Scheduling Notes</h3>
              </div>
              <div className="space-y-4 p-6 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Calendar integrations are not wired to an external provider from the admin panel yet. The source of truth remains the Handy availability data stored in `professional_availability`.
                </p>
                <p>
                  Use <span className="font-semibold text-slate-900 dark:text-white">Availability Management</span> to review coverage gaps and identify handys who need setup.
                </p>
                <p>
                  If you want actual admin-side scheduling controls next, the right implementation is a real mutation layer for availability slots rather than static settings inputs.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Handys Requiring Follow-up</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Handys missing availability setup or carrying inactive coverage.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Handy</th>
                    <th className="px-6 py-3">Active Slots</th>
                    <th className="px-6 py-3">Total Slots</th>
                    <th className="px-6 py-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-6" colSpan={4}>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : [...partiallyConfigured, ...notConfigured].length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={4}>
                        No follow-up needed right now.
                      </td>
                    </tr>
                  ) : (
                    [...partiallyConfigured, ...notConfigured].map((handy) => (
                      <tr key={handy.user_id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {[handy.first_name, handy.last_name].filter(Boolean).join(' ') || 'Unknown Handy'}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{handy.activeSlots}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{handy.totalSlots}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {handy.totalSlots === 0 ? 'Create initial availability slots' : 'Review and reactivate coverage'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Card({
  title,
  value,
  helper,
  icon: Icon,
  loading,
}: {
  title: string
  value: number
  helper: string
  icon: typeof CalendarRange
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

function HealthRow({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'green' | 'yellow' | 'red'
}) {
  const toneClass =
    tone === 'green'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      : tone === 'yellow'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{value}</span>
    </div>
  )
}
