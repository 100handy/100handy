"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Luka K.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer truthmaster-builder of human happiness. No o",
  },
  {
    name: "Dasha K.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the",
  },
  {
    name: "Berkay M.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the",
  },
  {
    name: "Yuan L.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the",
  },
  {
    name: "Rodrigo S.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the",
  },
  {
    name: "Lisa S.",
    rating: 5,
    text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the",
  },
];

function StarRating({ rating }: { rating: number }): React.JSX.Element {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function LandingTestimonials(): React.JSX.Element {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[31px] font-medium text-brand-dark-alt">
          See What Happy customers are saying about 100 Handy
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4">
                <p className="text-[21px] font-medium text-brand-dark-alt">
                  {testimonial.name}
                </p>
                <div className="mt-2">
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-[17px] leading-relaxed text-black">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>

        {/* Trustpilot Reviews */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {/* Trustpilot Badge 1 */}
          <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2">
              <div className="rounded bg-[#00B67A] px-3 py-1.5">
                <span className="text-sm font-bold text-white">Excellent</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#00B67A] text-[#00B67A]" />
                ))}
              </div>
            </div>
          </div>

          {/* Trustpilot Badge 2 */}
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2">
              <div className="rounded bg-[#00B67A] px-3 py-1.5">
                <span className="text-sm font-bold text-white">Trustpilot</span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">My company worked amazingly</div>
                <div className="text-xs text-gray-500">from here and</div>
              </div>
            </div>
          </div>

          {/* Trustpilot Badge 3 */}
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2">
              <div className="rounded bg-[#73CF11] px-3 py-1.5">
                <span className="text-sm font-bold text-white">Great</span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">Someone really trusts us</div>
                <div className="text-xs text-gray-500">impressions 7 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

