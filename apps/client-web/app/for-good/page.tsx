import { Header, Footer } from "@/components/layout";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";
import { Heart } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('for-good', {
    title: "100 Handy Cares | 100 Handy",
    description: "Learn about how 100 Handy gives back to the community.",
    canonicalUrl: "/for-good",
  })
}

export const dynamic = 'force-dynamic';

export default async function ForGoodPage() {
  const c = await getPageContent('for-good');

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
                <span className="text-[14px] font-semibold text-brand-terracotta">{c('hero.badge', '100 Handy Cares')}</span>
              </div>
              <h1 className="text-[52px] font-bold leading-tight text-white">
                {c('hero.title', '100 Handy Cares')}
              </h1>
              <p className="mt-8 text-[20px] leading-relaxed text-white/70">
                {c('hero.paragraph', 'Content coming soon.')}
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-white/50">
                {c('hero.supporting_text', 'We\'re working on sharing our community initiatives and giving-back programs. Check back soon to learn how 100 Handy is making a positive impact in neighborhoods across the country.')}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
