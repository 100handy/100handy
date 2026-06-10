import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
