import Header from '@/components/header'
import { Bell, Mail, MonitorSmartphone } from 'lucide-react'

export default function NotificationsOverviewPage() {
  const cards = [
    {
      title: 'Email Notifications',
      description: 'Manage reusable email templates and one-time campaign drafts.',
      href: '/notifications/email',
      icon: Mail,
    },
    {
      title: 'Pop-ups',
      description: 'Manage modal and banner announcements shown on the website and app.',
      href: '/notifications/popups',
      icon: MonitorSmartphone,
    },
    {
      title: 'Announcements',
      description: 'Manage broader platform announcements and placement-specific notices.',
      href: '/dashboard/announcements',
      icon: Bell,
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Notifications" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <a
                key={card.title}
                href={card.href}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-primary/40 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
              </a>
            )
          })}
        </div>
      </main>
    </div>
  )
}
