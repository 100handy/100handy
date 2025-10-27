import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/login'
import DashboardLayout from '@/layouts/dashboard-layout'
import DashboardPage from '@/pages/dashboard'
import UsersPage from '@/pages/users'
import TaskListPage from '@/pages/tasks/task-list'
import BrowseCategoriesPage from '@/pages/tasks/browse-categories'
import TaskDetailsPage from '@/pages/tasks/task-details'
import EditTaskPage from '@/pages/tasks/edit-task'
import RescheduleTaskPage from '@/pages/tasks/reschedule-task'
import CancelTaskPage from '@/pages/tasks/cancel-task'
import EditCategoriesPage from '@/pages/tasks/edit-categories'
import DeleteCategoriesPage from '@/pages/tasks/delete-categories'
import HandysPage from '@/pages/handys'
import EarningsDashboardPage from '@/pages/finance/earnings-dashboard'
import DataAnalyticsPage from '@/pages/insights/data-analytics'
import PromotionsManagementPage from '@/pages/promotions/promotions-management'
import ContentPagesPage from '@/pages/content/pages'
import CreatePagePage from '@/pages/content/create-page'
import BlogsPage from '@/pages/content/blogs'
import MediaPage from '@/pages/content/media'
import FAQsPage from '@/pages/content/faqs'
import NavigationPage from '@/pages/content/navigation'
import AddUserPage from '@/pages/users/add-user'
import RemoveUsersPage from '@/pages/users/remove-users'
import UserProfilePage from '@/pages/users/user-profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<div className="p-6">Admin Page</div>} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/add" element={<AddUserPage />} />
          <Route path="/users/remove" element={<RemoveUsersPage />} />
          <Route path="/users/profiles" element={<UserProfilePage />} />
          <Route path="/tasks/categories" element={<BrowseCategoriesPage />} />
          <Route path="/tasks/categories/edit" element={<EditCategoriesPage />} />
          <Route path="/tasks/categories/delete" element={<DeleteCategoriesPage />} />
          <Route path="/tasks/list" element={<TaskListPage />} />
          <Route path="/tasks/open" element={<div className="p-6">Open Tasks Page</div>} />
          <Route path="/tasks/scheduled" element={<div className="p-6">Scheduled Tasks Page</div>} />
          <Route path="/tasks/details" element={<TaskDetailsPage />} />
          <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
          <Route path="/tasks/reschedule/:id" element={<RescheduleTaskPage />} />
          <Route path="/tasks/cancel/:id" element={<CancelTaskPage />} />
          <Route path="/tasks/completed" element={<div className="p-6">Completed Tasks Page</div>} />
          <Route path="/tasks/cancelled" element={<div className="p-6">Cancelled Tasks Page</div>} />
          <Route path="/tasks/questions" element={<div className="p-6">Task Questions Page</div>} />
          <Route path="/handys" element={<HandysPage />} />
          <Route path="/finance/earnings" element={<EarningsDashboardPage />} />
          <Route path="/finance/income" element={<div className="p-6">Total Income Page</div>} />
          <Route path="/finance/rates" element={<div className="p-6">Rates Adjustments Page</div>} />
          <Route path="/finance/payment-methods" element={<div className="p-6">Payment Methods Page</div>} />
          <Route path="/finance/balances" element={<div className="p-6">Account Balances Page</div>} />
          <Route path="/finance/invoices" element={<div className="p-6">Invoices Page</div>} />
          <Route path="/insights/analytics" element={<DataAnalyticsPage />} />
          <Route path="/promotions/management" element={<PromotionsManagementPage />} />
          <Route path="/content/pages" element={<ContentPagesPage />} />
          <Route path="/content/pages/create" element={<CreatePagePage />} />
          <Route path="/content/page-settings" element={<div className="p-6">Page Settings</div>} />
          <Route path="/content/blogs" element={<BlogsPage />} />
          <Route path="/content/media" element={<MediaPage />} />
          <Route path="/content/faqs" element={<FAQsPage />} />
          <Route path="/content/navigation" element={<NavigationPage />} />
          <Route path="/accounts" element={<div className="p-6">Accounts Page</div>} />
          <Route path="/notifications" element={<div className="p-6">Notifications Page</div>} />
          <Route path="/support" element={<div className="p-6">Support Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
