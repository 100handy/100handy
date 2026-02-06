import { Header, Footer } from "@/components/layout";
import { Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100 Handy Cares | 100 Handy",
  description: "Learn about how 100 Handy gives back to the community.",
};

export default function ForGoodPage() {
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
                <span className="text-[14px] font-semibold text-brand-terracotta">100 Handy Cares</span>
              </div>
              <h1 className="text-[52px] font-bold leading-tight text-white">
                100 Handy Cares
              </h1>
              <p className="mt-8 text-[20px] leading-relaxed text-white/70">
                Content coming soon.
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-white/50">
                We&apos;re working on sharing our community initiatives and giving-back programs. Check back soon to learn how 100 Handy is making a positive impact in neighborhoods across the country.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
