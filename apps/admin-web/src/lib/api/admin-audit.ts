import { useQuery } from '@tanstack/react-query'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database, Json } from '@/lib/database.types'

type AdminAuditRow = Database['public']['Tables']['admin_audit_logs']['Row']

export interface AdminAuditLogEntry extends AdminAuditRow {
  actor_name: string
  actor_email?: string
}

export interface CreateAdminAuditLogInput {
  action: string
  entityType: string
  entityId?: string | null
  summary: string
  metadata?: Json
}

export interface AdminAuditLogFilters {
  entityType?: string
  actorId?: string
  search?: string
  limit?: number
}

export async function createAdminAuditLog(input: CreateAdminAuditLogInput) {
  const { user, profile } = await requireActiveAdmin()

  const { error } = await supabase.from('admin_audit_logs').insert({
    actor_id: user.id,
    actor_admin_role: profile.admin_role,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    summary: input.summary,
    metadata_json: input.metadata ?? {},
  })

  if (error) {
    throw error
  }
}

export function useAdminAuditLogs(filters: AdminAuditLogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: async (): Promise<AdminAuditLogEntry[]> => {
      await requireAdminPermission('audit.view')

      let query = supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType)
      }

      if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error

      const rows = data ?? []
      if (rows.length === 0) {
        return []
      }

      const actorIds = [...new Set(rows.map((row) => row.actor_id))]

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', actorIds)

      if (profileError) throw profileError

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [
          profile.user_id,
          `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Admin',
        ]),
      )

      const emailMap = new Map<string, string>()
      for (const actorId of actorIds) {
        try {
          const { data: authData } = await supabase.auth.admin.getUserById(actorId)
          if (authData?.user?.email) {
            emailMap.set(actorId, authData.user.email)
          }
        } catch {
          // Email is a non-critical enhancement for the audit stream.
        }
      }

      return rows
        .map((row) => ({
          ...row,
          actor_name: profileMap.get(row.actor_id) ?? 'Unknown Admin',
          actor_email: emailMap.get(row.actor_id),
        }))
        .filter((row) => {
          if (!filters.search) return true
          const searchValue = filters.search.toLowerCase()
          return (
            row.summary.toLowerCase().includes(searchValue) ||
            row.action.toLowerCase().includes(searchValue) ||
            row.entity_type.toLowerCase().includes(searchValue) ||
            row.actor_name.toLowerCase().includes(searchValue) ||
            row.actor_email?.toLowerCase().includes(searchValue) === true
          )
        })
    },
    staleTime: 30 * 1000,
  })
}
