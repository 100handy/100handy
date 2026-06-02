import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { AlertTriangle, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useCreateReviewModerationEvent,
  useDeleteReview,
  useModerationReviews,
} from '@/lib/api/reviews'

export default function ReviewsModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [noteReason, setNoteReason] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')
  useMemo(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: reviews = [], isLoading, error } = useModerationReviews(debouncedSearch || undefined)
  const createModerationEvent = useCreateReviewModerationEvent()
  const deleteReview = useDeleteReview()
  const selectedReview = reviews.find((review) => review.id === selectedReviewId) || null

  async function handleFlag(reviewId: string) {
    const reason = window.prompt('Flag reason')
    if (!reason) return
    await createModerationEvent.mutateAsync({ reviewId, action: 'flagged', reason })
  }

  async function handleDelete(reviewId: string) {
    const reason = window.prompt('Removal reason')
    if (!reason) return
    if (!window.confirm('Remove this review?')) return
    await deleteReview.mutateAsync({ reviewId, reason })
    setSelectedReviewId(null)
  }

  async function handleNote() {
    if (!selectedReviewId || !noteReason.trim()) return
    await createModerationEvent.mutateAsync({ reviewId: selectedReviewId, action: 'noted', reason: noteReason.trim() })
    setNoteReason('')
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Reviews Moderation" />
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer review moderation</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Flag suspicious reviews, leave moderation notes, and remove abusive content.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search review, customer, provider..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Failed to load reviews.'}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900/50">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Review</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading reviews...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr
                      key={review.id}
                      className={`border-t border-slate-200 dark:border-slate-800 ${selectedReviewId === review.id ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{review.rating}/5</div>
                        <div className="max-w-md text-sm text-slate-600 dark:text-slate-300">{review.comment || 'No comment left.'}</div>
                      </td>
                      <td className="px-5 py-4">{review.customer_name}</td>
                      <td className="px-5 py-4">{review.provider_name}</td>
                      <td className="px-5 py-4">{format(new Date(review.created_at), 'dd MMM yyyy')}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setSelectedReviewId(review.id)} className="text-primary hover:underline">
                            Inspect
                          </button>
                          <button onClick={() => handleFlag(review.id)} className="text-amber-600 hover:underline">
                            Flag
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            {selectedReview ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Moderation detail</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review #{selectedReview.id}</p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{selectedReview.customer_name} → {selectedReview.provider_name}</div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedReview.comment || 'No comment left.'}</div>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {selectedReview.rating}/5
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Admin note</label>
                  <div className="flex gap-2">
                    <input
                      value={noteReason}
                      onChange={(event) => setNoteReason(event.target.value)}
                      placeholder="Leave an internal moderation note..."
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      disabled={!noteReason.trim() || createModerationEvent.isPending}
                      onClick={handleNote}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFlag(selectedReview.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 dark:border-amber-900/60"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Flag suspicious
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedReview.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove review
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <h4 className="mb-3 font-medium text-slate-900 dark:text-white">Moderation history</h4>
                  <div className="space-y-3">
                    {selectedReview.moderationEvents.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No moderation activity yet.</p>
                    ) : (
                      selectedReview.moderationEvents.map((event) => (
                        <div key={event.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
                          <div className="font-medium capitalize text-slate-900 dark:text-white">{event.action}</div>
                          <div className="mt-1 text-slate-600 dark:text-slate-300">{event.reason || 'No reason provided.'}</div>
                          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Select a review to moderate it.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
