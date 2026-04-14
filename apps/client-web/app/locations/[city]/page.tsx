import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { notFound } from "next/navigation";
import { FurnitureAssemblyIcon } from "@/components/icons/categories/FurnitureAssemblyIcon";
import { TvMountingIcon } from "@/components/icons/categories/TvMountingIcon";
import { MinorHomeRepairsIcon } from "@/components/icons/categories/MinorHomeRepairsIcon";
import { CleanIcon } from "@/components/icons/categories/CleanIcon";
import { MovingHelpIcon } from "@/components/icons/categories/MovingHelpIcon";
import { LightCarpentryIcon } from "@/components/icons/categories/LightCarpentryIcon";
import { LeakFixingIcon } from "@/components/icons/categories/LeakFixingIcon";
import { LightInstallationIcon } from "@/components/icons/categories/LightInstallationIcon";
import { DeepCleanIcon } from "@/components/icons/categories/DeepCleanIcon";
import { GardeningIcon } from "@/components/icons/categories/GardeningIcon";

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
  // London — Central
  "city-of-london": { name: "City of London", taskerCount: 620, reviewCount: "85k" },
  "soho": { name: "Soho", taskerCount: 580, reviewCount: "78k" },
  "holborn": { name: "Holborn", taskerCount: 540, reviewCount: "72k" },
  "bloomsbury": { name: "Bloomsbury", taskerCount: 510, reviewCount: "68k" },
  "fitzrovia": { name: "Fitzrovia", taskerCount: 490, reviewCount: "65k" },
  "covent-garden": { name: "Covent Garden", taskerCount: 530, reviewCount: "71k" },
  "marylebone": { name: "Marylebone", taskerCount: 560, reviewCount: "75k" },
  // London — North
  "camden-town": { name: "Camden Town", taskerCount: 640, reviewCount: "88k" },
  "islington": { name: "Islington", taskerCount: 610, reviewCount: "83k" },
  "highgate": { name: "Highgate", taskerCount: 420, reviewCount: "56k" },
  "finsbury-park": { name: "Finsbury Park", taskerCount: 480, reviewCount: "64k" },
  "holloway": { name: "Holloway", taskerCount: 450, reviewCount: "60k" },
  "tottenham": { name: "Tottenham", taskerCount: 520, reviewCount: "69k" },
  "wood-green": { name: "Wood Green", taskerCount: 460, reviewCount: "61k" },
  "barnet": { name: "Barnet", taskerCount: 500, reviewCount: "67k" },
  // London — South
  "brixton": { name: "Brixton", taskerCount: 590, reviewCount: "80k" },
  "clapham": { name: "Clapham", taskerCount: 630, reviewCount: "86k" },
  "peckham": { name: "Peckham", taskerCount: 520, reviewCount: "69k" },
  "greenwich": { name: "Greenwich", taskerCount: 570, reviewCount: "76k" },
  "lewisham": { name: "Lewisham", taskerCount: 510, reviewCount: "68k" },
  "crystal-palace": { name: "Crystal Palace", taskerCount: 430, reviewCount: "57k" },
  "dulwich": { name: "Dulwich", taskerCount: 440, reviewCount: "59k" },
  "croydon": { name: "Croydon", taskerCount: 600, reviewCount: "82k" },
  // London — East
  "shoreditch": { name: "Shoreditch", taskerCount: 580, reviewCount: "78k" },
  "bethnal-green": { name: "Bethnal Green", taskerCount: 510, reviewCount: "68k" },
  "hackney": { name: "Hackney", taskerCount: 620, reviewCount: "85k" },
  "dalston": { name: "Dalston", taskerCount: 480, reviewCount: "64k" },
  "hoxton": { name: "Hoxton", taskerCount: 460, reviewCount: "61k" },
  "whitechapel": { name: "Whitechapel", taskerCount: 490, reviewCount: "65k" },
  "canary-wharf": { name: "Canary Wharf", taskerCount: 550, reviewCount: "74k" },
  "bow": { name: "Bow", taskerCount: 440, reviewCount: "59k" },
  "leyton": { name: "Leyton", taskerCount: 470, reviewCount: "63k" },
  "stratford": { name: "Stratford", taskerCount: 530, reviewCount: "71k" },
  // London — West
  "notting-hill": { name: "Notting Hill", taskerCount: 560, reviewCount: "75k" },
  "kensington": { name: "Kensington", taskerCount: 590, reviewCount: "80k" },
  "chelsea": { name: "Chelsea", taskerCount: 570, reviewCount: "76k" },
  "hammersmith": { name: "Hammersmith", taskerCount: 540, reviewCount: "72k" },
  "shepherds-bush": { name: "Shepherd's Bush", taskerCount: 510, reviewCount: "68k" },
  "ealing": { name: "Ealing", taskerCount: 530, reviewCount: "71k" },
  "acton": { name: "Acton", taskerCount: 470, reviewCount: "63k" },
  "chiswick": { name: "Chiswick", taskerCount: 490, reviewCount: "65k" },
  "richmond": { name: "Richmond", taskerCount: 520, reviewCount: "69k" },
  // London — Greater
  "wembley": { name: "Wembley", taskerCount: 540, reviewCount: "72k" },
  "harrow": { name: "Harrow", taskerCount: 480, reviewCount: "64k" },
  "watford": { name: "Watford", taskerCount: 460, reviewCount: "61k" },
  "enfield": { name: "Enfield", taskerCount: 500, reviewCount: "67k" },
  "ilford": { name: "Ilford", taskerCount: 470, reviewCount: "63k" },
  "romford": { name: "Romford", taskerCount: 490, reviewCount: "65k" },
  "kingston-upon-thames": { name: "Kingston upon Thames", taskerCount: 520, reviewCount: "69k" },
  "twickenham": { name: "Twickenham", taskerCount: 450, reviewCount: "60k" },
  "bexley": { name: "Bexley", taskerCount: 430, reviewCount: "57k" },
  "sutton": { name: "Sutton", taskerCount: 440, reviewCount: "59k" },
};

type IconComponent = React.ComponentType<{ className?: string }>;

const serviceIconMap: Record<string, IconComponent> = {
  "furniture-assembly": FurnitureAssemblyIcon,
  "tv-mounting": TvMountingIcon,
  "handyman": MinorHomeRepairsIcon,
  "home-cleaning": CleanIcon,
  "help-moving": MovingHelpIcon,
  "home-repairs-and-fixes": LightCarpentryIcon,
  "plumbing": LeakFixingIcon,
  "electrical": LightInstallationIcon,
  "cleaning": DeepCleanIcon,
  "outdoor": GardeningIcon,
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
            Browse {cityInfo.taskerCount.toLocaleString()}+ trusted 100 Handy Pros ready to help with your home projects in {cityInfo.name}.
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
            Popular Services in {cityInfo.name}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = serviceIconMap[service.slug];
              return (
                <Link
                  key={service.slug}
                  href={`/locations/${city}/${service.slug}`}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-terracotta transition-all group"
                >
                  <div className="w-12 h-12 bg-brand-sage/20 rounded-full mb-4 flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6 text-brand-sage" />}
                  </div>
                  <h3 className="text-brand-dark-alt font-bold text-[20px] group-hover:text-brand-terracotta transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-[16px] mt-2">
                    Find {service.name.toLowerCase()} help in {cityInfo.name}
                  </p>
                </Link>
              );
            })}
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
