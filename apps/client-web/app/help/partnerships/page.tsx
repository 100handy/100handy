import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnerships | Help | 100 Handy",
  description:
    "Learn how businesses, brands, and organisations can partner with 100 Handy through retail integrations, marketing collaborations, and tailored service solutions.",
};

const sidebarLinks = [
  { name: "Retail Partnerships", href: "#retail-partnerships" },
  { name: "Business Integrations", href: "#business-integrations" },
  {
    name: "Marketing and Brand Collaborations",
    href: "#marketing-and-brand-collaborations",
  },
  { name: "100 Handy Pro Partnerships", href: "#100-handy-pro-partnerships" },
  { name: "Getting in Touch", href: "#getting-in-touch" },
];

export default function HelpPartnershipsPage() {
  return (
    <HelpArticleLayout
      title="Partnerships"
      breadcrumb="100 Handy Support / Partnerships"
      sidebarLinks={sidebarLinks}
    >
      {/* Intro */}
      <p className="mb-4">
        The <strong>Partnerships</strong> section in the 100 Handy Help Centre
        outlines how businesses, brands, and organisations can work with 100
        Handy.
      </p>
      <p className="mb-4">
        Through partnerships, companies can integrate 100 Handy services into
        their customer journey, enhance their offering with professional
        services, and create smoother, more convenient experiences for their
        customers.
      </p>
      <p className="mb-4">
        100 Handy supports a range of partnership models, from retail
        integrations to marketing collaborations and tailored service solutions.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Retail Partnerships */}
      <section id="retail-partnerships">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Retail Partnerships
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Offering 100 Handy services at checkout
        </h3>
        <p className="mb-4">
          Retailers can integrate 100 Handy services directly into their
          customer journey.
        </p>
        <p className="mb-4">
          This allows customers to book services such as:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Furniture assembly</li>
          <li>Installation</li>
          <li>Mounting</li>
          <li>Repairs</li>
          <li>Outdoor services</li>
        </ul>
        <p className="mb-4">Adding services at checkout helps:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Reduce friction after purchase</li>
          <li>Improve customer experience</li>
          <li>Increase conversion rates</li>
          <li>Provide a complete end-to-end solution</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Partner landing pages</h3>
        <p className="mb-4">
          100 Handy can create dedicated partner pages designed to match your
          brand and customer journey.
        </p>
        <p className="mb-4">These pages allow:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Seamless booking of services</li>
          <li>Clear presentation of available services</li>
          <li>A branded experience aligned with your business</li>
          <li>Easy access for customers after purchase</li>
        </ul>
        <p className="mb-4">
          Partner pages simplify the booking process and improve customer
          confidence.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Fixed-price service options
        </h3>
        <p className="mb-4">
          For selected services, partners can offer fixed pricing to make
          booking simple and transparent.
        </p>
        <p className="mb-4">Fixed pricing helps:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Remove uncertainty for customers</li>
          <li>Speed up decision-making</li>
          <li>Reduce booking friction</li>
          <li>Improve overall customer satisfaction</li>
        </ul>
        <p className="mb-4">
          Pricing structures can be tailored based on the service type and
          customer needs.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Business Integrations */}
      <section id="business-integrations">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Business Integrations
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          100 Handy for Business
        </h3>
        <p className="mb-4">
          Businesses can integrate 100 Handy services into their operations to
          support customers before, during, or after a purchase.
        </p>
        <p className="mb-4">Common use cases include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Post-purchase service support</li>
          <li>Customer service enhancements</li>
          <li>Installation and setup services</li>
          <li>Ongoing maintenance solutions</li>
        </ul>
        <p className="mb-4">
          This allows businesses to extend their offering without managing
          service delivery directly.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          API and platform integrations
        </h3>
        <p className="mb-4">
          100 Handy can support integration into your existing systems where
          required.
        </p>
        <p className="mb-4">This allows:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Direct service booking within your platform</li>
          <li>Integration into checkout or support flows</li>
          <li>Streamlined customer journeys</li>
          <li>Automated service coordination</li>
        </ul>
        <p className="mb-4">
          Integration options can be adapted depending on your technical
          requirements.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Tailored service offerings
        </h3>
        <p className="mb-4">
          Partnerships can be customised based on your business model and
          customer needs.
        </p>
        <p className="mb-4">This may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Service packages aligned with your products</li>
          <li>Location-specific services</li>
          <li>Industry-specific solutions</li>
          <li>Flexible service combinations</li>
        </ul>
        <p className="mb-4">
          Tailored services ensure a better fit for both your business and your
          customers.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Marketing and Brand Collaborations */}
      <section id="marketing-and-brand-collaborations">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Marketing and Brand Collaborations
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Promotions and co-marketing
        </h3>
        <p className="mb-4">
          100 Handy works with brands on collaborative marketing initiatives.
        </p>
        <p className="mb-4">This may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Joint campaigns</li>
          <li>Cross-promotions</li>
          <li>Digital marketing collaborations</li>
          <li>Content partnerships</li>
        </ul>
        <p className="mb-4">
          Co-marketing helps increase brand visibility and reach new audiences.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Promo code partnerships
        </h3>
        <p className="mb-4">
          Businesses can offer 100 Handy services through promotional
          incentives.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Customer discounts</li>
          <li>Reward-based offers</li>
          <li>Campaign-specific promo codes</li>
          <li>Customer retention initiatives</li>
        </ul>
        <p className="mb-4">
          Promo codes can be tailored to specific campaigns or audiences.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Affiliate and sponsorship opportunities
        </h3>
        <p className="mb-4">
          100 Handy also supports broader partnership opportunities such as:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Affiliate collaborations</li>
          <li>Sponsored campaigns</li>
          <li>Brand partnerships</li>
          <li>Strategic marketing initiatives</li>
        </ul>
        <p className="mb-4">
          These partnerships help expand reach and create new growth
          opportunities.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. 100 Handy Pro Partnerships */}
      <section id="100-handy-pro-partnerships">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. 100 Handy Pro Partnerships
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Pro perks and development
        </h3>
        <p className="mb-4">
          100 Handy may partner with organisations to support{" "}
          <strong>100 Handy Pros</strong> with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Professional development opportunities</li>
          <li>Access to tools or resources</li>
          <li>Business growth support</li>
          <li>Industry-specific partnerships</li>
        </ul>
        <p className="mb-4">
          These initiatives help Pros grow their services and improve
          performance on the platform.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Pro acquisition initiatives
        </h3>
        <p className="mb-4">
          Partnerships can also support the growth of the 100 Handy Pro network.
        </p>
        <p className="mb-4">This may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Recruitment campaigns</li>
          <li>Training partnerships</li>
          <li>Industry collaborations</li>
          <li>Local or regional initiatives</li>
        </ul>
        <p className="mb-4">
          Expanding the Pro network ensures service availability and quality
          across locations.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Choosing partner services
        </h3>
        <p className="mb-4">
          100 Handy Pros can choose which partner-related services they want to
          accept.
        </p>
        <p className="mb-4">This allows Pros to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Select services that match their skills</li>
          <li>Control the type of work they receive</li>
          <li>Maintain flexibility in their schedule</li>
          <li>Focus on preferred service categories</li>
        </ul>
        <p className="mb-4">
          Pros always have control over the work they accept.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Getting in Touch */}
      <section id="getting-in-touch">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Getting in Touch
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          How to become a partner
        </h3>
        <p className="mb-4">
          If you are interested in partnering with 100 Handy, the best route
          depends on your goals.
        </p>
        <p className="mb-4">You may be looking to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Integrate services into your checkout</li>
          <li>Enhance your customer offering</li>
          <li>Run a marketing collaboration</li>
          <li>Support Pro development or recruitment</li>
        </ul>
        <p className="mb-4">
          Our team will guide you to the most suitable partnership model.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Partnership enquiries</h3>
        <p className="mb-4">
          For all partnership enquiries, please contact:
        </p>
        <p className="mb-4">
          <strong>
            <a
              href="mailto:help@100handy.com"
              className="text-brand-terracotta hover:underline"
            >
              help@100handy.com
            </a>
          </strong>
        </p>
        <p className="mb-4">Please include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Your business name</li>
          <li>Type of partnership interest</li>
          <li>A brief overview of your requirements</li>
        </ul>
        <p className="mb-4">
          Our team will review your enquiry and respond with the next steps.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
