import { getPublicSiteSetting, resolvePublicAssetUrl } from '@/lib/public-settings'

type CategoryMediaLike = {
  icon_url?: string | null
  content_image_url?: string | null
}

const CATEGORY_IMAGE_KEYWORDS: Array<{ key: string; patterns: string[] }> = [
  { key: 'assembly', patterns: ['assembly', 'ikea', 'crib', 'wardrobe', 'office furniture', 'furniture'] },
  { key: 'mounting', patterns: ['mounting', 'tv', 'shelves', 'artwork', 'light installation', 'curtains', 'blinds'] },
  { key: 'home_repairs', patterns: ['home repair', 'repairs', 'carpentry', 'painting', 'window', 'door', 'cabinet', 'caulking'] },
  { key: 'plumbing', patterns: ['plumbing', 'drain', 'tap', 'leak', 'washing machine', 'water filter'] },
  { key: 'electrical', patterns: ['electrical', 'socket', 'switch', 'cable'] },
  { key: 'cleaning', patterns: ['clean', 'tenancy', 'airbnb', 'office cleaning', 'deep clean', 'party clean'] },
  { key: 'moving', patterns: ['moving', 'waste', 'van', 'lifting', 'packing', 'movers'] },
  { key: 'outdoor_help', patterns: ['outdoor', 'gardening', 'lawn', 'landscaping', 'leaf', 'gutter', 'hedge', 'branch'] },
]

export type AppCategoryImageMap = Record<string, string>

export function getAppCategoryImageKey(categoryName: string): string | null {
  const normalized = categoryName.toLowerCase()
  const match = CATEGORY_IMAGE_KEYWORDS.find(({ patterns }) =>
    patterns.some((pattern) => normalized.includes(pattern))
  )
  return match?.key ?? null
}

export async function getAppCategoryImageMap(): Promise<AppCategoryImageMap> {
  const value = await getPublicSiteSetting('app.images.categories')
  const entries = Object.entries(value ?? {})
    .map(([key, raw]) => [key, resolvePublicAssetUrl(raw)] as const)
    .filter((entry): entry is readonly [string, string] => typeof entry[1] === 'string')
  return Object.fromEntries(entries)
}

export function getAppCategoryImageUri(
  categoryName: string,
  imageMap: AppCategoryImageMap
): string | null {
  const key = getAppCategoryImageKey(categoryName)
  if (!key) return null
  return imageMap[key] ?? null
}

export function resolveCategoryImageUri(
  category: CategoryMediaLike,
  categoryName: string,
  imageMap: AppCategoryImageMap
): string | null {
  const directImage = resolvePublicAssetUrl(category.content_image_url) ?? resolvePublicAssetUrl(category.icon_url)
  if (directImage) {
    return directImage
  }

  return getAppCategoryImageUri(categoryName, imageMap)
}
