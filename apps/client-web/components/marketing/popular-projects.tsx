"use client";

import Link from "next/link";
import Image from "next/image";
import { useGroupedSubcategories } from "@shared/supabase";
import { useMemo } from "react";

// Map service names to their card images
const serviceImages: Record<string, string> = {
  "Furniture assembly": "/images/home/furniture-assembly.jpeg",
  "Furniture Assembly": "/images/home/furniture-assembly.jpeg",
  "IKEA assembly": "/images/home/furniture-assembly.jpeg",
  "IKEA Assembly": "/images/home/furniture-assembly.jpeg",
  "TV mounting": "/images/home/tv.jpeg",
  "TV Mounting": "/images/home/tv.jpeg",
  "Put up shelves": "/images/home/blinds.png",
  "Minor home repairs": "/images/home/light.png",
  "Deep clean": "/images/home/deepclean.png",
  "Deep Clean": "/images/home/deepclean.png",
  "Moving help": "/images/services/moving/moving-help.png",
  "Moving Help": "/images/services/moving/moving-help.png",
  "Gardening": "/images/home/gardening.jpeg",
  "Leak fixing": "/images/home/plumber.jpeg",
  "Leak Fixing": "/images/home/plumber.jpeg",
  "Light installation": "/images/home/light.png",
  "Light Installation": "/images/home/light.png",
  "Gutter cleaning": "/images/home/guttercleaning.jpeg",
  "Roof and Gutter Cleaning": "/images/home/guttercleaning.jpeg",
};

// Fallback when DB is unavailable
const fallbackServices = [
  { title: "Furniture assembly", category: "Furniture assembly", price: "From £36" },
  { title: "IKEA assembly", category: "IKEA assembly", price: "From £36" },
  { title: "TV mounting", category: "TV mounting", price: "From £45" },
  { title: "Put up shelves", category: "Put up shelves", price: "From £35" },
  { title: "Minor home repairs", category: "Minor home repairs", price: "From £40" },
  { title: "Deep clean", category: "Deep clean", price: "From £55" },
  { title: "Moving help", category: "Moving help", price: "From £45" },
  { title: "Gardening", category: "Gardening", price: "From £40" },
];

function ServiceCardImage({ title }: { title: string }) {
  const img = serviceImages[title];

  if (img) {
    return (
      <Image
        src={img}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
    );
  }

  return (
    <>
      <div className="absolute left-[25%] top-[35%] h-16 w-16 rounded-full bg-[#5A6357]/60" />
      <div
        className="absolute bottom-[20%] right-[25%] h-24 w-24 bg-[#5A6357]/60"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
    </>
  );
}

export function PopularProjects() {
  const { data: grouped, isLoading } = useGroupedSubcategories();

  const services = useMemo(() => {
    if (!grouped || grouped.length === 0) return fallbackServices;
    const items: { title: string; category: string; price: string }[] = [];
    for (const main of grouped) {
      const subs = main.subcategories?.slice(0, 2) ?? [];
      for (const sub of subs) {
        if (items.length >= 8) break;
        items.push({
          title: sub.name,
          category: sub.name,
          price: "From £36",
        });
      }
      if (items.length >= 8) break;
    }
    return items.length > 0 ? items : fallbackServices;
  }, [grouped]);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[31px] font-medium text-brand-dark-alt">
          Popular Services
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(isLoading ? fallbackServices : services).map((service, index) => (
            <Link
              key={`${service.category}-${index}`}
              href={`/task-form?category=${encodeURIComponent(service.category)}`}
              className="group cursor-pointer"
            >
              {/* Project Image */}
              <div className="relative mb-4 h-[180px] overflow-hidden rounded-xl bg-[#3C423B]">
                <ServiceCardImage title={service.title} />
              </div>

              {/* Service Info */}
              <h3 className="text-[19px] font-medium text-brand-dark-alt transition-colors group-hover:text-brand-terracotta">
                {service.title}
              </h3>
              <p className="mt-1 text-[16px] font-light text-brand-dark-alt">
                {service.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
