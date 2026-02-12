"use client";

import Link from "next/link";

interface CTASectionProps {
  categoryName?: string;
}

export function CTASection({ categoryName }: CTASectionProps): React.JSX.Element {
  const href = categoryName
    ? `/task-form?category=${encodeURIComponent(categoryName)}`
    : "/dashboard";

  return (
    <section className="bg-[#F5EBE5] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Dark card with decorative shapes */}
          <div className="relative h-[321px] overflow-hidden rounded-3xl bg-brand-dark">
            {/* Decorative shapes */}
            <div className="absolute left-[15%] top-[25%] h-[101px] w-[101px] rounded-full bg-[#5A6357]/50" />
            <div
              className="absolute bottom-[15%] right-[20%] h-[205px] w-[238px] bg-[#5A6357]/50"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          {/* Right column - CTA text and button */}
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mb-8 text-[39px] font-bold text-brand-dark-alt">
              Ready to hire a Tasker?
            </h2>
            <Link
              href={href}
              className="rounded-full bg-brand-terracotta px-14 py-[14px] text-[20px] font-medium text-white transition-colors hover:bg-brand-terracotta/90"
            >
              Find help now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

