import Header from '@/components/header'
import { Bell, Mail, MonitorSmartphone, Loader2, FileText, Smartphone, TriangleAlert } from 'lucide-react'
import { useNotificationsSummary } from '@/lib/api/content-platform'

export default function NotificationsOverviewPage() {
  const { data: summary, isLoading } = useNotificationsSummary()
  const cards = [
    {
      title: 'Email Notifications',
      description: 'Manage reusable email templates and one-time campaign drafts.',
      href: '/notifications/email',
      icon: Mail,
    },
    {
      title: 'Push Notifications',
      description: 'Manage reusable push templates, one-time campaigns, and delivery jobs.',
      href: '/notifications/push',
      icon: Smartphone,
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
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="Email Templates" value={summary?.emailTemplates ?? 0} icon={Mail} loading={isLoading} />
          <SummaryCard title="Active Email Templates" value={summary?.activeEmailTemplates ?? 0} icon={Mail} loading={isLoading} />
          <SummaryCard title="Campaign Drafts" value={summary?.campaignDrafts ?? 0} icon={FileText} loading={isLoading} />
          <SummaryCard title="Push Templates" value={summary?.pushTemplates ?? 0} icon={Smartphone} loading={isLoading} />
          <SummaryCard title="Active Push Templates" value={summary?.activePushTemplates ?? 0} icon={Smartphone} loading={isLoading} />
          <SummaryCard title="Push Drafts" value={summary?.pushDrafts ?? 0} icon={FileText} loading={isLoading} />
          <SummaryCard title="Failed Email Jobs" value={summary?.failedEmailJobs ?? 0} icon={TriangleAlert} loading={isLoading} />
          <SummaryCard title="Failed Push Jobs" value={summary?.failedPushJobs ?? 0} icon={TriangleAlert} loading={isLoading} />
          <SummaryCard title="Active Announcements" value={summary?.activeAnnouncements ?? 0} icon={Bell} loading={isLoading} />
          <SummaryCard title="Active Banners/Modals" value={summary?.activeBannersAndModals ?? 0} icon={MonitorSmartphone} loading={isLoading} />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
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

function SummaryCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string
  value: number
  icon: typeof Bell
  loading: boolean
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
    </div>
  )
}
