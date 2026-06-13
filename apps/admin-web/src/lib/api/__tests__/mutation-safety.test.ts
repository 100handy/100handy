import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpdateAccountLifecycleStatus } from '@/lib/api/accounts'
import { useBulkUpdateCategories, useCreateCategory } from '@/lib/api/categories'
import { useRefundPayment } from '@/lib/api/finance'
import { useSavePaymentMethodConfig } from '@/lib/api/finance-config'
import { useSaveServiceArea } from '@/lib/api/locations'
import { useCreateOutreachLead } from '@/lib/api/outreach'
import { useProcessAdminPayout } from '@/lib/api/payouts'
import { useDeleteReview } from '@/lib/api/reviews'
import { usePublishPageDraft } from '@/lib/api/site-content'
import { useUpdateTicketStatus } from '@/lib/api/support'
import { useSaveVerificationSettings, useUpdateVerificationStatus } from '@/lib/api/verification'

type MutationConfig<TInput, TResult = unknown> = {
  mutationFn: (input: TInput) => Promise<TResult>
  onSuccess?: (data: TResult, variables: TInput) => void
}

const mocks = vi.hoisted(() => ({
  createAdminAuditLog: vi.fn(),
  from: vi.fn(),
  functionsInvoke: vi.fn(),
  invalidateQueries: vi.fn(),
  requireActiveAdmin: vi.fn(),
  requireAdminPermission: vi.fn(),
  requireAdminPermissions: vi.fn(),
  useMutation: vi.fn((config: unknown) => config),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: mocks.useMutation,
  useQuery: vi.fn((config: unknown) => config),
  useQueryClient: () => ({
    invalidateQueries: mocks.invalidateQueries,
  }),
}))

vi.mock('@/lib/api/admin-auth', () => ({
  requireActiveAdmin: mocks.requireActiveAdmin,
  requireAdminPermission: mocks.requireAdminPermission,
  requireAdminPermissions: mocks.requireAdminPermissions,
}))

vi.mock('@/lib/api/admin-audit', () => ({
  createAdminAuditLog: mocks.createAdminAuditLog,
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mocks.from,
    functions: {
      invoke: mocks.functionsInvoke,
    },
  },
}))

describe('admin mutation safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.requireActiveAdmin.mockResolvedValue({ user: { id: 'admin-1' }, profile: { admin_role: 'super_admin' } })
    mocks.requireAdminPermission.mockResolvedValue({ user: { id: 'admin-1' } })
    mocks.requireAdminPermissions.mockResolvedValue({ user: { id: 'admin-1' } })
  })

  it('validates category bulk updates before checking permissions or writing', async () => {
    const mutation = useBulkUpdateCategories() as unknown as MutationConfig<{
      categoryIds: string[]
      updates: { active?: boolean }
    }>

    await expect(mutation.mutationFn({ categoryIds: [], updates: { active: false } })).rejects.toThrow(
      'Select at least one category',
    )

    expect(mocks.requireAdminPermission).not.toHaveBeenCalled()
    expect(mocks.from).not.toHaveBeenCalled()
    expect(mocks.createAdminAuditLog).not.toHaveBeenCalled()
  })

  it('creates categories only after permission, writes an audit log, and invalidates category cache', async () => {
    const insert = vi.fn((payload: Record<string, unknown>) => ({
      select: () => ({
        single: async () => ({ data: { id: 'cat-1', name: payload.name }, error: null }),
      }),
    }))
    mocks.from.mockReturnValue({ insert })

    const mutation = useCreateCategory() as unknown as MutationConfig<{
      name: string
      active?: boolean
    }, { id: string; name: string }>

    const result = await mutation.mutationFn({ name: 'Furniture Assembly' })
    mutation.onSuccess?.(result, { name: 'Furniture Assembly' })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('tasks.manage')
    expect(mocks.from).toHaveBeenCalledWith('categories')
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ name: 'Furniture Assembly', active: true }))
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'category.create',
        entityType: 'category',
        entityId: 'cat-1',
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['categories'] })
  })

  it('stops payment refunds before invoking edge functions when the payment is missing', async () => {
    mocks.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
    })

    const mutation = useRefundPayment() as unknown as MutationConfig<{ paymentId: string; reason: string }>

    await expect(mutation.mutationFn({ paymentId: 'pay_missing', reason: 'Customer request' })).rejects.toThrow(
      'Payment not found.',
    )

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('finance.manage')
    expect(mocks.functionsInvoke).not.toHaveBeenCalled()
    expect(mocks.createAdminAuditLog).not.toHaveBeenCalled()
  })

  it('refunds payments through the edge function, audits the result, and refreshes dependent caches', async () => {
    mocks.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              id: 'pay_1',
              booking_id: 'booking_1',
              amount_cents: 12500,
              status: 'paid',
            },
            error: null,
          }),
        }),
      }),
    })
    mocks.functionsInvoke.mockResolvedValue({ data: { refundId: 'refund_1' }, error: null })

    const mutation = useRefundPayment() as unknown as MutationConfig<
      { paymentId: string; reason: string },
      { id: string; refundId: string | null }
    >

    const result = await mutation.mutationFn({ paymentId: 'pay_1', reason: 'Customer request' })
    mutation.onSuccess?.(result, { paymentId: 'pay_1', reason: 'Customer request' })

    expect(mocks.functionsInvoke).toHaveBeenCalledWith('refund-payment', {
      body: {
        bookingId: 'booking_1',
        reason: 'Customer request',
      },
    })
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'payment.refund',
        entityType: 'payment',
        entityId: 'pay_1',
        metadata: expect.objectContaining({
          refundId: 'refund_1',
          amountCents: 12500,
        }),
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['finance'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] })
  })

  it('stamps outreach leads with the active admin, audits the mutation, and invalidates outreach data', async () => {
    const insert = vi.fn((payload: Record<string, unknown>) => ({
      select: () => ({
        single: async () => ({
          data: {
            id: 'lead_1',
            profile_name: 'Jane Lead',
            business_name: null,
            lead_type: payload.lead_type,
            source_platform: payload.source_platform,
            service_type: payload.service_type,
            approval_status: payload.approval_status,
          },
          error: null,
        }),
      }),
    }))
    mocks.from.mockReturnValue({ insert })

    const mutation = useCreateOutreachLead() as unknown as MutationConfig<
      {
        lead_type: 'customer'
        source_platform: string
        service_type: string
        raw_text: string
        approval_status: 'pending'
      },
      { id: string }
    >

    const result = await mutation.mutationFn({
      lead_type: 'customer',
      source_platform: 'Facebook',
      service_type: 'Handyman',
      raw_text: 'Needs a repair',
      approval_status: 'pending',
    })
    mutation.onSuccess?.(result, {
      lead_type: 'customer',
      source_platform: 'Facebook',
      service_type: 'Handyman',
      raw_text: 'Needs a repair',
      approval_status: 'pending',
    })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('outreach.manage')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        created_by: 'admin-1',
        updated_by: 'admin-1',
      }),
    )
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'outreach.lead.create',
        entityType: 'outreach_lead',
        entityId: 'lead_1',
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['outreach'] })
  })

  it('publishes a page draft only after permissions, audits the publish, and refreshes page queries', async () => {
    const fromMock = vi.fn((table: string) => {
      if (table === 'page_content_revisions') {
        return {
          select: () => ({
            eq: (_column: string, value: string) => {
              if (value === 'home') {
                return {
                  eq: () => ({
                    order: () => ({
                      limit: () => ({
                        maybeSingle: async () => ({
                          data: {
                            id: 'rev_1',
                            page_json: {
                              title: 'Home',
                              slug: '/home',
                              template_key: 'standard',
                              status: 'published',
                            },
                            seo_json: {
                              meta_title: 'Home',
                              meta_description: '',
                              og_title: '',
                              og_description: '',
                              og_image_url: '',
                              twitter_title: '',
                              twitter_description: '',
                              twitter_image_url: '',
                              canonical_url: '',
                              robots_index: true,
                              robots_follow: true,
                            },
                            content_json: {
                              'hero.title': {
                                section_key: 'hero',
                                field_key: 'title',
                                content_type: 'text',
                                value: 'Book help fast',
                              },
                            },
                          },
                          error: null,
                        }),
                      }),
                    }),
                  }),
                }
              }

              return {
                eq: () => ({
                  update: async () => ({ error: null }),
                }),
              }
            },
          }),
          update: vi.fn(() => ({
            eq: async () => ({ error: null }),
          })),
        }
      }

      if (table === 'site_pages' || table === 'seo_metadata' || table === 'site_content') {
        return {
          upsert: async () => ({ error: null }),
          delete: () => ({
            eq: () => ({
              eq: async () => ({ error: null }),
            }),
          }),
          select: () => ({
            eq: async () => ({ data: [], error: null }),
          }),
        }
      }

      throw new Error(`Unexpected table ${table}`)
    })

    mocks.from.mockImplementation(fromMock)

    const mutation = usePublishPageDraft() as unknown as MutationConfig<string, void>

    await mutation.mutationFn('home')
    mutation.onSuccess?.(undefined, 'home')

    expect(mocks.requireAdminPermissions).toHaveBeenCalledWith(['content.manage', 'seo.manage'])
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'page.publish',
        entityType: 'page',
        entityId: 'home',
        metadata: expect.objectContaining({
          revisionId: 'rev_1',
          publishedBy: 'admin-1',
        }),
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'site-content', 'home'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'site-pages', 'home'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'page-revisions', 'home'] })
  })

  it('updates support ticket status only after support management permission, audits the change, and refreshes ticket queries', async () => {
    const eq = vi.fn(async () => ({ error: null }))
    const update = vi.fn(() => ({ eq }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'support_tickets') {
        return { update }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useUpdateTicketStatus() as unknown as MutationConfig<{
      ticketId: string
      status?: 'open' | 'in_progress' | 'resolved' | 'closed'
      assignedTo?: string | null
    }>

    await mutation.mutationFn({ ticketId: 'ticket_1', status: 'resolved', assignedTo: 'admin-1' })
    mutation.onSuccess?.(undefined, { ticketId: 'ticket_1', status: 'resolved', assignedTo: 'admin-1' })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('support.manage')
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'resolved',
        assigned_to: 'admin-1',
        updated_at: expect.any(String),
      }),
    )
    expect(eq).toHaveBeenCalledWith('id', 'ticket_1')
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'support.status.update',
        entityType: 'support_ticket',
        entityId: 'ticket_1',
        metadata: {
          status: 'resolved',
          assignedTo: 'admin-1',
        },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'support-tickets'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'support-ticket', 'ticket_1'] })
  })

  it('deletes reviews only after support management permission, records moderation, and refreshes moderation queries', async () => {
    const moderationInsert = vi.fn(async () => ({ error: null }))
    const reviewDeleteEq = vi.fn(async () => ({ error: null }))
    const reviewDelete = vi.fn(() => ({ eq: reviewDeleteEq }))

    mocks.from.mockImplementation((table: string) => {
      if (table === 'review_moderation_events') {
        return { insert: moderationInsert }
      }
      if (table === 'reviews') {
        return { delete: reviewDelete }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useDeleteReview() as unknown as MutationConfig<{ reviewId: string; reason: string }>

    await mutation.mutationFn({ reviewId: 'review_1', reason: 'Abusive content' })
    mutation.onSuccess?.(undefined, { reviewId: 'review_1', reason: 'Abusive content' })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('support.manage')
    expect(mocks.requireActiveAdmin).toHaveBeenCalled()
    expect(moderationInsert).toHaveBeenCalledWith({
      review_id: 'review_1',
      admin_id: 'admin-1',
      action: 'removed',
      reason: 'Abusive content',
    })
    expect(reviewDeleteEq).toHaveBeenCalledWith('id', 'review_1')
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'review.delete',
        entityType: 'review',
        entityId: 'review_1',
        metadata: { reason: 'Abusive content' },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['reviews', 'moderation'] })
  })

  it('updates account lifecycle only after accounts management permission, audits the change, and refreshes account queries', async () => {
    const selectSingle = vi.fn(async () => ({
      data: {
        user_id: 'user_1',
        first_name: 'Alex',
        last_name: 'Customer',
        role: 'customer',
        phone: null,
        account_status: 'paused',
        status_reason: 'Manual review',
        status_updated_at: '2026-06-13T00:00:00.000Z',
        deleted_at: null,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      error: null,
    }))
    const eq = vi.fn(() => ({
      select: () => ({
        single: selectSingle,
      }),
    }))
    const update = vi.fn(() => ({ eq }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return { update }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useUpdateAccountLifecycleStatus() as unknown as MutationConfig<{
      userId: string
      status: 'active' | 'paused' | 'deleted'
      reason?: string | null
    }>

    await mutation.mutationFn({ userId: 'user_1', status: 'paused', reason: 'Manual review' })
    mutation.onSuccess?.(undefined, { userId: 'user_1', status: 'paused', reason: 'Manual review' })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('accounts.manage')
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        account_status: 'paused',
        status_reason: 'Manual review',
        status_updated_at: expect.any(String),
        deleted_at: null,
      }),
    )
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'account.lifecycle.update',
        entityType: 'user',
        entityId: 'user_1',
        metadata: {
          role: 'customer',
          status: 'paused',
          reason: 'Manual review',
        },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['accounts', 'summary'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['accounts', 'status-users'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['accounts', 'admin-access-users'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] })
  })

  it('processes admin payouts only after finance management permission, audits the result, and refreshes payout queries', async () => {
    mocks.functionsInvoke.mockResolvedValue({
      data: {
        transferId: 'tr_1',
        payoutAmountCents: 9800,
      },
      error: null,
    })

    const mutation = useProcessAdminPayout() as unknown as MutationConfig<{ bookingId: string }, { transferId: string }>

    const result = await mutation.mutationFn({ bookingId: 'booking_1' })
    mutation.onSuccess?.(result, { bookingId: 'booking_1' })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('finance.manage')
    expect(mocks.functionsInvoke).toHaveBeenCalledWith('admin-process-payout', {
      body: { bookingId: 'booking_1' },
    })
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'payout.process',
        entityType: 'booking',
        entityId: 'booking_1',
        metadata: expect.objectContaining({
          transferId: 'tr_1',
          payoutAmountCents: 9800,
        }),
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'payout-queue'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'payout-summary'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['finance'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
  })

  it('saves payment methods only after finance management permission, audits the mutation, and refreshes finance config queries', async () => {
    const selectSingle = vi.fn(async () => ({
      data: {
        id: 'pm_1',
        provider_key: 'stripe',
        method_type: 'card',
        display_name: 'Card',
        status: 'active',
      },
      error: null,
    }))
    const insert = vi.fn(() => ({
      select: () => ({
        single: selectSingle,
      }),
    }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'payment_method_configs') {
        return { insert }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useSavePaymentMethodConfig() as unknown as MutationConfig<{
      provider_key: string
      method_type: string
      display_name: string
      status: string
      supported_currencies?: string[] | null
    }>

    await mutation.mutationFn({
      provider_key: 'stripe',
      method_type: 'card',
      display_name: 'Card',
      status: 'active',
    })
    mutation.onSuccess?.(undefined, {
      provider_key: 'stripe',
      method_type: 'card',
      display_name: 'Card',
      status: 'active',
    })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('finance.manage')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_key: 'stripe',
        supported_currencies: ['GBP'],
      }),
    )
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'payment_method.created',
        entityType: 'payment_method',
        entityId: 'pm_1',
        metadata: {
          provider_key: 'stripe',
          method_type: 'card',
          status: 'active',
        },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['finance-config', 'payment-methods'] })
  })

  it('saves service areas only after location management permission, records the active admin, and refreshes location queries', async () => {
    const selectSingle = vi.fn(async () => ({
      data: { id: 'area_1' },
      error: null,
    }))
    const insert = vi.fn(() => ({
      select: () => ({
        single: selectSingle,
      }),
    }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'service_areas') {
        return { insert }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useSaveServiceArea() as unknown as MutationConfig<{
      id?: string
      city: string
      postcodePrefix: string
      enabled: boolean
      notes?: string
      locationAreaId?: string | null
    }, string>

    const result = await mutation.mutationFn({
      city: 'London',
      postcodePrefix: 'sw1',
      enabled: true,
      notes: 'Prime coverage',
      locationAreaId: 'loc_london_city',
    })
    mutation.onSuccess?.(result, {
      city: 'London',
      postcodePrefix: 'sw1',
      enabled: true,
      notes: 'Prime coverage',
      locationAreaId: 'loc_london_city',
    })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('locations.manage')
    expect(mocks.requireActiveAdmin).toHaveBeenCalled()
    expect(insert).toHaveBeenCalledWith({
      city: 'London',
      postcode_prefix: 'SW1',
      location_area_id: 'loc_london_city',
      enabled: true,
      notes: 'Prime coverage',
    })
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'service_area.create',
        entityType: 'service_area',
        entityId: 'area_1',
        metadata: {
          city: 'London',
          postcode_prefix: 'SW1',
          location_area_id: 'loc_london_city',
          enabled: true,
          notes: 'Prime coverage',
        },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'service-areas'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'service-area-health-warnings'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'location-areas'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'location-coverage-summary'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'location-map-data'] })
  })

  it('saves verification settings only after accounts management permission, stamps the admin user, and refreshes verification settings', async () => {
    const upsert = vi.fn(async () => ({ error: null }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'site_settings') {
        return { upsert }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useSaveVerificationSettings() as unknown as MutationConfig<{
      governmentIdCheckEnabled: boolean
      livenessCheckEnabled: boolean
      profilePhotoCheckEnabled: boolean
      socialMediaVerificationEnabled: boolean
    }>

    await mutation.mutationFn({
      governmentIdCheckEnabled: true,
      livenessCheckEnabled: true,
      profilePhotoCheckEnabled: false,
      socialMediaVerificationEnabled: true,
    })
    mutation.onSuccess?.(undefined, {
      governmentIdCheckEnabled: true,
      livenessCheckEnabled: true,
      profilePhotoCheckEnabled: false,
      socialMediaVerificationEnabled: true,
    })

    expect(mocks.requireAdminPermission).toHaveBeenCalledWith('accounts.manage')
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        setting_group: 'accounts',
        setting_key: 'accounts.verification_settings',
        updated_by: 'admin-1',
      }),
      { onConflict: 'setting_key' },
    )
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'verification.settings.update',
        entityType: 'verification_setting',
        entityId: 'accounts.verification_settings',
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'verification-settings'] })
  })

  it('updates verification status only after the verification admin permissions, audits the change, and refreshes verification queries', async () => {
    const eq = vi.fn(async () => ({ error: null }))
    const update = vi.fn(() => ({ eq }))
    mocks.from.mockImplementation((table: string) => {
      if (table === 'handy_profiles') {
        return { update }
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const mutation = useUpdateVerificationStatus() as unknown as MutationConfig<{
      userId: string
      status: 'verified' | 'rejected' | 'pending'
    }>

    await mutation.mutationFn({ userId: 'provider_1', status: 'verified' })
    mutation.onSuccess?.(undefined, { userId: 'provider_1', status: 'verified' })

    expect(mocks.requireAdminPermissions).toHaveBeenCalledWith(['providers.manage', 'accounts.manage', 'handys.manage'])
    expect(update).toHaveBeenCalledWith({
      verification_status: 'verified',
      verified: true,
    })
    expect(eq).toHaveBeenCalledWith('user_id', 'provider_1')
    expect(mocks.createAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'provider.verification.update',
        entityType: 'provider',
        entityId: 'provider_1',
        metadata: {
          status: 'verified',
        },
      }),
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'verification-requests'] })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin', 'verification-stats'] })
  })
})
