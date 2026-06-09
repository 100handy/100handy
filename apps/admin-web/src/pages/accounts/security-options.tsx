import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Loader2, Shield, ShieldCheck, UserCog } from 'lucide-react'
import Header from '@/components/header'
import { useAuth } from '@/contexts/AuthContext'
import type { AdminRole } from '@/lib/admin-permissions'
import {
  useAdminAccessUsers,
  useUpdateAccountLifecycleStatus,
  useUpdateAdminRole,
} from '@/lib/api/accounts'

const ADMIN_ROLE_OPTIONS: Array<{ value: AdminRole; label: string; description: string }> = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full platform access' },
  { value: 'content_admin', label: 'Content Admin', description: 'Pages, SEO, promos, notifications' },
  { value: 'ops_admin', label: 'Ops Admin', description: 'Tasks, handys, support operations' },
  { value: 'support_admin', label: 'Support Admin', description: 'Support queues and account controls' },
  { value: 'finance_admin', label: 'Finance Admin', description: 'Finance and insights only' },
  { value: 'seo_admin', label: 'SEO Admin', description: 'SEO and content operations' },
]

function getUserName(firstName: string | null, lastName: string | null) {
  const parts = [firstName, lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown Admin'
}

export default function SecurityOptions() {
  const { user, hasPermission } = useAuth()
  const canManageAccounts = hasPermission('accounts.manage')
  const { data: admins, isLoading, error } = useAdminAccessUsers()
  const updateAdminRole = useUpdateAdminRole()
  const updateAccountStatus = useUpdateAccountLifecycleStatus()
  const [reasonDrafts, setReasonDrafts] = useState<Record<string, string>>({})
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const summary = useMemo(() => {
    const rows = admins ?? []
    return {
      total: rows.length,
      active: rows.filter((row) => row.account_status === 'active').length,
      paused: rows.filter((row) => row.account_status === 'paused').length,
      deleted: rows.filter((row) => row.account_status === 'deleted').length,
    }
  }, [admins])

  const getReasonError = (status: 'paused' | 'deleted', userId: string, existingReason: string | null) => {
    const reason = (reasonDrafts[userId] ?? existingReason ?? '').trim()
    if ((status === 'paused' || status === 'deleted') && !reason) {
      return 'Reason required'
    }
    return null
  }

  const handleRoleChange = async (userId: string, adminRole: AdminRole) => {
    try {
      await updateAdminRole.mutateAsync({ userId, adminRole })
      const label = ADMIN_ROLE_OPTIONS.find((option) => option.value === adminRole)?.label ?? adminRole
      setActionFeedback({
        tone: 'success',
        message: `Admin scope updated to ${label}.`,
      })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to update admin role.',
      })
    }
  }

  const handleAccountStatusChange = async (
    userId: string,
    status: 'active' | 'paused' | 'deleted',
    reason: string | null | undefined,
    userName: string,
  ) => {
    try {
      await updateAccountStatus.mutateAsync({ userId, status, reason })
      const label =
        status === 'active'
          ? 'restored'
          : status === 'paused'
            ? 'paused'
            : 'soft-deleted'
      setActionFeedback({
        tone: 'success',
        message: `${userName} was ${label} successfully.`,
      })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to update admin access.',
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Admin Access" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {actionFeedback && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                actionFeedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
              }`}
            >
              {actionFeedback.message}
            </div>
          )}
          {!canManageAccounts && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view access controls, but it cannot change admin roles or account lifecycle state.
            </div>
          )}
          <div className="mb-4 flex items-center text-sm">
            <Link className="text-slate-500 hover:text-primary dark:text-slate-400" to="/accounts">
              Accounts
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-800 dark:text-slate-200">Admin Access</span>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <SummaryCard title="Admin Profiles" value={summary.total} icon={UserCog} />
            <SummaryCard title="Active" value={summary.active} icon={ShieldCheck} />
            <SummaryCard title="Paused" value={summary.paused} icon={Shield} />
            <SummaryCard title="Deleted" value={summary.deleted} icon={Shield} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900/50">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scoped admin access</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This panel manages permission scope for existing admin profiles. User creation still controls who is an admin at the account level.
              </p>
            </div>

            {error && (
              <div className="border-b border-slate-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-slate-800 dark:bg-red-900/20 dark:text-red-300">
                {error instanceof Error ? error.message : 'Failed to load admin access data.'}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Admin</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Scope</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : !admins || admins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        No admin profiles found.
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => {
                      const isSelf = admin.user_id === user?.id
                      return (
                        <tr key={admin.user_id} className="border-b border-slate-200 bg-white align-top last:border-0 dark:border-slate-800 dark:bg-gray-900/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {getUserName(admin.first_name, admin.last_name)}
                            </div>
                            {isSelf && (
                              <div className="mt-1 text-xs font-medium text-primary">Current session</div>
                            )}
                          </td>
                          <td className="px-6 py-4">{admin.email || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={admin.admin_role ?? 'super_admin'}
                              disabled={isSelf || updateAdminRole.isPending || !canManageAccounts}
                              onChange={(event) => handleRoleChange(admin.user_id, event.target.value as AdminRole)}
                              className="w-full min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                            >
                              {ADMIN_ROLE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              {ADMIN_ROLE_OPTIONS.find((option) => option.value === (admin.admin_role ?? 'super_admin'))?.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {admin.account_status}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-[260px]">
                            <input
                              value={reasonDrafts[admin.user_id] ?? admin.status_reason ?? ''}
                              onChange={(event) =>
                                setReasonDrafts((prev) => ({
                                  ...prev,
                                  [admin.user_id]: event.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                              placeholder="Reason for pause/delete"
                              disabled={isSelf || !canManageAccounts}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              {admin.account_status !== 'active' && (
                                <button
                                  type="button"
                                  disabled={isSelf || updateAccountStatus.isPending || !canManageAccounts}
                                  onClick={() =>
                                    handleAccountStatusChange(
                                      admin.user_id,
                                      'active',
                                      reasonDrafts[admin.user_id] ?? admin.status_reason,
                                      getUserName(admin.first_name, admin.last_name),
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50 dark:border-slate-700"
                                >
                                  Restore access
                                </button>
                              )}
                              {admin.account_status !== 'paused' && (
                                <button
                                  type="button"
                                  disabled={isSelf || updateAccountStatus.isPending || !canManageAccounts || !!getReasonError('paused', admin.user_id, admin.status_reason)}
                                  onClick={() =>
                                    handleAccountStatusChange(
                                      admin.user_id,
                                      'paused',
                                      reasonDrafts[admin.user_id] ?? admin.status_reason,
                                      getUserName(admin.first_name, admin.last_name),
                                    )
                                  }
                                  className="rounded-lg border border-amber-200 px-3 py-2 text-left text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900/60 dark:hover:bg-amber-950/20"
                                >
                                  Pause access
                                </button>
                              )}
                              {admin.account_status !== 'deleted' && (
                                <button
                                  type="button"
                                  disabled={isSelf || updateAccountStatus.isPending || !canManageAccounts || !!getReasonError('deleted', admin.user_id, admin.status_reason)}
                                  onClick={() =>
                                    handleAccountStatusChange(
                                      admin.user_id,
                                      'deleted',
                                      reasonDrafts[admin.user_id] ?? admin.status_reason,
                                      getUserName(admin.first_name, admin.last_name),
                                    )
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:hover:bg-red-950/20"
                                >
                                  Soft delete access
                                </button>
                              )}
                              {admin.account_status !== 'active' ? null : getReasonError('paused', admin.user_id, admin.status_reason) ? (
                                <div className="text-xs text-red-600 dark:text-red-400">Reason required to pause or delete access.</div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: typeof Shield
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
