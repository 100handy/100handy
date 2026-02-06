import { Header, Footer } from "@/components/layout";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | 100 Handy",
  description: "Tips, guides, and news from 100 Handy.",
};

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-32">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-terracotta/10 px-4 py-2">
                <BookOpen className="h-5 w-5 text-brand-terracotta" />
                <span className="text-[14px] font-semibold text-brand-terracotta">Blog</span>
              </div>
              <h1 className="text-[52px] font-bold leading-tight text-brand-dark-alt">
                100 Handy Blog
              </h1>
              <p className="mt-8 text-[20px] leading-relaxed text-brand-dark-alt/70">
                Coming soon.
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-brand-dark-alt/50">
                We&apos;re working on helpful guides, tips, and stories from our community of Pros and customers. Check back soon!
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
