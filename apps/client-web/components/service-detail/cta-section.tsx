"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  categoryName?: string;
  ctaImage?: string;
}

export function CTASection({ categoryName, ctaImage }: CTASectionProps): React.JSX.Element {
  const href = categoryName
    ? `/task-form?category=${encodeURIComponent(categoryName)}`
    : "/dashboard";

  return (
    <section className="bg-[#F5EBE5] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Image or decorative card */}
          {ctaImage ? (
            <div className="relative h-[321px] overflow-hidden rounded-3xl">
              <Image
                src={ctaImage}
                alt="Ready to hire a 100 Handy Pro?"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ) : (
            <div className="relative h-[321px] overflow-hidden rounded-3xl bg-brand-dark">
              <div className="absolute left-[15%] top-[25%] h-[101px] w-[101px] rounded-full bg-[#5A6357]/50" />
              <div
                className="absolute bottom-[15%] right-[20%] h-[205px] w-[238px] bg-[#5A6357]/50"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            </div>
          )}

          {/* Right column - CTA text and button */}
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mb-8 text-[39px] font-bold text-brand-dark-alt">
              Ready to hire a 100 Handy Pro?
            </h2>
            <Button variant="terracotta" size="lg" asChild>
              <Link href={href}>Find help now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
