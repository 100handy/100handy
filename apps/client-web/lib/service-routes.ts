/**
 * Maps category/service names to the route slugs used in [category]/[service]/page.tsx.
 * This ensures links generated from DB data match the static service detail routes.
 */

// Category name keywords → route category slug
// Order matters: more specific matches first.
const categorySlugMap: [string[], string][] = [
  [["furniture", "assembly"], "furniture-assembly"],
  [["tv", "mount", "wall mount"], "tv-wall-mounting"],
  [["outdoor", "garden", "yard", "great outdoors"], "outdoor"],
  [["repair", "fix", "home repair"], "home-repairs"],
  [["handyman"], "handyman"],
  [["plumb"], "plumbing"],
  [["electric"], "electrical"],
  [["sparkle", "clean"], "cleaning"],
  [["pack", "moving", "lifting"], "packing-moving"],
];

// Service/subcategory name keywords → [category slug, service slug]
// IMPORTANT: More specific keywords MUST come BEFORE generic ones.
// Use multi-word phrases to avoid substring collisions (e.g. "door repair" not "door").
const serviceSlugMap: [string[], string, string][] = [
  // Assembly subcategories
  [["ikea assembly", "ikea furniture"], "furniture-assembly", "ikea-assembly"],
  [["office furniture assembly", "office furniture assembl"], "furniture-assembly", "office-furniture-assembly"],
  [["wardrobe assembly", "wardrobe"], "furniture-assembly", "wardrobe-assembly"],
  [["crib assembly", "crib", "nursery furniture"], "furniture-assembly", "crib-assembly"],
  [["furniture assembly"], "furniture-assembly", "furniture-assembly"],

  // Mounting subcategories
  [["tv mount", "tv wall mount"], "tv-wall-mounting", "tv-wall-mounting"],
  [["wall mount", "wall-mount"], "tv-wall-mounting", "wall-mounting"],
  [["shelf mount", "put up shelves", "shelves", "shelf"], "tv-wall-mounting", "shelf-mounting"],
  [["hanging picture", "artwork", "picture hanging"], "tv-wall-mounting", "hanging-pictures"],
  [["light fixture install", "light fixture"], "tv-wall-mounting", "light-fixture-installation"],
  [["curtain install", "blind install", "curtains and blinds", "blinds install", "install curtain", "install blind"], "tv-wall-mounting", "curtains-and-blinds"],

  // Outdoor subcategories — BEFORE home-repairs to avoid "door" matching "outdoor"
  [["lawn care", "lawn treatment", "lawn mow"], "outdoor", "lawn-care"],
  [["landscap"], "outdoor", "landscaping"],
  [["leaf rak", "leaf removal"], "outdoor", "leaf-raking-removal"],
  [["roof clean", "gutter clean", "gutter"], "outdoor", "roof-gutter-cleaning"],
  [["hedge", "branch trimm", "hedge trimm"], "outdoor", "branch-hedge-trimming"],
  [["great outdoors"], "outdoor", "great-outdoors"],
  [["garden", "outdoor"], "outdoor", "gardening"],

  // Home repairs subcategories — use multi-word keywords to avoid shadowing outdoor/cleaning
  [["minor home repair", "minor repair"], "home-repairs", "minor-home-repairs"],
  [["door repair", "cabinet repair", "furniture repair", "door lock", "door frame", "door handle", "cabinet hinge", "cabinet door"], "home-repairs", "door-cabinet-furniture-repairs"],
  [["window blind", "blinds repair", "window repair", "shades repair"], "home-repairs", "window-blinds-repair"],
  [["seal", "caulk"], "home-repairs", "sealing-and-caulking"],
  [["floor", "tile", "tiling", "laminate"], "home-repairs", "flooring-and-tiling"],
  [["carpentry", "light carpentry"], "home-repairs", "light-carpentry"],
  [["home repair"], "home-repairs", "home-repairs"],

  // Plumbing subcategories
  [["leak fix", "leak repair", "leaking tap", "pipe leak"], "plumbing", "leak-fixing"],
  [["drain unblock", "drain unblocker", "blocked drain"], "plumbing", "drain-unblocking"],
  [["tap replace", "tap replacement", "replace tap", "kitchen tap"], "plumbing", "tap-replacement"],
  [["washing machine install", "washing machine"], "plumbing", "washing-machine-installation"],
  [["water filter install", "water filter"], "plumbing", "water-filter-installation"],
  [["plumb"], "plumbing", "plumbers"],

  // Electrical subcategories
  [["light install", "lighting install", "light installation"], "electrical", "light-installation"],
  [["socket install", "socket repair", "plug socket"], "electrical", "sockets-installation-repair"],
  [["switch install", "switch repair", "light switch"], "electrical", "switches-installation-repair"],
  [["cable repair", "cables repair", "fiber optic", "fibre optic"], "electrical", "cables-repair"],
  [["electric"], "electrical", "electricians"],

  // Cleaning subcategories — specific before generic "clean"
  [["deep clean", "deep cleaning"], "cleaning", "deep-clean"],
  [["party clean", "after party"], "cleaning", "party-clean-up"],
  [["end of tenancy", "move-out clean", "tenancy clean"], "cleaning", "end-of-tenancy"],
  [["office clean"], "cleaning", "office-cleaning"],
  [["airbnb clean", "airbnb"], "cleaning", "airbnb-cleaning"],
  [["sparkle clean"], "cleaning", "sparkle-clean"],
  [["clean"], "cleaning", "clean"],

  // Moving subcategories
  [["van assisted", "man and van", "man van"], "packing-moving", "van-assisted-moving"],
  [["waste removal", "furniture removal", "junk removal", "rubbish removal"], "packing-moving", "waste-furniture-removal"],
  [["heavy lift", "heavy loading", "heavy furniture"], "packing-moving", "heavy-lifting-loading"],
  [["packing and moving", "packing service", "packing"], "packing-moving", "packing-and-moving"],
  [["full service mover", "full service move"], "packing-moving", "full-service-movers"],
  [["moving help", "moving"], "packing-moving", "moving-help"],
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
