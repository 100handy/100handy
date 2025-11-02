"use client";

import Link from "next/link";

const pressReleases = [
  {
    date: "September 16, 2025",
    title: "100Handy for Businesses Powers Retail Growth with On-Demand Assembly and Installation",
    link: "#",
  },
  {
    date: "August 5, 2025",
    title: "100Handy Expands Nationwide, Bringing Trusted Home Services Across the UK and Europe",
    link: "#",
  },
  {
    date: "June 18, 2025",
    title: "100Handy Reinvents the Customer Experience with Integrated Solutions for Partners",
    link: "#",
  },
];

export function PressReleases(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-center text-[32px] font-bold text-[#30352D]">
          Press Release Highlights
        </h2>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {pressReleases.map((release, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gray-50 p-8 transition-shadow hover:shadow-lg"
            >
              <p className="mb-4 text-[20px] font-medium text-[#30352D]">
                {release.date}
              </p>
              <h3 className="mb-6 min-h-[120px] text-[20px] font-medium leading-relaxed text-[#30352D]">
                {release.title}
              </h3>
              <Link
                href={release.link}
                className="text-[16px] font-bold text-[#333A31] underline hover:text-[#C1856A]"
              >
                Read Release
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-md bg-[#C1856A] px-6 py-2.5 text-[16px] font-bold text-white transition-colors hover:bg-[#C1856A]/90">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}

