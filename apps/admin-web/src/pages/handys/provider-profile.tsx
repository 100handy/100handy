import { format } from 'date-fns'
import { ArrowLeft, BadgeCheck, Clock3, FileText, MapPin, Shield, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '@/components/header'
import { useUpdateAccountLifecycleStatus } from '@/lib/api/accounts'
import { useHandyManagementDetails } from '@/lib/api/handys'
import { useUpdateVerificationStatus } from '@/lib/api/verification'

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof BadgeCheck
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

export default function ProviderProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { data: provider, isLoading, error } = useHandyManagementDetails(userId)
  const updateVerification = useUpdateVerificationStatus()
  const updateAccountStatus = useUpdateAccountLifecycleStatus()

  if (!userId) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Provider Profile" />
        <main className="flex-1 p-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            Invalid provider id.
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Provider Profile" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/handys"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to providers
          </Link>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load provider details.'}
            </div>
          )}

          {isLoading || !provider ? (
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {[provider.first_name, provider.last_name].filter(Boolean).join(' ') || 'Unknown provider'}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{provider.email || 'No email available'}</span>
                      <span>{provider.phone || 'No phone'}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {provider.postcode || 'No postcode'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        account: {provider.account_status}
                      </span>
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                        verification: {provider.verification_status || 'pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 xl:w-[360px]">
                    <button
                      type="button"
                      disabled={updateVerification.isPending}
                      onClick={() => updateVerification.mutate({ userId, status: 'verified' })}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Approve provider
                    </button>
                    <button
                      type="button"
                      disabled={updateVerification.isPending}
                      onClick={() => updateVerification.mutate({ userId, status: 'rejected' })}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      Reject provider
                    </button>
                    <button
                      type="button"
                      disabled={updateAccountStatus.isPending}
                      onClick={() => updateAccountStatus.mutate({ userId, status: 'paused', reason: 'Paused by admin from provider profile' })}
                      className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900/60"
                    >
                      Suspend access
                    </button>
                    <button
                      type="button"
                      disabled={updateAccountStatus.isPending}
                      onClick={() => updateAccountStatus.mutate({ userId, status: 'deleted', reason: 'Soft deleted by admin from provider profile' })}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60"
                    >
                      Ban / soft delete
                    </button>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Completed Jobs" value={String(provider.completed_jobs)} icon={BadgeCheck} />
                <SummaryCard label="Total Earnings" value={`£${provider.total_earnings.toFixed(0)}`} icon={Star} />
                <SummaryCard label="Avg Rating" value={provider.rating.toFixed(1)} icon={Star} />
                <SummaryCard
                  label="Availability"
                  value={`${provider.active_availability_slots}/${provider.total_availability_slots}`}
                  icon={Clock3}
                />
              </section>

              <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent jobs</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                      <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="pb-3">Task</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">When</th>
                          <th className="pb-3 text-right">Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {provider.bookings.slice(0, 8).map((booking) => (
                          <tr key={booking.id} className="border-t border-slate-200 dark:border-slate-800">
                            <td className="py-3 font-medium text-slate-900 dark:text-white">{booking.task_title}</td>
                            <td className="py-3">{booking.customer_name}</td>
                            <td className="py-3 capitalize">{booking.status.replaceAll('_', ' ')}</td>
                            <td className="py-3">{format(new Date(booking.scheduled_date), 'dd MMM yyyy')}</td>
                            <td className="py-3 text-right">£{booking.payout_amount.toFixed(0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills & service areas</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {provider.categories.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No service categories linked yet.</p>
                      ) : (
                        provider.categories.map((category) => (
                          <span
                            key={category.id}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {category.name}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      Primary service area: {provider.postcode || 'Not configured'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verification</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <span className="font-medium capitalize">{provider.verification_status || 'pending'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Onboarding</span>
                        <span className="font-medium">{provider.onboarding_completed ? 'Complete' : 'In progress'}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span>Document</span>
                        {provider.verification_document_url ? (
                          <a
                            href={provider.verification_document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View uploaded file
                          </a>
                        ) : (
                          <span className="font-medium">Not uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent reviews</h2>
                    <div className="mt-4 space-y-4">
                      {provider.reviews.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No reviews yet.</p>
                      ) : (
                        provider.reviews.slice(0, 4).map((review) => (
                          <div key={review.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900 dark:text-white">{review.customer_name}</span>
                              <span className="inline-flex items-center gap-1 text-amber-500">
                                <Shield className="h-4 w-4" />
                                {review.rating}/5
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                              {review.comment || 'No written review left.'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
