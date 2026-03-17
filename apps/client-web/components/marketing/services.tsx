"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useHomeCategory } from "./home-category-context";
import {
  useSubcategories,
  useTopLevelCategories,
  type Category,
} from "@shared/supabase";
import { getCategoryIcon } from "@/components/icons/category-icons";

// Fallback categories for when DB is unavailable
const fallbackMainCategories = [
  { name: "Furniture Assembly", slug: "furniture-assembly", description: "Don't wrestle with confusing instructions or leftover screws. We turn flat-packs into functional furniture quickly and correctly, so you can enjoy your new pieces immediately." },
  { name: "TV & Wall Mounting", slug: "tv-wall-mounting", description: "Get that \"perfectly straight\" finish—without guessing. Our pros mount TVs, shelves, curtains, and more with the right tools and a clean, secure result." },
  { name: "Home Repairs & Fixes", slug: "home-repairs", description: "Small issues can become big headaches. We handle the quick fixes and touch-ups that keep your home feeling solid, smooth, and well maintained." },
  { name: "Plumbers", slug: "plumbing", description: "Whether it's a drip, a leak, or a drain that won't cooperate, our plumbing pros get things back to normal—cleanly and efficiently." },
  { name: "Electricians", slug: "electrical", description: "Power problems? New lights? Socket acting up? Our electricians handle installations and repairs with safety, care, and attention to detail." },
  { name: "Sparkle Clean", slug: "cleaning", description: "A cleaner space changes everything. From regular cleans to deep refreshes, our pros leave homes, offices, and rentals looking sharp and feeling brand new." },
  { name: "Packing & Moving", slug: "packing-moving", description: "Moving doesn't have to be chaos. Get help packing, lifting, loading, and shifting—so you can move faster with less effort and fewer backaches." },
  { name: "The Great Outdoors", slug: "outdoor", description: "From quick tidy-ups to full garden care, our outdoor pros help you keep things clean, trimmed, and looking their best—season after season." },
];

export function Services() {
  const router = useRouter();
  const homeCategory = useHomeCategory();
  const { data: mainCategories, isLoading: loadingMainCategories } =
    useTopLevelCategories();

  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Assembly");

  // Sync initial/loaded category to Stats section
  useEffect(() => {
    homeCategory?.setActiveCategory(activeCategory);
  }, [activeCategory, homeCategory?.setActiveCategory]);

  // Set default active parent once main categories load
  useEffect(() => {
    if (activeParentId) return;
    const first = mainCategories?.[0];
    if (!first) return;
    setActiveParentId(first.id);
    setActiveCategory(first.name);
  }, [activeParentId, mainCategories]);

  const { data: subcategories, isLoading: loadingSubcategories } =
    useSubcategories(activeParentId);

  const handleMainCategoryClick = (category: Category) => {
    const name = category.name;
    // Sync to Stats section immediately
    homeCategory?.setActiveCategory(name);
    // Avoid querying subcategories when we're using fallback IDs
    if (category.id.startsWith("fallback-")) {
      setActiveParentId(null);
      setActiveCategory(name);
      return;
    }

    setActiveParentId(category.id);
    setActiveCategory(name);
  };

  const handleSubCategoryClick = (subCategory: Category) => {
    // Navigate to task form with sub-category
    router.push(`/task-form?category=${encodeURIComponent(subCategory.name)}`);
  };

  const handleSeeAllServices = () => {
    router.push('/services');
  };

  // Use fallback if no categories loaded
  const usingFallbackMainCategories =
    !loadingMainCategories && (!mainCategories || mainCategories.length === 0);

  const displayMainCategories =
    mainCategories && mainCategories.length > 0
      ? mainCategories
      : fallbackMainCategories.map((cat, idx) => ({
          id: `fallback-${idx}`,
          name: cat.name,
          description: null,
          icon_url: null,
          parent_id: null,
          level: 0,
          display_order: idx,
        }));

  const displaySubCategories = useMemo(() => {
    if (usingFallbackMainCategories) return [];
    return (subcategories ?? []).filter((c) => c.level === 1).slice(0, 6);
  }, [subcategories, usingFallbackMainCategories]);

  const loading = loadingMainCategories || loadingSubcategories;

  return (
    <section className="border-y border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Main Categories with Icons Above */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {loadingMainCategories ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </>
            ) : (
            displayMainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMainCategoryClick(category as Category)}
                className="group flex flex-col items-center gap-2"
              >
                {/* Category Icon */}
                {(() => {
                  const Icon = getCategoryIcon(category.name);
                  return (
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                        activeCategory === category.name
                          ? "bg-brand-terracotta/10"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          activeCategory === category.name ? "text-brand-terracotta" : "text-gray-500"
                        }`}
                      />
                    </div>
                  );
                })()}
                {/* Category Name */}
                <span
                  className={`whitespace-nowrap text-[16px] transition-colors ${
                    activeCategory === category.name
                      ? "font-bold text-brand-terracotta"
                      : "font-medium text-brand-dark-alt hover:text-brand-terracotta"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gray-200" />

        {/* Sub Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {loading ? (
            <>
              {[120, 100, 140, 110, 130, 95].map((w, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-full bg-gray-200"
                  style={{ width: w }}
                />
              ))}
            </>
          ) : displaySubCategories.length > 0 ? (
            displaySubCategories.map((subCategory) => {
              const SubIcon = getCategoryIcon(subCategory.name);
              return (
                <button
                  key={subCategory.id}
                  onClick={() => handleSubCategoryClick(subCategory)}
                  className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
                >
                  <SubIcon className="h-5 w-5 shrink-0" />
                  {subCategory.name}
                </button>
              );
            })
          ) : usingFallbackMainCategories && activeCategory === "Assembly" ? (
            // Fallback static subcategories for Assembly
            ["Furniture Assembly", "Garden Assembly", "Office Furniture", "Bed Assembly", "Wardrobe Assembly", "Crib Assembly"].map(
              (name) => (
                <button
                  key={name}
                  onClick={() => router.push(`/task-form?category=${encodeURIComponent(name)}`)}
                  className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
                >
                  {name}
                </button>
              )
            )
          ) : (
            <div className="text-gray-500 text-sm">No subcategories available</div>
          )}
        </div>

        {/* See All Services Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSeeAllServices}
            className="text-[16px] font-bold text-brand-terracotta underline decoration-brand-terracotta underline-offset-4 transition-colors hover:text-brand-terracotta/80"
          >
            See All Services
          </button>
        </div>
      </div>
    </section>
  );
}
