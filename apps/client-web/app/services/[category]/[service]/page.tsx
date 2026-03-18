import { Header, Footer } from "@/components/layout";
import {
  ServiceHero,
  Breadcrumb,
  ContentSection,
  ServiceHowItWorks,
  CTASection,
  FAQs,
  Cities,
} from "@/components/service-detail";
import { notFound } from "next/navigation";
import { servicesData } from "@/lib/services-data";
import type { ServiceData } from "@/lib/services-data";
import type { Metadata } from "next";

// Allow dynamic paths beyond the statically generated ones
export const dynamicParams = true;

// Find a category key that partially matches the given slug
function findCategoryKey(slug: string): string | undefined {
  if (servicesData[slug]) return slug;
  return Object.keys(servicesData).find(
    (key) => key.includes(slug) || slug.includes(key)
  );
}

// Find a service key within a category that partially matches
function findServiceKey(
  categoryData: Record<string, ServiceData>,
  slug: string
): string | undefined {
  if (categoryData[slug]) return slug;
  // Try partial match
  const partial = Object.keys(categoryData).find(
    (key) => key.includes(slug) || slug.includes(key)
  );
  if (partial) return partial;
  // Try match ignoring "-and-" (DB names include "and", data keys may not)
  const normalized = slug.replace(/-and-/g, "-");
  if (categoryData[normalized]) return normalized;
  return Object.keys(categoryData).find(
    (key) => key.replace(/-and-/g, "-").includes(normalized) || normalized.includes(key.replace(/-and-/g, "-"))
  );
}

function getServiceData(category: string, service: string): ServiceData | null {
  const categoryKey = findCategoryKey(category);
  if (!categoryKey) return null;
  const categoryData = servicesData[categoryKey];
  if (!categoryData) return null;
  const serviceKey = findServiceKey(categoryData, service);
  if (!serviceKey) return null;
  return categoryData[serviceKey] ?? null;
}

interface ServicePageProps {
  params: Promise<{
    category: string;
    service: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { category, service } = await params;
  const data = getServiceData(category, service);

  if (!data) {
    return { title: "Service Not Found | 100 Handy" };
  }

  return {
    title: `${data.title} | 100 Handy`,
    description: data.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { category, service } = await params;
  const serviceData = getServiceData(category, service);

  if (!serviceData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
          heroImage={serviceData.heroImage}
        />
        <Breadcrumb
          category={serviceData.categoryDisplay}
          service={serviceData.title}
          categorySlug={category}
        />
        <ContentSection
          title={serviceData.title}
          longDescription={serviceData.longDescription}
          benefits={serviceData.benefits}
          tasks={serviceData.tasks}
          contentImage={serviceData.contentImage}
        />
        <ServiceHowItWorks />
        <CTASection
          categoryName={serviceData.title}
          ctaImage={serviceData.contentImage}
        />
        <FAQs service={serviceData.title} faqs={serviceData.faqs} />
        <Cities service={serviceData.title} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  const params: Array<{ category: string; service: string }> = [];

  Object.keys(servicesData).forEach((category) => {
    const categoryData = servicesData[category];
    if (categoryData) {
      Object.keys(categoryData).forEach((service) => {
        params.push({ category, service });
      });
    }
  });

  return params;
}
