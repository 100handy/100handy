import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import { webPageInventory } from '@/lib/cms/web-page-inventory'

const statusMeta = {
  admin: {
    label: 'Admin-managed',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  partial: {
    label: 'Partial',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  code: {
    label: 'Code only',
    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  },
} as const

const statusFilters = [
  { value: 'all', label: 'All pages' },
  { value: 'admin', label: 'Admin-managed' },
  { value: 'partial', label: 'Partial' },
  { value: 'code', label: 'Code only' },
] as const

export default function ContentPagesPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage') || hasPermission('seo.manage')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]['value']>('all')
  const [areaFilter, setAreaFilter] = useState<string>('all')

  const areaOptions = useMemo(
    () => ['all', ...Array.from(new Set(webPageInventory.map((page) => page.area))).sort()],
    []
  )

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return webPageInventory.filter((page) => {
      const matchesStatus = statusFilter === 'all' ? true : page.status === statusFilter
      const matchesArea = areaFilter === 'all' ? true : page.area === areaFilter
      if (!matchesArea) return false
      if (!matchesStatus) return false
      if (!query) return true
      return [page.title, page.route, page.area, page.source, page.notes ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [searchQuery, statusFilter, areaFilter])

  const counts = useMemo(
    () => ({
      total: webPageInventory.length,
      admin: webPageInventory.filter((page) => page.status === 'admin').length,
      partial: webPageInventory.filter((page) => page.status === 'partial').length,
      code: webPageInventory.filter((page) => page.status === 'code').length,
    }),
    []
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <Header title="Pages" />
      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background-light p-4 dark:bg-background-dark sm:p-8">
        <div className="w-full min-w-0 max-w-full space-y-6">
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view pages, but it cannot edit text or publish changes.
            </div>
          )}

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Open a page and edit its text, images, and SEO without touching code.
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/50 sm:p-6">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pages library</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a page, update the wording or images you need, save a draft, and publish when ready.
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900"
                >
                  {areaOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All areas' : option}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as (typeof statusFilters)[number]['value'])}
                  className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900"
                >
                  {statusFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total pages" value={counts.total} />
              <SummaryCard label="Editable in admin" value={counts.admin} tone="good" />
              <SummaryCard label="Partly editable" value={counts.partial} tone="warn" />
              <SummaryCard label="Still needs code" value={counts.code} tone="muted" />
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredPages.map((page, index) => (
              <div
                key={`${page.route}-${page.adminPath ?? page.title}-${index}-card`}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white">{page.title}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{page.area}</div>
                  </div>
                  <span className={`inline-flex flex-none rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[page.status].className}`}>
                    {statusMeta[page.status].label}
                  </span>
                </div>
                <div className="mt-3 break-all font-mono text-[11px] text-gray-500 dark:text-gray-400">{page.route}</div>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">{page.source}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{page.notes ?? 'Text and media can be managed here.'}</div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {page.adminPath ? (
                    <Link to={page.adminPath} className="font-medium text-primary hover:underline">
                      Edit page
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">Code only</span>
                  )}
                  <a
                    href={page.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                </div>
              </div>
            ))}
            {filteredPages.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                No pages match the current search or coverage filter.
              </div>
            )}
          </div>

          <div className="hidden w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm [contain:inline-size] dark:border-gray-800 dark:bg-gray-800/50 md:block">
            <table className="w-full min-w-0 text-sm text-left text-gray-500 dark:text-gray-400 sm:min-w-[760px]">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-3 py-3 sm:px-6">Page</th>
                  <th className="px-3 py-3 sm:px-6">What you can edit</th>
                  <th className="px-3 py-3 sm:px-6">Coverage</th>
                  <th className="px-3 py-3 sm:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page, index) => (
                  <tr
                    key={`${page.route}-${page.adminPath ?? page.title}-${index}`}
                    className="border-b border-gray-200 bg-white align-top hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-3 py-4 sm:px-6">
                      <div className="font-medium text-gray-900 dark:text-white">{page.title}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{page.area}</div>
                      <div className="mt-1 font-mono text-[11px] text-gray-500 dark:text-gray-400">{page.route}</div>
                    </td>
                    <td className="max-w-md px-3 py-4 sm:px-6">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{page.source}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{page.notes ?? 'Text and media can be managed here.'}</div>
                    </td>
                    <td className="px-3 py-4 sm:px-6">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[page.status].className}`}>
                        {statusMeta[page.status].label}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right sm:px-6">
                      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                        {page.adminPath ? (
                          <Link to={page.adminPath} className="font-medium text-primary hover:underline">
                            Edit page
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">Code only</span>
                        )}
                        <a
                          href={page.route}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPages.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No pages match the current search or coverage filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'good' | 'warn' | 'muted'
}) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'warn'
        ? 'text-amber-700 dark:text-amber-300'
        : tone === 'muted'
          ? 'text-slate-700 dark:text-slate-300'
          : 'text-gray-900 dark:text-white'

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  )
}
