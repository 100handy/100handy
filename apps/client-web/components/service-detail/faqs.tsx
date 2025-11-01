"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQsProps {
  service: string;
}

const defaultFaqs = [
  {
    question: "Do Taskers only do minor repairs?",
    answer: "No, Taskers can handle both minor and major projects depending on their expertise and qualifications.",
  },
  {
    question: "How quickly can I get a Tasker?",
    answer: "Many Taskers are available same-day or within 24 hours, depending on your location and the scope of work.",
  },
  {
    question: "How much do services cost?",
    answer: "Costs vary based on the task, location, and Tasker experience. You can compare prices and choose the best fit for your budget.",
  },
  {
    question: "Will I be able to communicate directly with my Tasker?",
    answer: "Yes! You can chat directly with your Tasker through the 100Handy platform to discuss details and confirm requirements.",
  },
];

export function FAQs({ service }: FAQsProps): React.JSX.Element {
  const faqs = defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-[39px] font-bold text-brand-dark-alt">
          Frequently Asked Questions
        </h2>

        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 py-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between text-left"
              >
                <p className="pr-8 text-[24px] font-medium text-brand-dark-alt">
                  {faq.question}
                </p>
                <ChevronDown
                  className={`h-7 w-7 flex-shrink-0 text-brand-terracotta transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-4 text-[20px] leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

