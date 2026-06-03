import { useState } from 'react'
import { PlusCircle, Loader2 } from 'lucide-react'
import {
  usePromoCodes,
  usePromoStats,
  useTopCodes,
  useCreatePromoCode,
  useExpirePromoCode,
  type PromoCode,
} from '@/lib/api/promotions'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function PromotionsManagementPage() {
  const [filter, setFilter] = useState<'all' | 'promotions' | 'referrals'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCode, setNewCode] = useState({ code: '', amount: '', maxUses: '', expiresAt: '' })
  const [expireTarget, setExpireTarget] = useState<PromoCode | null>(null)

  const { data: promoCodes, isLoading: codesLoading } = usePromoCodes(filter)
  const { data: stats, isLoading: statsLoading } = usePromoStats()
  const { data: topCodes, isLoading: topCodesLoading } = useTopCodes(5)

  const createPromoCode = useCreatePromoCode()
  const expirePromoCode = useExpirePromoCode()

  const handleCreateCode = async () => {
    if (!newCode.code || !newCode.amount) return

    try {
      await createPromoCode.mutateAsync({
        code: newCode.code,
        amountCents: Math.round(parseFloat(newCode.amount) * 100),
        maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : undefined,
        expiresAt: newCode.expiresAt || undefined,
      })
      setShowCreateModal(false)
      setNewCode({ code: '', amount: '', maxUses: '', expiresAt: '' })
    } catch (error) {
      console.error('Failed to create promo code:', error)
    }
  }

  const handleExpireCode = async (id: string) => {
    try {
      await expirePromoCode.mutateAsync(id)
      setExpireTarget(null)
    } catch (error) {
      console.error('Failed to expire promo code:', error)
    }
  }

  const getActions = (code: PromoCode): { label: string; action: () => void; className: string }[] => {
    const actions: { label: string; action: () => void; className: string }[] = []

    if (code.status !== 'Expired') {
      actions.push({
        label: 'Expire',
        action: () => setExpireTarget(code),
        className: 'text-red-500',
      })
    }

    return actions
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Campaign Management
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Active Campaigns</h4>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'text-primary font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}
            >
              All
            </button>
            <button
              onClick={() => setFilter('promotions')}
              className={filter === 'promotions' ? 'text-primary font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}
            >
              Promotions
            </button>
            <button
              onClick={() => setFilter('referrals')}
              className={filter === 'referrals' ? 'text-primary font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}
            >
              Referrals
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Usage/Redemptions</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codesLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Loading campaigns...</p>
                  </td>
                </tr>
              ) : promoCodes && promoCodes.length > 0 ? (
                promoCodes.map((campaign) => {
                  const actions = getActions(campaign)
                  return (
                    <tr
                      key={campaign.id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {campaign.code}
                      </td>
                      <td className="px-6 py-4">{campaign.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.statusColor === 'green'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : campaign.statusColor === 'blue'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{campaign.startDate}</td>
                      <td className="px-6 py-4">{campaign.endDate}</td>
                      <td className="px-6 py-4">{campaign.usage}</td>
                      <td className="px-6 py-4 text-right">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.action}
                            className={`${idx > 0 ? 'ml-4' : ''} ${action.className} hover:underline`}
                          >
                            {action.label}
                          </button>
                        ))}
                        {actions.length === 0 && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No promo codes found. Create your first campaign!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Overall Promotion Performance
          </h4>
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Total Discounts Given</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats?.totalDiscountsGiven || 0)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Total Referral Bonuses Paid
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats?.totalReferralBonuses || 0)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    New Customers from Promotions
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  +{stats?.newCustomersFromPromotions?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Codes
          </h4>
          {topCodesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : topCodes && topCodes.length > 0 ? (
            <div className="space-y-3">
              {topCodes.map((code, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {code.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${code.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{code.uses} uses</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No promo code usage data yet
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Promo Code
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER25"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Amount ($) *
                </label>
                <input
                  type="number"
                  value={newCode.amount}
                  onChange={(e) => setNewCode({ ...newCode, amount: e.target.value })}
                  placeholder="e.g., 10.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  value={newCode.maxUses}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                  placeholder="e.g., 100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires At (optional)
                </label>
                <input
                  type="date"
                  value={newCode.expiresAt}
                  onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCode}
                disabled={!newCode.code || !newCode.amount || createPromoCode.isPending}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createPromoCode.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}

      {expireTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Expire campaign</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Expire <span className="font-medium text-slate-900 dark:text-white">{expireTarget.code}</span>. This stops further redemptions immediately.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setExpireTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExpireCode(expireTarget.id)}
                disabled={expirePromoCode.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm expire
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
