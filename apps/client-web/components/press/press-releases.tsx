"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PressReleaseItem {
  date: string;
  title: string;
  link: string;
}

interface PressReleasesProps {
  title: string;
  ctaText: string;
  releases: PressReleaseItem[];
}

export function PressReleases({
  title,
  ctaText,
  releases,
}: PressReleasesProps): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-center text-[32px] font-bold text-brand-dark-alt">
          {title}
        </h2>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {releases.map((release, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gray-50 p-8 transition-shadow hover:shadow-lg"
            >
              <p className="mb-4 text-[20px] font-medium text-brand-dark-alt">
                {release.date}
              </p>
              <h3 className="mb-6 min-h-[120px] text-[20px] font-medium leading-relaxed text-brand-dark-alt">
                {release.title}
              </h3>
              <Link
                href={release.link}
                className="text-[16px] font-bold text-brand-dark underline hover:text-brand-terracotta"
              >
                Read Release
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="terracotta" size="md" className="font-bold">
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
