import type { Metadata } from "next";
import { BookOpen, Globe, CheckSquare, Handshake, User } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { InlineAnnouncements } from "@/components/marketing/public-announcements";
import { HelpSearch } from "@/components/help/help-search";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("help", {
    title: "Help | 100 Handy",
    description: "Browse help categories, support resources, and platform guidance for 100 Handy clients and Pros.",
  });
}

export default async function HelpPage() {
  const content = await getPageContent("help");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <InlineAnnouncements placement="support" />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1920 1760"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="1920" height="1760" fill="#F3E3D3" fillOpacity="0.25" />
            <polygon points="0,0 480,0 280,700 0,460" fill="#333A31" />
            <polygon points="0,460 280,700 340,1760 0,1760" fill="#2D3229" />
            <polygon points="0,0 480,0 0,320" fill="#C1856A" />
            <polygon points="1580,0 1920,0 1920,460 1680,700" fill="#333A31" />
            <polygon points="1920,460 1680,700 1720,1760 1920,1760" fill="#2D3229" />
            <polygon points="1440,0 1920,0 1920,320" fill="#C1856A" />
            <polygon points="1380,0 1580,0 1680,700 1720,1760 1480,1760 1440,700" fill="#A0B194" />
            <polygon points="1440,700 1480,1760 1280,1760 1340,900" fill="#A0B194" fillOpacity="0.45" />
            <polygon points="480,0 1280,0 1340,700 1180,1760 340,1760 280,700" fill="white" />
          </svg>
        </div>

        <section className="relative z-30 pb-[112px] pt-[98px]">
          <div className="mx-auto max-w-[1920px] px-8 text-center">
            <h1 className="mb-[39px] text-[68px] font-bold leading-[1.221] text-brand-dark-alt">
              {content("hero.title", "How can we help?")}
            </h1>
            <p className="mb-[24px] text-base font-bold leading-[1.221] text-brand-dark-alt">
              {content("hero.subtitle", "Are you a 100 Handy Pro? Sign in to view additional resources.")}
            </p>
            <HelpSearch />
          </div>
        </section>

        <section className="relative z-10 py-[111px]">
          <div className="mx-auto max-w-[900px] px-8">
            <div className="mb-[60px] grid grid-cols-1 justify-items-center gap-y-[60px] gap-x-[80px] md:grid-cols-3">
              <CategoryCard
                icon={<BookOpen className="h-[33.7px] w-[33.7px]" />}
                title={content("categories.client_title", "Client")}
                href="/help/client"
                bgColor="bg-brand-terracotta"
              />
              <CategoryCard
                icon={<Globe className="h-[33.76px] w-[33.76px]" />}
                title={content("categories.pro_title", "100 Handy Pro")}
                href="/help/pro"
                bgColor="bg-brand-terracotta"
              />
              <CategoryCard
                icon={<CheckSquare className="h-[37.44px] w-[33.59px]" />}
                title={content("categories.registration_title", "Registration")}
                href="/help/registration"
                bgColor="bg-brand-terracotta"
              />
            </div>
            <div className="mb-[60px] flex justify-center gap-x-[80px]">
              <CategoryCard
                icon={<User className="h-[32.09px] w-[32.06px]" />}
                title={content("categories.account_title", "Account")}
                href="/help/account"
                bgColor="bg-brand-terracotta"
              />
              <CategoryCard
                icon={<Handshake className="h-[32.09px] w-[50.79px]" />}
                title={content("categories.policy_title", "Policy Center")}
                href="/help/policies"
                bgColor="bg-brand-terracotta"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 py-[83px]">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto grid max-w-[1076px] grid-cols-1 gap-[29px] md:grid-cols-2">
              <Link href="/contact">
                <CTACard
                  title={content("ctas.contact_title", "Can't find what you need? →")}
                  description={content("ctas.contact_description", "Contact us and we'll get back to you as soon as we can.")}
                />
              </Link>
              <Link href="/services">
                <CTACard
                  title={content("ctas.services_title", "Ready to book a task? →")}
                  description={content("ctas.services_description", "Head over to our website to see our available categories!")}
                />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function CategoryCard({ icon, title, href, bgColor }: { icon: React.ReactNode; title: string; href: string; bgColor: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center text-center">
      <div className={`mb-[40px] flex h-[99px] w-[101px] items-center justify-center rounded-full ${bgColor} text-white transition-opacity group-hover:opacity-85`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold leading-[1.221] text-brand-dark-alt transition-colors group-hover:text-brand-terracotta">{title}</h3>
    </Link>
  );
}

function CTACard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg bg-white shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)] transition-shadow hover:shadow-lg">
      <div className="p-10">
        <h3 className="mb-[43px] text-xl font-bold leading-[1.221] text-brand-dark">{title}</h3>
        <p className="text-xl font-medium leading-[1.221] text-brand-dark">{description}</p>
      </div>
    </div>
  );
}
