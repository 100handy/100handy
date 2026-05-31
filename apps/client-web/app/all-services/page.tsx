import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

// --- Components --- //

const AllServicesHero = ({ title, subtitle, image }: { title: string; subtitle: string; image: string }) => {
  return (
    <section className="relative h-[400px] md:h-[500px] bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="All Services"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl px-12 py-10 text-center max-w-2xl mx-auto shadow-xl">
          <h1 className="text-[48px] md:text-[56px] font-bold text-brand-dark-alt mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-[22px] md:text-[26px] text-brand-dark-alt font-medium">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = ({ services }: { services: Array<{ name: string; href: string }> }) => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">

        <div className="space-y-6 mt-12">
          {services.map((service) => (
            <div key={service.name}>
              <Link
                href={service.href}
                className="text-[22px] text-brand-terracotta hover:underline transition-colors inline-block"
              >
                {service.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HelpButton = () => {
  return (
    <button className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
      <HelpIcon />
    </button>
  );
};

// --- Main Page Component --- //

export async function generateMetadata() {
  return getPageSeoMetadata("all-services", {
    title: "All Services | 100 Handy",
    description: "Browse home services and book a trusted 100 Handy Pro.",
  });
}

export default async function AllServicesPage() {
  const c = await getPageContent("all-services");
  const services = Array.from({ length: 20 }, (_, index) => {
    const n = index + 1;
    return {
      name: c(`services.item_${n}_name`, ""),
      href: c(`services.item_${n}_link`, "/"),
    };
  }).filter((item) => item.name.trim());

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <AllServicesHero
        title={c("hero.title", "Find the Best Home Services Pros Nearby")}
        subtitle={c("hero.subtitle", "Hire a trusted 100 Handy Pro today.")}
        image={c("hero.background_image", "/images/services/hero.jpeg")}
      />
      <ServicesSection services={services} />
      <Footer />
      <HelpButton />
    </div>
  );
}
