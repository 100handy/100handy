"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function LandingHero(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-white pb-8 pt-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero Title */}
          <h1 className="mb-8 text-[59px] font-bold leading-[1.1] text-brand-dark-alt">
            Find trusted help
            <br />
            for every home task
          </h1>

          {/* Search Bar */}
          <div className="mt-10">
            <p className="mb-4 text-[18px] font-light text-brand-dark-alt">
              What do you need help with?
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[52px] w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-14 text-[18px] text-brand-dark-alt placeholder:font-light placeholder:text-gray-400 focus:border-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-brand-terracotta p-3 text-white transition-colors hover:bg-brand-terracotta/90"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

