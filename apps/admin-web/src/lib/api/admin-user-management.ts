import { supabase } from '@/lib/supabase'

export interface AdminAuthUserSummary {
  id: string
  email: string | null
}

async function invokeAdminUserManagement<T>(payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('admin-user-management', {
    body: payload,
  })

  if (error) {
    throw error
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data as T
}

export async function fetchAdminAuthUsersByIds(userIds: string[]) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))]
  if (uniqueIds.length === 0) {
    return new Map<string, string>()
  }

  const data = await invokeAdminUserManagement<{ users: AdminAuthUserSummary[] }>({
    operation: 'get_users',
    user_ids: uniqueIds,
  })

  return new Map(
    (data.users ?? [])
      .filter((user) => user.email)
      .map((user) => [user.id, user.email as string]),
  )
}

export async function createAdminAuthUser(input: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  postcode?: string
  role?: string
}) {
  const data = await invokeAdminUserManagement<{ user: AdminAuthUserSummary }>({
    operation: 'create_user',
    ...input,
  })

  return data.user
}

export async function deleteAdminAuthUser(userId: string) {
  return invokeAdminUserManagement<{ success: true; deleted_user_id: string }>({
    operation: 'delete_user',
    user_ids: [userId],
  })
}

export async function bulkDeleteAdminAuthUsers(userIds: string[]) {
  return invokeAdminUserManagement<{ success: true; deleted_user_ids: string[] }>({
    operation: 'bulk_delete_users',
    user_ids: userIds,
  })
}
