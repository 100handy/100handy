"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WhatsHappeningProps {
  title: string;
  description: string;
  image: string;
  ctaText: string;
}

export function WhatsHappening({
  title,
  description,
  image,
  ctaText,
}: WhatsHappeningProps): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-[32px] font-bold leading-tight text-brand-dark-alt">
              {title}
            </h2>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              {description}
            </p>
            <Button variant="terracotta" size="md" className="font-bold" asChild>
              <Link href="/blog">{ctaText}</Link>
            </Button>
          </div>

          <div className="rounded-3xl bg-[#F5F0E8] p-2">
            <div className="relative h-[400px] overflow-hidden rounded-[20px] bg-[#E0D5C8]">
              <Image
                src={image}
                alt="What's happening at 100 Handy"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
