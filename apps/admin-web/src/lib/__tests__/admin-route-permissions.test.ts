import { describe, expect, it } from 'vitest'
import { ADMIN_ROUTE_PERMISSIONS, ADMIN_ROUTE_SMOKE_TEST_PATHS } from '@/lib/admin-route-permissions'
import { ROLE_PERMISSIONS, type AdminPermission } from '@/lib/admin-permissions'

const allPermissions = new Set<AdminPermission>(Object.values(ROLE_PERMISSIONS).flat())

describe('admin route permission matrix', () => {
  it('assigns known permissions to every admin route entry', () => {
    for (const [key, entry] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
      expect(entry.path, `${key} is missing a route path`).toMatch(/^\//)
      expect(entry.permissions.length, `${entry.path} has no permissions`).toBeGreaterThan(0)
      expect(entry.section, `${entry.path} is missing a section`).toBeTruthy()

      for (const permission of entry.permissions) {
        expect(allPermissions.has(permission), `${entry.path} references unknown permission ${permission}`).toBe(true)
      }
    }
  })

  it('keeps smoke-test paths unique and backed by a matrix entry', () => {
    expect(ADMIN_ROUTE_SMOKE_TEST_PATHS.length).toBeGreaterThan(40)
    expect(new Set(ADMIN_ROUTE_SMOKE_TEST_PATHS).size).toBe(ADMIN_ROUTE_SMOKE_TEST_PATHS.length)

    for (const path of ADMIN_ROUTE_SMOKE_TEST_PATHS) {
      expect(
        Object.values(ADMIN_ROUTE_PERMISSIONS).some((entry) => entry.smokeTestPath === path),
        `${path} is not backed by a permission matrix entry`,
      ).toBe(true)
    }
  })

  it('documents formerly unguarded redirect routes with their section permissions', () => {
    expect(ADMIN_ROUTE_PERMISSIONS.userAddRedirect.permissions).toEqual(['users.manage'])
    expect(ADMIN_ROUTE_PERMISSIONS.userRemoveRedirect.permissions).toEqual(['users.manage'])
    expect(ADMIN_ROUTE_PERMISSIONS.taskRescheduleRedirect.permissions).toEqual(['tasks.manage'])
    expect(ADMIN_ROUTE_PERMISSIONS.taskCancelRedirect.permissions).toEqual(['tasks.manage'])
    expect(ADMIN_ROUTE_PERMISSIONS.accountsLocationRedirect.permissions).toEqual(['locations.manage'])
  })
})
