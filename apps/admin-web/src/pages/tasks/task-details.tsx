import { useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { Calendar, CreditCard, Loader2, Pencil, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '@/components/header'
import { useAvailableHandys } from '@/lib/api/handys'
import { useCategories } from '@/lib/api/categories'
import { useRefundPayment } from '@/lib/api/finance'
import { statusDisplayMap, useCancelTask, useRescheduleTask, useTaskManagementDetails, useUpdateTask } from '@/lib/api/tasks'
import type { BookingStatus } from '@/lib/database.types'

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { data: task, isLoading, error } = useTaskManagementDetails(taskId)
  const { data: handys = [] } = useAvailableHandys()
  const { data: categories = [] } = useCategories()
  const updateTask = useUpdateTask()
  const rescheduleTask = useRescheduleTask()
  const cancelTask = useCancelTask()
  const refundPayment = useRefundPayment()

  const [selectedHandy, setSelectedHandy] = useState<string>('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [editForm, setEditForm] = useState({
    task_title: '',
    task_details: '',
    category_id: '',
    status: 'pending' as BookingStatus,
    scheduled_date: '',
    scheduled_time: '',
    handy_id: '',
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Booking Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Booking Details" />
        <main className="flex-1 p-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Booking not found.'}
          </div>
        </main>
      </div>
    )
  }

  function openEditModal() {
    if (!task) return
    setEditForm({
      task_title: task.task_title || '',
      task_details: task.task_details || '',
      category_id: task.category_id || '',
      status: task.status,
      scheduled_date: task.scheduled_date || '',
      scheduled_time: task.scheduled_time || '',
      handy_id: task.handy?.user_id || '',
    })
    setShowEditModal(true)
  }

  async function handleSaveEdit() {
    if (!task) return
    setActionFeedback(null)
    try {
      await updateTask.mutateAsync({
        taskId: String(task.id),
        task_title: editForm.task_title,
        task_details: editForm.task_details || undefined,
        category_id: editForm.category_id || undefined,
        status: editForm.status,
        scheduled_date: editForm.scheduled_date,
        scheduled_time: editForm.scheduled_time,
        handy_id: editForm.handy_id || undefined,
      })
      setShowEditModal(false)
      setActionFeedback({ tone: 'success', message: 'Booking updated.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to update booking.' })
    }
  }

  async function handleReassign() {
    if (!task) return
    if (!selectedHandy) return
    setActionFeedback(null)
    try {
      await updateTask.mutateAsync({ taskId: String(task.id), handy_id: selectedHandy, status: task.status === 'pending' ? 'accepted' : task.status })
      setSelectedHandy('')
      setActionFeedback({ tone: 'success', message: 'Provider reassigned.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to reassign provider.' })
    }
  }

  async function handleReschedule() {
    if (!task) return
    if (!rescheduleDate || !rescheduleTime) return
    setActionFeedback(null)
    try {
      await rescheduleTask.mutateAsync({
        taskId: String(task.id),
        scheduled_date: rescheduleDate,
        scheduled_time: rescheduleTime,
        handy_id: task.handy?.user_id || undefined,
      })
      setRescheduleDate('')
      setRescheduleTime('')
      setActionFeedback({ tone: 'success', message: 'Booking rescheduled.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to reschedule booking.' })
    }
  }

  async function handleCancel() {
    if (!task) return
    setActionFeedback(null)
    try {
      await cancelTask.mutateAsync(String(task.id))
      setShowCancelModal(false)
      setActionFeedback({ tone: 'success', message: 'Booking cancelled.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to cancel booking.' })
    }
  }

  async function handleRefund() {
    if (!task) return
    if (!task.payment) return
    if (!refundReason.trim()) return
    setActionFeedback(null)
    try {
      await refundPayment.mutateAsync({ paymentId: task.payment.id, reason: refundReason.trim() })
      setRefundReason('')
      setShowRefundModal(false)
      setActionFeedback({ tone: 'success', message: 'Refund completed.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to refund payment.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Booking #${String(task.id).slice(0, 8)}`} />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {actionFeedback && (
            <div className={`rounded-xl px-4 py-3 text-sm ${
              actionFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300'
                : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300'
            }`}>
              {actionFeedback.message}
            </div>
          )}
          <div>
            <Link to="/tasks/list" className="text-sm text-primary hover:underline">
              ← Back to bookings
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage booking details, provider assignment, schedule changes, and payment actions from one screen.
            </p>
          </div>

          <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <Panel title="Booking details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Info label="Task" value={task.task_title} />
                  <Info label="Category" value={task.category?.name || 'Uncategorised'} />
                  <Info label="Status" value={task.status.replaceAll('_', ' ')} />
                  <Info label="Scheduled" value={`${task.scheduled_date} ${task.scheduled_time}`} />
                  <Info label="Customer" value={`${task.customer?.first_name || ''} ${task.customer?.last_name || ''}`.trim() || 'Unknown customer'} />
                  <Info label="Provider" value={`${task.handy?.first_name || ''} ${task.handy?.last_name || ''}`.trim() || 'Unassigned'} />
                  <Info label="Address" value={task.address ? `${task.address.street}, ${task.address.city || ''} ${task.address.postcode}`.trim() : 'No address'} />
                  <Info label="Value" value={`£${((task.hourly_rate_cents * task.estimated_hours) / 100).toFixed(2)}`} />
                </div>
                {task.task_details ? (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</div>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{task.task_details}</p>
                  </div>
                ) : null}
              </Panel>

              <Panel title="Timeline">
                <div className="space-y-4">
                  {task.timeline.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{item.label}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{item.detail}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel title="Booking actions">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Reassign provider</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedHandy}
                        onChange={(event) => setSelectedHandy(event.target.value)}
                        className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="">Select provider</option>
                        {handys.map((handy) => (
                          <option key={handy.user_id} value={handy.user_id}>
                            {handy.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!selectedHandy || updateTask.isPending}
                        onClick={handleReassign}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Reschedule</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(event) => setRescheduleDate(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(event) => setRescheduleTime(event.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!rescheduleDate || !rescheduleTime || rescheduleTask.isPending}
                      onClick={handleReschedule}
                      className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                    >
                      <Calendar className="h-4 w-4" />
                      Update schedule
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={openEditModal}
                      disabled={updateTask.isPending}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700 disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit booking
                    </button>
                    <button
                      type="button"
                      disabled={cancelTask.isPending || task.status === 'cancelled'}
                      onClick={() => setShowCancelModal(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50 dark:border-red-900/60"
                    >
                      <X className="h-4 w-4" />
                      Cancel booking
                    </button>
                  </div>
                </div>
              </Panel>

              <Panel title="Payment & review">
                {task.payment ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Payment</span>
                      <span className="font-medium text-slate-900 dark:text-white">£{task.payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Status</span>
                      <span className="font-medium text-slate-900 dark:text-white">{task.payment.status}</span>
                    </div>
                    <button
                      type="button"
                      disabled={refundPayment.isPending || task.payment.status !== 'paid'}
                      onClick={() => setShowRefundModal(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50 dark:border-red-900/60"
                    >
                      <CreditCard className="h-4 w-4" />
                      Issue refund
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No payment record linked yet.</p>
                )}

                <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                  {task.review ? (
                    <div className="space-y-2 text-sm">
                      <div className="font-medium text-slate-900 dark:text-white">
                        Review: {task.review.rating}/5
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">{task.review.comment || 'No review comment.'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(task.review.created_at), 'dd MMM yyyy')}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No review submitted.</p>
                  )}
                </div>
              </Panel>
            </div>
          </section>
        </div>
      </main>

      {showEditModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Edit booking</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Task title">
                <input value={editForm.task_title} onChange={(e) => setEditForm((prev) => ({ ...prev, task_title: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </Field>
              <Field label="Category">
                <select value={editForm.category_id} onChange={(e) => setEditForm((prev) => ({ ...prev, category_id: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select value={editForm.status} onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as BookingStatus }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  {Object.entries(statusDisplayMap).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Assigned provider">
                <select value={editForm.handy_id} onChange={(e) => setEditForm((prev) => ({ ...prev, handy_id: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">Unassigned</option>
                  {handys.map((handy) => (
                    <option key={handy.user_id} value={handy.user_id}>{handy.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Scheduled date">
                <input type="date" value={editForm.scheduled_date} onChange={(e) => setEditForm((prev) => ({ ...prev, scheduled_date: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </Field>
              <Field label="Scheduled time">
                <input type="time" value={editForm.scheduled_time} onChange={(e) => setEditForm((prev) => ({ ...prev, scheduled_time: e.target.value }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea value={editForm.task_details} onChange={(e) => setEditForm((prev) => ({ ...prev, task_details: e.target.value }))} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button type="button" onClick={handleSaveEdit} disabled={updateTask.isPending || !editForm.task_title.trim() || !editForm.scheduled_date || !editForm.scheduled_time} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCancelModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cancel booking</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Cancel <span className="font-medium text-slate-900 dark:text-white">{task.task_title}</span>. This action will update the booking immediately.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelTask.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showRefundModal && task.payment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Issue refund</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Refund payment for <span className="font-medium text-slate-900 dark:text-white">{task.task_title}</span>. A reason is required for the audit trail.
            </p>
            <textarea
              value={refundReason}
              onChange={(event) => setRefundReason(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Refund reason..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false)
                  setRefundReason('')
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefund}
                disabled={!refundReason.trim() || refundPayment.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm refund
              </button>
            </div>
          </div>
        </div>
      ) : null}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  )
}
