export type AdminPermission =
  | 'dashboard.view'
  | 'audit.view'
  | 'handys.manage'
  | 'providers.manage'
  | 'users.manage'
  | 'tasks.manage'
  | 'disputes.manage'
  | 'locations.manage'
  | 'outreach.manage'
  | 'content.manage'
  | 'seo.manage'
  | 'accounts.manage'
  | 'notifications.manage'
  | 'finance.view'
  | 'finance.manage'
  | 'insights.view'
  | 'reports.view'
  | 'promotions.manage'
  | 'support.view'
  | 'support.manage'

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
    'audit.view',
    'handys.manage',
    'providers.manage',
    'users.manage',
    'tasks.manage',
    'disputes.manage',
    'locations.manage',
    'outreach.manage',
    'content.manage',
    'seo.manage',
    'accounts.manage',
    'notifications.manage',
    'finance.view',
    'finance.manage',
    'insights.view',
    'reports.view',
    'promotions.manage',
    'support.view',
    'support.manage',
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
    'audit.view',
    'handys.manage',
    'providers.manage',
    'tasks.manage',
    'disputes.manage',
    'locations.manage',
    'outreach.manage',
    'support.view',
    'support.manage',
    'notifications.manage',
  ],
  support_admin: [
    'dashboard.view',
    'audit.view',
    'support.view',
    'support.manage',
    'disputes.manage',
    'notifications.manage',
    'accounts.manage',
  ],
  finance_admin: [
    'dashboard.view',
    'audit.view',
    'finance.view',
    'finance.manage',
    'insights.view',
    'reports.view',
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

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  content_admin: 'Content Admin',
  ops_admin: 'Operations Admin',
  support_admin: 'Support Agent',
  finance_admin: 'Finance Admin',
  seo_admin: 'SEO Admin',
}
