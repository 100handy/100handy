"use client";
import React from 'react';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";

// --- Services Data from Figma --- //
const services = [
  "Appliance Repair Near Me",
  "Blind Repairs Near Me",
  "Cabinet Installation Help Near Me",
  "Carpet Cleaning Near Me",
  "Ceiling Fan Installation Help Near Me",
  "Drywall Repair & Patching Near Me",
  "Furniture Assembly Near Me",
  "Furniture Removal Help Near Me",
  "Gutter Cleaning Near Me",
  "Handyman Near Me – Find a Local Handyman",
  "Hedge Trimming Near Me",
  "Moving Help Near Me",
  "House Cleaning Near Me",
  "Air Conditioner Installation Near Me",
  "Junk Removal Near Me",
  "Lawn Mowing & Trimming Near Me",
  "Painting Help Near Me",
  "Pressure Washing Near Me",
  "TV Mounting Near Me",
  "Wallpapering Near Me"
];

// --- Components --- //

const ServicesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h1 className="text-[44px] font-bold text-brand-dark-alt mb-16">
          Find the best home services taskers nearby
        </h1>

        <div className="space-y-6">
          {services.map((service) => (
            <div key={service}>
              <a
                href="#"
                className="text-[22px] text-brand-terracotta hover:underline transition-colors inline-block"
              >
                {service}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HelpButton = () => {
  return (
    <button className="fixed bottom-6 left-6 bg-[#A0B194] text-white p-4 rounded-full shadow-lg hover:bg-[#8a9a7e] transition-colors flex items-center justify-center">
      <HelpIcon />
    </button>
  );
};

// --- Main Page Component --- //

export default function AllServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <ServicesSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
