import { useMemo, useState } from 'react'
import {
  Bell,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  FileText,
  Gauge,
  LifeBuoy,
  MapPinned,
  Megaphone,
  Radar,
  Search,
  Shield,
  Users,
  Wrench,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { AdminPermission } from '@/lib/admin-permissions'
import { cn } from '@/lib/utils'

const groups = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: Gauge,
    path: '/dashboard',
    permissions: ['dashboard.view'] as AdminPermission[],
  },
  {
    key: 'handys',
    label: 'Handys',
    icon: Wrench,
    path: '/handys',
    permissions: ['handys.manage'] as AdminPermission[],
  },
  {
    key: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    permissions: ['users.manage'] as AdminPermission[],
  },
  {
    key: 'tasks',
    label: 'Tasks',
    icon: ClipboardList,
    path: '/tasks/categories',
    permissions: ['tasks.manage'] as AdminPermission[],
  },
  {
    key: 'content',
    label: 'Content',
    icon: FileText,
    path: '/content/pages',
    permissions: ['content.manage', 'seo.manage'] as AdminPermission[],
  },
  {
    key: 'accounts',
    label: 'Accounts',
    icon: Shield,
    path: '/accounts',
    permissions: ['accounts.manage', 'audit.view', 'locations.manage'] as AdminPermission[],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    permissions: ['notifications.manage'] as AdminPermission[],
  },
  {
    key: 'announcements',
    label: 'Announcements',
    icon: Megaphone,
    path: '/dashboard/announcements',
    permissions: ['notifications.manage'] as AdminPermission[],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: CreditCard,
    path: '/finance/earnings',
    permissions: ['finance.view'] as AdminPermission[],
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: FileBarChart2,
    path: '/insights/analytics',
    permissions: ['insights.view', 'reports.view'] as AdminPermission[],
  },
  {
    key: 'promotions',
    label: 'Promotions',
    icon: FileText,
    path: '/promotions/management',
    permissions: ['promotions.manage'] as AdminPermission[],
  },
  {
    key: 'outreach',
    label: 'Outreach',
    icon: Radar,
    path: '/outreach/leads',
    permissions: ['outreach.manage'] as AdminPermission[],
  },
  {
    key: 'locations',
    label: 'Locations',
    icon: MapPinned,
    path: '/accounts/service-areas',
    permissions: ['locations.manage'] as AdminPermission[],
  },
  {
    key: 'support',
    label: 'Support',
    icon: LifeBuoy,
    path: '/support/centre',
    permissions: ['support.view', 'disputes.manage'] as AdminPermission[],
  },
] as const

export default function Sidebar() {
  const location = useLocation()
  const { hasPermission } = useAuth()
  const [query, setQuery] = useState('')

  const visibleGroups = useMemo(
    () =>
      groups.filter((group) =>
        group.permissions.some((permission) => hasPermission(permission)),
      ),
    [hasPermission],
  )

  const normalizedQuery = query.trim().toLowerCase()
  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return visibleGroups
    return visibleGroups.filter((group) =>
      group.label.toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery, visibleGroups])

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
      <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex items-center gap-4 px-2">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">100 Handy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin panel</p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sections"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <nav className="space-y-2">
          {filteredGroups.map((group) => {
            const Icon = group.icon
            const isActive =
              location.pathname === group.path ||
              location.pathname.startsWith(`${group.path}/`) ||
              (group.key === 'tasks' && location.pathname.startsWith('/tasks')) ||
              (group.key === 'content' && location.pathname.startsWith('/content')) ||
              (group.key === 'accounts' && location.pathname.startsWith('/accounts')) ||
              (group.key === 'notifications' && location.pathname.startsWith('/notifications')) ||
              (group.key === 'finance' && location.pathname.startsWith('/finance')) ||
              (group.key === 'insights' && location.pathname.startsWith('/insights')) ||
              (group.key === 'support' && location.pathname.startsWith('/support')) ||
              (group.key === 'users' && location.pathname.startsWith('/users')) ||
              (group.key === 'handys' && location.pathname.startsWith('/handys'))

            return (
              <Link
                key={group.key}
                to={group.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-primary',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{group.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
