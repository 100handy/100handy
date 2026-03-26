"use client";

import Image from "next/image";

export function TaskerTestimonial(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Testimonial */}
          <div>
            <p className="text-[24px] font-medium leading-relaxed text-brand-dark-alt">
              "100Handy has allowed me to overcome the fear of talking to customers and taught me to always do more than the customer expects. I have more flexibility now and more time to stay with my family."
            </p>
            <p className="mt-6 text-[24px] font-medium text-brand-dark-alt">
              — Berkay W. , London
            </p>
          </div>

          {/* Right side - Illustration */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl">
            <Image
              src="/images/become-tasker/getting-started.jpeg"
              alt="100 Handy Pro testimonial"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

