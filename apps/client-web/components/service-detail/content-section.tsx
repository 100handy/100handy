"use client";

import Image from "next/image";

interface ContentSectionProps {
  title: string;
  longDescription: string;
  benefits?: Array<{ title: string; description: string }>;
  tasks?: Array<{ title: string; description: string }>;
  contentImage?: string;
}

export function ContentSection({ title, longDescription, contentImage }: ContentSectionProps): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Title */}
        <h2 className="mb-10 text-[29px] font-bold text-brand-dark-alt">
          {title} Services
        </h2>

        {/* Main content grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Text content */}
          <div>
            <h3 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
              Need Help with {title}?
              <br />
              100Handy Has You Covered!
            </h3>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              {longDescription}
            </p>
          </div>

          {/* Right column - Image or decorative card */}
          {contentImage ? (
            <div className="relative h-[351px] overflow-hidden rounded-3xl">
              <Image
                src={contentImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ) : (
            <div className="relative h-[351px] overflow-hidden rounded-3xl bg-brand-dark">
              <div className="absolute left-[15%] top-[25%] h-[101px] w-[101px] rounded-full bg-[#5A6357]/50" />
              <div
                className="absolute bottom-[15%] right-[20%] h-[205px] w-[238px] bg-[#5A6357]/50"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
