"use client";

import { useState } from "react";

interface FAQSectionProps {
  serviceName: string;
  cityName: string;
}

export function FAQSection({ serviceName, cityName }: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState(false);

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[44px] mb-12">
          Frequently asked questions about {serviceName} in {cityName}
        </h2>

        <div className="border-t border-gray-300">
          <button
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full flex justify-between items-center py-6 text-left border-b border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="text-brand-dark-alt font-semibold text-[21px]">
              Q: How much does {serviceName.toLowerCase()} cost in {cityName}?
            </span>
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform ${openFaq ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openFaq && (
            <div className="py-6 border-b border-gray-300">
              <p className="text-brand-dark-alt text-[18px] leading-relaxed">
                Rates in {cityName} typically range from £30-£60 per hour, depending on the complexity of the task and the experience level of the 100 Handy Pro.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
