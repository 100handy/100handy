import { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { emitAdminToast } from '@/lib/admin-toast'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title: string
}

const sectionTabs = [
  {
    match: (pathname: string) => pathname.startsWith('/tasks'),
    items: [
      { label: 'Categories', to: '/tasks/categories' },
      { label: 'Rollouts', to: '/tasks/rollouts' },
      { label: 'Bookings', to: '/tasks/list' },
      { label: 'Open', to: '/tasks/open' },
      { label: 'Scheduled', to: '/tasks/scheduled' },
      { label: 'Completed', to: '/tasks/completed' },
      { label: 'Cancelled', to: '/tasks/cancelled' },
      { label: 'Booking Fields', to: '/tasks/questions' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/content'),
    items: [
      { label: 'Pages', to: '/content/pages' },
      { label: 'Global Settings', to: '/content/page-settings' },
      { label: 'Help Articles', to: '/content/help-articles' },
      { label: 'Blogs', to: '/content/blogs' },
      { label: 'Media', to: '/content/media' },
      { label: 'FAQs', to: '/content/faqs' },
      { label: 'Navigation', to: '/content/navigation' },
      { label: 'App Content', to: '/content/app-content' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/finance'),
    items: [
      { label: 'Earnings', to: '/finance/earnings' },
      { label: 'Transactions', to: '/finance/transactions' },
      { label: 'Payouts', to: '/finance/payouts' },
      { label: 'Income', to: '/finance/income' },
      { label: 'Rates', to: '/finance/rates' },
      { label: 'Payment Methods', to: '/finance/payment-methods' },
      { label: 'Balances', to: '/finance/balances' },
      { label: 'Invoices', to: '/finance/invoices' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/accounts'),
    items: [
      { label: 'Overview', to: '/accounts' },
      { label: 'Security', to: '/accounts/security' },
      { label: 'Timeline', to: '/accounts/timeline' },
      { label: 'Audit Log', to: '/accounts/audit-log' },
      { label: 'Verification', to: '/accounts/verification' },
      { label: 'Deleted', to: '/accounts/deleted' },
      { label: 'Paused', to: '/accounts/paused' },
      { label: 'Service Areas', to: '/accounts/service-areas' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/notifications'),
    items: [
      { label: 'Overview', to: '/notifications' },
      { label: 'Announcements', to: '/dashboard/announcements' },
      { label: 'Email', to: '/notifications/email' },
      { label: 'Push', to: '/notifications/push' },
      { label: 'Pop-ups', to: '/notifications/popups' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/dashboard/announcements'),
    items: [
      { label: 'Announcements', to: '/dashboard/announcements' },
      { label: 'Notifications Overview', to: '/notifications' },
      { label: 'Email', to: '/notifications/email' },
      { label: 'Push', to: '/notifications/push' },
      { label: 'Pop-ups', to: '/notifications/popups' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/users'),
    items: [
      { label: 'Customers', to: '/users' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/handys'),
    items: [
      { label: 'All Handys', to: '/handys' },
      { label: '100 Handy Stars', to: '/handys/stars' },
      { label: 'Selection', to: '/handys/selection-process' },
      { label: 'Availability', to: '/handys/availability' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/support'),
    items: [
      { label: 'Support Centre', to: '/support/centre' },
      { label: 'Reviews', to: '/support/reviews' },
      { label: 'Disputes', to: '/support/disputes' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/insights'),
    items: [
      { label: 'Analytics', to: '/insights/analytics' },
      { label: 'Reports', to: '/insights/reports' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/promotions'),
    items: [
      { label: 'Promotions', to: '/promotions/management' },
    ],
  },
  {
    match: (pathname: string) => pathname.startsWith('/outreach'),
    items: [
      { label: 'Outreach', to: '/outreach/leads' },
    ],
  },
]

export default function Header({ title }: HeaderProps) {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      emitAdminToast({
        tone: 'error',
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'Failed to sign out of the admin panel.',
      })
    }
  }

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Admin'
    : 'Admin'
  const displayEmail = user?.email || 'admin@100handy.com'
  const avatarUrl = profile?.avatar_url
  const currentSectionTabs =
    sectionTabs.find((section) => section.match(location.pathname))?.items ?? []

  return (
    <header className="bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <div className="h-16 flex items-center justify-between px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <Bell className="w-6 h-6" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
            >
              {avatarUrl ? (
                <img alt={displayName} className="w-10 h-10 rounded-full object-cover" src={avatarUrl} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">{displayName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{displayEmail}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {currentSectionTabs.length > 0 ? (
        <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-800">
          <div className="flex gap-2 overflow-x-auto">
            {currentSectionTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
