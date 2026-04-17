"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";

// --- Services Data with Links --- //
const services = [
  { name: "Appliance Repair Near Me", href: "/services/home-repairs/home-repairs" },
  { name: "Blind Repairs Near Me", href: "/services/home-repairs/home-repairs" },
  { name: "Cabinet Installation Help Near Me", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "Carpet Cleaning Near Me", href: "/services/cleaning/sparkle-clean" },
  { name: "Ceiling Fan Installation Help Near Me", href: "/services/electrical/electricians" },
  { name: "Drywall Repair & Patching Near Me", href: "/services/home-repairs/home-repairs" },
  { name: "Furniture Assembly Near Me", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "Furniture Removal Help Near Me", href: "/services/packing-moving/moving" },
  { name: "Gutter Cleaning Near Me", href: "/services/outdoor/great-outdoors" },
  { name: "Handyman Near Me", href: "/services/handyman/general" },
  { name: "Hedge Trimming Near Me", href: "/services/outdoor/great-outdoors" },
  { name: "Moving Help Near Me", href: "/services/packing-moving/moving" },
  { name: "House Cleaning Near Me", href: "/services/cleaning/sparkle-clean" },
  { name: "Air Conditioner Installation Near Me", href: "/services/electrical/electricians" },
  { name: "Junk Removal Near Me", href: "/services/packing-moving/moving" },
  { name: "Lawn Mowing & Trimming Near Me", href: "/services/outdoor/great-outdoors" },
  { name: "Painting Help Near Me", href: "/services/home-repairs/home-repairs" },
  { name: "Pressure Washing Near Me", href: "/services/outdoor/great-outdoors" },
  { name: "TV Mounting Near Me", href: "/services/tv-wall-mounting/tv-mounting" },
  { name: "Wallpapering Near Me", href: "/services/home-repairs/home-repairs" },
];

// --- Components --- //

const AllServicesHero = () => {
  return (
    <section className="relative h-[400px] md:h-[500px] bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src="/images/services/hero.jpeg"
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
            Find the Best Home Services Pros Nearby
          </h1>
          <p className="text-[22px] md:text-[26px] text-brand-dark-alt font-medium">
            Hire a trusted 100 Handy Pro today.
          </p>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
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

export default function AllServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <AllServicesHero />
      <ServicesSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
