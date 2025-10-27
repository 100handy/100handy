import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Outlet />
    </div>
  )
}
