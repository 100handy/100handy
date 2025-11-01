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
import { notFound } from "next/navigation";

// Service data structure
interface ServiceData {
  title: string;
  description: string;
  category: string;
  categoryDisplay: string;
  longDescription: string;
  benefits: Array<{ title: string; description: string }>;
  tasks: Array<{ title: string; description: string }>;
}

// Service database - map of category/service to data
const servicesData: Record<string, Record<string, ServiceData>> = {
  "featured-tasks": {
    "furniture-assembly": {
      title: "Furniture Assembly",
      description: "Let Taskers help tackle your furniture assembly needs.",
      category: "featured-tasks",
      categoryDisplay: "Featured Tasks",
      longDescription: "Need someone to put together furniture? Hire a Tasker to assemble your furniture and leave the building to them.",
      benefits: [
        { title: "Trusted & Vetted Taskers", description: "Every Tasker on 100Handy is background-checked, reviewed, and rated by real users." },
        { title: "Seamless Booking", description: "Find, hire, and pay your Tasker seamlessly through our secure platform." },
        { title: "Reliable Service", description: "From IKEA to custom furniture, Taskers can handle all your assembly needs." },
        { title: "Happiness Pledge", description: "We stand by the quality of our services. If something isn't right, we'll work to make it right." },
      ],
      tasks: [
        { title: "Desk Assembly", description: "Setting up your home office or workspace." },
        { title: "Bed Assembly", description: "Assembling bed frames, headboards, and more." },
        { title: "IKEA Furniture", description: "Expert assembly of IKEA furniture collections." },
        { title: "Patio Furniture", description: "Outdoor furniture assembly for your deck or patio." },
        { title: "Bookshelf Assembly", description: "Installing and assembling storage solutions." },
      ],
    },
    "home-repairs": {
      title: "Home Repairs",
      description: "Get help with all your home repair needs.",
      category: "featured-tasks",
      categoryDisplay: "Featured Tasks",
      longDescription: "Need a quick fix or a skilled handyman for larger home repairs? 100Handy makes it easy to find trusted home repair services near you.",
      benefits: [
        { title: "Trusted & Vetted Taskers", description: "Every handyman on 100Handy is background-checked, reviewed, and rated by real users." },
        { title: "Seamless Booking", description: "Find, hire, and pay your Tasker seamlessly through our secure platform." },
        { title: "Reliable Home Repairs", description: "From minor fixes to larger handyman projects, Taskers can help with a variety of home maintenance needs." },
        { title: "Happiness Pledge", description: "We stand by the quality of our services. If something isn't right, we'll work to make it right." },
      ],
      tasks: [
        { title: "Drywall Repair", description: "Patching holes, smoothing out dents, and painting over fixes." },
        { title: "Furniture Repair", description: "Fixing broken chairs, tables, and other household items." },
        { title: "Plumbing Repair", description: "Stopping leaks, replacing faucets, and unclogging drains." },
        { title: "Electrical Repairs", description: "Installing light fixtures, replacing switches, and minor wiring work." },
        { title: "General Handyman", description: "Fixing doors, repairing cabinets, installing shelves, and more." },
      ],
    },
  },
  "handyman": {
    "furniture-assembly": {
      title: "Furniture Assembly",
      description: "Professional furniture assembly services.",
      category: "handyman",
      categoryDisplay: "Handyman",
      longDescription: "Let's be honest: you were never going to read that furniture assembly manual. No matter how the instructions are laid out, furniture assembly is not necessarily a user-friendly task. Taskers on 100Handy will come to your home and assemble your furniture professionally and efficiently.",
      benefits: [
        { title: "Trusted & Vetted Taskers", description: "Every Tasker is background-checked and reviewed." },
        { title: "Quick & Efficient", description: "Taskers bring their own tools and can help you as quickly and efficiently as possible." },
        { title: "IKEA Experts", description: "As official furniture assembly partners with IKEA, Taskers are familiar with popular collections." },
        { title: "No Hassle", description: "Furniture assembly doesn't need to be a huge hassle. Taskers will put together furniture in a snap and save you time and effort." },
      ],
      tasks: [
        { title: "Couches", description: "Assembly of sofas and sectionals." },
        { title: "Tables", description: "Dining tables, coffee tables, and more." },
        { title: "Chairs", description: "Desk chairs, dining chairs, and accent chairs." },
        { title: "Wardrobes", description: "Closet systems and wardrobes." },
        { title: "Furniture Disassembly", description: "Taking apart furniture for moving or storage." },
      ],
    },
    "tv-mounting": {
      title: "TV Mounting",
      description: "Expert TV mounting and installation services.",
      category: "handyman",
      categoryDisplay: "Handyman",
      longDescription: "Mount your TV safely and professionally. Taskers can help you find the perfect spot, mount your TV, and ensure all cables are properly organized.",
      benefits: [
        { title: "Professional Installation", description: "Taskers have the right tools and experience to mount your TV safely." },
        { title: "Cable Management", description: "Hide cables and wires for a clean, professional look." },
        { title: "Wall Assessment", description: "Taskers can assess your wall type and use appropriate mounting hardware." },
        { title: "Same-Day Service", description: "Many Taskers offer same-day service for urgent needs." },
      ],
      tasks: [
        { title: "Flat Screen TV Mounting", description: "Mounting TVs of all sizes on walls." },
        { title: "Cable Concealment", description: "Hiding cables for a clean appearance." },
        { title: "Soundbar Installation", description: "Installing and connecting soundbars." },
        { title: "TV Setup", description: "Connecting all devices and setting up your TV." },
      ],
    },
  },
};

interface ServicePageProps {
  params: Promise<{
    category: string;
    service: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { category, service } = await params;

  // Find the service data
  const categoryData = servicesData[category];
  if (!categoryData) {
    notFound();
  }

  const serviceData = categoryData[service];
  if (!serviceData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
        />
        <Breadcrumb
          category={serviceData.categoryDisplay}
          service={serviceData.title}
          categorySlug={category}
        />
        <ContentSection
          title={serviceData.title}
          longDescription={serviceData.longDescription}
          benefits={serviceData.benefits}
          tasks={serviceData.tasks}
        />
        <ServiceHowItWorks />
        <CTASection />
        <FAQs service={serviceData.title} />
        <Cities service={serviceData.title} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  const params: Array<{ category: string; service: string }> = [];

  Object.keys(servicesData).forEach((category) => {
    Object.keys(servicesData[category]).forEach((service) => {
      params.push({ category, service });
    });
  });

  return params;
}
