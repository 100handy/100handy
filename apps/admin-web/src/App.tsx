import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { resolveInitialRoute } from '@/contexts/auth-routing'
import DashboardLayout from '@/layouts/dashboard-layout'
import AdminAnalyticsProvider from '@/components/analytics/AdminAnalyticsProvider'
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary'
import { ADMIN_ROUTE_PERMISSIONS as routePermissions } from '@/lib/admin-route-permissions'

const LoginPage = lazy(() => import('@/pages/login'))
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password'))
const VerifyCodePage = lazy(() => import('@/pages/verify-code'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UsersPage = lazy(() => import('@/pages/users'))
const TaskListPage = lazy(() => import('@/pages/tasks/task-list'))
const BrowseCategoriesPage = lazy(() => import('@/pages/tasks/browse-categories'))
const RolloutPlannerPage = lazy(() => import('@/pages/tasks/rollout-planner'))
const TaskDetailsPage = lazy(() => import('@/pages/tasks/task-details'))
const EditCategoriesPage = lazy(() => import('@/pages/tasks/edit-categories'))
const TaskQuestionsPage = lazy(() => import('@/pages/tasks/task-questions'))
const HandysPage = lazy(() => import('@/pages/handys'))
const HandyStarsPage = lazy(() => import('@/pages/handys/stars'))
const ProviderProfilePage = lazy(() => import('@/pages/handys/provider-profile'))
const HandySelectionProcess = lazy(() => import('@/pages/handys/selection-process'))
const AvailabilityManagement = lazy(() => import('@/pages/handys/availability-management'))
const EarningsDashboardPage = lazy(() => import('@/pages/finance/earnings-dashboard'))
const TransactionsRefundsPage = lazy(() => import('@/pages/finance/transactions-refunds'))
const PayoutOperationsPage = lazy(() => import('@/pages/finance/payout-operations'))
const TotalIncome = lazy(() => import('@/pages/finance/total-income'))
const RatesAdjustments = lazy(() => import('@/pages/finance/rates-adjustments'))
const PaymentMethods = lazy(() => import('@/pages/finance/payment-methods'))
const AccountBalances = lazy(() => import('@/pages/finance/account-balances'))
const Invoices = lazy(() => import('@/pages/finance/invoices'))
const DataAnalyticsPage = lazy(() => import('@/pages/insights/data-analytics'))
const MarketplaceReportsPage = lazy(() => import('@/pages/insights/marketplace-reports'))
const PromotionsManagementPage = lazy(() => import('@/pages/promotions/promotions-management'))
const OutreachLeadsPage = lazy(() => import('@/pages/outreach/leads'))
const OutreachSourcesPage = lazy(() => import('@/pages/outreach/sources'))
const OutreachRunsPage = lazy(() => import('@/pages/outreach/runs'))
const ContentPagesPage = lazy(() => import('@/pages/content/pages'))
const PageEditorPage = lazy(() => import('@/pages/content/page-editor'))
const PageSettingsPage = lazy(() => import('@/pages/content/page-settings'))
const HelpArticlesPage = lazy(() => import('@/pages/content/help-articles'))
const BlogsPage = lazy(() => import('@/pages/content/blogs'))
const MediaPage = lazy(() => import('@/pages/content/media'))
const FAQsPage = lazy(() => import('@/pages/content/faqs'))
const NavigationPage = lazy(() => import('@/pages/content/navigation'))
const AppContentPage = lazy(() => import('@/pages/content/app-content'))
const UserProfilePage = lazy(() => import('@/pages/users/user-profile'))
const AccountsOverviewPage = lazy(() => import('@/pages/accounts'))
const SecurityOptions = lazy(() => import('@/pages/accounts/security-options'))
const VerificationOptions = lazy(() => import('@/pages/accounts/verification-options'))
const AccountStatus = lazy(() => import('@/pages/accounts/account-status'))
const ServiceAreasPage = lazy(() => import('@/pages/accounts/service-areas'))
const AuditLogPage = lazy(() => import('@/pages/accounts/audit-log'))
const AdminTimelinePage = lazy(() => import('@/pages/accounts/timeline'))
const NotificationsOverviewPage = lazy(() => import('@/pages/notifications'))
const EmailNotifications = lazy(() => import('@/pages/notifications/email-notifications'))
const PushNotificationsPage = lazy(() => import('@/pages/notifications/push-notifications'))
const PopupsPage = lazy(() => import('@/pages/notifications/popups'))
const SupportCentre = lazy(() => import('@/pages/support/support-centre'))
const ReviewsModerationPage = lazy(() => import('@/pages/support/reviews-moderation'))
const DisputesPage = lazy(() => import('@/pages/support/disputes'))
const AnnouncementsPage = lazy(() => import('@/pages/dashboard/announcements'))

const isE2EAdmin = import.meta.env.VITE_ADMIN_E2E_AUTH === 'true'

function AuthBootstrapScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Restoring session...
        </p>
      </div>
    </div>
  )
}

function RouteLoadingScreen() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

function RootRedirect() {
  const { user, session, isAdmin, loading, roleResolved } = useAuth()
  const destination = resolveInitialRoute({
    loading,
    roleResolved,
    user,
    session,
    isAdmin,
  })

  if (!destination) {
    return <AuthBootstrapScreen />
  }

  return <Navigate to={destination} replace />
}

function TaskDetailsRedirect() {
  const { id } = useParams<{ id: string }>()
  return id ? <Navigate to={`/tasks/details/${id}`} replace /> : <Navigate to="/tasks/list" replace />
}

function E2ECrashPage() {
  throw new Error('E2E admin crash boundary probe')
  return null
}

function App() {
  return (
    <BrowserRouter>
      <AdminAnalyticsProvider>
        <AdminRoutes />
      </AdminAnalyticsProvider>
    </BrowserRouter>
  )
}

function AdminRoutes() {
  const location = useLocation()

  return (
    <AdminErrorBoundary key={location.pathname}>
      <Suspense fallback={<RouteLoadingScreen />}>
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route element={<ProtectedRoute permissions={routePermissions.dashboard.permissions} />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.dashboardAnnouncements.permissions} />}>
                  <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.users.permissions} />}>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/profiles" element={<UserProfilePage />} />
                  <Route path="/users/add" element={<Navigate to="/users?mode=add" replace />} />
                  <Route path="/users/remove" element={<Navigate to="/users" replace />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.taskList.permissions} />}>
                  <Route path="/tasks/reschedule/:id" element={<TaskDetailsRedirect />} />
                  <Route path="/tasks/cancel/:id" element={<TaskDetailsRedirect />} />
                  <Route path="/tasks/categories" element={<BrowseCategoriesPage />} />
                  <Route path="/tasks/rollouts" element={<RolloutPlannerPage />} />
                  <Route path="/tasks/categories/edit" element={<EditCategoriesPage />} />
                  <Route path="/tasks/categories/delete" element={<Navigate to="/tasks/categories/edit" replace />} />
                  <Route path="/tasks/list" element={<TaskListPage />} />
                  <Route path="/tasks/open" element={<TaskListPage pageTitle="Open Bookings" forcedStatus="pending" />} />
                  <Route path="/tasks/scheduled" element={<TaskListPage pageTitle="Scheduled Bookings" forcedStatus="accepted" />} />
                  <Route path="/tasks/details/:taskId" element={<TaskDetailsPage />} />
                  <Route path="/tasks/edit/:id" element={<TaskDetailsRedirect />} />
                  <Route path="/tasks/completed" element={<TaskListPage pageTitle="Completed Bookings" forcedStatus="completed" />} />
                  <Route path="/tasks/cancelled" element={<TaskListPage pageTitle="Cancelled Bookings" forcedStatus="cancelled" />} />
                  <Route path="/tasks/questions" element={<TaskQuestionsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.handys.permissions} />}>
                  <Route path="/handys" element={<HandysPage />} />
                  <Route path="/handys/stars" element={<HandyStarsPage />} />
                  <Route path="/handys/:userId" element={<ProviderProfilePage />} />
                  <Route path="/handys/selection-process" element={<HandySelectionProcess />} />
                  <Route path="/handys/availability" element={<AvailabilityManagement />} />
                  <Route path="/handys/calendar-settings" element={<Navigate to="/handys/availability" replace />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.financeEarnings.permissions} />}>
                  <Route path="/finance/earnings" element={<EarningsDashboardPage />} />
                  <Route path="/finance/transactions" element={<TransactionsRefundsPage />} />
                  <Route path="/finance/payouts" element={<PayoutOperationsPage />} />
                  <Route path="/finance/income" element={<TotalIncome />} />
                  <Route path="/finance/rates" element={<RatesAdjustments />} />
                  <Route path="/finance/payment-methods" element={<PaymentMethods />} />
                  <Route path="/finance/balances" element={<AccountBalances />} />
                  <Route path="/finance/invoices" element={<Invoices />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.insightsAnalytics.permissions} />}>
                  <Route path="/insights/analytics" element={<DataAnalyticsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.insightsReports.permissions} />}>
                  <Route path="/insights/reports" element={<MarketplaceReportsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.promotionsManagement.permissions} />}>
                  <Route path="/promotions/management" element={<PromotionsManagementPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.outreachLeads.permissions} />}>
                  <Route path="/outreach/leads" element={<OutreachLeadsPage />} />
                  <Route path="/outreach/sources" element={<OutreachSourcesPage />} />
                  <Route path="/outreach/runs" element={<OutreachRunsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.contentPages.permissions} />}>
                  <Route path="/content/pages" element={<ContentPagesPage />} />
                  <Route path="/content/pages/create" element={<Navigate to="/content/pages" replace />} />
                  <Route path="/content/pages/:pageKey" element={<PageEditorPage />} />
                  <Route path="/content/page-settings" element={<PageSettingsPage />} />
                  <Route path="/content/help-articles" element={<HelpArticlesPage />} />
                  <Route path="/content/blogs" element={<BlogsPage />} />
                  <Route path="/content/media" element={<MediaPage />} />
                  <Route path="/content/faqs" element={<FAQsPage />} />
                  <Route path="/content/navigation" element={<NavigationPage />} />
                  <Route path="/content/app-content" element={<AppContentPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.accounts.permissions} />}>
                  <Route path="/accounts" element={<AccountsOverviewPage />} />
                  <Route path="/accounts/security" element={<SecurityOptions />} />
                  <Route path="/accounts/verification" element={<VerificationOptions />} />
                  <Route path="/accounts/deleted" element={<AccountStatus />} />
                  <Route path="/accounts/paused" element={<AccountStatus />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.accountsServiceAreas.permissions} />}>
                  <Route path="/accounts/location" element={<Navigate to="/accounts/service-areas" replace />} />
                  <Route path="/accounts/service-areas" element={<ServiceAreasPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.accountsAuditLog.permissions} />}>
                  <Route path="/accounts/audit-log" element={<AuditLogPage />} />
                  <Route path="/accounts/timeline" element={<AdminTimelinePage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.notifications.permissions} />}>
                  <Route path="/notifications" element={<NotificationsOverviewPage />} />
                  <Route path="/notifications/email" element={<EmailNotifications />} />
                  <Route path="/notifications/push" element={<PushNotificationsPage />} />
                  <Route path="/notifications/popups" element={<PopupsPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.supportCentre.permissions} />}>
                  <Route path="/support/centre" element={<SupportCentre />} />
                  <Route path="/support/reviews" element={<ReviewsModerationPage />} />
                </Route>
                <Route element={<ProtectedRoute permissions={routePermissions.supportDisputes.permissions} />}>
                  <Route path="/support/disputes" element={<DisputesPage />} />
                </Route>
                {isE2EAdmin ? (
                  <Route path="/__e2e/crash" element={<E2ECrashPage />} />
                ) : null}
              </Route>
            </Route>
        </Routes>
      </Suspense>
    </AdminErrorBoundary>
  )
}

export default App
