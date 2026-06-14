import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminState'
import Header from '@/components/header'
import OutreachNav from '@/components/outreach/OutreachNav'
import { useDiscoveryRuns, useOutreachSources, type DiscoveryRun } from '@/lib/api/outreach-sources'

const STATUS_CLASSES: Record<string, string> = {
  ingested: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  succeeded: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  running: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  queued: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  aborted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  timed_out: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

function formatDateTime(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OutreachRunsPage() {
  const { data: runs = [], isLoading, error, refetch } = useDiscoveryRuns()
  const { data: sources = [] } = useOutreachSources()
  const sourceName = (id: string) => sources.find((s) => s.id === id)?.name ?? id.slice(0, 8)

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <Header title="Outreach" />
      <div className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <OutreachNav />
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Discovery runs</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recent Apify scrape runs and what they produced.</p>
            </div>

            {isLoading ? (
              <AdminLoadingState label="Loading runs..." />
            ) : error ? (
              <AdminErrorState
                title="Failed to load runs"
                description={error instanceof Error ? error.message : 'Please try again.'}
                onRetry={() => void refetch()}
              />
            ) : runs.length === 0 ? (
              <AdminEmptyState title="No runs yet" description="Trigger a source from the Sources tab to see runs here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2 pr-4">Source</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Trigger</th>
                      <th className="py-2 pr-4">Scraped</th>
                      <th className="py-2 pr-4">New</th>
                      <th className="py-2 pr-4">Dupes</th>
                      <th className="py-2 pr-4">Leads</th>
                      <th className="py-2 pr-4">Started</th>
                      <th className="py-2 pr-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run: DiscoveryRun) => (
                      <tr key={run.id} className="border-b border-slate-100 dark:border-slate-800/60">
                        <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{sourceName(run.source_id)}</td>
                        <td className="py-2 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_CLASSES[run.status] ?? STATUS_CLASSES.queued}`}>
                            {run.status.replace('_', ' ')}
                          </span>
                          {run.error ? <div className="mt-1 max-w-xs truncate text-xs text-red-600" title={run.error}>{run.error}</div> : null}
                        </td>
                        <td className="py-2 pr-4 capitalize text-slate-600 dark:text-slate-300">{run.trigger}</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{run.items_scraped}</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{run.items_new}</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{run.items_duplicate}</td>
                        <td className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">{run.leads_created}</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{formatDateTime(run.started_at ?? run.created_at)}</td>
                        <td className="py-2 pr-4">
                          {run.leads_created > 0 ? (
                            <Link
                              to={`/outreach/leads?run=${run.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              View leads <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
