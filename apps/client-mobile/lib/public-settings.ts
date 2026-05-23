import { supabase } from '@shared/supabase'

const PUBLIC_WEB_BASE_URL = 'https://www.100handy.com'

export async function getPublicSiteSetting(settingKey: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value_json')
      .eq('setting_key', settingKey)
      .maybeSingle()

    if (error) throw error
    return (data?.value_json as Record<string, unknown> | undefined) ?? null
  } catch (error) {
    console.error(`[public-settings] Failed to fetch "${settingKey}":`, error)
    return null
  }
}

export function resolvePublicAssetUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return `${PUBLIC_WEB_BASE_URL}${trimmed}`
  }

  return null
}
