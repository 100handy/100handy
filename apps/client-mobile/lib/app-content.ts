import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { supabase } from '@shared/supabase'

export type AppContentDefaults = Record<string, string>

function getPlatformsForLookup() {
  const currentPlatform = Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'shared'
  return currentPlatform === 'shared' ? ['shared'] : ['shared', currentPlatform]
}

export async function getPublishedAppContent(screenKey: string): Promise<Record<string, string>> {
  try {
    const platforms = getPlatformsForLookup()
    const { data, error } = await supabase
      .from('app_content')
      .select('platform, section_key, field_key, value')
      .eq('screen_key', screenKey)
      .eq('status', 'published')
      .in('platform', platforms)

    if (error) throw error

    const content: Record<string, string> = {}
    const sharedRows = (data ?? []).filter((row) => row.platform === 'shared')
    const platformRows = (data ?? []).filter((row) => row.platform !== 'shared')

    for (const row of sharedRows) {
      content[`${row.section_key}.${row.field_key}`] = row.value
    }
    for (const row of platformRows) {
      content[`${row.section_key}.${row.field_key}`] = row.value
    }

    return content
  } catch (error) {
    console.error(`[app-content] Failed to fetch "${screenKey}":`, error)
    return {}
  }
}

export function useAppContent(screenKey: string, defaults: AppContentDefaults) {
  const [content, setContent] = useState<AppContentDefaults>(defaults)

  useEffect(() => {
    let isMounted = true

    getPublishedAppContent(screenKey).then((rows) => {
      if (!isMounted) return
      setContent({ ...defaults, ...rows })
    })

    return () => {
      isMounted = false
    }
  }, [screenKey, defaults])

  return content
}

export function getAppContentValue(
  content: Record<string, string>,
  key: string,
  fallback: string
) {
  const value = content[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export function getMultilineAppContent(
  content: Record<string, string>,
  key: string,
  fallback: string
) {
  return getAppContentValue(content, key, fallback)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
