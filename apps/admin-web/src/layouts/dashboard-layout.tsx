import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen lg:pl-72">
      <Sidebar />
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
