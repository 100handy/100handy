import { Header, Footer } from "@/components/layout";
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
        <ServiceHero 
          title="Home Repair Services"
          description="Professional home repair services to keep your home in perfect condition"
        />
        <Breadcrumb 
          category="Home Repair"
          service="Home Repair Services"
          categorySlug="home-repair"
        />
        <ContentSection 
          title="Home Repair"
          longDescription="Our professional handymen are skilled in all aspects of home repair and maintenance. From fixing leaky faucets to repairing drywall, we've got you covered."
          benefits={[
            { title: "Expert Technicians", description: "All our handymen are vetted and experienced" },
            { title: "Quality Guaranteed", description: "We stand behind our work with a satisfaction guarantee" },
            { title: "Fair Pricing", description: "Transparent pricing with no hidden fees" }
          ]}
          tasks={[
            { title: "Plumbing Repairs", description: "Fix leaks, clogs, and other plumbing issues" },
            { title: "Electrical Work", description: "Safe and professional electrical repairs" },
            { title: "Drywall Repair", description: "Patch holes and repair damaged walls" }
          ]}
        />
        <ServiceHowItWorks />
        <CTASection />
        <FAQs service="Home Repair" />
        <Cities service="Home Repair" />
      </main>
      <Footer />
    </div>
  );
}

