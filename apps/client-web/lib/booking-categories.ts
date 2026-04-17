// Maps client-web service routes to the exact `categories.name` value stored
// in the database. The /task-form page looks up categories by name, so the
// string appended to `?category=` must match exactly — display titles like
// "Professional TV & Wall Mounting Service" or "Leak Fixing Help" do not exist
// in the DB and will produce a "Category not found" error.

const BOOKING_CATEGORY_MAP: Record<string, string> = {
  // Furniture Assembly
  "furniture-assembly/furniture-assembly": "Furniture assembly",
  "furniture-assembly/ikea-assembly": "IKEA assembly",
  "furniture-assembly/office-furniture-assembly": "Office furniture assembly",
  "furniture-assembly/wardrobe-assembly": "Wardrobe assembly",
  "furniture-assembly/crib-assembly": "Crib assembly",

  // TV & Wall Mounting
  "tv-wall-mounting/tv-mounting": "TV mounting",
  "tv-wall-mounting/tv-wall-mounting": "TV mounting",
  "tv-wall-mounting/wall-mounting": "Wall mounting",
  "tv-wall-mounting/shelf-mounting": "Put up shelves",
  "tv-wall-mounting/hanging-pictures": "Hanging pictures and artwork",
  "tv-wall-mounting/light-fixture-installation": "Light fixture installation",
  "tv-wall-mounting/curtains-and-blinds": "Install curtains and blinds",

  // Home Repairs
  "home-repairs/home-repairs": "Home Repairs",
  "home-repairs/minor-home-repairs": "Minor home repairs",
  "home-repairs/door-cabinet-furniture-repairs": "Door, cabinet, and furniture repairs",
  "home-repairs/window-blinds-repair": "Window and blinds repair",
  "home-repairs/sealing-and-caulking": "Sealing and caulking",
  "home-repairs/flooring-and-tiling": "Flooring and tiling help",
  "home-repairs/light-carpentry": "Light carpentry",

  // Plumbing
  "plumbing/plumbers": "Plumbing",
  "plumbing/leak-fixing": "Leak fixing",
  "plumbing/drain-unblocking": "Drain unblocking",
  "plumbing/tap-replacement": "Tap replacement",
  "plumbing/washing-machine-installation": "Washing machine installation",
  "plumbing/water-filter-installation": "Water filter installation",

  // Electrical
  "electrical/electricians": "Electrical",
  "electrical/light-installation": "Light installation",
  "electrical/sockets-installation-repair": "Sockets installation and repair",
  "electrical/switches-installation-repair": "Switches installation and repair",
  "electrical/cables-repair": "Cables repair",

  // Cleaning
  "cleaning/sparkle-clean": "Cleaning",
  "cleaning/clean": "Domestic Cleaning",
  "cleaning/deep-clean": "Deep clean",
  "cleaning/party-clean-up": "Party clean up",
  "cleaning/end-of-tenancy": "End of tenancy",
  "cleaning/office-cleaning": "Office cleaning",
  "cleaning/airbnb-cleaning": "AirBnB cleaning",

  // Moving (packing-moving)
  "packing-moving/moving": "Moving",
  "packing-moving/van-assisted-moving": "Van assisted moving help",
  "packing-moving/moving-help": "Moving help",
  "packing-moving/waste-furniture-removal": "Waste and furniture removal",
  "packing-moving/heavy-lifting-loading": "Heavy lifting and loading",
  "packing-moving/packing-and-moving": "Packing and moving",
  "packing-moving/full-service-movers": "Full service movers",

  // Outdoor
  "outdoor/great-outdoors": "Outdoor help",
  "outdoor/gardening": "Gardening",
  "outdoor/lawn-care": "Lawn care",
  "outdoor/landscaping": "Landscaping",
  "outdoor/leaf-raking-removal": "Leaf raking and removal",
  "outdoor/roof-gutter-cleaning": "Roof and gutter cleaning",
  "outdoor/branch-hedge-trimming": "Branch and hedge trimming",

  // Handyman fallback → Home Repairs
  "handyman/general": "Home Repairs",
};

// Used by city-service pages (keyed by the city service slug, not a category/service pair).
const CITY_SERVICE_CATEGORY_MAP: Record<string, string> = {
  "furniture-assembly": "Furniture assembly",
  "tv-mounting": "TV mounting",
  "tv-wall-mounting": "TV mounting",
  "handyman": "Home Repairs",
  "home-cleaning": "Domestic Cleaning",
  "clean": "Domestic Cleaning",
  "home-repairs-and-fixes": "Home Repairs",
  "home-repairs": "Home Repairs",
  "help-moving": "Moving help",
  "plumbing": "Plumbing",
  "electrical": "Electrical",
  "cleaning": "Cleaning",
  "sparkle-clean": "Cleaning",
  "packing-moving": "Moving",
  "outdoor": "Outdoor help",
  "great-outdoors": "Outdoor help",
  // Assembly sub-services
  "ikea-assembly": "IKEA assembly",
  "office-furniture-assembly": "Office furniture assembly",
  "wardrobe-assembly": "Wardrobe assembly",
  "crib-assembly": "Crib assembly",
  // Mounting sub-services
  "wall-mounting": "Wall mounting",
  "shelf-mounting": "Put up shelves",
  "put-up-shelves": "Put up shelves",
  "hanging-pictures": "Hanging pictures and artwork",
  "hanging-pictures-and-artwork": "Hanging pictures and artwork",
  "light-fixture-installation": "Light fixture installation",
  "curtains-and-blinds": "Install curtains and blinds",
  "install-curtains-and-blinds": "Install curtains and blinds",
  // Home Repairs sub-services
  "minor-home-repairs": "Minor home repairs",
  "door-cabinet-furniture-repairs": "Door, cabinet, and furniture repairs",
  "door-cabinet-and-furniture-repairs": "Door, cabinet, and furniture repairs",
  "window-blinds-repair": "Window and blinds repair",
  "window-and-blinds-repair": "Window and blinds repair",
  "sealing-caulking": "Sealing and caulking",
  "sealing-and-caulking": "Sealing and caulking",
  "flooring-tiling": "Flooring and tiling help",
  "flooring-and-tiling": "Flooring and tiling help",
  "flooring-and-tiling-help": "Flooring and tiling help",
  "light-carpentry": "Light carpentry",
  // Plumbing sub-services
  "leak-fixing": "Leak fixing",
  "drain-unblocking": "Drain unblocking",
  "tap-replacement": "Tap replacement",
  "washing-machine-installation": "Washing machine installation",
  "water-filter-installation": "Water filter installation",
  // Electrical sub-services
  "light-installation": "Light installation",
  "sockets-installation-and-repair": "Sockets installation and repair",
  "sockets-installation-repair": "Sockets installation and repair",
  "switches-installation-and-repair": "Switches installation and repair",
  "switches-installation-repair": "Switches installation and repair",
  "cables-repair": "Cables repair",
  // Cleaning sub-services
  "deep-clean": "Deep clean",
  "deep-cleaning": "Deep clean",
  "party-clean-up": "Party clean up",
  "end-of-tenancy": "End of tenancy",
  "office-cleaning": "Office cleaning",
  "airbnb-cleaning": "AirBnB cleaning",
  // Moving sub-services
  "van-assisted-moving": "Van assisted moving help",
  "van-assisted-moving-help": "Van assisted moving help",
  "moving-help": "Moving help",
  "moving": "Moving",
  "waste-furniture-removal": "Waste and furniture removal",
  "waste-and-furniture-removal": "Waste and furniture removal",
  "heavy-lifting-loading": "Heavy lifting and loading",
  "heavy-lifting-and-loading": "Heavy lifting and loading",
  "packing-and-moving": "Packing and moving",
  "full-service-movers": "Full service movers",
  // Outdoor sub-services
  "gardening": "Gardening",
  "lawn-care": "Lawn care",
  "landscaping": "Landscaping",
  "leaf-raking-removal": "Leaf raking and removal",
  "leaf-raking-and-removal": "Leaf raking and removal",
  "roof-gutter-cleaning": "Roof and gutter cleaning",
  "roof-and-gutter-cleaning": "Roof and gutter cleaning",
  "branch-hedge-trimming": "Branch and hedge trimming",
  "branch-and-hedge-trimming": "Branch and hedge trimming",
};

export function getBookingCategoryForService(categorySlug: string, serviceSlug: string): string | undefined {
  return BOOKING_CATEGORY_MAP[`${categorySlug}/${serviceSlug}`];
}

export function getBookingCategoryForCityService(serviceSlug: string): string | undefined {
  return CITY_SERVICE_CATEGORY_MAP[serviceSlug];
}
