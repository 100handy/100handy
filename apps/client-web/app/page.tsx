import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { Stats } from "@/components/marketing/stats";
import { PopularProjects } from "@/components/marketing/popular-projects";
import { Testimonials } from "@/components/marketing/testimonials";
import { Guarantees } from "@/components/marketing/guarantees";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { GetHelpToday } from "@/components/marketing/get-help-today";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Stats />
        <PopularProjects />
        <Testimonials />
        <Guarantees />
        <HowItWorks />
        <GetHelpToday />
      </main>
      <Footer />
    </div>
  );
}
