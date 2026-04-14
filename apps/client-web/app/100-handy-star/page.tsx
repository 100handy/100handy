import { Header, Footer } from "@/components/layout";
import { Star, Clock, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100 Handy Star | 100 Handy",
  description:
    "Our top-rated 100 Handy Pros, ready when you are. The 100 Handy Star badge highlights 100 Handy Pros who consistently deliver outstanding workmanship.",
};

const benefits = [
  {
    title: "Consistently high ratings",
    description:
      "Customers regularly leave glowing reviews for 100 Handy Stars - because they go above and beyond to ensure the job is completed to the highest standard, showcasing their expertise.",
    icon: Star,
  },
  {
    title: "Reliable and responsive",
    description:
      "On-time arrivals, quick replies, and updates you can count on - so you're never left guessing.",
    icon: Clock,
  },
  {
    title: "Experienced and active",
    description:
      "100 Handy Stars complete a high number of tasks and bring real, hands-on experience to every booking.",
    icon: Award,
  },
];

export default function EliteTaskersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-terracotta py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <Star className="h-5 w-5 fill-white text-white" />
                <span className="text-[14px] font-semibold text-white">
                  100 Handy Star
                </span>
              </div>
              <h1 className="text-[52px] font-bold leading-tight text-white">
                The 100 Handy Star
              </h1>
              <p className="mt-6 text-[24px] leading-relaxed text-white/90">
                Our top-rated 100 Handy Pros, ready when you are.
              </p>
              <p className="mt-6 text-[18px] leading-relaxed text-white/70">
                The 100 Handy Star badge highlights 100 Handy Pros who
                consistently deliver outstanding workmanship, clear
                communication, and a smooth customer experience - task after
                task.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <h2 className="mb-16 text-center text-[36px] font-bold text-brand-dark-alt">
              Why Customers Choose a 100 Handy Star
            </h2>

            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12 md:grid-cols-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-brand-terracotta/10">
                        <Icon className="h-10 w-10 text-brand-terracotta" />
                      </div>
                      <h3 className="mb-4 text-[24px] font-bold text-brand-dark-alt">
                        {benefit.title}
                      </h3>
                      <p className="text-[16px] leading-relaxed text-brand-dark-alt/80">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Statement */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[20px] leading-relaxed text-brand-dark-alt">
                They&apos;re also trusted and dependable, with a strong record
                of following 100 Handy&apos;s Marketplace Guidelines.
              </p>
            </div>
          </div>
        </section>

        {/* How to Hire Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                {/* Phone Mockup */}
                <div className="flex justify-center">
                  <div className="relative h-[500px] w-[280px] rounded-[40px] border-4 border-gray-800 bg-gray-900 p-2">
                    <div className="h-full w-full rounded-[32px] bg-white p-4">
                      <div className="mb-4 text-center text-[12px] font-medium text-gray-500">
                        100 HANDY
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                          >
                            <div className="h-12 w-12 rounded-full bg-gray-200" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-20 rounded bg-gray-300" />
                                {i === 1 && (
                                  <Star className="h-4 w-4 fill-brand-terracotta text-brand-terracotta" />
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className="h-3 w-3 fill-brand-terracotta text-brand-terracotta"
                                  />
                                ))}
                                <span className="ml-1 text-[10px] text-gray-500">
                                  5.0
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="mb-6 text-[36px] font-bold text-brand-dark-alt">
                    How Do I Hire a 100 Handy Star?
                  </h2>
                  <p className="mb-8 text-[18px] leading-relaxed text-brand-dark-alt/80">
                    It&apos;s simple. When you search for a service, look for
                    the Star badge on a 100 Handy Pro&apos;s profile or in your
                    search results. Then compare reviews, rates, and
                    availability to book the right match.
                  </p>
                  <Button variant="terracotta" size="lg" asChild>
                    <Link href="/dashboard">Find your Star today</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
