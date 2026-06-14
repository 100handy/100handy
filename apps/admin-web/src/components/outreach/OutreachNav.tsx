import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Leads', path: '/outreach/leads' },
  { label: 'Sources', path: '/outreach/sources' },
  { label: 'Runs', path: '/outreach/runs' },
] as const

export default function OutreachNav() {
  const location = useLocation()

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path)
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-primary text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
