import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import Header from '@/components/header'
import { useAdminAuditLogs, useAdminTimelineSummary } from '@/lib/api/admin-audit'

const SECTION_OPTIONS = [
  { value: '', label: 'All sections' },
  { value: 'content', label: 'Content' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'operations', label: 'Operations' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
] as const

export default function AdminTimelinePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [section, setSection] = useState('')
  const [activeView, setActiveView] = useState<'timeline' | 'insights'>('timeline')

  const filters = useMemo(() => ({
    search: searchQuery || undefined,
    section: section || undefined,
    limit: 150,
  }), [searchQuery, section])

  const { data: logs = [], isLoading, error } = useAdminAuditLogs(filters)
  const { data: summary, isLoading: summaryLoading } = useAdminTimelineSummary()

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Admin Timeline" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {[
              { id: 'timeline', label: 'Timeline' },
              { id: 'insights', label: 'Insights' },
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

          {activeView === 'insights' ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
              <MetricCard label="Recent changes" value={summaryLoading ? '...' : String(summary?.recentChanges ?? 0)} />
              <MetricCard label="Active admins" value={summaryLoading ? '...' : String(summary?.activeAdmins ?? 0)} />
              <MetricCard label="Sections touched" value={summaryLoading ? '...' : String(summary?.sectionsTouched ?? 0)} />
              <MetricCard label="Revision backups" value={summaryLoading ? '...' : String(summary?.latestRevisionBackups ?? 0)} />
              <MetricCard label="Rollout presets" value={summaryLoading ? '...' : String(summary?.latestRolloutPresets ?? 0)} />
            </div>
            <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
              <section className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activity by section</h3>
                  <div className="mt-4 space-y-3">
                    {(summary?.bySection ?? []).length === 0 ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400">No section activity yet.</div>
                    ) : (
                      summary!.bySection.map((row) => (
                        <div key={row.section} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
                          <span className="font-medium capitalize text-slate-900 dark:text-white">{row.section}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{row.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Most active admins</h3>
                  <div className="mt-4 space-y-3">
                    {(summary?.byActor ?? []).length === 0 ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400">No admin activity yet.</div>
                    ) : (
                      summary!.byActor.map((row) => (
                        <div key={row.actorId} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
                          <span className="font-medium text-slate-900 dark:text-white">{row.actorName}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{row.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
          ) : null}

          {activeView === 'timeline' ? (
          <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
            <section className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick summary</h3>
                <div className="mt-4 space-y-3">
                  <QuickStat label="Recent changes" value={summaryLoading ? '...' : String(summary?.recentChanges ?? 0)} />
                  <QuickStat label="Active admins" value={summaryLoading ? '...' : String(summary?.activeAdmins ?? 0)} />
                  <QuickStat label="Sections touched" value={summaryLoading ? '...' : String(summary?.sectionsTouched ?? 0)} />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Change timeline</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">See who changed what, when, and in which part of the admin panel.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search actor, action, summary..."
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-80"
                    />
                  </div>
                  <select value={section} onChange={(event) => setSection(event.target.value)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    {SECTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                  {error instanceof Error ? error.message : 'Failed to load timeline.'}
                </div>
              )}

              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">Loading timeline...</div>
                ) : logs.length === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">No admin changes yet for the current filters.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{log.summary}</div>
                          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {log.actor_name} • {log.actor_email || log.actor_id}
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{format(new Date(log.created_at), 'dd MMM yyyy, HH:mm')}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{log.action}</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{log.entity_type}</span>
                        {log.entity_id ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{log.entity_id}</span> : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
      <span className="font-medium text-slate-900 dark:text-white">{label}</span>
      <span className="text-sm text-slate-500 dark:text-slate-400">{value}</span>
    </div>
  )
}
