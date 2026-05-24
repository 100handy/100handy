import { supabase } from '@/lib/supabase'
import { adminRoleHasAnyPermission, type AdminPermission, type AdminRole } from '@/lib/admin-permissions'

type AdminProfile = {
  role: string
  admin_role: AdminRole | null
  account_status: 'active' | 'paused' | 'deleted'
}

export async function requireAdminPermissions(permissions: AdminPermission[]) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, admin_role, account_status')
    .eq('user_id', user.id)
    .single<AdminProfile>()

  if (error || !profile) {
    throw new Error('Failed to resolve admin access')
  }

  if (profile.role !== 'admin' || profile.account_status !== 'active') {
    throw new Error('Active admin access is required')
  }

  if (!adminRoleHasAnyPermission(profile.admin_role, permissions)) {
    throw new Error('You do not have permission to perform this action')
  }

  return { user, profile }
}

export async function requireAdminPermission(permission: AdminPermission) {
  return requireAdminPermissions([permission])
}
