import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <img
            alt="Admin"
            className="w-10 h-10 rounded-full"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByNGef88GluCXVsixImwv295iGNJfQnhtCu0xKI4Oq3-gD6mH-crS1c1CgFlSU_mDvopWYPqr7uIH42HcfXgrkzEWltxHo3i1k8b0b_3c8v18_hCBVZcjxAYsTAKNYHrAC2QjT6jrEbWt6PUQ9bjximaHID-NZd35HZlTmIY_ake4qylGu4TdSi0f-Jguf1IwK__e6sJf4kAcSOEwdkqPXasJ7N6ybchHaLqy7DBhh0xjN0v8Io7kt3wmwBq5VsQle_wQMqG-jqVNk"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Admin</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">admin@taskconnect.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
