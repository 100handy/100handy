"use client";

import Link from "next/link";
import Image from "next/image";
import { useGroupedSubcategories } from "@shared/supabase";
import { useMemo } from "react";

// Map service names to their card images (case-insensitive lookup via lowercase key)
const serviceImages: Record<string, string> = {
  // Assembly
  "furniture assembly": "/images/home/furniture-assembly.jpeg",
  "ikea assembly": "/images/services/assembly/ikea-assembly.jpeg",
  "office furniture assembly": "/images/services/assembly/office-furniture-assembly.jpeg",
  "wardrobe assembly": "/images/services/assembly/wardrobe-assembly.png",
  "crib assembly": "/images/services/assembly/crib-assembly.jpeg",
  // Mounting
  "tv mounting": "/images/home/tv.jpeg",
  "wall mounting": "/images/services/mounting/wall-mounting.jpeg",
  "shelf mounting": "/images/services/mounting/shelf-mounting.jpeg",
  "put up shelves": "/images/services/mounting/shelf-mounting.jpeg",
  "hanging pictures and artwork": "/images/services/mounting/hanging-pictures.jpeg",
  "install curtains and blinds": "/images/home/blinds.png",
  "curtains and blinds": "/images/home/blinds.png",
  "light fixture installation": "/images/services/mounting/light-fixture-installation.jpeg",
  // Home Repairs
  "home repairs": "/images/services/main/home-repairs.jpeg",
  "minor home repairs": "/images/services/home-repairs/minor-home-repairs.jpeg",
  "door, cabinet, and furniture repairs": "/images/services/home-repairs/door-cabinet-furniture-repairs.jpeg",
  "sealing and caulking": "/images/services/home-repairs/sealing-and-caulking.jpeg",
  "flooring and tiling help": "/images/services/home-repairs/flooring-and-tiling.jpeg",
  "light carpentry": "/images/services/home-repairs/light-carpentry.jpeg",
  "window and blinds repair": "/images/services/home-repairs/window-blinds-repair.jpeg",
  // Plumbing
  "plumbing": "/images/home/plumber.jpeg",
  "leak fixing": "/images/home/plumber.jpeg",
  "drain unblocking": "/images/services/plumbing/drain-unblocking.jpeg",
  "tap replacement": "/images/services/plumbing/tap-replacement.jpeg",
  "washing machine installation": "/images/services/plumbing/washing-machine-installation.jpeg",
  "water filter installation": "/images/services/plumbing/water-filter-installation.jpeg",
  // Electrical
  "light installation": "/images/home/light.png",
  "sockets installation and repair": "/images/services/electrical/sockets-installation-repair.jpeg",
  "switches installation and repair": "/images/services/electrical/switches-installation-repair.jpeg",
  "cables repair": "/images/services/electrical/cables-repair.jpeg",
  // Cleaning
  "deep clean": "/images/home/deepclean.png",
  "deep cleaning": "/images/home/deepclean.png",
  "clean": "/images/services/cleaning/clean.jpeg",
  "party clean up": "/images/services/cleaning/party-clean-up.jpeg",
  "end of tenancy": "/images/services/cleaning/end-of-tenancy.jpeg",
  "office cleaning": "/images/services/cleaning/office-cleaning.jpeg",
  "airbnb cleaning": "/images/services/cleaning/airbnb-cleaning.jpeg",
  // Moving
  "moving help": "/images/services/moving/moving-help.png",
  "packing and moving": "/images/services/moving/packing-and-moving.jpeg",
  "van assisted moving help": "/images/services/moving/van-assisted-moving.jpeg",
  "heavy lifting and loading": "/images/services/moving/heavy-lifting-loading.jpeg",
  "full service movers": "/images/services/moving/full-service-movers.jpg",
  // Outdoor
  "gardening": "/images/home/gardening.jpeg",
  "gutter cleaning": "/images/home/guttercleaning.jpeg",
  "roof and gutter cleaning": "/images/home/guttercleaning.jpeg",
  "landscaping": "/images/services/outdoor/landscaping.jpeg",
  "lawn care": "/images/services/outdoor/lawn-care.jpeg",
  "branch and hedge trimming": "/images/services/outdoor/branch-hedge-trimming.jpeg",
  "leaf raking and removal": "/images/services/outdoor/leaf-raking-removal.jpeg",
};

// Fallback when DB is unavailable — matches doc's Popular Services list
const fallbackServices = [
  { title: "Furniture Assembly", category: "Furniture Assembly", price: "From £36" },
  { title: "TV Mounting", category: "TV Mounting", price: "From £45" },
  { title: "Install Curtains and Blinds", category: "Install Curtains and Blinds", price: "From £35" },
  { title: "Plumbing", category: "Plumbing", price: "From £40" },
  { title: "Light Installation", category: "Light Installation", price: "From £38" },
  { title: "Deep Clean", category: "Deep Clean", price: "From £55" },
  { title: "Gardening", category: "Gardening", price: "From £40" },
  { title: "Gutter Cleaning", category: "Gutter Cleaning", price: "From £45" },
];

function ServiceCardImage({ title }: { title: string }) {
  const img = serviceImages[title.toLowerCase()];

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
