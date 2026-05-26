import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";
import { PartnershipForm } from "@/components/for-business/partnership-form";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("for-business", {
    title: "For Business | 100 Handy",
    description: "Partner with 100 Handy to offer trusted assembly, mounting, and installation without adding operational overhead.",
    canonicalUrl: "/for-business",
  });
}

export default async function ForBusinessPage() {
  const c = await getPageContent("for-business");

  const benefits = [1, 2, 3].map((index) => ({
    number: index,
    title: c(`benefits.item_${index}_title`, [
      "Build Customer Loyalty",
      "Increase Sales & Reduce Returns",
      "Seamless Integration",
    ][index - 1]!),
    description: c(`benefits.item_${index}_description`, [
      "Offer a convenient, reliable solution for assembly and installation — so your customers feel supported from delivery to done.",
      "When customers know help is available, they're more likely to buy — and less likely to return items because setup felt overwhelming.",
      "We can support scheduling and service workflows to make booking and payment feel effortless for your customers and your team.",
    ][index - 1]!),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative h-[470px] bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={c("hero.image", "/images/hero/partnerheroimage.png")}
            alt="Partner with 100 Handy"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative flex h-full items-center justify-center">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white px-12 py-10 text-center shadow-xl">
            <h1 className="mb-4 text-[40px] font-bold leading-tight text-brand-dark-alt">
              {c("hero.title", "Boost sales — without adding operational load")}
            </h1>
            <p className="mb-8 text-[18px] leading-relaxed text-brand-dark-alt/80">
              {c("hero.subtitle", "100 Handy partners with retailers and service-led brands to provide trusted assembly, mounting, and installation.")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1920px] px-8">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.number} className="text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-terracotta">
                  <span className="text-[36px] font-bold text-white">{item.number}</span>
                </div>
                <h2 className="mb-4 text-[32px] font-bold leading-tight text-brand-dark-alt">{item.title}</h2>
                <p className="text-[20px] leading-relaxed text-brand-dark-alt">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnershipForm
        title={c("form.title", "Want to Learn More About Partnering With 100 Handy?")}
        intro={c("form.intro", "Tell us a bit about your business and what you're looking to enable. We'll follow up with relevant details, example workflows, and a case study — then explore the best partnership model for you.")}
        successTitle={c("form.success_title", "Thank You for Your Interest!")}
        successMessage={c("form.success_message", "We've received your inquiry and will be in touch within 2 business days to discuss partnership opportunities.")}
        footerLinkText={c("form.footer_link_text", "Looking to sign up as a 100 Handy Pro?")}
        footerLinkCta={c("form.footer_link_cta", "Submit your application here")}
      />

      <Footer />

      <button className="fixed bottom-6 left-6 flex items-center justify-center rounded-full bg-brand-sage p-4 text-white shadow-lg transition-colors hover:bg-brand-sage/85">
        <HelpIcon />
      </button>
    </div>
  );
}
