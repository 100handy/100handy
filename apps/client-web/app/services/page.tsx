"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { getCategoryTree } from "@/lib/supabase/categories";
import type { CategoryWithChildren } from "@/lib/supabase/types";

// Helper function to create slug from service name
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Default images for different category types (can be customized later)
const getCategoryImage = (categoryName: string): string => {
  const imageMap: Record<string, string> = {
    'Furniture & Assembly': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    'Home Cleaning & Maintenance': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop',
    'Handyman & Home Repairs': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
    'Moving & Heavy Lifting': 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop',
    'Mounting & Installation': 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=600&fit=crop',
    'Yard & Outdoor Services': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop',
    'Errands, Shopping & Delivery': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
    'Beauty & Grooming Services': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    'Men\'s Grooming & At-Home Treatments': 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&h=600&fit=crop',
  };

  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop';
};

// Service Category Card Component
function ServiceCategoryCard({ category }: { category: CategoryWithChildren }) {
  const slug = slugify(category.name);
  const subcategories = category.subcategories || [];

  // Get first 6 subcategories to display
  const displayedSubcategories = subcategories.slice(0, 6);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Category Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={category.icon_url || getCategoryImage(category.name)}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category Content */}
      <div className="p-6">
        <h2 className="text-[20px] font-bold text-[#30352D] mb-2">
          {category.name}
        </h2>
        <p className="text-[14px] text-gray-600 mb-4">
          {category.description || `Explore ${category.name} services`}
        </p>

        {/* Subcategory Links */}
        {displayedSubcategories.length > 0 && (
          <ul className="space-y-2 mb-4">
            {displayedSubcategories.map((subcategory) => (
              <li key={subcategory.id}>
                <Link
                  href={`/services/${slug}/${slugify(subcategory.name)}`}
                  className="text-[14px] text-brand-terracotta hover:text-brand-terracotta/80 hover:underline transition-colors"
                >
                  {subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* See More Link */}
        {subcategories.length > 6 && (
          <Link
            href={`/services#${slug}`}
            className="text-[14px] text-brand-terracotta hover:text-brand-terracotta/80 font-medium hover:underline transition-colors"
          >
            See more {category.name} services →
          </Link>
        )}
      </div>
    </div>
  );
}

// Hero Section
function ServicesHero() {
  return (
    <section className="relative h-[400px] md:h-[500px] bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=600&fit=crop"
          alt="Services Hero"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-[48px] md:text-[64px] font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Your to-do list is on us.
          </h1>
          <p className="text-[24px] md:text-[28px] text-white font-medium drop-shadow-lg">
            Hire a trusted Tasker presto.
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

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await getCategoryTree();
        // Only show main categories (level 0)
        setCategories(data);
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
        <ServicesHero />

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
                  <ServiceCategoryCard key={category.id} category={category} />
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
