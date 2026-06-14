import { describe, expect, it, vi } from 'vitest'

// outreach-sources transitively imports the supabase client (which touches
// window.localStorage at module load); stub it so the pure helpers can be tested.
vi.mock('@/lib/supabase', () => ({
  supabase: { from: vi.fn(), functions: { invoke: vi.fn() } },
}))

import { buildSourceKey, cadenceLabel, REDDIT_PRESET } from '@/lib/api/outreach-sources'

describe('outreach-sources helpers', () => {
  it('slugifies a source name into a stable key', () => {
    expect(buildSourceKey('Reddit UK Cleaners')).toBe('reddit-uk-cleaners')
    expect(buildSourceKey('  Google Maps — Plumbers!! ')).toBe('google-maps-plumbers')
  })

  it('labels each cadence', () => {
    expect(cadenceLabel('every_6h')).toBe('Every 6 hours')
    expect(cadenceLabel('off')).toBe('Manual only')
    expect(cadenceLabel('daily')).toBe('Daily')
  })

  it('exposes a usable Reddit preset', () => {
    expect(REDDIT_PRESET.platform).toBe('Reddit')
    expect(REDDIT_PRESET.source_type).toBe('customer_finder')
    expect(REDDIT_PRESET.apify_actor_id.length).toBeGreaterThan(0)
    expect((REDDIT_PRESET.field_mapping as Record<string, unknown>).raw_text).toBe('body')
  })
})
