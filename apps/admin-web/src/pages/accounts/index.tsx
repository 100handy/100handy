import Header from '@/components/header'
import { Shield, UserX, PauseCircle } from 'lucide-react'

export default function AccountsOverviewPage() {
  const cards = [
    {
      title: 'Security Options',
      description: 'Review account security policies, password controls, and administrative safeguards.',
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
  ]

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Accounts" />
      <main className="flex-1 overflow-y-auto p-6">
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
