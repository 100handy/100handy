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
import { getBookingCategoryForService } from "@/lib/booking-categories";
import type { Metadata } from "next";
import { getMainCategories, getServiceCategoryByRoute, getSubcategories } from "@/lib/supabase/categories";

// Allow dynamic paths beyond the statically generated ones
export const dynamicParams = true;

const HANDYMAN_SERVICE = {
  title: "General Handyman Services",
  description: "Expert help for every odd job, repair, and upgrade in your home.",
  category: "handyman",
  categoryDisplay: "Handyman Services",
  longDescription:
    "From assembly and furniture setup to painting, light installation, plumbing, wall mounting, gardening, electrical work, home renovation, general repairs, and carpentry - our skilled Pros handle it all. Whatever the job, big or small, we connect you with trusted handymen who arrive prepared with the right tools and expertise to get it done right.",
  heroImage: "/images/services/home-repairs/hero.jpeg",
  benefits: [
    { title: "Trusted & Vetted Pros", description: "Every Pro is background-checked, reviewed, and rated." },
    { title: "Wide Range of Services", description: "Assembly, mounting, repairs, painting, and more." },
    { title: "Seamless Booking", description: "Find, hire, and pay through our secure platform." },
    { title: "Happiness Pledge", description: "If something isn't right, we'll work to make it right." },
  ],
  tasks: [
    { title: "Assembly", description: "Build it right the first time. We assemble furniture, shelves, desks, cabinets, and more." },
    { title: "Furniture Assembly", description: "From flat-packs to heavy pieces, our pros handle setup with care." },
    { title: "Painting", description: "Freshen up walls and rooms with clean, professional results." },
    { title: "Home Repairs", description: "Minor repairs, fixes, adjustments, and general maintenance." },
  ],
  faqs: [
    { question: "What can a handyman help with?", answer: "Assembly, repairs, painting, mounting, carpentry, gardening, and more." },
    { question: "Do I need to provide tools?", answer: "No. Pros come prepared with the tools needed for most jobs." },
    { question: "Can I combine multiple jobs in one booking?", answer: "Yes. You can discuss multiple tasks with your Pro before the visit." },
    { question: "How quickly can I book a handyman?", answer: "Same-day and next-day availability is often possible depending on your area." },
  ],
};

interface ServicePageProps {
  params: Promise<{
    category: string;
    service: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { category, service } = await params;
  if (category === "handyman" && service === "general") {
    return {
      title: `${HANDYMAN_SERVICE.title} | 100 Handy`,
      description: HANDYMAN_SERVICE.description,
    };
  }
  const dbResolved = await getServiceCategoryByRoute(category, service);
  if (dbResolved) {
    return {
      title: `${dbResolved.service.marketing_title || dbResolved.service.name} | 100 Handy`,
      description:
        dbResolved.service.marketing_description ||
        dbResolved.service.description ||
        "Book a trusted 100 Handy Pro.",
    };
  }
  return { title: "Service Not Found | 100 Handy" };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { category, service } = await params;
  const isHandymanGeneral = category === "handyman" && service === "general";
  const dbResolved = await getServiceCategoryByRoute(category, service);

  if (!isHandymanGeneral && !dbResolved) {
    notFound();
  }

  const serviceData = dbResolved
    ? {
        title: dbResolved.service.marketing_title || dbResolved.service.name,
        description:
          dbResolved.service.marketing_description ||
          dbResolved.service.description ||
          "Book a trusted 100 Handy Pro.",
        category,
        categoryDisplay:
          dbResolved.parent.marketing_title ||
          dbResolved.parent.name,
        longDescription:
          dbResolved.service.long_description ||
          dbResolved.service.marketing_description ||
          dbResolved.service.description ||
          "",
        heroImage: dbResolved.service.hero_image_url || dbResolved.parent.hero_image_url || undefined,
        contentImage: dbResolved.service.content_image_url || undefined,
        benefits: dbResolved.service.benefits_json || [],
        tasks: dbResolved.service.tasks_json || [],
        faqs: dbResolved.service.faqs_json || [],
        isSubcategory: true,
      }
    : HANDYMAN_SERVICE;
  const categoryKey = category;
  const serviceKey = service;
  const bookingCategory = getBookingCategoryForService(categoryKey, serviceKey) ?? serviceData.title;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
          heroImage={serviceData.heroImage}
          bookingCategory={bookingCategory}
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
          categoryName={bookingCategory}
          ctaImage={serviceData.contentImage}
        />
        <FAQs service={serviceData.title} faqs={serviceData.faqs} />
        <Cities service={serviceData.title} serviceSlug={service} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  const params: Array<{ category: string; service: string }> = [];
  const seen = new Set<string>();
  params.push({ category: "handyman", service: "general" });
  seen.add("handyman/general");

  const mainCategories = await getMainCategories();
  for (const category of mainCategories) {
    if (!category.route_slug) continue
    const children = await getSubcategories(category.id)
    for (const service of children) {
      if (!service.route_slug) continue
      const key = `${category.route_slug}/${service.route_slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ category: category.route_slug, service: service.route_slug })
      }
    }
  }

  return params;
}
