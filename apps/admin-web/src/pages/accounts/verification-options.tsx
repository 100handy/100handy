import { useEffect, useState } from 'react'
import Header from '../../components/header'
import { ChevronRight, Loader2, X, Check, XCircle, ExternalLink, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useVerificationSettings,
  useVerificationRequests,
  useVerificationStats,
  useSaveVerificationSettings,
  useUpdateVerificationStatus,
  useVerificationDetail,
  type VerificationRequest,
  type VerificationSettings,
} from '@/lib/api/verification'
import { useAuth } from '@/contexts/AuthContext'

export default function VerificationOptions() {
  const { hasPermission } = useAuth()
  const canManageSettings = hasPermission('accounts.manage')
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'verified' | 'rejected'>('all')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [settingsDraft, setSettingsDraft] = useState<VerificationSettings | null>(null)

  const { data: verificationSettings, isLoading: settingsLoading } = useVerificationSettings()
  const { data: verificationRequests, isLoading: requestsLoading } = useVerificationRequests(filter)
  const { data: stats, isLoading: statsLoading } = useVerificationStats()
  const { data: selectedDetail, isLoading: detailLoading } = useVerificationDetail(selectedUserId || '')
  const updateStatus = useUpdateVerificationStatus()
  const saveSettings = useSaveVerificationSettings()

  useEffect(() => {
    if (verificationSettings) {
      setSettingsDraft(verificationSettings)
    }
  }, [verificationSettings])

  const isDirty = JSON.stringify(settingsDraft) !== JSON.stringify(verificationSettings)

  const toggleSetting = (key: keyof VerificationSettings) => {
    setSettingsDraft((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev))
  }

  const handleApprove = async (userId: string) => {
    try {
      await updateStatus.mutateAsync({ userId, status: 'verified' })
      setSelectedUserId(null)
    } catch (error) {
      console.error('Failed to approve:', error)
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this verification?')) return
    try {
      await updateStatus.mutateAsync({ userId, status: 'rejected' })
      setSelectedUserId(null)
    } catch (error) {
      console.error('Failed to reject:', error)
    }
  }

  const handleSaveSettings = async () => {
    if (!settingsDraft || !canManageSettings) return
    try {
      await saveSettings.mutateAsync(settingsDraft)
    } catch (error) {
      console.error('Failed to save verification settings:', error)
    }
  }

  const getActionButton = (request: VerificationRequest) => {
    switch (request.status) {
      case 'Pending Review':
      case 'Submitted':
        return { label: 'Review', className: 'text-primary' }
      case 'Verified':
        return { label: 'View', className: 'text-green-600' }
      case 'Rejected':
        return { label: 'Details', className: 'text-red-600' }
      default:
        return { label: 'View', className: 'text-primary' }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Verification Options" />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm mb-4">
            <Link className="text-slate-500 dark:text-slate-400 hover:text-primary" to="/accounts">
              Accounts
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-800 dark:text-slate-200">Account Verification Options</span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              {statsLoading ? (
                <div className="h-8 w-12 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-yellow-600">{stats?.pendingCount || 0}</p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
              {statsLoading ? (
                <div className="h-8 w-12 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-blue-600">{stats?.submittedCount || 0}</p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
              {statsLoading ? (
                <div className="h-8 w-12 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-green-600">{stats?.verifiedCount || 0}</p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              {statsLoading ? (
                <div className="h-8 w-12 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-red-600">{stats?.rejectedCount || 0}</p>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <div className="mb-4 flex items-center justify-between border-b border-slate-200/50 pb-2 dark:border-slate-800/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Verification Rules
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    These controls define which verification requirements are active across provider review flows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={!canManageSettings || !isDirty || saveSettings.isPending || !settingsDraft}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saveSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Rules
                </button>
              </div>

              {!canManageSettings && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                  Your role can review verification requests, but it cannot change verification rules.
                </div>
              )}

              <div className="bg-background-light/50 dark:bg-background-dark/50 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                {settingsLoading || !settingsDraft ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                    <VerificationRuleRow
                      title="Government ID Check"
                      description="Require a government-issued identity document before provider approval."
                      enabled={settingsDraft.governmentIdCheckEnabled}
                      disabled={!canManageSettings}
                      onToggle={() => toggleSetting('governmentIdCheckEnabled')}
                    />
                    <VerificationRuleRow
                      title="Liveness Check"
                      description="Require selfie/liveness validation alongside identity documents."
                      enabled={settingsDraft.livenessCheckEnabled}
                      disabled={!canManageSettings}
                      onToggle={() => toggleSetting('livenessCheckEnabled')}
                    />
                    <VerificationRuleRow
                      title="Profile Photo Check"
                      description="Require manual review of provider profile photos before activation."
                      enabled={settingsDraft.profilePhotoCheckEnabled}
                      disabled={!canManageSettings}
                      onToggle={() => toggleSetting('profilePhotoCheckEnabled')}
                    />
                    <VerificationRuleRow
                      title="Social Media Verification"
                      description="Allow providers to link social profiles as an additional verification signal."
                      enabled={settingsDraft.socialMediaVerificationEnabled}
                      disabled={!canManageSettings}
                      onToggle={() => toggleSetting('socialMediaVerificationEnabled')}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Verification Status Section */}
            <section>
              <div className="flex items-center justify-between mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Verification Status
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3" scope="col">
                        User
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Verification Type
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Status
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Date Submitted
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                          <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Loading verification requests...
                          </p>
                        </td>
                      </tr>
                    ) : verificationRequests && verificationRequests.length > 0 ? (
                      verificationRequests.map((item) => {
                        const action = getActionButton(item)
                        return (
                          <tr
                            key={item.userId}
                            className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                          >
                            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                              {item.userName}
                            </td>
                            <td className="px-6 py-4">{item.verificationType}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${item.statusColor}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">{item.dateSubmitted}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedUserId(item.userId)}
                                className={`font-medium ${action.className} hover:underline`}
                              >
                                {action.label}
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No verification requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Verification Details
              </h3>
              <button
                onClick={() => setSelectedUserId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : selectedDetail ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDetail.userName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedDetail.status}</p>
                    </div>
                    {selectedDetail.phone && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedDetail.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Experience</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDetail.experienceYears} years</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Hourly Rate</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${(selectedDetail.hourlyRateCents / 100).toFixed(2)}
                      </p>
                    </div>
                    {selectedDetail.submittedAt && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Submitted</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedDetail.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedDetail.bio && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Bio</p>
                      <p className="text-gray-900 dark:text-white text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {selectedDetail.bio}
                      </p>
                    </div>
                  )}

                  {selectedDetail.documentUrl && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Verification Document</p>
                      <a
                        href={selectedDetail.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Document ({selectedDetail.documentType || 'ID'})
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">User not found</p>
              )}
            </div>

            {/* Modal Footer - Actions */}
            {selectedDetail && selectedDetail.status !== 'verified' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => handleReject(selectedUserId)}
                  disabled={updateStatus.isPending}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedUserId)}
                  disabled={updateStatus.isPending}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function VerificationRuleRow({
  title,
  description,
  enabled,
  disabled,
  onToggle,
}: {
  title: string
  description: string
  enabled: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`min-w-[110px] rounded-lg px-4 py-2 text-sm font-medium transition ${
          enabled
            ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-300'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {enabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  )
}
