"use client";

import { Check } from "lucide-react";

const stats = [
  { label: "Furniture Assembled", value: "3.4 million+" },
  { label: "Moving tasks:", value: "1.5 million+" },
  { label: "Items Mounted:", value: "1 million+" },
  { label: "Home Repairs Made:", value: "700,000+" },
];

export function Stats() {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Assembly Card */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl">
            {/* Beige background */}
            <div className="absolute inset-0 bg-brand-cream" />
            
            {/* Dark green section on the right */}
            <div className="absolute right-0 top-0 h-full w-[58%] rounded-l-[50px] bg-[#3C423B]">
              {/* Circle decoration */}
              <div className="absolute left-[20%] top-[30%] h-28 w-28 rounded-full bg-[#5A6357]/50" />
              {/* Triangle decoration */}
              <div 
                className="absolute bottom-[20%] right-[25%] h-40 w-40 bg-[#5A6357]/50"
                style={{ 
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            </div>

            {/* White info card */}
            <div className="absolute left-8 top-1/2 z-10 w-[280px] -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-[37px] font-medium leading-tight text-brand-dark-alt">
                Assembly
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-green-500">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] leading-snug text-brand-dark-alt">
                    Assemble or disassemble furniture items including wardrobes, beds, TV units & more.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-green-500">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] leading-snug text-brand-dark-alt">
                    Now Trending: Curved sofas, computer desks, and sustainable materials.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Grid - No card backgrounds, just text */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[19px] font-medium text-brand-dark-alt">{stat.label}</p>
                <p className="mt-2 text-[26px] font-medium text-brand-terracotta">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
