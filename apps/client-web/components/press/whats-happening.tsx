"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WhatsHappening(): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-[32px] font-bold leading-tight text-brand-dark-alt">
              What's happening at<br />
              100 Handy
            </h2>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              We bring people together. It's at the heart of everything we do. We know that for every person who needs their radiator fixed before winter, the nursery set up for their newborn, or a TV mounted in time for game day, there's someone nearby who is ready, willing, and able to help.
            </p>
            <Button variant="terracotta" size="md" className="font-bold" asChild>
              <Link href="/blog">Read the Blog</Link>
            </Button>
          </div>

          {/* Right side - Illustration */}
          <div className="rounded-3xl bg-[#F5F0E8] p-2">
            <div className="relative h-[400px] overflow-hidden rounded-[20px] bg-[#E0D5C8]">
              <Image
                src="/images/press/we-bring-people-together.jpeg"
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

