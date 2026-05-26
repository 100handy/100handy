import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("become-100-handy-pro", {
    title: "Become a 100 Handy Pro | 100 Handy",
    description: "Turn your skills into flexible income with 100 Handy. Choose your work, set your availability, and grow your business.",
    canonicalUrl: "/become-100-handy-pro",
  });
}

const benefitIcons = [Briefcase, DollarSign, TrendingUp] as const;

export default async function BecomeTaskerPage() {
  const c = await getPageContent("become-100-handy-pro");

  const categories = c(
    "hero.categories_list",
    "Cleaning Jobs\nElectrical Help Jobs\nFurniture Assembly Jobs\nIKEA Assembly Jobs\nIndoor Painting Jobs\nLight Carpentry Jobs\nMinor Home Repairs Jobs\nPlumbing Help Jobs\nTrash & Furniture Removal Jobs\nGardening Jobs"
  )
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const benefits = [1, 2, 3].map((index) => ({
    icon: benefitIcons[index - 1]!,
    title: c(`benefits.item_${index}_title`, [
      "Be your own boss",
      "Set your own rates",
      "Grow your business",
    ][index - 1]!),
    description: c(`benefits.item_${index}_description`, [
      "Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area. You are in control of your time.",
      "You know what your skills are worth. You set your hourly rate, and you keep 100% of your tips. We handle the invoicing so you get paid directly and securely.",
      "We connect you with clients in your area and give you the tools to market yourself. Say goodbye to advertising costs - focus on what you do best, and we'll bring the work to you.",
    ][index - 1]!),
  }));

  const steps = [1, 2, 3, 4, 5].map((index) => ({
    number: index,
    title: c(`getting_started.step_${index}_title`, [
      "Sign up",
      "Build your profile",
      "Verify your eligibility to task",
      "Set your schedule and work area",
      "Start getting jobs",
    ][index - 1]!),
    description: c(`getting_started.step_${index}_description`, [
      "Create your account in minutes with your email or social login.",
      "Add your skills, experience, service areas, and a friendly intro. A strong profile helps you win more bookings.",
      "Complete identity checks and any requirements needed for your location and categories.",
      "Choose your availability and where you want to work - near home, across the city, or both.",
      "Receive requests, accept the work that fits, show up prepared, and get paid when the job is done.",
    ][index - 1]!),
  }));

  const faqs = [1, 2, 3, 4, 5, 6]
    .map((index) => ({
      question: c(`faqs.faq_${index}_question`, ""),
      answer: c(`faqs.faq_${index}_answer`, ""),
    }))
    .filter((item) => item.question.trim() && item.answer.trim());

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-brand-dark py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[52px] font-bold leading-tight text-white">
                {c("hero.title", "Earn Money Your Way")}
              </h1>
              <p className="mt-6 text-[22px] leading-relaxed text-white/90">
                {c("hero.subtitle", "Turn your skills into a flexible income. Choose the work you like, set your availability, and get paid for jobs completed.")}
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-[14px] font-medium text-white"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-10">
                <Button variant="terracotta" size="lg" asChild>
                  <Link href="/sign-up?type=pro">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <p className="mx-auto mb-16 max-w-3xl text-center text-[23px] font-medium leading-relaxed text-brand-dark-alt">
              {c("benefits.intro", "Find local jobs that fit your skills and schedule. With 100 Handy, you have the freedom and support to be your own boss.")}
            </p>

            <div className="grid gap-16 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-sage/20">
                      <Icon className="h-10 w-10 text-brand-sage" />
                    </div>
                    <h2 className="mb-4 text-[28px] font-bold text-brand-dark-alt">{benefit.title}</h2>
                    <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
              <div className="relative h-[400px] overflow-hidden rounded-3xl">
                <Image
                  src={c("overview.image", "/images/become-tasker/what-is-100handy.jpeg")}
                  alt="What is 100 Handy?"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
              <div>
                <h2 className="mb-6 text-[28px] font-bold text-brand-dark-alt">
                  {c("overview.title", "What is 100 Handy?")}
                </h2>
                <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
                  {c("overview.paragraph_1", "100 Handy connects customers who need help with skilled local Pros - like you. From home repairs and mounting to cleaning and moving help, we make it simple for people to book services they can trust.")}
                </p>
                <p className="mt-4 text-[18px] font-medium leading-relaxed text-brand-dark-alt">
                  {c("overview.paragraph_2", "You bring the skills. We help you get discovered, manage bookings, and get paid securely - so you can focus on doing great work.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#D4DCC8]">
              <div className="absolute right-0 top-0 hidden h-full w-[52%] overflow-hidden rounded-l-[50px] lg:block">
                <Image
                  src={c("getting_started.image", "/images/become-tasker/what-is-100handy.jpeg")}
                  alt="Getting started as a 100 Handy Pro"
                  fill
                  className="object-cover"
                  sizes="52vw"
                />
              </div>

              <div className="relative z-10 m-8 rounded-2xl bg-white p-8 shadow-xl lg:m-10 lg:w-[44%]">
                <h2 className="mb-6 text-[24px] font-bold text-brand-dark-alt">
                  {c("getting_started.title", "Getting Started is Simple")}
                </h2>
                <div className="space-y-5">
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[14px] font-bold text-white">
                        {step.number}
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[15px] font-semibold text-brand-dark-alt">{step.title}</p>
                        <p className="mt-1 text-[13px] leading-snug text-brand-dark-alt/70">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <h2 className="mb-16 text-center text-[36px] font-bold text-brand-dark-alt">
              {c("faqs.title", "Frequently Asked Questions")}
            </h2>

            <div className="mx-auto max-w-3xl space-y-1">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="border-b border-gray-300 py-6 group">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-left">
                    <span className="pr-8 text-[21px] font-medium text-brand-dark-alt">{faq.question}</span>
                    <span className="text-brand-terracotta transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="mt-4 text-[18px] leading-relaxed text-gray-600">{faq.answer}</div>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="mb-6 text-[28px] font-bold text-brand-dark-alt">
                {c("faqs.cta_title", "Ready to create an extra source of income?")}
              </h3>
              <Button variant="terracotta" size="lg" asChild>
                <Link href="/sign-up?type=pro">Get started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
