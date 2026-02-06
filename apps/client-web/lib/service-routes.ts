/**
 * Maps category/service names to the route slugs used in [category]/[service]/page.tsx.
 * This ensures links generated from DB data match the static service detail routes.
 */

// Category name keywords → route category slug
const categorySlugMap: [string[], string][] = [
  [["furniture", "assembly"], "furniture-assembly"],
  [["tv", "mount", "wall mount"], "tv-wall-mounting"],
  [["repair", "fix", "handyman", "home repair"], "home-repairs"],
  [["plumb"], "plumbing"],
  [["electric"], "electrical"],
  [["clean", "sparkle"], "cleaning"],
  [["pack", "moving", "lifting"], "packing-moving"],
  [["outdoor", "garden", "yard", "great outdoors"], "outdoor"],
];

// Service/subcategory name keywords → [category slug, service slug]
const serviceSlugMap: [string[], string, string][] = [
  [["furniture assembly", "ikea", "crib", "wardrobe", "office furniture", "bed assembly"], "furniture-assembly", "furniture-assembly"],
  [["tv mount", "shelf", "shelves", "picture", "artwork", "light install", "curtain", "blind"], "tv-wall-mounting", "tv-mounting"],
  [["home repair", "minor repair", "door", "cabinet", "window", "seal", "caulk", "floor", "tile", "carpentry"], "home-repairs", "home-repairs"],
  [["leak", "drain", "tap", "faucet", "pipe", "plumb", "washing machine", "water filter"], "plumbing", "plumbers"],
  [["socket", "switch", "cable", "wiring", "electric", "light fixture"], "electrical", "electricians"],
  [["clean", "deep clean", "tenancy", "airbnb", "office clean", "party clean"], "cleaning", "sparkle-clean"],
  [["van", "moving", "packing", "waste", "removal", "heavy lift", "loading", "full service mover"], "packing-moving", "moving"],
  [["garden", "lawn", "landscape", "leaf", "hedge", "gutter", "roof", "branch", "trim", "outdoor"], "outdoor", "great-outdoors"],
];

/**
 * Resolve a category name from the DB to the route slug used in servicesData.
 */
export function getCategoryRouteSlug(categoryName: string): string | null {
  const name = categoryName.toLowerCase();

  for (const [keywords, slug] of categorySlugMap) {
    if (keywords.some((kw) => name.includes(kw))) {
      return slug;
    }
  }

  return null;
}

/**
 * Resolve a subcategory name to [category slug, service slug] for linking.
 * Returns null if no known route exists.
 */
export function getServiceRoute(subcategoryName: string): { category: string; service: string } | null {
  const name = subcategoryName.toLowerCase();

  for (const [keywords, categorySlug, serviceSlug] of serviceSlugMap) {
    if (keywords.some((kw) => name.includes(kw))) {
      return { category: categorySlug, service: serviceSlug };
    }
  }

  return null;
}
