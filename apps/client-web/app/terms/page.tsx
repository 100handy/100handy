import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy | 100 Handy",
  description: "Terms of service and privacy policy for 100 Handy.",
};

const sections = [
  {
    id: "terms-of-service",
    title: "Terms of Service",
    content: `Welcome to 100 Handy. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.

These Terms of Service govern your use of the 100 Handy platform, including our website, mobile applications, and related services (collectively, the "Platform"). By creating an account or using the Platform, you confirm that you are at least 18 years old and have the legal capacity to enter into binding contracts.

100 Handy operates as a marketplace that connects clients with independent service professionals ("100 Handy Pros"). We are not responsible for the quality, safety, or legality of services provided by 100 Handy Pros. All bookings are subject to availability and confirmation by the relevant 100 Handy Pro.`,
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    content: `As a user of 100 Handy, you agree to:

- Provide accurate and complete information when creating your account and making bookings
- Treat all 100 Handy Pros with respect and professionalism
- Pay for services as agreed, using the Platform's payment system
- Not engage in any fraudulent, abusive, or harmful behaviour on the Platform
- Not attempt to circumvent the Platform to engage 100 Handy Pros directly outside of the Platform
- Report any concerns or issues through the appropriate channels

Failure to comply with these responsibilities may result in the suspension or termination of your account.`,
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: `At 100 Handy, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard your information.

We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account or make a booking. We also collect information automatically, such as your device information, IP address, and usage data when you use our Platform.

We use your information to facilitate bookings, process payments, communicate with you about your account and services, improve our Platform, and comply with legal obligations. We do not sell your personal data to third parties.`,
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    content: `100 Handy uses cookies and similar tracking technologies to enhance your experience on our Platform. Cookies are small text files stored on your device that help us remember your preferences and understand how you use our services.

We use essential cookies that are necessary for the Platform to function, performance cookies that help us understand how visitors interact with our Platform, and preference cookies that remember your settings and preferences.

You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our Platform.`,
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    content: `All payments on 100 Handy are processed securely through our payment partners. By making a booking, you authorise 100 Handy to charge the payment method you provide.

Payments are held securely until the service is completed. Upon completion, funds are released to the 100 Handy Pro. In the event of a dispute, payments may be held pending resolution.

Cancellation policies vary depending on the service and the 100 Handy Pro. Please review the specific cancellation policy before confirming your booking.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `All content on the 100 Handy Platform, including but not limited to text, graphics, logos, images, and software, is the property of 100 Handy or its content suppliers and is protected by applicable intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works of any content from our Platform without prior written permission from 100 Handy.`,
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, 100 Handy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform or services booked through the Platform.

100 Handy's total liability to you for any claims arising out of or relating to these Terms or your use of the Platform shall not exceed the amount you paid to 100 Handy in the twelve months preceding the claim.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about these Terms of Service, Privacy Policy, or any other legal matters, please contact us:

Email: legal@100handy.com

We aim to respond to all enquiries within 5 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="bg-brand-dark py-12">
          <div className="mx-auto max-w-[1920px] px-8">
            <h1 className="text-[42px] font-bold text-white">
              Terms &amp; Privacy
            </h1>
            <p className="mt-3 text-[18px] text-white/80">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content with sidebar */}
        <section className="py-12">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="flex gap-12">
              {/* Sidebar */}
              <aside className="hidden w-64 flex-shrink-0 lg:block">
                <nav className="sticky top-8">
                  <ul className="space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block rounded-lg px-4 py-2 text-[15px] text-brand-dark-alt transition-colors hover:bg-brand-terracotta/10 hover:text-brand-terracotta"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Article content */}
              <article className="flex-1 max-w-3xl">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
                    <h2 className="mb-4 text-[28px] font-bold text-brand-dark-alt border-b border-gray-200 pb-3">
                      {section.title}
                    </h2>
                    <div className="text-[16px] leading-relaxed text-brand-dark-alt/80 whitespace-pre-line">
                      {section.content}
                    </div>
                  </section>
                ))}
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
