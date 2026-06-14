import { describe, expect, it, vi } from 'vitest'

// outreach-sources transitively imports the supabase client (which touches
// window.localStorage at module load); stub it so the pure helpers can be tested.
vi.mock('@/lib/supabase', () => ({
  supabase: { from: vi.fn(), functions: { invoke: vi.fn() } },
}))

import { buildSourceKey, cadenceLabel, REDDIT_PRESET, SOURCE_PRESETS } from '@/lib/api/outreach-sources'

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

  it('ships presets for both agents with unique keys and a raw_text mapping', () => {
    expect(SOURCE_PRESETS.length).toBeGreaterThanOrEqual(6)
    const keys = SOURCE_PRESETS.map((p) => p.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect(SOURCE_PRESETS.some((p) => p.source_type === 'customer_finder')).toBe(true)
    expect(SOURCE_PRESETS.some((p) => p.source_type === 'worker_finder')).toBe(true)
    for (const preset of SOURCE_PRESETS) {
      expect(preset.apify_actor_id.length).toBeGreaterThan(0)
      expect((preset.field_mapping as Record<string, unknown>).raw_text).toBeTruthy()
    }
  })
})
