"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";

// --- Helpers --- //
const toSlug = (name: string) =>
  name.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-');

// --- UK Cities Data --- //
const ukCities = [
  { name: "London", slug: "london" },
  { name: "Manchester", slug: "manchester" },
  { name: "Birmingham", slug: "birmingham" },
  { name: "Leeds", slug: "leeds" },
  { name: "Liverpool", slug: "liverpool" },
  { name: "Glasgow", slug: "glasgow" },
  { name: "Edinburgh", slug: "edinburgh" },
  { name: "Bristol", slug: "bristol" },
  { name: "Sheffield", slug: "sheffield" },
  { name: "Nottingham", slug: "nottingham" },
  { name: "Leicester", slug: "leicester" },
  { name: "Newcastle upon Tyne", slug: "newcastle-upon-tyne" },
  { name: "Cardiff", slug: "cardiff" },
  { name: "Belfast", slug: "belfast" },
  { name: "Coventry", slug: "coventry" },
  { name: "Brighton", slug: "brighton" },
  { name: "Southampton", slug: "southampton" },
  { name: "Reading", slug: "reading" },
  { name: "Cambridge", slug: "cambridge" },
  { name: "Oxford", slug: "oxford" },
  { name: "Norwich", slug: "norwich" },
  { name: "Exeter", slug: "exeter" },
];

// --- London Neighborhoods Data --- //
// Layout matches Figma: 3 columns x 2 rows
// Row 1: Central, North, South
// Row 2: East, West, Greater
const londonAreas = [
  {
    region: "Central London",
    neighborhoods: [
      "City of London",
      "Soho",
      "Holborn",
      "Bloomsbury",
      "Fitzrovia",
      "Covent Garden",
      "Marylebone"
    ]
  },
  {
    region: "North London",
    neighborhoods: [
      "Camden Town",
      "Islington",
      "Highgate",
      "Finsbury Park",
      "Holloway",
      "Tottenham",
      "Wood Green",
      "Barnet"
    ]
  },
  {
    region: "South London",
    neighborhoods: [
      "Brixton",
      "Clapham",
      "Peckham",
      "Greenwich",
      "Lewisham",
      "Crystal Palace",
      "Dulwich",
      "Croydon"
    ]
  },
  {
    region: "East London",
    neighborhoods: [
      "Shoreditch",
      "Bethnal Green",
      "Hackney",
      "Dalston",
      "Hoxton",
      "Whitechapel",
      "Canary Wharf",
      "Bow",
      "Leyton",
      "Stratford"
    ]
  },
  {
    region: "West London",
    neighborhoods: [
      "Notting Hill",
      "Kensington",
      "Chelsea",
      "Hammersmith",
      "Shepherd's Bush",
      "Ealing",
      "Acton",
      "Chiswick",
      "Richmond"
    ]
  },
  {
    region: "Greater London",
    neighborhoods: [
      "Wembley",
      "Harrow",
      "Watford",
      "Enfield",
      "Ilford",
      "Romford",
      "Kingston upon Thames",
      "Twickenham",
      "Bexley",
      "Sutton"
    ]
  }
];

// --- Components --- //

const HeroSection = () => {
  return (
    <section className="relative bg-brand-dark">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero/heroimage2.jpeg"
          alt="Services by City"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </div>
      <div className="relative flex min-h-[470px] items-center justify-center">
        <div className="relative z-10 bg-white rounded-2xl px-12 py-10 text-center max-w-2xl mx-8 shadow-xl">
          <h1 className="text-[48px] md:text-[56px] font-bold text-brand-dark-alt mb-4 leading-tight">
            Services by City
          </h1>
          <p className="text-[22px] md:text-[26px] text-brand-dark-alt font-medium">
            Find trusted 100 Handy Pros in your area
          </p>
        </div>
      </div>
    </section>
  );
};

const CitiesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-[44px] font-bold text-brand-dark-alt mb-16">
          Find us in these cities
        </h2>

        <div className="grid grid-cols-3 gap-x-16 gap-y-12">
          {londonAreas.map(({ region, neighborhoods }) => (
            <div key={region}>
              <h3 className="text-[22px] font-bold text-brand-dark-alt mb-6">{region}</h3>
              <ul className="space-y-3">
                {neighborhoods.map((neighborhood) => (
                  <li key={neighborhood}>
                    <Link
                      href={`/locations/${toSlug(neighborhood)}`}
                      className="text-[18px] text-brand-terracotta hover:underline transition-colors"
                    >
                      {neighborhood}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* UK Cities */}
        <h2 className="text-[44px] font-bold text-brand-dark-alt mt-20 mb-16">
          UK Cities
        </h2>

        <div className="grid grid-cols-3 gap-x-16 gap-y-4">
          {ukCities.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/locations/${slug}`}
              className="text-[18px] text-brand-terracotta hover:underline transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Choose a 100 Handy Pro by price, skills, and reviews.",
      bgColor: "bg-brand-terracotta"
    },
    {
      number: 2,
      title: "Schedule your 100 Handy Pro as early as today.",
      bgColor: "bg-brand-sage"
    },
    {
      number: 3,
      title: "Chat, pay, tip, and review all in one place.",
      bgColor: "bg-brand-sage"
    }
  ];

  return (
    <section className="bg-[#F5F3F1] py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-[33px] font-bold text-brand-dark-alt text-center mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className={`${step.bgColor} w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-[33px] font-bold">{step.number}</span>
              </div>
              <p className="text-[20px] text-brand-dark-alt leading-relaxed pt-1">
                {step.title}
              </p>
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

export default function ServicesByCityPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <HeroSection />
      <CitiesSection />
      <HowItWorksSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
