"use client";

import Link from "next/link";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

// Service category data structure with images
interface ServiceCategory {
  title: string;
  slug: string;
  description: string;
  image: string;
  services: Array<{ name: string; slug: string }>;
  moreLink?: string;
}

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

const serviceCategories: ServiceCategory[] = [
  {
    title: "Featured Tasks",
    slug: "featured-tasks",
    description: "Let Taskers help tackle your to-do list.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    services: [
      { name: "Furniture Assembly", slug: "furniture-assembly" },
      { name: "Home Repairs", slug: "home-repairs" },
      { name: "Help Moving", slug: "help-moving" },
      { name: "Heavy Lifting", slug: "heavy-lifting" },
      { name: "Home Cleaning", slug: "home-cleaning" },
      { name: "Spring Cleaning", slug: "spring-cleaning" },
      { name: "Personal Assistant", slug: "personal-assistant" },
      { name: "Hang Art, Mirror & Decor", slug: "hang-art-mirror-and-decor" },
      { name: "Yard Work Services", slug: "yard-work-services" },
      { name: "Wait in Line", slug: "wait-in-line" },
      { name: "Closet Organization Service", slug: "closet-organization-service" },
    ],
  },
  {
    title: "Handyman",
    slug: "handyman",
    description: "Hire a Tasker for help around the house",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop",
    services: [
      { name: "Door, Cabinet, & Furniture Repair", slug: "door-cabinet-and-furniture-repair" },
      { name: "Appliance Installation & Repairs", slug: "appliance-installation-and-repairs" },
      { name: "Furniture Assembly", slug: "furniture-assembly" },
      { name: "TV Mounting", slug: "tv-mounting" },
      { name: "Drywall Repair Service", slug: "drywall-repair-service" },
      { name: "Flooring & Tiling Help", slug: "flooring-and-tiling-help" },
      { name: "Electrical Help", slug: "electrical-help" },
      { name: "Sealing & Caulking", slug: "sealing-and-caulking" },
      { name: "Plumbing", slug: "plumbing" },
      { name: "Window & Blinds Repair", slug: "window-and-blinds-repair" },
      { name: "Ceiling Fan Installation", slug: "ceiling-fan-installation" },
      { name: "Smart Home Installation", slug: "smart-home-installation" },
    ],
  },
  {
    title: "Moving Services",
    slug: "moving-services",
    description: "From the heavy lifting to unpacking and organizing make your move with 100Handy!",
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop",
    services: [
      { name: "Help Moving", slug: "help-moving" },
      { name: "Truck Assisted Help Moving", slug: "truck-assisted-help-moving" },
      { name: "Packing Services & Help", slug: "packing-services-and-help" },
      { name: "Unpacking Services", slug: "unpacking-services" },
      { name: "Heavy Lifting", slug: "heavy-lifting" },
      { name: "Local Movers", slug: "local-movers" },
    ],
  },
  {
    title: "Furniture Assembly",
    slug: "furniture-assembly",
    description: "Get help assembling your furniture quickly and correctly.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    services: [
      { name: "Furniture Assembly", slug: "furniture-assembly" },
      { name: "Patio Furniture Assembly", slug: "patio-furniture-assembly" },
      { name: "Desk Assembly", slug: "desk-assembly" },
      { name: "Dresser Assembly", slug: "dresser-assembly" },
      { name: "Bed Assembly", slug: "bed-assembly" },
      { name: "Bookshelf Assembly", slug: "bookshelf-assembly" },
    ],
  },
  {
    title: "Mounting & Installation",
    slug: "mounting-and-installation",
    description: "Wall Mounting",
    image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=600&fit=crop",
    services: [
      { name: "TV Mounting", slug: "tv-mounting" },
      { name: "Install Shelves, Rods & Hooks", slug: "install-shelves-rods-and-hooks" },
      { name: "Ceiling Fan Installation", slug: "ceiling-fan-installation" },
      { name: "Install Blinds & Window Treatments", slug: "install-blinds-and-window-treatments" },
      { name: "Hang Art, Mirror & Decor", slug: "hang-art-mirror-and-decor" },
      { name: "General Mounting", slug: "general-mounting" },
    ],
  },
  {
    title: "Cleaning",
    slug: "cleaning",
    description: "Taskers will make your home sparkle!",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop",
    services: [
      { name: "House Cleaning Services", slug: "house-cleaning-services" },
      { name: "Deep Cleaning", slug: "deep-cleaning" },
      { name: "Disinfecting Services", slug: "disinfecting-services" },
      { name: "Move In Cleaning", slug: "move-in-cleaning" },
      { name: "Move Out Cleaning", slug: "move-out-cleaning" },
      { name: "Vacation Rental Cleaning", slug: "vacation-rental-cleaning" },
    ],
  },
  {
    title: "Shopping + Delivery",
    slug: "shopping-and-delivery",
    description: "Get anything from groceries to furniture",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop",
    services: [
      { name: "Delivery Service", slug: "delivery-service" },
      { name: "Grocery Shopping & Delivery", slug: "grocery-shopping-and-delivery" },
      { name: "Running Your Errands", slug: "running-your-errands" },
      { name: "Wait in Line", slug: "wait-in-line" },
      { name: "Deliver Big Piece of Furniture", slug: "deliver-big-piece-of-furniture" },
      { name: "Drop Off Donations", slug: "drop-off-donations" },
    ],
  },
  {
    title: "IKEA Services",
    slug: "ikea-services",
    description: "Hire a Tasker for all your IKEA needs",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    services: [
      { name: "Light Installation", slug: "light-installation" },
      { name: "Furniture Removal", slug: "furniture-removal" },
      { name: "Smart Home Installation", slug: "smart-home-installation" },
      { name: "Organization", slug: "organization" },
      { name: "Furniture Assembly", slug: "furniture-assembly" },
      { name: "General Mounting", slug: "general-mounting" },
    ],
  },
  {
    title: "Yardwork Services",
    slug: "yardwork-services",
    description: "Hire a Tasker to help with yardwork & landscaping!",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop",
    services: [
      { name: "Gardening Services", slug: "gardening-services" },
      { name: "Weed Removal", slug: "weed-removal" },
      { name: "Lawn Care Services", slug: "lawn-care-services" },
      { name: "Lawn Mowing Services", slug: "lawn-mowing-services" },
      { name: "Landscaping Services", slug: "landscaping-services" },
      { name: "Gutter Cleaning", slug: "gutter-cleaning" },
    ],
  },
];

// Service Category Card Component
function ServiceCategoryCard({ category }: { category: ServiceCategory }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Category Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category Content */}
      <div className="p-6">
        <h2 className="text-[20px] font-bold text-[#30352D] mb-2">
          {category.title}
        </h2>
        <p className="text-[14px] text-gray-600 mb-4">
          {category.description}
        </p>

        {/* Service Links */}
        <ul className="space-y-2 mb-4">
          {category.services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${category.slug}/${service.slug}`}
                className="text-[14px] text-brand-terracotta hover:text-brand-terracotta/80 hover:underline transition-colors"
              >
                {service.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* See More Link */}
        <Link
          href={`/services#${category.slug}`}
          className="text-[14px] text-brand-terracotta hover:text-brand-terracotta/80 font-medium hover:underline transition-colors"
        >
          See more {category.title} services →
        </Link>
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
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <ServicesHero />

        {/* Services Grid */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.map((category) => (
                <ServiceCategoryCard key={category.title} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
