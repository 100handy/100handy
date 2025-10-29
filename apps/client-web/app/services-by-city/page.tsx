"use client";
import React from 'react';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";

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
    <section className="bg-brand-dark h-[261px] flex items-center justify-center">
      <div className="max-w-[1920px] mx-auto px-8 flex items-center justify-center">
        <svg width="250" height="190" viewBox="0 0 250 190" className="text-brand-sage">
          <circle cx="100" cy="60" r="35" fill="currentColor" opacity="0.6" />
          <polygon points="125,90 200,180 50,180" fill="currentColor" opacity="0.6" />
        </svg>
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
                    <a
                      href="#"
                      className="text-[18px] text-brand-terracotta hover:underline transition-colors"
                    >
                      {neighborhood}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
      title: "Choose a Handy by price, skills, and reviews.",
      bgColor: "bg-brand-terracotta"
    },
    {
      number: 2,
      title: "Schedule your 100Handy tasker as early as today.",
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
    <button className="fixed bottom-6 left-6 bg-[#A0B194] text-white p-4 rounded-full shadow-lg hover:bg-[#8a9a7e] transition-colors flex items-center justify-center">
      <HelpIcon />
    </button>
  );
};

// --- Main Page Component --- //

export default function ServicesByCityPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header currentPage="services" />
      <HeroSection />
      <CitiesSection />
      <HowItWorksSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
