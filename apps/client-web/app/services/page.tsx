"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { getCategoryTree } from "@/lib/supabase/categories";
import type { CategoryWithChildren } from "@/lib/supabase/types";
import { getCategoryIcon } from "@/components/icons/category-icons";
import { getCategoryRouteSlug, getServiceRoute } from "@/lib/service-routes";
import { getServiceWebImageSettings } from "@/lib/content-platform";

// Map category names to their card images (includes both DB and fallback names)
const categoryImages: Record<string, string> = {
  "Assembly": "/images/services/main/assembly.png",
  "Furniture Assembly": "/images/services/main/assembly.png",
  "Mounting": "/images/services/main/mounting.png",
  "TV & Wall Mounting": "/images/services/main/mounting.png",
  "Home Repairs": "/images/services/main/home-repairs.jpeg",
  "Home Repairs & Fixes": "/images/services/main/home-repairs.jpeg",
  "Plumbing": "/images/services/main/plumbing.jpeg",
  "Plumbers": "/images/services/main/plumbing.jpeg",
  "Electrical": "/images/services/main/electrical.png",
  "Electricians": "/images/services/main/electrical.png",
  "Cleaning": "/images/services/main/cleaning.jpeg",
  "Sparkle Clean": "/images/services/main/cleaning.jpeg",
  "Moving": "/images/services/main/moving.jpeg",
  "Packing & Moving": "/images/services/main/moving.jpeg",
  "Outdoor help": "/images/services/main/outdoor.png",
  "Outdoor Help": "/images/services/main/outdoor.png",
  "The Great Outdoors": "/images/services/main/outdoor.png",
};

// Helper function to create slug from service name (fallback only)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Service Category Card Component
function ServiceCategoryCard({
  category,
  imageOverrides,
}: {
  category: CategoryWithChildren
  imageOverrides: Record<string, string>
}) {
  const categorySlug =
    category.route_slug ?? getCategoryRouteSlug(category.name) ?? slugify(category.name);
  const subcategories = category.subcategories || [];
  const Icon = getCategoryIcon(category.name);

  const cardImage = category.content_image_url ?? imageOverrides[category.name] ?? categoryImages[category.name];

  // Get first 6 subcategories to display
  const displayedSubcategories = subcategories.slice(0, 6);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Category Image or Icon Fallback */}
      {cardImage ? (
        <div className="relative h-48">
          <Image
            src={cardImage}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-brand-dark-alt">
          {category.icon_url ? (
            <Image
              src={category.icon_url}
              alt={category.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <Icon className="h-16 w-16 text-brand-cream" />
          )}
        </div>
      )}

      {/* Category Content */}
      <div className="p-6">
        <h2 className="text-[20px] font-bold text-brand-dark-alt mb-2">
          {category.marketing_title || category.name}
        </h2>
        <p className="text-[14px] text-gray-600 mb-4">
          {category.marketing_description || category.description || `Explore ${category.name} services`}
        </p>

        {/* Subcategory Links */}
        {displayedSubcategories.length > 0 && (
          <ul className="space-y-2 mb-4">
            {displayedSubcategories.map((subcategory) => {
              const route = getServiceRoute(subcategory.name);
              const serviceSlug = subcategory.route_slug ?? slugify(subcategory.name);
              const href = route
                ? `/services/${route.category}/${route.service}`
                : `/services/${categorySlug}/${serviceSlug}`;
              const SubIcon = getCategoryIcon(subcategory.name);
              return (
                <li key={subcategory.id}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-[14px] text-brand-terracotta hover:text-brand-terracotta/80 hover:underline transition-colors"
                  >
                    {subcategory.icon_url ? (
                      <Image
                        src={subcategory.icon_url}
                        alt={subcategory.name}
                        width={16}
                        height={16}
                        className="h-4 w-4 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <SubIcon className="h-4 w-4 shrink-0" />
                    )}
                    {subcategory.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
}

// Hero Section
function ServicesHero({ heroImage }: { heroImage: string }) {
  return (
    <section className="relative h-[400px] md:h-[500px] bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Services Hero"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl px-12 py-10 text-center max-w-2xl mx-auto shadow-xl">
          <h1 className="text-[48px] md:text-[56px] font-bold text-brand-dark-alt mb-4 leading-tight">
            Your to-do list is on us.
          </h1>
          <p className="text-[22px] md:text-[26px] text-brand-dark-alt font-medium">
            Hire a trusted 100 Handy Pro today.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(categoryImages);
  const [heroImage, setHeroImage] = useState('/images/services/hero.jpeg')

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const [data, imageSettings] = await Promise.all([
          getCategoryTree(),
          getServiceWebImageSettings({
            hero: '/images/services/hero.jpeg',
            mainCategoryImages: categoryImages,
          }),
        ])
        // Only show main categories (level 0)
        setCategories(data);
        setImageOverrides(imageSettings.mainCategoryImages ?? categoryImages)
        setHeroImage(imageSettings.hero ?? '/images/services/hero.jpeg')
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <ServicesHero heroImage={heroImage} />

        {/* Services Grid */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No services available at the moment.</p>
              </div>
            )}

            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <ServiceCategoryCard key={category.id} category={category} imageOverrides={imageOverrides} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
