"use client";

import Link from "next/link";

const categories = [
  "Cleaning Jobs",
  "Electrical Help Jobs",
  "Furniture Assembly Jobs",
  "IKEA Assembly Jobs",
  "Indoor Painting Jobs",
  "Light Carpentry Jobs",
  "Minor Home Repairs Jobs",
  "Plumbing Help Jobs",
  "Trash & Furniture Removal Jobs",
  "Gardening Jobs",
];

export function TaskerHero(): React.JSX.Element {
  return (
    <section className="bg-brand-dark py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Title */}
          <h1 className="text-[52px] font-bold leading-tight text-white">
            Earn Money Your Way
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-[22px] leading-relaxed text-white/90">
            Turn your skills into a flexible income. Choose the work you like, set your availability, and get paid for jobs completed.
          </p>

          {/* Categories */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[14px] font-medium text-white"
              >
                {category}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="/sign-up?type=pro"
              className="inline-block rounded-full bg-brand-terracotta px-8 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-brand-terracotta/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
