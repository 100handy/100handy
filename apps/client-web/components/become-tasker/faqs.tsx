"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What do I need to become a Handy?",
    answer: "You'll need relevant skills for your chosen categories, a completed profile, and to pass verification requirements for your location.",
  },
  {
    question: "How do I get paid?",
    answer: "Payments are handled securely through the platform after the job is completed, so you don't need to chase invoices.",
  },
  {
    question: "How long does it take to get approved?",
    answer: "Timelines vary by location and verification steps, but many pros can complete setup quickly once documents are submitted.",
  },
  {
    question: "Can I choose my own hours?",
    answer: "Yes. Set your schedule, update it anytime, and only accept jobs that work for you.",
  },
  {
    question: "Do I need my own tools?",
    answer: "For most categories, yes. Customers book you for your expertise - having the right tools helps you complete work efficiently and earn better reviews.",
  },
  {
    question: "How do I get more jobs?",
    answer: "A great profile, fast responses, fair pricing, and strong reviews help you rank higher and get booked more often.",
  },
];

export function TaskerFAQs(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-center text-[36px] font-bold text-brand-dark-alt">
          Frequently Asked Questions
        </h2>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-1" role="region" aria-label="Frequently Asked Questions">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-300 py-6"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between text-left"
                  aria-expanded={openIndex === index}
                  aria-controls={`tasker-faq-answer-${index}`}
                  id={`tasker-faq-question-${index}`}
                >
                  <span className="pr-8 text-[21px] font-medium text-brand-dark-alt">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 flex-shrink-0 text-brand-terracotta transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {openIndex === index && (
                  <div
                    id={`tasker-faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`tasker-faq-question-${index}`}
                    className="mt-4 text-[18px] leading-relaxed text-gray-600"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h3 className="mb-6 text-[28px] font-bold text-brand-dark-alt">
            Ready to create an extra source of income?
          </h3>
          <Button variant="terracotta" size="lg" asChild>
            <Link href="/sign-up?type=pro">Get started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

