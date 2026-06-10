import type { AdminPermission } from '@/lib/admin-permissions'

export type AdminRouteKey =
  | 'dashboard'
  | 'dashboardAnnouncements'
  | 'users'
  | 'userProfile'
  | 'userAddRedirect'
  | 'userRemoveRedirect'
  | 'taskCategories'
  | 'taskRollouts'
  | 'taskCategoriesEdit'
  | 'taskCategoriesDeleteRedirect'
  | 'taskList'
  | 'taskOpen'
  | 'taskScheduled'
  | 'taskDetails'
  | 'taskEditRedirect'
  | 'taskRescheduleRedirect'
  | 'taskCancelRedirect'
  | 'taskCompleted'
  | 'taskCancelled'
  | 'taskQuestions'
  | 'handys'
  | 'handyStars'
  | 'handyProfile'
  | 'handySelectionProcess'
  | 'handyAvailability'
  | 'handyCalendarSettingsRedirect'
  | 'financeEarnings'
  | 'financeTransactions'
  | 'financePayouts'
  | 'financeIncome'
  | 'financeRates'
  | 'financePaymentMethods'
  | 'financeBalances'
  | 'financeInvoices'
  | 'insightsAnalytics'
  | 'insightsReports'
  | 'promotionsManagement'
  | 'outreachLeads'
  | 'contentPages'
  | 'contentPagesCreateRedirect'
  | 'contentPageEditor'
  | 'contentPageSettings'
  | 'contentHelpArticles'
  | 'contentBlogs'
  | 'contentMedia'
  | 'contentFaqs'
  | 'contentNavigation'
  | 'contentAppContent'
  | 'accounts'
  | 'accountsSecurity'
  | 'accountsVerification'
  | 'accountsDeleted'
  | 'accountsPaused'
  | 'accountsLocationRedirect'
  | 'accountsServiceAreas'
  | 'accountsAuditLog'
  | 'accountsTimeline'
  | 'notifications'
  | 'notificationsEmail'
  | 'notificationsPush'
  | 'notificationsPopups'
  | 'supportCentre'
  | 'supportReviews'
  | 'supportDisputes'

export interface AdminRoutePermissionEntry {
  path: string
  permissions: AdminPermission[]
  section: string
  smokeTestPath?: string
}

export const ADMIN_ROUTE_PERMISSIONS: Record<AdminRouteKey, AdminRoutePermissionEntry> = {
  dashboard: { path: '/dashboard', permissions: ['dashboard.view'], section: 'dashboard', smokeTestPath: '/dashboard' },
  dashboardAnnouncements: { path: '/dashboard/announcements', permissions: ['notifications.manage'], section: 'notifications', smokeTestPath: '/dashboard/announcements' },
  users: { path: '/users', permissions: ['users.manage'], section: 'users', smokeTestPath: '/users' },
  userProfile: { path: '/users/profiles', permissions: ['users.manage'], section: 'users', smokeTestPath: '/users/profiles?id=admin_e2e' },
  userAddRedirect: { path: '/users/add', permissions: ['users.manage'], section: 'users', smokeTestPath: '/users/add' },
  userRemoveRedirect: { path: '/users/remove', permissions: ['users.manage'], section: 'users', smokeTestPath: '/users/remove' },
  taskCategories: { path: '/tasks/categories', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/categories' },
  taskRollouts: { path: '/tasks/rollouts', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/rollouts' },
  taskCategoriesEdit: { path: '/tasks/categories/edit', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/categories/edit' },
  taskCategoriesDeleteRedirect: { path: '/tasks/categories/delete', permissions: ['tasks.manage'], section: 'tasks' },
  taskList: { path: '/tasks/list', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/list' },
  taskOpen: { path: '/tasks/open', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/open' },
  taskScheduled: { path: '/tasks/scheduled', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/scheduled' },
  taskDetails: { path: '/tasks/details/:taskId', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/details/admin-e2e-task' },
  taskEditRedirect: { path: '/tasks/edit/:id', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/edit/admin-e2e-task' },
  taskRescheduleRedirect: { path: '/tasks/reschedule/:id', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/reschedule/admin-e2e-task' },
  taskCancelRedirect: { path: '/tasks/cancel/:id', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/cancel/admin-e2e-task' },
  taskCompleted: { path: '/tasks/completed', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/completed' },
  taskCancelled: { path: '/tasks/cancelled', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/cancelled' },
  taskQuestions: { path: '/tasks/questions', permissions: ['tasks.manage'], section: 'tasks', smokeTestPath: '/tasks/questions' },
  handys: { path: '/handys', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys' },
  handyStars: { path: '/handys/stars', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys/stars' },
  handyProfile: { path: '/handys/:userId', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys/admin-e2e' },
  handySelectionProcess: { path: '/handys/selection-process', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys/selection-process' },
  handyAvailability: { path: '/handys/availability', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys/availability' },
  handyCalendarSettingsRedirect: { path: '/handys/calendar-settings', permissions: ['handys.manage'], section: 'handys', smokeTestPath: '/handys/calendar-settings' },
  financeEarnings: { path: '/finance/earnings', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/earnings' },
  financeTransactions: { path: '/finance/transactions', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/transactions' },
  financePayouts: { path: '/finance/payouts', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/payouts' },
  financeIncome: { path: '/finance/income', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/income' },
  financeRates: { path: '/finance/rates', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/rates' },
  financePaymentMethods: { path: '/finance/payment-methods', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/payment-methods' },
  financeBalances: { path: '/finance/balances', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/balances' },
  financeInvoices: { path: '/finance/invoices', permissions: ['finance.view'], section: 'finance', smokeTestPath: '/finance/invoices' },
  insightsAnalytics: { path: '/insights/analytics', permissions: ['insights.view'], section: 'insights', smokeTestPath: '/insights/analytics' },
  insightsReports: { path: '/insights/reports', permissions: ['reports.view'], section: 'insights', smokeTestPath: '/insights/reports' },
  promotionsManagement: { path: '/promotions/management', permissions: ['promotions.manage'], section: 'promotions', smokeTestPath: '/promotions/management' },
  outreachLeads: { path: '/outreach/leads', permissions: ['outreach.manage'], section: 'outreach', smokeTestPath: '/outreach/leads' },
  contentPages: { path: '/content/pages', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/pages' },
  contentPagesCreateRedirect: { path: '/content/pages/create', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/pages/create' },
  contentPageEditor: { path: '/content/pages/:pageKey', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/pages/home' },
  contentPageSettings: { path: '/content/page-settings', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/page-settings' },
  contentHelpArticles: { path: '/content/help-articles', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/help-articles' },
  contentBlogs: { path: '/content/blogs', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/blogs' },
  contentMedia: { path: '/content/media', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/media' },
  contentFaqs: { path: '/content/faqs', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/faqs' },
  contentNavigation: { path: '/content/navigation', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/navigation' },
  contentAppContent: { path: '/content/app-content', permissions: ['content.manage', 'seo.manage'], section: 'content', smokeTestPath: '/content/app-content' },
  accounts: { path: '/accounts', permissions: ['accounts.manage'], section: 'accounts', smokeTestPath: '/accounts' },
  accountsSecurity: { path: '/accounts/security', permissions: ['accounts.manage'], section: 'accounts', smokeTestPath: '/accounts/security' },
  accountsVerification: { path: '/accounts/verification', permissions: ['accounts.manage'], section: 'accounts', smokeTestPath: '/accounts/verification' },
  accountsDeleted: { path: '/accounts/deleted', permissions: ['accounts.manage'], section: 'accounts', smokeTestPath: '/accounts/deleted' },
  accountsPaused: { path: '/accounts/paused', permissions: ['accounts.manage'], section: 'accounts', smokeTestPath: '/accounts/paused' },
  accountsLocationRedirect: { path: '/accounts/location', permissions: ['locations.manage'], section: 'accounts', smokeTestPath: '/accounts/location' },
  accountsServiceAreas: { path: '/accounts/service-areas', permissions: ['locations.manage'], section: 'accounts', smokeTestPath: '/accounts/service-areas' },
  accountsAuditLog: { path: '/accounts/audit-log', permissions: ['audit.view'], section: 'accounts', smokeTestPath: '/accounts/audit-log' },
  accountsTimeline: { path: '/accounts/timeline', permissions: ['audit.view'], section: 'accounts', smokeTestPath: '/accounts/timeline' },
  notifications: { path: '/notifications', permissions: ['notifications.manage'], section: 'notifications', smokeTestPath: '/notifications' },
  notificationsEmail: { path: '/notifications/email', permissions: ['notifications.manage'], section: 'notifications', smokeTestPath: '/notifications/email' },
  notificationsPush: { path: '/notifications/push', permissions: ['notifications.manage'], section: 'notifications', smokeTestPath: '/notifications/push' },
  notificationsPopups: { path: '/notifications/popups', permissions: ['notifications.manage'], section: 'notifications', smokeTestPath: '/notifications/popups' },
  supportCentre: { path: '/support/centre', permissions: ['support.view'], section: 'support', smokeTestPath: '/support/centre' },
  supportReviews: { path: '/support/reviews', permissions: ['support.view'], section: 'support', smokeTestPath: '/support/reviews' },
  supportDisputes: { path: '/support/disputes', permissions: ['disputes.manage'], section: 'support', smokeTestPath: '/support/disputes' },
}

export const ADMIN_ROUTE_SMOKE_TEST_PATHS = Object.values(ADMIN_ROUTE_PERMISSIONS)
  .map((entry) => entry.smokeTestPath)
  .filter((path): path is string => Boolean(path))
