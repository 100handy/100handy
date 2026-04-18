import { Header, Footer } from "@/components/layout";
import { Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HandyCares | 100 Handy",
  description: "Learn about HandyCares - care and support services from 100 Handy.",
};

export default function HandyCarePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-dark py-32">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-terracotta/20 px-4 py-2">
                <Heart className="h-5 w-5 text-brand-terracotta" />
                <span className="text-[14px] font-semibold text-brand-terracotta">
                  HandyCares
                </span>
              </div>
              <h1 className="text-[52px] font-bold leading-tight text-white">
                HandyCares
              </h1>
              <p className="mt-8 text-[20px] leading-relaxed text-white/70">
                Content coming soon.
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-white/50">
                We&apos;re preparing our HandyCares services and support offerings. Check back soon to learn how 100 Handy can help with care and support needs.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
