import { Header, Footer } from "@/components/layout";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import { getServiceWebImageSettings } from "@/lib/content-platform";
import { getCategoryByRouteSlug, getMainCategories, getSubcategories } from "@/lib/supabase/categories";

const HANDYMAN_CATEGORY_META = {
  title: "Handyman Services",
  description:
    "Expert help for every odd job, repair, and upgrade in your home - from assembly and painting to plumbing and electrical work.",
  heroImage: "/images/services/home-repairs/hero.jpeg",
  services: [
    {
      slug: "general",
      title: "General Handyman Services",
      description: "Expert help for every odd job, repair, and upgrade in your home.",
      contentImage: undefined as string | undefined,
    },
  ],
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const dbCategory = await getCategoryByRouteSlug(category);
  const meta = category === "handyman" ? HANDYMAN_CATEGORY_META : undefined;
  const resolvedTitle =
    dbCategory?.marketing_title || dbCategory?.name || meta?.title;
  const resolvedDescription =
    dbCategory?.marketing_description || dbCategory?.description || meta?.description;

  if (!resolvedTitle) {
    return { title: "Services | 100 Handy" };
  }

  return {
    title: `${resolvedTitle} Services | 100 Handy`,
    description: resolvedDescription || "Browse services from trusted 100 Handy Pros.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const imageSettings = await getServiceWebImageSettings({ categoryHeroImages: {} })
  const dbCategory = await getCategoryByRouteSlug(category);
  const meta = category === "handyman" ? HANDYMAN_CATEGORY_META : undefined;
  const dbChildren = dbCategory ? await getSubcategories(dbCategory.id) : [];

  if ((!meta && !dbCategory) || (!meta?.services && dbChildren.length === 0)) {
    notFound();
  }

  const fallbackMeta = meta || {
    title: dbCategory?.marketing_title || dbCategory?.name || 'Services',
    description:
      dbCategory?.marketing_description ||
      dbCategory?.description ||
      'Browse services from trusted 100 Handy Pros.',
    heroImage: '/images/services/hero.jpeg',
  };

  const resolvedMeta = {
    ...fallbackMeta,
    title: dbCategory?.marketing_title || fallbackMeta.title,
    description:
      dbCategory?.marketing_description ||
      dbCategory?.description ||
      fallbackMeta.description,
    heroImage:
      imageSettings.categoryHeroImages?.[category] ??
      dbCategory?.hero_image_url ??
      fallbackMeta.heroImage,
  }

  // Get all services in this category
  const services =
    dbChildren.length > 0
      ? dbChildren.map((service) => ({
          slug: service.route_slug || service.name.toLowerCase().replace(/\s+/g, '-'),
          title: service.marketing_title || service.name,
          description:
            service.marketing_description ||
            service.description ||
            `Book ${service.name} with a trusted 100 Handy Pro.`,
          contentImage: service.content_image_url || undefined,
        }))
      : meta?.services || [];

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
              {resolvedMeta.title}
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
  const dbCategories = await getMainCategories();
  const dbParams = dbCategories
    .map((item) => item.route_slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ category: slug }));
  const fallbackParams = [{ category: "handyman" }];
  const seen = new Set<string>();

  return [...dbParams, ...fallbackParams].filter((item) => {
    if (seen.has(item.category)) return false;
    seen.add(item.category);
    return true;
  });
}
