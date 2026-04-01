import { createClient } from '@supabase/supabase-js'

/**
 * Lightweight Supabase client for public CMS reads.
 * Does NOT use cookies, so CMS-backed pages can opt into dynamic rendering
 * without depending on the authenticated app session.
 */
function createCmsClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Fetch all CMS content for a page.
 * Returns a lookup function: content('section.field', 'default value')
 *
 * Usage in RSC pages:
 *   const c = await getPageContent('home')
 *   <h1>{c('hero.title', 'Default Title')}</h1>
 */
export async function getPageContent(
  pageKey: string
): Promise<(key: string, fallback: string) => string> {
  let content: Record<string, string> = {}

  try {
    const supabase = createCmsClient()
    const { data } = await supabase
      .from('site_content')
      .select('section_key, field_key, value')
      .eq('page_key', pageKey)

    for (const row of data ?? []) {
      content[`${row.section_key}.${row.field_key}`] = row.value
    }
  } catch (error) {
    // If fetch fails, fall back to defaults silently
    console.error(`[CMS] Failed to fetch content for page "${pageKey}":`, error)
  }

  return (key: string, fallback: string) => content[key] || fallback
}
