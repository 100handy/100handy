import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | 100 Handy",
  description: "Legal information for 100 Handy.",
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-8 text-[42px] font-bold text-brand-dark-alt">
                Legal
              </h1>
              <div className="prose prose-lg max-w-none text-brand-dark-alt/80">
                <p className="text-[18px] leading-relaxed">
                  Content coming soon. We&apos;re preparing our legal documentation.
                </p>
                <p className="mt-4 text-[18px] leading-relaxed">
                  If you have any legal inquiries in the meantime, please contact us at{" "}
                  <a href="mailto:legal@100handy.com" className="text-brand-terracotta hover:underline">
                    legal@100handy.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
