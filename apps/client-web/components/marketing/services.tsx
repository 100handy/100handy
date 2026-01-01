"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCategories, type Category } from "@shared/supabase";

// Fallback categories for when DB is unavailable
const fallbackMainCategories = [
  { name: "Assembly", slug: "assembly" },
  { name: "Mounting", slug: "mounting" },
  { name: "Home Repairs", slug: "home-repairs" },
  { name: "Plumbing", slug: "plumbing" },
  { name: "Electrical", slug: "electrical" },
  { name: "Cleaning", slug: "cleaning" },
  { name: "Moving", slug: "moving" },
  { name: "Outdoor Help", slug: "outdoor-help" },
];

export function Services() {
  const router = useRouter();
  const { data: categories, isLoading: loading } = useCategories();

  // Derive main and sub categories from the hook data
  const { mainCategories, subCategories, activeCategory } = useMemo(() => {
    if (!categories || categories.length === 0) {
      return { mainCategories: [], subCategories: [], activeCategory: "Assembly" };
    }

    // Main categories are level 0 (parent categories)
    const parents = categories.filter(cat => cat.level === 0);

    // Get first parent as active
    const firstParent = parents[0];
    const active = firstParent?.name ?? "Assembly";

    // Filter subcategories for the first parent
    const children = firstParent
      ? categories.filter(cat => cat.parent_id === firstParent.id && cat.level === 1).slice(0, 6)
      : categories.filter(cat => cat.level === 1).slice(0, 6);

    return { mainCategories: parents, subCategories: children, activeCategory: active };
  }, [categories]);

  const handleMainCategoryClick = (category: Category) => {
    // Navigate to task form with category
    router.push(`/task-form?category=${encodeURIComponent(category.name)}`);
  };

  const handleSubCategoryClick = (subCategory: Category) => {
    // Navigate to task form with sub-category
    router.push(`/task-form?category=${encodeURIComponent(subCategory.name)}`);
  };

  const handleSeeAllServices = () => {
    router.push('/all-services');
  };

  // Use fallback if no categories loaded
  const displayMainCategories = mainCategories.length > 0
    ? mainCategories
    : fallbackMainCategories.map((cat, idx) => ({
        id: `fallback-${idx}`,
        name: cat.name,
        description: null,
        icon_url: null,
        parent_id: null,
        level: 0,
        display_order: idx
      }));

  return (
    <section className="border-y border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Main Categories with Icons Above */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {displayMainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMainCategoryClick(category as Category)}
                className="group flex flex-col items-center gap-2"
              >
                {/* Circle Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    activeCategory === category.name
                      ? "bg-brand-terracotta/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${
                      activeCategory === category.name ? "bg-brand-terracotta" : "bg-gray-400"
                    }`}
                  />
                </div>
                {/* Category Name */}
                <span
                  className={`whitespace-nowrap text-[16px] transition-colors ${
                    activeCategory === category.name
                      ? "font-bold text-brand-terracotta"
                      : "font-medium text-[#30352D] hover:text-brand-terracotta"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gray-200" />

        {/* Sub Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {loading ? (
            <div className="text-gray-500 text-sm">Loading services...</div>
          ) : subCategories.length > 0 ? (
            subCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                onClick={() => handleSubCategoryClick(subCategory)}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-[#30352D] transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
              >
                {subCategory.name}
              </button>
            ))
          ) : (
            // Fallback static subcategories
            ["Furniture Assembly", "Garden Assembly", "Office Furniture", "Bed Assembly", "Wardrobe Assembly", "Crib Assembly"].map((name) => (
              <button
                key={name}
                onClick={() => router.push(`/task-form?category=${encodeURIComponent(name)}`)}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-[#30352D] transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
              >
                {name}
              </button>
            ))
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
