import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const taskSectionLinks = [
  { label: 'Categories', to: '/tasks/categories' },
  { label: 'Rollouts', to: '/tasks/rollouts' },
  { label: 'Bookings', to: '/tasks/list' },
  { label: 'Open', to: '/tasks/open' },
  { label: 'Scheduled', to: '/tasks/scheduled' },
  { label: 'Completed', to: '/tasks/completed' },
  { label: 'Cancelled', to: '/tasks/cancelled' },
  { label: 'Booking Fields', to: '/tasks/questions' },
] as const

export function TaskSectionNav() {
  return (
    <div className="border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto py-3">
        {taskSectionLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
