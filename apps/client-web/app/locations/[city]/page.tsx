import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { notFound } from "next/navigation";

// City data mapping
const cityData: Record<string, { name: string; taskerCount: number; reviewCount: string }> = {
  "london": { name: "London", taskerCount: 3744, reviewCount: "500k" },
  "manchester": { name: "Manchester", taskerCount: 2100, reviewCount: "300k" },
  "birmingham": { name: "Birmingham", taskerCount: 1800, reviewCount: "250k" },
  "leeds": { name: "Leeds", taskerCount: 1200, reviewCount: "180k" },
  "liverpool": { name: "Liverpool", taskerCount: 1400, reviewCount: "200k" },
  "glasgow": { name: "Glasgow", taskerCount: 1100, reviewCount: "150k" },
  "edinburgh": { name: "Edinburgh", taskerCount: 900, reviewCount: "130k" },
  "bristol": { name: "Bristol", taskerCount: 1300, reviewCount: "190k" },
  "sheffield": { name: "Sheffield", taskerCount: 800, reviewCount: "120k" },
  "nottingham": { name: "Nottingham", taskerCount: 750, reviewCount: "110k" },
  "leicester": { name: "Leicester", taskerCount: 680, reviewCount: "95k" },
  "newcastle-upon-tyne": { name: "Newcastle upon Tyne", taskerCount: 950, reviewCount: "140k" },
  "cardiff": { name: "Cardiff", taskerCount: 720, reviewCount: "100k" },
  "belfast": { name: "Belfast", taskerCount: 650, reviewCount: "90k" },
  "coventry": { name: "Coventry", taskerCount: 580, reviewCount: "80k" },
  "brighton": { name: "Brighton", taskerCount: 870, reviewCount: "125k" },
  "southampton": { name: "Southampton", taskerCount: 640, reviewCount: "88k" },
  "reading": { name: "Reading", taskerCount: 560, reviewCount: "78k" },
  "cambridge": { name: "Cambridge", taskerCount: 620, reviewCount: "85k" },
  "oxford": { name: "Oxford", taskerCount: 600, reviewCount: "82k" },
  "norwich": { name: "Norwich", taskerCount: 430, reviewCount: "60k" },
  "exeter": { name: "Exeter", taskerCount: 380, reviewCount: "52k" },
};

// Services available in each city
const services = [
  { slug: "furniture-assembly", name: "Furniture Assembly" },
  { slug: "tv-mounting", name: "TV Mounting" },
  { slug: "handyman", name: "Handyman" },
  { slug: "home-cleaning", name: "Home Cleaning" },
  { slug: "help-moving", name: "Help Moving" },
  { slug: "home-repairs-and-fixes", name: "Home Repairs & Fixes" },
  { slug: "plumbing", name: "Plumbing" },
  { slug: "electrical", name: "Electrical" },
  { slug: "cleaning", name: "Cleaning" },
  { slug: "outdoor", name: "Outdoor Services" },
];

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityInfo = cityData[city];

  if (!cityInfo) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-8">
          <p className="text-brand-terracotta text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            {" > "}
            <Link href="/services-by-city" className="hover:underline">Locations</Link>
            {" > "}
            <span>{cityInfo.name}</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-dark py-16">
        <div className="max-w-[1920px] mx-auto px-8">
          <h1 className="text-white font-bold text-[44px] leading-tight mb-6">
            Services in {cityInfo.name}
          </h1>
          <p className="text-white text-[24px] mb-6 leading-relaxed max-w-2xl">
            Browse {cityInfo.taskerCount.toLocaleString()}+ trusted Taskers ready to help with your home projects in {cityInfo.name}.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white text-[20px] font-semibold">{cityInfo.reviewCount} Reviews</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[37px] mb-12">
            Popular services in {cityInfo.name}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/locations/${city}/${service.slug}`}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-terracotta transition-all group"
              >
                <div className="w-12 h-12 bg-brand-sage/20 rounded-full mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-brand-sage rounded-full" />
                </div>
                <h3 className="text-brand-dark-alt font-bold text-[20px] group-hover:text-brand-terracotta transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-[16px] mt-2">
                  Find {service.name.toLowerCase()} help in {cityInfo.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Help Button */}
      <button className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
        <HelpIcon />
      </button>
    </div>
  );
}

// Generate static params for cities
export async function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({ city }));
}
