"use client";

import Image from "next/image";

export function PressHero(): React.JSX.Element {
  return (
    <section className="relative bg-[#3D4539] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative flex min-h-[470px] items-center justify-center">
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/press/pressheroimage.jpeg"
              alt="100 Handy Press"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-8 text-[67px] font-bold leading-none text-white">
              Press
            </h1>
            <button className="rounded-md bg-brand-terracotta px-6 py-2.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
              Get the latest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

