import { useMemo, useState } from 'react'
import { Award, Check, Copy, Loader2, Save, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import { emitAdminToast } from '@/lib/admin-toast'
import {
  useHandyStarPromotionsHistory,
  useMonthlyHandyStars,
  useSavedHandyStarPromotion,
  useSaveHandyStarPromotion,
} from '@/lib/api/handys'

function getCurrentMonthValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  const date = new Date(year, monthNumber - 1, 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function HandyStarsPage() {
  const [month, setMonth] = useState(getCurrentMonthValue())
  const [copied, setCopied] = useState(false)
  const [customSummary, setCustomSummary] = useState('')
  const { data: leaderboard = [], isLoading, error } = useMonthlyHandyStars(month)
  const { data: savedPromotion } = useSavedHandyStarPromotion(month)
  const { data: promotionHistory = [] } = useHandyStarPromotionsHistory()
  const savePromotion = useSaveHandyStarPromotion()
  const winner = leaderboard[0] ?? null

  const winnerName = useMemo(() => {
    if (!winner) return ''
    return [winner.first_name, winner.last_name].filter(Boolean).join(' ') || 'Unknown provider'
  }, [winner])

  const promoCopy = useMemo(() => {
    if (!winner) return ''
    return `100 Handy Star for ${formatMonthLabel(month)}: ${winnerName}. ${winner.five_star_reviews} customer 5-star reviews this month, ${winner.total_reviews} total customer reviews, and an average rating of ${winner.average_rating.toFixed(1)}.`
  }, [winner, winnerName, month])

  const promotionSummary = customSummary.trim() || savedPromotion?.summary || promoCopy

  async function handleSavePromotion() {
    if (!winner) return

    try {
      await savePromotion.mutateAsync({
        ...winner,
        month,
        summary: promotionSummary,
        promoted_at: savedPromotion?.promoted_at || new Date().toISOString(),
        promoted_by: savedPromotion?.promoted_by || null,
      })
      emitAdminToast({
        tone: 'success',
        title: 'Promotion saved',
        description: `Saved the 100 Handy Star promotion for ${formatMonthLabel(month)}.`,
      })
      setCustomSummary('')
    } catch (saveError) {
      emitAdminToast({
        tone: 'error',
        title: 'Failed to save promotion',
        description: saveError instanceof Error ? saveError.message : 'Please try again.',
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="100 Handy Stars" />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rank providers by customer 5-star reviews for a single month and pick the one worth promoting.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Failed to load monthly star rankings.'}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.05fr,1fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Monthly winner</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formatMonthLabel(month)}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !winner ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No customer 5-star reviews found for this month.
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{winnerName}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{winner.postcode || 'No postcode'}{winner.verified ? ' • Verified provider' : ''}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricCard label="5-star reviews" value={String(winner.five_star_reviews)} />
                  <MetricCard label="Average rating" value={winner.average_rating.toFixed(1)} />
                  <MetricCard label="Completed jobs" value={String(winner.jobs_completed)} />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Promotion summary</h4>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        This is the copy you can save for the month and use across the website, app, and campaigns.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(promotionSummary)
                        setCopied(true)
                        window.setTimeout(() => setCopied(false), 2000)
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy summary'}
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={customSummary || savedPromotion?.summary || promoCopy}
                    onChange={(event) => setCustomSummary(event.target.value)}
                    className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {savedPromotion
                        ? `Saved promotion record for ${formatMonthLabel(savedPromotion.month)}.`
                        : 'No saved promotion record for this month yet.'}
                    </div>
                    <button
                      type="button"
                      onClick={handleSavePromotion}
                      disabled={savePromotion.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      {savePromotion.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {savedPromotion ? 'Update saved promotion' : 'Save monthly promotion'}
                    </button>
                  </div>
                </div>

                <Link
                  to={`/handys/${winner.user_id}`}
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Open provider profile
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Leaderboard</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ranked by customer 5-star reviews first, then average rating, total reviews, and completed jobs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">5-star reviews</th>
                    <th className="px-4 py-3">Avg rating</th>
                    <th className="px-4 py-3">All reviews</th>
                    <th className="px-4 py-3">Jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                        No ranked providers for this month.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((item, index) => (
                      <tr key={item.user_id} className="border-t border-slate-200 dark:border-slate-800">
                        <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">#{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {[item.first_name, item.last_name].filter(Boolean).join(' ') || 'Unknown provider'}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{item.postcode || 'No postcode'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {item.five_star_reviews}
                          </span>
                        </td>
                        <td className="px-4 py-4">{item.average_rating.toFixed(1)}</td>
                        <td className="px-4 py-4">{item.total_reviews}</td>
                        <td className="px-4 py-4">{item.jobs_completed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Promotion history</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Saved monthly winners. This is the stable record for who was actually promoted each month.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">5-star reviews</th>
                  <th className="px-4 py-3">Avg rating</th>
                  <th className="px-4 py-3">Jobs</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {promotionHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                      No saved promotions yet.
                    </td>
                  </tr>
                ) : (
                  promotionHistory.map((item) => (
                    <tr key={`${item.month}-${item.user_id}`} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{formatMonthLabel(item.month)}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {[item.first_name, item.last_name].filter(Boolean).join(' ') || 'Unknown provider'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.postcode || 'No postcode'}</div>
                      </td>
                      <td className="px-4 py-4">{item.five_star_reviews}</td>
                      <td className="px-4 py-4">{item.average_rating.toFixed(1)}</td>
                      <td className="px-4 py-4">{item.jobs_completed}</td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/handys/${item.user_id}`}
                          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          Open profile
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
