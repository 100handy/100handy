import Header from '@/components/header'
import { Shield, UserX, PauseCircle, MapPin, Users, Wrench, Loader2, History } from 'lucide-react'
import { useAccountsSummary } from '@/lib/api/accounts'

export default function AccountsOverviewPage() {
  const { data: summary, isLoading } = useAccountsSummary()
  const cards = [
    {
      title: 'Admin Access & Security',
      description: 'Manage admin permission scopes, lifecycle access, and operational safeguards.',
      href: '/accounts/security',
      icon: Shield,
    },
    {
      title: 'Verification Options',
      description: 'Manage identity and verification review settings for platform accounts.',
      href: '/accounts/verification',
      icon: Shield,
    },
    {
      title: 'Deleted Accounts',
      description: 'Review deleted-account states and related account lifecycle actions.',
      href: '/accounts/deleted',
      icon: UserX,
    },
    {
      title: 'Paused Accounts',
      description: 'Review paused or restricted accounts and their operational state.',
      href: '/accounts/paused',
      icon: PauseCircle,
    },
    {
      title: 'Timeline & Backups',
      description: 'Review who changed what, section activity, and revision/rollout backup coverage.',
      href: '/accounts/timeline',
      icon: History,
    },
    {
      title: 'Location Status',
      description: 'Review users who have configured their default address and location records.',
      href: '/accounts/location',
      icon: MapPin,
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Accounts" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <SummaryCard title="Total Users" value={summary?.totalUsers ?? 0} icon={Users} loading={isLoading} />
          <SummaryCard title="Clients" value={summary?.clients ?? 0} icon={Users} loading={isLoading} />
          <SummaryCard title="Handys" value={summary?.handys ?? 0} icon={Wrench} loading={isLoading} />
          <SummaryCard title="Users With Default Location" value={summary?.usersWithDefaultLocation ?? 0} icon={MapPin} loading={isLoading} />
          <SummaryCard title="Paused Users" value={summary?.pausedUsers ?? 0} icon={PauseCircle} loading={isLoading} />
          <SummaryCard title="Deleted Users" value={summary?.deletedUsers ?? 0} icon={UserX} loading={isLoading} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
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
  icon: typeof Users
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
