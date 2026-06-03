import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'

import { requireAuthenticatedUser, jsonResponse } from '../_shared/auth.ts'

type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'ops_admin'
  | 'support_admin'
  | 'finance_admin'
  | 'seo_admin'

type AdminPermission =
  | 'audit.view'
  | 'accounts.manage'
  | 'handys.manage'
  | 'providers.manage'
  | 'users.manage'

type Operation =
  | 'get_users'
  | 'create_user'
  | 'delete_user'
  | 'bulk_delete_users'

type Payload = {
  operation?: Operation
  user_ids?: string[]
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  phone?: string
  postcode?: string
  role?: string
}

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: ['audit.view', 'accounts.manage', 'handys.manage', 'providers.manage', 'users.manage'],
  content_admin: [],
  ops_admin: ['handys.manage', 'providers.manage'],
  support_admin: ['audit.view', 'accounts.manage'],
  finance_admin: ['audit.view'],
  seo_admin: [],
}

function roleHasPermission(role: AdminRole | null | undefined, permission: AdminPermission) {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

async function requireAdminWithPermission(req: Request, permission: AdminPermission) {
  const auth = await requireAuthenticatedUser(req)
  if (auth.error) return auth

  const { user, serviceClient } = auth

  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role, admin_role, account_status')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin' || profile.account_status !== 'active') {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) }
  }

  if (!roleHasPermission(profile.admin_role as AdminRole | null, permission)) {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) }
  }

  return auth
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return jsonResponse({ ok: true })
  }

  try {
    const body = (await req.json()) as Payload
    const operation = body.operation

    if (!operation) {
      return jsonResponse({ error: 'operation is required' }, 400)
    }

    if (operation === 'get_users') {
      const auth = await requireAdminWithPermission(req, 'audit.view')
      if (auth.error) return auth.error

      const userIds = [...new Set((body.user_ids ?? []).filter(Boolean))]
      if (userIds.length === 0) {
        return jsonResponse({ users: [] })
      }

      const users = await Promise.all(
        userIds.map(async (userId) => {
          const { data, error } = await auth.serviceClient.auth.admin.getUserById(userId)
          if (error || !data.user) {
            return { id: userId, email: null }
          }
          return { id: userId, email: data.user.email ?? null }
        }),
      )

      return jsonResponse({ users })
    }

    if (operation === 'create_user') {
      const auth = await requireAdminWithPermission(req, 'users.manage')
      if (auth.error) return auth.error

      if (!body.email || !body.password || !body.first_name || !body.last_name) {
        return jsonResponse({ error: 'email, password, first_name and last_name are required' }, 400)
      }

      const role = body.role ?? 'customer'
      const { data, error } = await auth.serviceClient.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        app_metadata: { role },
        user_metadata: {
          firstName: body.first_name,
          lastName: body.last_name,
          phone: body.phone ?? null,
          postcode: body.postcode ?? null,
          role,
        },
      })

      if (error || !data.user) {
        return jsonResponse({ error: error?.message ?? 'Failed to create user' }, 400)
      }

      return jsonResponse({
        user: {
          id: data.user.id,
          email: data.user.email ?? null,
        },
      })
    }

    if (operation === 'delete_user') {
      const auth = await requireAdminWithPermission(req, 'users.manage')
      if (auth.error) return auth.error

      const userId = body.user_ids?.[0]
      if (!userId) {
        return jsonResponse({ error: 'user id is required' }, 400)
      }

      const { error } = await auth.serviceClient.auth.admin.deleteUser(userId)
      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({ success: true, deleted_user_id: userId })
    }

    if (operation === 'bulk_delete_users') {
      const auth = await requireAdminWithPermission(req, 'users.manage')
      if (auth.error) return auth.error

      const userIds = [...new Set((body.user_ids ?? []).filter(Boolean))]
      if (userIds.length === 0) {
        return jsonResponse({ error: 'user_ids is required' }, 400)
      }

      const results = await Promise.all(
        userIds.map(async (userId) => {
          const { error } = await auth.serviceClient.auth.admin.deleteUser(userId)
          return { userId, error: error?.message ?? null }
        }),
      )

      const failed = results.filter((result) => result.error)
      if (failed.length > 0) {
        return jsonResponse({ error: 'One or more deletes failed', failed }, 400)
      }

      return jsonResponse({ success: true, deleted_user_ids: userIds })
    }

    return jsonResponse({ error: 'Unsupported operation' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 500)
  }
})
