export type AdminPermission =
  | 'dashboard.view'
  | 'handys.manage'
  | 'users.manage'
  | 'tasks.manage'
  | 'content.manage'
  | 'seo.manage'
  | 'accounts.manage'
  | 'notifications.manage'
  | 'finance.view'
  | 'insights.view'
  | 'promotions.manage'
  | 'support.view'

export type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'ops_admin'
  | 'support_admin'
  | 'finance_admin'
  | 'seo_admin'

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'dashboard.view',
    'handys.manage',
    'users.manage',
    'tasks.manage',
    'content.manage',
    'seo.manage',
    'accounts.manage',
    'notifications.manage',
    'finance.view',
    'insights.view',
    'promotions.manage',
    'support.view',
  ],
  content_admin: [
    'dashboard.view',
    'content.manage',
    'seo.manage',
    'notifications.manage',
    'promotions.manage',
  ],
  ops_admin: [
    'dashboard.view',
    'handys.manage',
    'tasks.manage',
    'support.view',
    'notifications.manage',
  ],
  support_admin: [
    'dashboard.view',
    'support.view',
    'notifications.manage',
    'accounts.manage',
  ],
  finance_admin: [
    'dashboard.view',
    'finance.view',
    'insights.view',
  ],
  seo_admin: [
    'dashboard.view',
    'content.manage',
    'seo.manage',
  ],
}

export function adminRoleHasPermission(role: AdminRole | null | undefined, permission: AdminPermission) {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function adminRoleHasAnyPermission(role: AdminRole | null | undefined, permissions: AdminPermission[]) {
  return permissions.some((permission) => adminRoleHasPermission(role, permission))
}
