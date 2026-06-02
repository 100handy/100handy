import { useEffect, useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Mail, MapPin, Phone, Shield, Star, Ticket } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/header'
import { useUpdateUser, useDeleteUser, useUpdateUserStatus, useUser } from '@/lib/api/users'
import type { UserRole } from '@/lib/database.types'

export default function UserProfilePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const userId = searchParams.get('id')

  const { data: user, isLoading, error } = useUser(userId || undefined)
  const updateUser = useUpdateUser()
  const updateUserStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    postcode: '',
    role: 'customer' as UserRole,
  })

  useEffect(() => {
    if (!user) return
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      phone: user.phone || '',
      postcode: user.postcode || '',
      role: user.role,
    })
  }, [user])

  if (!userId) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Customer Profile" />
        <main className="flex-1 p-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            Invalid user id.
          </div>
        </main>
      </div>
    )
  }

  async function handleSave() {
    await updateUser.mutateAsync({
      userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      postcode: formData.postcode,
      role: formData.role,
    })
    setIsEditing(false)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this user account? This removes the auth user and cascades dependent data.')) {
      return
    }

    await deleteUser.mutateAsync(userId)
    navigate('/users', { replace: true })
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Customer Profile" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/users"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to load customer profile.'}
            </div>
          )}

          {isLoading || !user ? (
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    {isEditing ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={formData.firstName}
                          onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="First name"
                        />
                        <input
                          value={formData.lastName}
                          onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                          placeholder="Last name"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unknown customer'}
                      </h1>
                    )}
                    <div className="mt-4 grid gap-3 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                      <div className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email || 'No email'}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {isEditing ? (
                          <input
                            value={formData.phone}
                            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                            placeholder="Phone"
                          />
                        ) : (
                          <span>{user.phone || 'No phone'}</span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <input
                            value={formData.postcode}
                            onChange={(event) => setFormData((prev) => ({ ...prev, postcode: event.target.value }))}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                            placeholder="Postcode"
                          />
                        ) : (
                          <span>{user.postcode || 'No postcode'}</span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="capitalize">{user.account_status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 xl:w-[360px]">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={updateUser.isPending}
                          onClick={handleSave}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                          Save changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                        >
                          Edit profile
                        </button>
                        <button
                          type="button"
                          disabled={updateUserStatus.isPending}
                          onClick={() =>
                            updateUserStatus.mutate({
                              userId,
                              status: user.account_status === 'active' ? 'paused' : 'active',
                              reason: user.account_status === 'active' ? 'Paused from customer profile' : 'Restored from customer profile',
                            })
                          }
                          className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 dark:border-amber-900/60"
                        >
                          {user.account_status === 'active' ? 'Suspend account' : 'Restore account'}
                        </button>
                        <button
                          type="button"
                          disabled={updateUserStatus.isPending}
                          onClick={() =>
                            updateUserStatus.mutate({
                              userId,
                              status: 'deleted',
                              reason: 'Soft deleted from customer profile',
                            })
                          }
                          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60"
                        >
                          Anonymise / soft delete
                        </button>
                        <button
                          type="button"
                          disabled={deleteUser.isPending}
                          onClick={handleDelete}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                          Delete auth user
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-4">
                <SummaryCard label="Bookings" value={String(user.bookings_count || 0)} icon={Ticket} />
                <SummaryCard label="Total spent" value={`£${(user.total_spent || 0).toFixed(0)}`} icon={Star} />
                <SummaryCard label="Reviews given" value={String(user.reviews_given.length)} icon={Star} />
                <SummaryCard label="Support tickets" value={String(user.support_tickets.length)} icon={Shield} />
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Panel title="Booking history">
                  <SimpleTable
                    headers={['Task', 'Provider', 'Status', 'Date', 'Amount']}
                    rows={user.booking_history.map((booking) => [
                      booking.task_title,
                      booking.provider_name,
                      booking.status.replaceAll('_', ' '),
                      format(new Date(booking.scheduled_date), 'dd MMM yyyy'),
                      `£${booking.amount.toFixed(0)}`,
                    ])}
                    emptyLabel="No bookings yet."
                  />
                </Panel>

                <Panel title="Payment history">
                  <SimpleTable
                    headers={['Payment', 'Booking', 'Status', 'Created']}
                    rows={user.payment_history.map((payment) => [
                      `£${payment.amount.toFixed(0)}`,
                      `#${payment.booking_id}`,
                      payment.status,
                      format(new Date(payment.created_at), 'dd MMM yyyy'),
                    ])}
                    emptyLabel="No payments yet."
                  />
                </Panel>

                <Panel title="Reviews given">
                  <SimpleTable
                    headers={['Provider', 'Rating', 'Comment', 'Date']}
                    rows={user.reviews_given.map((review) => [
                      review.handy_name,
                      `${review.rating}/5`,
                      review.comment || 'No comment',
                      format(new Date(review.created_at), 'dd MMM yyyy'),
                    ])}
                    emptyLabel="No reviews yet."
                  />
                </Panel>

                <Panel title="Support tickets">
                  <SimpleTable
                    headers={['Subject', 'Status', 'Messages', 'Created']}
                    rows={user.support_tickets.map((ticket) => [
                      ticket.subject,
                      ticket.status,
                      String(ticket.message_count),
                      format(new Date(ticket.created_at), 'dd MMM yyyy'),
                    ])}
                    emptyLabel="No support tickets yet."
                  />
                </Panel>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Shield
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

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SimpleTable({
  headers,
  rows,
  emptyLabel,
}: {
  headers: string[]
  rows: string[][]
  emptyLabel: string
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyLabel}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="pb-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.join('-')}-${rowIndex}`} className="border-t border-slate-200 dark:border-slate-800">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="py-3 pr-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
