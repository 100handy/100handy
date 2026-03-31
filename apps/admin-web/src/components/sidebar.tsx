import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardList, Wrench, CreditCard, TrendingUp, Megaphone, FileText, UserCog, Bell, Headset, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const dashboardSubItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Announcements & Notifications', path: '/dashboard/announcements' },
]

const supportSubItems = [
    { label: 'Support Centre', path: '/support/centre' },
]

const notificationsSubItems = [
    { label: 'Email Notifications', path: '/notifications/email' },
    { label: 'Pop-ups on website and app', path: '/notifications/popups' },
    { label: 'App notifications', path: '/notifications/app' },
    { label: 'Text notifications', path: '/notifications/text' },
]

const accountsSubItems = [
    { label: 'Account Security Options', path: '/accounts/security' },
    { label: 'Verification Options', path: '/accounts/verification' },
    { label: 'Deleted Accounts', path: '/accounts/deleted' },
    { label: 'Paused Accounts', path: '/accounts/paused' },
    { label: 'Default Location', path: '/accounts/location' },
]

const handysSubItems = [
    { label: 'All Handys', path: '/handys' },
    { label: 'Selection Process', path: '/handys/selection-process' },
    { label: 'Availability Management', path: '/handys/availability' },
    { label: 'Calendar & Settings', path: '/handys/calendar-settings' },
]

const userSubItems = [
    { label: 'All Users', path: '/users' },
    { label: 'Add User', path: '/users/add' },
    { label: 'Remove Users', path: '/users/remove' },
    { label: 'User Profiles', path: '/users/profiles' },
]

const taskSubItems = [
    { label: 'Browse Categories', path: '/tasks/categories' },
    { label: 'Task List', path: '/tasks/list' },
    { label: 'Open Tasks', path: '/tasks/open' },
    { label: 'Scheduled Tasks', path: '/tasks/scheduled' },
    { label: 'Task Details', path: '/tasks/details' },
    { label: 'Completed Tasks', path: '/tasks/completed' },
    { label: 'Cancelled Tasks', path: '/tasks/cancelled' },
    { label: 'Task Questions', path: '/tasks/questions' },
]

const financeSubItems = [
    { label: 'Earnings Dashboard (per Handy)', path: '/finance/earnings' },
    { label: 'Total Income', path: '/finance/income' },
    { label: 'Rates Adjustments', path: '/finance/rates' },
    { label: 'Payment Methods', path: '/finance/payment-methods' },
    { label: 'Account Balances', path: '/finance/balances' },
    { label: 'Invoices', path: '/finance/invoices' },
]

const insightsSubItems = [
    { label: 'Data & Analytics', path: '/insights/analytics' },
]

const promotionsSubItems = [
    { label: 'Promotions & Referral Management', path: '/promotions/management' },
]

const contentSubItems = [
    { label: 'Pages', path: '/content/pages' },
    { label: 'Page Settings', path: '/content/page-settings' },
    { label: 'Blogs', path: '/content/blogs' },
    { label: 'Media', path: '/content/media' },
    { label: 'FAQs', path: '/content/faqs' },
    { label: 'Navigation Menu Editor', path: '/content/navigation' },
]

export default function Sidebar() {
    const location = useLocation()
    const [dashboardExpanded, setDashboardExpanded] = useState(true)
    const [accountsExpanded, setAccountsExpanded] = useState(true)
    const [handysExpanded, setHandysExpanded] = useState(true)
    const [usersExpanded, setUsersExpanded] = useState(true)
    const [tasksExpanded, setTasksExpanded] = useState(true)
    const [financeExpanded, setFinanceExpanded] = useState(true)
    const [insightsExpanded, setInsightsExpanded] = useState(true)
    const [promotionsExpanded, setPromotionsExpanded] = useState(true)
    const [contentExpanded, setContentExpanded] = useState(true)
    const [supportExpanded, setSupportExpanded] = useState(true)
    const [notificationsExpanded, setNotificationsExpanded] = useState(true)
    const isDashboardActive = location.pathname.startsWith('/dashboard')
    const isAccountsActive = location.pathname.startsWith('/accounts')
    const isHandysActive = location.pathname.startsWith('/handys')
    const isUsersActive = location.pathname.startsWith('/users')
    const isTasksActive = location.pathname.startsWith('/tasks')
    const isFinanceActive = location.pathname.startsWith('/finance')
    const isInsightsActive = location.pathname.startsWith('/insights')
    const isPromotionsActive = location.pathname.startsWith('/promotions')
    const isContentActive = location.pathname.startsWith('/content')
    const isSupportActive = location.pathname.startsWith('/support')
    const isNotificationsActive = location.pathname.startsWith('/notifications')

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center gap-4 h-16 border-b border-slate-200 dark:border-slate-800 px-6">
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

            <nav className="flex-1 px-4 py-6 space-y-2">
                <div className="relative group">
                    <button
                        onClick={() => setDashboardExpanded(!dashboardExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isDashboardActive
                                ? 'text-white bg-primary/90 dark:bg-primary/80'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                dashboardExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {dashboardExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {dashboardSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setAccountsExpanded(!accountsExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isAccountsActive
                                ? 'text-white bg-primary/90 dark:bg-primary/80'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <UserCog className="w-5 h-5" />
                            <span>Accounts</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                accountsExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {accountsExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {accountsSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setHandysExpanded(!handysExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isHandysActive
                                ? 'text-white bg-primary/90 dark:bg-primary/80'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Wrench className="w-5 h-5" />
                            <span>Handys</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                handysExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {handysExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {handysSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setUsersExpanded(!usersExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isUsersActive
                                ? 'text-white bg-primary/90 dark:bg-primary/80'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            <span>Users</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                usersExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {usersExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {userSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setTasksExpanded(!tasksExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isTasksActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-5 h-5" />
                            <span>Tasks</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                tasksExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {tasksExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {taskSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setFinanceExpanded(!financeExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isFinanceActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            <span>Finance</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                financeExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {financeExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {financeSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setInsightsExpanded(!insightsExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isInsightsActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5" />
                            <span>Insights</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                insightsExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {insightsExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {insightsSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setPromotionsExpanded(!promotionsExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isPromotionsActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Megaphone className="w-5 h-5" />
                            <span>Promotions</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                promotionsExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {promotionsExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {promotionsSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setContentExpanded(!contentExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isContentActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5" />
                            <span>Content Management</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                contentExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {contentExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {contentSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setSupportExpanded(!supportExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isSupportActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Headset className="w-5 h-5" />
                            <span>Support</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                supportExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {supportExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {supportSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setNotificationsExpanded(!notificationsExpanded)}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isNotificationsActive
                                ? 'text-white bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5" />
                            <span>Notifications</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform',
                                notificationsExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                    {notificationsExpanded && (
                        <div className="mt-2 space-y-1 pl-8">
                            {notificationsSubItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path

                                return (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={cn(
                                            'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isSubActive
                                                ? 'text-primary dark:text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    )
}
