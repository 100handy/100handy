import { Header, Footer } from "@/components/layout";
import {
  LandingHero,
  LandingServices,
  LandingStatsSection,
  LandingPopularProjects,
  LandingTestimonials,
  LandingGuarantees,
  LandingHowItWorks,
  LandingGetHelpToday,
} from "@/components/landing";

export default function LandingV2Page(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LandingHero />
        <LandingServices />
        <LandingStatsSection />
        <LandingPopularProjects />
        <LandingTestimonials />
        <LandingGuarantees />
        <LandingHowItWorks />
        <LandingGetHelpToday />
      </main>
      <Footer />
    </div>
  );
}

