"use client";

import { Check } from "lucide-react";
import { useHomeCategory } from "./home-category-context";

type CategoryContent = {
  title: string;
  bullets: [string, string];
  stats: [string, string][];
};

const categoryContent: Record<string, CategoryContent> = {
  Assembly: {
    title: "Assembly",
    bullets: [
      "Assemble or disassemble furniture items including wardrobes, beds, TV units & more.",
      "Now Trending: Curved sofas, computer desks, and sustainable materials.",
    ],
    stats: [
      ["Furniture Assembled", "3.4 million+"],
      ["IKEA Pieces Built", "1.2 million+"],
      ["Wardrobes Installed", "800,000+"],
      ["Office Furniture Set Up", "500,000+"],
    ],
  },
  Mounting: {
    title: "Mounting",
    bullets: [
      "Get that perfectly straight finish. Our pros mount TVs, shelves, curtains, and more.",
      "Secure mounting with the right tools and a clean, professional result.",
    ],
    stats: [
      ["Items Mounted", "1 million+"],
      ["TVs Hung", "600,000+"],
      ["Shelves Installed", "400,000+"],
      ["Pictures & Art Hung", "300,000+"],
    ],
  },
  "Home Repairs": {
    title: "Home Repairs",
    bullets: [
      "Quick fixes and touch-ups that keep your home feeling solid and well maintained.",
      "From squeaky doors to loose hinges—small issues handled with care.",
    ],
    stats: [
      ["Home Repairs Made", "700,000+"],
      ["Doors Fixed", "250,000+"],
      ["Furniture Repaired", "200,000+"],
      ["Paint Touch-Ups", "150,000+"],
    ],
  },
  Plumbing: {
    title: "Plumbing",
    bullets: [
      "Drips, leaks, and drains—our plumbing pros get things back to normal.",
      "Clean, efficient repairs and installations when you need them.",
    ],
    stats: [
      ["Leaks Fixed", "400,000+"],
      ["Drains Unblocked", "300,000+"],
      ["Taps Replaced", "200,000+"],
      ["Appliances Installed", "150,000+"],
    ],
  },
  Electrical: {
    title: "Electrical",
    bullets: [
      "Power problems, new lights, socket issues—handled with safety and care.",
      "Installations and repairs with attention to detail.",
    ],
    stats: [
      ["Lights Installed", "350,000+"],
      ["Sockets Repaired", "200,000+"],
      ["Switches Fixed", "150,000+"],
      ["Cables Repaired", "100,000+"],
    ],
  },
  Cleaning: {
    title: "Cleaning",
    bullets: [
      "A cleaner space changes everything. Regular cleans to deep refreshes.",
      "Homes, offices, and rentals looking sharp and feeling brand new.",
    ],
    stats: [
      ["Homes Cleaned", "2 million+"],
      ["Deep Cleans Done", "500,000+"],
      ["End of Tenancy", "300,000+"],
      ["Office Cleans", "200,000+"],
    ],
  },
  Moving: {
    title: "Moving",
    bullets: [
      "Help packing, lifting, loading, and shifting—move faster with less effort.",
      "Less chaos, fewer backaches, and a smoother transition.",
    ],
    stats: [
      ["Moving Tasks", "1.5 million+"],
      ["Items Packed", "800,000+"],
      ["Heavy Lifts", "600,000+"],
      ["Furniture Removed", "400,000+"],
    ],
  },
  "Outdoor help": {
    title: "Outdoor Help",
    bullets: [
      "Quick tidy-ups to full garden care—season after season.",
      "Clean, trimmed, and looking their best.",
    ],
    stats: [
      ["Gardens Tended", "400,000+"],
      ["Lawns Mowed", "300,000+"],
      ["Hedges Trimmed", "200,000+"],
      ["Leaves Raked", "150,000+"],
    ],
  },
  // Fallback categories (when DB unavailable)
  "Furniture Assembly": {
    title: "Furniture Assembly",
    bullets: [
      "Assemble or disassemble furniture items including wardrobes, beds, TV units & more.",
      "Now Trending: Curved sofas, computer desks, and sustainable materials.",
    ],
    stats: [
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
      ["Home Repairs Made", "700,000+"],
    ],
  },
  "TV & Wall Mounting": {
    title: "TV & Wall Mounting",
    bullets: [
      "Get that perfectly straight finish. Our pros mount TVs, shelves, curtains, and more.",
      "Secure mounting with the right tools and a clean, professional result.",
    ],
    stats: [
      ["Items Mounted", "1 million+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Home Repairs Made", "700,000+"],
    ],
  },
  "Home Repairs & Fixes": {
    title: "Home Repairs & Fixes",
    bullets: [
      "Quick fixes and touch-ups that keep your home feeling solid and well maintained.",
      "From squeaky doors to loose hinges—small issues handled with care.",
    ],
    stats: [
      ["Home Repairs Made", "700,000+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
    ],
  },
  Plumbers: {
    title: "Plumbing",
    bullets: [
      "Drips, leaks, and drains—our plumbing pros get things back to normal.",
      "Clean, efficient repairs and installations when you need them.",
    ],
    stats: [
      ["Leaks Fixed", "400,000+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
    ],
  },
  Electricians: {
    title: "Electrical",
    bullets: [
      "Power problems, new lights, socket issues—handled with safety and care.",
      "Installations and repairs with attention to detail.",
    ],
    stats: [
      ["Lights Installed", "350,000+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
    ],
  },
  "Sparkle Clean": {
    title: "Cleaning",
    bullets: [
      "A cleaner space changes everything. Regular cleans to deep refreshes.",
      "Homes, offices, and rentals looking sharp and feeling brand new.",
    ],
    stats: [
      ["Homes Cleaned", "2 million+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
    ],
  },
  "Packing & Moving": {
    title: "Packing & Moving",
    bullets: [
      "Help packing, lifting, loading, and shifting—move faster with less effort.",
      "Less chaos, fewer backaches, and a smoother transition.",
    ],
    stats: [
      ["Moving Tasks", "1.5 million+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Items Mounted", "1 million+"],
      ["Home Repairs Made", "700,000+"],
    ],
  },
  "The Great Outdoors": {
    title: "Outdoor Help",
    bullets: [
      "Quick tidy-ups to full garden care—season after season.",
      "Clean, trimmed, and looking their best.",
    ],
    stats: [
      ["Gardens Tended", "400,000+"],
      ["Furniture Assembled", "3.4 million+"],
      ["Moving tasks", "1.5 million+"],
      ["Items Mounted", "1 million+"],
    ],
  },
};

const defaultContent: CategoryContent = {
  title: "Assembly",
  bullets: [
    "Assemble or disassemble furniture items including wardrobes, beds, TV units & more.",
    "Now Trending: Curved sofas, computer desks, and sustainable materials.",
  ],
  stats: [
    ["Furniture Assembled", "3.4 million+"],
    ["Moving tasks", "1.5 million+"],
    ["Items Mounted", "1 million+"],
    ["Home Repairs Made", "700,000+"],
  ],
};

function getCategoryContent(categoryName: string): CategoryContent {
  return (
    categoryContent[categoryName] ??
    Object.entries(categoryContent).find(([key]) =>
      categoryName.toLowerCase().includes(key.toLowerCase())
    )?.[1] ??
    defaultContent
  );
}

export function Stats() {
  const homeCategory = useHomeCategory();
  const activeCategory = homeCategory?.activeCategory ?? "Assembly";
  const content = getCategoryContent(activeCategory);

  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Category Card - updates with selected category */}
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
                {content.title}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-green-500">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] leading-snug text-brand-dark-alt">
                    {content.bullets[0]}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm bg-green-500">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] leading-snug text-brand-dark-alt">
                    {content.bullets[1]}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Grid - updates with selected category */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {content.stats.map(([label, value]) => (
              <div key={label}>
                <p className="text-[19px] font-medium text-brand-dark-alt">{label}</p>
                <p className="mt-2 text-[26px] font-medium text-brand-terracotta">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
