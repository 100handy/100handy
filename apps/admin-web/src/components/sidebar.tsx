import { useState } from 'react'
import {
  Bell,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  FileText,
  Gauge,
  LifeBuoy,
  Megaphone,
  Settings2,
  Shield,
  Users,
  Wrench,
  ChevronDown,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const groups = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: Gauge,
    basePath: '/dashboard',
    defaultExpanded: true,
    items: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Announcements', path: '/dashboard/announcements' },
    ],
  },
  {
    key: 'handys',
    label: 'Handys',
    icon: Wrench,
    basePath: '/handys',
    defaultExpanded: true,
    items: [
      { label: 'All Handys', path: '/handys' },
      { label: 'Selection Process', path: '/handys/selection-process' },
      { label: 'Availability Management', path: '/handys/availability' },
      { label: 'Calendar & Settings', path: '/handys/calendar-settings' },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    icon: Users,
    basePath: '/users',
    defaultExpanded: true,
    items: [
      { label: 'All Users', path: '/users' },
      { label: 'Add User', path: '/users/add' },
      { label: 'Remove Users', path: '/users/remove' },
      { label: 'User Profiles', path: '/users/profiles' },
    ],
  },
  {
    key: 'tasks',
    label: 'Tasks',
    icon: ClipboardList,
    basePath: '/tasks',
    defaultExpanded: true,
    items: [
      { label: 'Browse Categories', path: '/tasks/categories' },
      { label: 'Task List', path: '/tasks/list' },
      { label: 'Open Tasks', path: '/tasks/open' },
      { label: 'Scheduled Tasks', path: '/tasks/scheduled' },
      { label: 'Task Details', path: '/tasks/details' },
      { label: 'Completed Tasks', path: '/tasks/completed' },
      { label: 'Cancelled Tasks', path: '/tasks/cancelled' },
      { label: 'Task Questions', path: '/tasks/questions' },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    icon: FileText,
    basePath: '/content',
    defaultExpanded: true,
    items: [
      { label: 'Pages', path: '/content/pages' },
      { label: 'Page Settings', path: '/content/page-settings' },
      { label: 'Blogs', path: '/content/blogs' },
      { label: 'Media', path: '/content/media' },
      { label: 'FAQs', path: '/content/faqs' },
      { label: 'Navigation', path: '/content/navigation' },
      { label: 'App Content', path: '/content/app-content' },
    ],
  },
  {
    key: 'accounts',
    label: 'Accounts',
    icon: Shield,
    basePath: '/accounts',
    defaultExpanded: false,
    items: [
      { label: 'Overview', path: '/accounts' },
      { label: 'Security Options', path: '/accounts/security' },
      { label: 'Verification Options', path: '/accounts/verification' },
      { label: 'Deleted Accounts', path: '/accounts/deleted' },
      { label: 'Paused Accounts', path: '/accounts/paused' },
      { label: 'Location Status', path: '/accounts/location' },
    ],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    basePath: '/notifications',
    defaultExpanded: false,
    items: [
      { label: 'Overview', path: '/notifications' },
      { label: 'Email Notifications', path: '/notifications/email' },
      { label: 'Pop-ups', path: '/notifications/popups' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: CreditCard,
    basePath: '/finance',
    defaultExpanded: false,
    items: [
      { label: 'Earnings', path: '/finance/earnings' },
      { label: 'Total Income', path: '/finance/income' },
      { label: 'Rates & Adjustments', path: '/finance/rates' },
      { label: 'Payment Methods', path: '/finance/payment-methods' },
      { label: 'Account Balances', path: '/finance/balances' },
      { label: 'Invoices', path: '/finance/invoices' },
    ],
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: FileBarChart2,
    basePath: '/insights',
    defaultExpanded: false,
    items: [{ label: 'Analytics', path: '/insights/analytics' }],
  },
  {
    key: 'promotions',
    label: 'Promotions',
    icon: Megaphone,
    basePath: '/promotions',
    defaultExpanded: false,
    items: [{ label: 'Management', path: '/promotions/management' }],
  },
  {
    key: 'support',
    label: 'Support',
    icon: LifeBuoy,
    basePath: '/support',
    defaultExpanded: false,
    items: [{ label: 'Support Centre', path: '/support/centre' }],
  },
] as const

export default function Sidebar() {
  const location = useLocation()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((group) => [group.key, group.defaultExpanded]))
  )

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
      <div className="flex h-16 items-center gap-4 border-b border-slate-200 px-6 dark:border-slate-800">
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">100 Handy</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {groups.map((group) => {
          const isActive = location.pathname.startsWith(group.basePath)
          const isExpanded = expanded[group.key]
          const Icon = group.icon

          return (
            <div key={group.key} className="relative">
              <button
                onClick={() => setExpanded((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{group.label}</span>
                </div>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
              </button>
              {isExpanded && (
                <div className="mt-2 space-y-1 pl-8">
                  {group.items.map((item) => {
                    const isSubActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                          isSubActive
                            ? 'text-primary dark:text-primary'
                            : 'text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
        <Link
          to="/content/page-settings"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-primary"
        >
          <Settings2 className="h-5 w-5" />
          Global Settings
        </Link>
      </div>
    </aside>
  )
}
