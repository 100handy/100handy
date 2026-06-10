import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBulkUpdateCategories, useCreateCategory } from '@/lib/api/categories'
import { useRefundPayment } from '@/lib/api/finance'
import { useCreateOutreachLead } from '@/lib/api/outreach'

type MutationConfig<TInput, TResult = unknown> = {
  mutationFn: (input: TInput) => Promise<TResult>
  onSuccess?: (data: TResult) => void
}

const mocks = vi.hoisted(() => ({
  createAdminAuditLog: vi.fn(),
  from: vi.fn(),
  functionsInvoke: vi.fn(),
  invalidateQueries: vi.fn(),
  requireAdminPermission: vi.fn(),
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
  requireActiveAdmin: vi.fn(),
  requireAdminPermission: mocks.requireAdminPermission,
  requireAdminPermissions: vi.fn(),
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
    mocks.requireAdminPermission.mockResolvedValue({ user: { id: 'admin-1' } })
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
    mutation.onSuccess?.(result)

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
    mutation.onSuccess?.(result)

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
    mutation.onSuccess?.(result)

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
})
