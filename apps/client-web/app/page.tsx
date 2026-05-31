import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Hero } from "@/components/marketing/hero";
import { HomeCategoryProvider } from "@/components/marketing/home-category-context";
import { Services } from "@/components/marketing/services";
import { Stats } from "@/components/marketing/stats";
import { PopularProjects } from "@/components/marketing/popular-projects";
import { Testimonials } from "@/components/marketing/testimonials";
import { Guarantees } from "@/components/marketing/guarantees";
import { GetHelpToday } from "@/components/marketing/get-help-today";
import { PendingBookingBanner } from "@/components/pending-booking-banner";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("home", {
    title: "100 Handy | Trusted Help for Your Home",
    description:
      "Book trusted help for assembly, repairs, cleaning, moving, and more through 100 Handy.",
    canonicalUrl: "/",
  });
}

export default async function HomePage() {
  const c = await getPageContent("home");
  const homeTestimonials = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(`testimonials.item_${index}_name`, ["Luka K.", "Dasha K.", "Berkay M.", "Yuan L.", "Rodrigo S.", "Lisa S."][index - 1]!),
    rating: 5,
    text: c(
      `testimonials.item_${index}_text`,
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system."
    ),
  }));
  const guaranteeItems = [1, 2, 3, 4].map((index) => ({
    title: c(
      `guarantees.item_${index}_title`,
      ["Satisfaction Guaranteed", "Happiness Pledge", "ID-Checked Pros", "Dedicated Support"][index - 1]!
    ),
    description: c(
      `guarantees.item_${index}_description`,
      [
        "We stand by our work. If you're not happy, we'll do everything we can to make it right.",
        "Your peace of mind matters. We're committed to delivering a service that leaves you smiling every time.",
        "Every professional on our platform is identity-verified before they join—so you can trust who's coming to your home.",
        "Need a hand or have a question? Our friendly support team is here for you, every day of the week.",
      ][index - 1]!
    ),
    icon: null,
  }));
  const getHelpServices = Array.from({ length: 12 }).map((_, index) => ({
    name: c(
      `get_help.item_${index + 1}_name`,
      ["Furniture Assembly", "TV Mounting", "Install Curtains and Blinds", "Plumbing", "Light Installation", "Deep Cleaning", "Gardening", "Gutter Cleaning", "Hang Pictures", "IKEA Assembly", "Wardrobe Assembly", "Home Repairs"][index]!
    ),
    href: c(`get_help.item_${index + 1}_link`, "/services"),
  }));
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PendingBookingBanner />
      <main className="flex-1">
        <Hero
          title={c("hero.title", "Book trusted help for your home — fast.")}
          subtitle={c("hero.subtitle", "Assembly, repairs, cleaning, moving, and more—handled by vetted pros, scheduled when it suits you, and paid securely in one place.")}
          searchPlaceholder={c("hero.search_placeholder", "What do you need help with?")}
          emptySearchLabel={c("hero.empty_search_label", "browse all services")}
        />
        <HomeCategoryProvider>
          <Services />
          <Stats />
        </HomeCategoryProvider>
        <PopularProjects />
        <Testimonials
          title={c("testimonials.title", "See What Happy Customers are Saying About 100 Handy")}
          testimonials={homeTestimonials}
          badgeOneLabel={c("testimonials.badge_1_label", "Excellent")}
          badgeTwoLabel={c("testimonials.badge_2_label", "Trustpilot")}
          badgeTwoTitle={c("testimonials.badge_2_title", "My company worked amazingly")}
          badgeTwoSubtitle={c("testimonials.badge_2_subtitle", "from here and")}
          badgeThreeLabel={c("testimonials.badge_3_label", "Great")}
          badgeThreeTitle={c("testimonials.badge_3_title", "Someone really trusts us")}
          badgeThreeSubtitle={c("testimonials.badge_3_subtitle", "impressions 7 hours ago")}
        />
        <Guarantees
          title={
            <>
              {c("guarantees.title", "Peace of Mind, Always").split("Always")[0]}
              <span className="text-brand-terracotta">Always</span>
            </>
          }
          guarantees={guaranteeItems.map((item, index) => ({
            ...item,
            icon: index === 0 ? (
              <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : index === 1 ? (
              <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : index === 2 ? (
              <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            ) : (
              <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ),
          }))}
        />
        <GetHelpToday
          title={c("get_help.title", "Get Help Today")}
          services={getHelpServices}
          ctaText={c("get_help.cta_text", "See All Services")}
        />
      </main>
      <Footer />
    </div>
  );
}
