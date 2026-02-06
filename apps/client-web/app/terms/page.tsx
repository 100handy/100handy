import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy | 100 Handy",
  description: "Terms of service and privacy policy for 100 Handy.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-8 text-[42px] font-bold text-brand-dark-alt">
                Terms & Privacy
              </h1>
              <div className="prose prose-lg max-w-none text-brand-dark-alt/80">
                <p className="text-[18px] leading-relaxed">
                  Content coming soon. We&apos;re preparing our terms of service and privacy policy documentation.
                </p>
                <p className="mt-4 text-[18px] leading-relaxed">
                  If you have any questions in the meantime, please contact us at{" "}
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
