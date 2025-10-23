"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero Title */}
          <h1 className="text-[59px] font-bold leading-tight text-[#30352D]">
            Find trusted help
            <br />
            for every home task
          </h1>

          {/* Search Bar */}
          <div className="mt-10">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[52px] w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-14 text-[18px] text-[#30352D] placeholder:font-light placeholder:text-gray-400 focus:border-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20"
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
