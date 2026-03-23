"use client";

import { Briefcase, DollarSign, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Briefcase,
    title: "Be your own boss",
    description:
      "Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area. You are in control of your time.",
  },
  {
    icon: DollarSign,
    title: "Set your own rates",
    description:
      "You know what your skills are worth. You set your hourly rate, and you keep 100% of your tips. We handle the invoicing so you get paid directly and securely.",
  },
  {
    icon: TrendingUp,
    title: "Grow your business",
    description:
      "We connect you with clients in your area and give you the tools to market yourself. Say goodbye to advertising costs - focus on what you do best, and we'll bring the work to you.",
  },
];

export function FlexibleWork(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <p className="mx-auto mb-16 max-w-3xl text-center text-[23px] font-medium leading-relaxed text-brand-dark-alt">
          Find local jobs that fit your skills and schedule. With 100 Handy, you have the freedom and support to be your own boss.
        </p>

        <div className="grid gap-16 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-sage/20">
                  <Icon className="h-10 w-10 text-brand-sage" />
                </div>
                <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
                  {benefit.title}
                </h3>
                <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
