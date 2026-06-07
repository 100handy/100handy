import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { resolveInitialRoute } from '@/contexts/auth-routing'
import LoginPage from '@/pages/login'
import ForgotPasswordPage from '@/pages/forgot-password'
import VerifyCodePage from '@/pages/verify-code'
import ResetPasswordPage from '@/pages/reset-password'
import DashboardLayout from '@/layouts/dashboard-layout'
import DashboardPage from '@/pages/dashboard'
import UsersPage from '@/pages/users'
import TaskListPage from '@/pages/tasks/task-list'
import BrowseCategoriesPage from '@/pages/tasks/browse-categories'
import RolloutPlannerPage from '@/pages/tasks/rollout-planner'
import TaskDetailsPage from '@/pages/tasks/task-details'
import EditTaskPage from '@/pages/tasks/edit-task'
import RescheduleTaskPage from '@/pages/tasks/reschedule-task'
import CancelTaskPage from '@/pages/tasks/cancel-task'
import EditCategoriesPage from '@/pages/tasks/edit-categories'
import DeleteCategoriesPage from '@/pages/tasks/delete-categories'
import HandysPage from '@/pages/handys'
import ProviderProfilePage from '@/pages/handys/provider-profile'
import EarningsDashboardPage from '@/pages/finance/earnings-dashboard'
import TransactionsRefundsPage from '@/pages/finance/transactions-refunds'
import PayoutOperationsPage from '@/pages/finance/payout-operations'
import DataAnalyticsPage from '@/pages/insights/data-analytics'
import MarketplaceReportsPage from '@/pages/insights/marketplace-reports'
import PromotionsManagementPage from '@/pages/promotions/promotions-management'
import OutreachLeadsPage from '@/pages/outreach/leads'
import ContentPagesPage from '@/pages/content/pages'
import CreatePagePage from '@/pages/content/create-page'
import PageEditorPage from '@/pages/content/page-editor'
import PageSettingsPage from '@/pages/content/page-settings'
import HelpArticlesPage from '@/pages/content/help-articles'
import BlogsPage from '@/pages/content/blogs'
import MediaPage from '@/pages/content/media'
import FAQsPage from '@/pages/content/faqs'
import NavigationPage from '@/pages/content/navigation'
import AppContentPage from '@/pages/content/app-content'
import AddUserPage from '@/pages/users/add-user'
import RemoveUsersPage from '@/pages/users/remove-users'
import UserProfilePage from '@/pages/users/user-profile'
import HandySelectionProcess from '@/pages/handys/selection-process'
import AvailabilityManagement from '@/pages/handys/availability-management'
import CalendarSettings from '@/pages/handys/calendar-settings'
import TotalIncome from '@/pages/finance/total-income'
import RatesAdjustments from '@/pages/finance/rates-adjustments'
import PaymentMethods from '@/pages/finance/payment-methods'
import AccountBalances from '@/pages/finance/account-balances'
import Invoices from '@/pages/finance/invoices'
import SecurityOptions from '@/pages/accounts/security-options'
import VerificationOptions from '@/pages/accounts/verification-options'
import AccountStatus from '@/pages/accounts/account-status'
import AccountsOverviewPage from '@/pages/accounts'
import AuditLogPage from '@/pages/accounts/audit-log'
import AdminTimelinePage from '@/pages/accounts/timeline'
import ServiceAreasPage from '@/pages/accounts/service-areas'
import EmailNotifications from '@/pages/notifications/email-notifications'
import PopupsPage from '@/pages/notifications/popups'
import PushNotificationsPage from '@/pages/notifications/push-notifications'
import NotificationsOverviewPage from '@/pages/notifications'
import SupportCentre from '@/pages/support/support-centre'
import ReviewsModerationPage from '@/pages/support/reviews-moderation'
import DisputesPage from '@/pages/support/disputes'
import AnnouncementsPage from '@/pages/dashboard/announcements'
import TaskQuestionsPage from '@/pages/tasks/task-questions'

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute permissions={['dashboard.view']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['users.manage']} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/add" element={<AddUserPage />} />
            <Route path="/users/remove" element={<RemoveUsersPage />} />
            <Route path="/users/profiles" element={<UserProfilePage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['tasks.manage']} />}>
            <Route path="/tasks/categories" element={<BrowseCategoriesPage />} />
            <Route path="/tasks/rollouts" element={<RolloutPlannerPage />} />
            <Route path="/tasks/categories/edit" element={<EditCategoriesPage />} />
            <Route path="/tasks/categories/delete" element={<DeleteCategoriesPage />} />
            <Route path="/tasks/list" element={<TaskListPage />} />
            <Route path="/tasks/open" element={<TaskListPage pageTitle="Open Tasks" forcedStatus="pending" />} />
            <Route path="/tasks/scheduled" element={<TaskListPage pageTitle="Scheduled Tasks" forcedStatus="accepted" />} />
            <Route path="/tasks/details/:taskId" element={<TaskDetailsPage />} />
            <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
            <Route path="/tasks/reschedule/:id" element={<RescheduleTaskPage />} />
            <Route path="/tasks/cancel/:id" element={<CancelTaskPage />} />
            <Route path="/tasks/completed" element={<TaskListPage pageTitle="Completed Tasks" forcedStatus="completed" />} />
            <Route path="/tasks/cancelled" element={<TaskListPage pageTitle="Cancelled Tasks" forcedStatus="cancelled" />} />
            <Route path="/tasks/questions" element={<TaskQuestionsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['handys.manage']} />}>
            <Route path="/handys" element={<HandysPage />} />
            <Route path="/handys/:userId" element={<ProviderProfilePage />} />
            <Route path="/handys/selection-process" element={<HandySelectionProcess />} />
            <Route path="/handys/availability" element={<AvailabilityManagement />} />
            <Route path="/handys/calendar-settings" element={<CalendarSettings />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['finance.view']} />}>
            <Route path="/finance/earnings" element={<EarningsDashboardPage />} />
            <Route path="/finance/transactions" element={<TransactionsRefundsPage />} />
            <Route path="/finance/payouts" element={<PayoutOperationsPage />} />
            <Route path="/finance/income" element={<TotalIncome />} />
            <Route path="/finance/rates" element={<RatesAdjustments />} />
            <Route path="/finance/payment-methods" element={<PaymentMethods />} />
            <Route path="/finance/balances" element={<AccountBalances />} />
            <Route path="/finance/invoices" element={<Invoices />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['insights.view']} />}>
            <Route path="/insights/analytics" element={<DataAnalyticsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['reports.view']} />}>
            <Route path="/insights/reports" element={<MarketplaceReportsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['promotions.manage']} />}>
            <Route path="/promotions/management" element={<PromotionsManagementPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['outreach.manage']} />}>
            <Route path="/outreach/leads" element={<OutreachLeadsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['content.manage', 'seo.manage']} />}>
            <Route path="/content/pages" element={<ContentPagesPage />} />
            <Route path="/content/pages/create" element={<CreatePagePage />} />
            <Route path="/content/pages/:pageKey" element={<PageEditorPage />} />
            <Route path="/content/page-settings" element={<PageSettingsPage />} />
            <Route path="/content/help-articles" element={<HelpArticlesPage />} />
            <Route path="/content/blogs" element={<BlogsPage />} />
            <Route path="/content/media" element={<MediaPage />} />
            <Route path="/content/faqs" element={<FAQsPage />} />
            <Route path="/content/navigation" element={<NavigationPage />} />
            <Route path="/content/app-content" element={<AppContentPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['accounts.manage']} />}>
            <Route path="/accounts" element={<AccountsOverviewPage />} />
            <Route path="/accounts/security" element={<SecurityOptions />} />
            <Route path="/accounts/verification" element={<VerificationOptions />} />
            <Route path="/accounts/deleted" element={<AccountStatus />} />
            <Route path="/accounts/paused" element={<AccountStatus />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['locations.manage']} />}>
            <Route path="/accounts/location" element={<ServiceAreasPage />} />
            <Route path="/accounts/service-areas" element={<ServiceAreasPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['audit.view']} />}>
            <Route path="/accounts/audit-log" element={<AuditLogPage />} />
            <Route path="/accounts/timeline" element={<AdminTimelinePage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['notifications.manage']} />}>
            <Route path="/notifications" element={<NotificationsOverviewPage />} />
            <Route path="/notifications/email" element={<EmailNotifications />} />
            <Route path="/notifications/push" element={<PushNotificationsPage />} />
            <Route path="/notifications/popups" element={<PopupsPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['support.view']} />}>
            <Route path="/support/centre" element={<SupportCentre />} />
            <Route path="/support/reviews" element={<ReviewsModerationPage />} />
          </Route>
          <Route element={<ProtectedRoute permissions={['disputes.manage']} />}>
            <Route path="/support/disputes" element={<DisputesPage />} />
          </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
