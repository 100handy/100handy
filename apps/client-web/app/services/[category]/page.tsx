import { Header, Footer } from "@/components/layout";
import { notFound } from "next/navigation";
import { servicesData } from "@/lib/services-data";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import { getServiceWebImageSettings } from "@/lib/content-platform";

// Category display info with hero images
const categoryMeta: Record<string, { title: string; description: string; heroImage: string }> = {
  "furniture-assembly": {
    title: "Furniture Assembly",
    description: "From flat-pack builds to full room setups, our vetted Pros handle all your furniture assembly needs quickly and with care.",
    heroImage: "/images/services/assembly/hero.jpeg",
  },
  "tv-wall-mounting": {
    title: "TV & Wall Mounting",
    description: "Professional mounting for TVs, shelves, pictures, light fixtures, curtains, and blinds - secure, level, and built to last.",
    heroImage: "/images/services/mounting/hero.png",
  },
  "home-repairs": {
    title: "Home Repairs & Fixes",
    description: "From minor fixes to flooring, doors, windows, and carpentry - our Pros handle all your home maintenance needs.",
    heroImage: "/images/services/home-repairs/hero.jpeg",
  },
  "plumbing": {
    title: "Plumbing Services",
    description: "Leak fixing, drain unblocking, tap replacement, and appliance installation - handled by experienced plumbers.",
    heroImage: "/images/services/plumbing/hero.jpeg",
  },
  "electrical": {
    title: "Electrical Services",
    description: "Safe, reliable electrical work including lighting, sockets, switches, and cable repairs by certified electricians.",
    heroImage: "/images/services/electrical/hero.jpeg",
  },
  "cleaning": {
    title: "Cleaning Services",
    description: "Standard cleans, deep cleans, end-of-tenancy, office cleaning, and AirBnB turnover - spotless results every time.",
    heroImage: "/images/services/cleaning/hero.png",
  },
  "packing-moving": {
    title: "Packing & Moving",
    description: "Man and van, moving help, packing services, heavy lifting, and full-service moves - stress-free relocations.",
    heroImage: "/images/services/moving/hero.jpeg",
  },
  "outdoor": {
    title: "The Great Outdoors",
    description: "Gardening, lawn care, landscaping, leaf removal, gutter cleaning, and hedge trimming - your garden, transformed.",
    heroImage: "/images/services/outdoor/hero.jpeg",
  },
  "handyman": {
    title: "Handyman Services",
    description: "Expert help for every odd job, repair, and upgrade in your home - from assembly and painting to plumbing and electrical work.",
    heroImage: "/images/services/home-repairs/hero.jpeg",
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const imageSettings = await getServiceWebImageSettings({ categoryHeroImages: {} })
  const meta = categoryMeta[category];

  if (!meta) {
    return { title: "Services | 100 Handy" };
  }

  return {
    title: `${meta.title} Services | 100 Handy`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const imageSettings = await getServiceWebImageSettings({ categoryHeroImages: {} })
  const meta = categoryMeta[category];
  const categoryData = servicesData[category];

  if (!meta || !categoryData) {
    notFound();
  }

  const resolvedMeta = {
    ...meta,
    heroImage: imageSettings.categoryHeroImages?.[category] ?? meta.heroImage,
  }

  // Get all services in this category
  const services = Object.entries(categoryData).map(([slug, data]) => ({
    slug,
    ...data,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[350px] bg-brand-dark">
          <Image
            src={resolvedMeta.heroImage}
            alt={resolvedMeta.title}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <h1 className="text-[48px] font-bold text-white drop-shadow-lg">
              {meta.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[20px] text-white/90 drop-shadow-md">
              {resolvedMeta.description}
            </p>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-gray-50 py-3">
          <div className="mx-auto max-w-[1920px] px-8">
            <nav className="flex items-center gap-2 text-[14px] text-gray-500">
              <Link href="/" className="hover:text-brand-terracotta transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-brand-terracotta transition-colors">Services</Link>
              <span>/</span>
              <span className="text-brand-dark-alt font-medium">{resolvedMeta.title}</span>
            </nav>
          </div>
        </div>

        {/* Subcategory Grid */}
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1920px] px-8">
            <h2 className="mb-4 text-[31px] font-bold text-brand-dark-alt">
              {resolvedMeta.title} Services
            </h2>
            <p className="mb-10 text-[18px] text-gray-600">
              Browse our {resolvedMeta.title.toLowerCase()} services and book a trusted 100 Handy Pro today.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${category}/${service.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                >
                  {/* Service Image */}
                  <div className="relative h-[200px] overflow-hidden bg-gray-100">
                    {service.contentImage ? (
                      <Image
                        src={service.contentImage}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-dark-alt">
                        <Wrench className="h-12 w-12 text-brand-cream/30" />
                      </div>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="p-6">
                    <h3 className="mb-2 text-[20px] font-bold text-brand-dark-alt transition-colors group-hover:text-brand-terracotta">
                      {service.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-gray-600 line-clamp-3">
                      {service.description}
                    </p>
                    <span className="mt-4 inline-block text-[14px] font-medium text-brand-terracotta">
                      Learn more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  return Object.keys(categoryMeta).map((category) => ({ category }));
}
