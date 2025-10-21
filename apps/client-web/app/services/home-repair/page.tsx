import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import {
  ServiceHero,
  Breadcrumb,
  ContentSection,
  ServiceHowItWorks,
  CTASection,
  FAQs,
  Cities,
} from "@/components/service-detail";

export default function HomeRepairServicePage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero />
        <Breadcrumb />
        <ContentSection />
        <ServiceHowItWorks />
        <CTASection />
        <FAQs />
        <Cities />
      </main>
      <Footer />
    </div>
  );
}

