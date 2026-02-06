import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Settings | 100 Handy",
  description: "Manage your cookie preferences on 100 Handy.",
};

export default function CookieSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-8 text-[42px] font-bold text-brand-dark-alt">
                Cookie Settings
              </h1>
              <div className="prose prose-lg max-w-none text-brand-dark-alt/80">
                <p className="text-[18px] leading-relaxed">
                  Content coming soon. We&apos;re preparing our cookie management interface.
                </p>
                <p className="mt-4 text-[18px] leading-relaxed">
                  If you have any questions about our cookie policy in the meantime, please contact us at{" "}
                  <a href="mailto:privacy@100handy.com" className="text-brand-terracotta hover:underline">
                    privacy@100handy.com
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
