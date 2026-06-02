import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import Header from '@/components/header'
import { useAdminAuditLogs } from '@/lib/api/admin-audit'

const ENTITY_OPTIONS = [
  { value: '', label: 'All entities' },
  { value: 'user', label: 'Users' },
  { value: 'admin', label: 'Admins' },
  { value: 'provider_availability', label: 'Provider availability' },
] as const

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [entityType, setEntityType] = useState('')

  const filters = useMemo(
    () => ({
      entityType: entityType || undefined,
      search: searchQuery || undefined,
      limit: 100,
    }),
    [entityType, searchQuery],
  )

  const { data: auditLogs = [], isLoading, error } = useAdminAuditLogs(filters)

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Audit Log" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Admin audit trail</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Core admin mutations are logged here with actor, target entity, and summary.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search summary, actor, action..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-80"
                />
              </div>
              <select
                value={entityType}
                onChange={(event) => setEntityType(event.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                {ENTITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load audit logs.'}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900/50">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Summary</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading audit log...
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      No audit entries yet for the current filter.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-5 py-4 whitespace-nowrap">
                        {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{log.actor_name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.actor_email || log.actor_id}</div>
                      </td>
                      <td className="px-5 py-4 font-medium">{log.action}</td>
                      <td className="px-5 py-4">
                        <div>{log.entity_type}</div>
                        {log.entity_id ? (
                          <div className="text-xs text-slate-500 dark:text-slate-400">{log.entity_id}</div>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">{log.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
