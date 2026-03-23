"use client";

import Link from "next/link";

interface CitiesProps {
  service: string;
  serviceSlug?: string;
}

// Helper function to create slug from city name
function slugifyCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// Helper function to create slug from service name
function slugifyService(service: string): string {
  return service
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const citiesColumns = [
  ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Glasgow", "Edinburgh"],
  ["Bristol", "Sheffield", "Nottingham", "Leicester", "Newcastle upon Tyne"],
  ["Cardiff", "Belfast", "Coventry", "Brighton", "Southampton"],
  ["Reading", "Cambridge", "Oxford", "Norwich", "Exeter"],
];

export function Cities({ service, serviceSlug: propSlug }: CitiesProps): React.JSX.Element {
  const serviceSlug = propSlug || slugifyService(service);

  return (
    <section className="bg-[#F5F3F1] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-[39px] font-bold text-brand-dark-alt">
          Find {service} Services in
        </h2>

        <div className="grid gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {citiesColumns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((city) => {
                const citySlug = slugifyCity(city);
                return (
                  <Link
                    key={city}
                    href={`/locations/${citySlug}/${serviceSlug}`}
                    className="block text-[24px] text-brand-dark-alt hover:text-brand-terracotta transition-colors"
                  >
                    {city}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

