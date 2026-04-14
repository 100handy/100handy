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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PendingBookingBanner />
      <main className="flex-1">
        <Hero />
        <HomeCategoryProvider>
          <Services />
          <Stats />
        </HomeCategoryProvider>
        <PopularProjects />
        <Testimonials />
        <Guarantees />
        <GetHelpToday />
      </main>
      <Footer />
    </div>
  );
}
