import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy | 100 Handy",
  description:
    "Terms of service, privacy policy, and platform rules for 100 Handy.",
};

const sections = [
  {
    id: "terms-of-service",
    title: "Terms of Service",
    content: `The Terms of Service explain the legal agreement between 100 Handy and its users.

This includes:

• How the 100 Handy platform can be used
• How service agreements are formed between Clients and 100 Handy Pros
• Rules for booking services
• Payment and fee policies
• Cancellation and refund conditions
• Responsibilities of both Clients and Pros
• Platform rights and limitations

All users must agree to the Terms of Service before using the platform.`,
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: `The Privacy Policy explains how 100 Handy collects, uses, stores, and protects personal information.

This includes:

• What personal data is collected
• How your information is used
• How data is stored securely
• When information may be shared
• Your rights regarding personal data
• How to request updates or deletion of your data

100 Handy is committed to protecting user privacy and handling information responsibly.`,
  },
  {
    id: "service-protection",
    title: "Service Protection Terms & Conditions",
    content: `100 Handy may offer service protection measures designed to support Clients and Pros when issues occur.

This section explains:

• What types of issues may be covered
• How to submit a claim
• How claims are reviewed
• What users must agree to before compensation is issued
• Conditions that may limit coverage

Protection policies help ensure fairness when unexpected issues arise.`,
  },
  {
    id: "trust-and-safety",
    title: "Trust & Safety",
    content: `Keeping your account secure

Protecting your account helps prevent unauthorised access.

We recommend:

• Using strong passwords
• Keeping login details private
• Updating passwords regularly
• Logging out on shared devices
• Reporting suspicious activity immediately

If unusual activity is detected, security checks may be applied to protect your account.

User safety guidance

Safety is a priority for everyone using 100 Handy.

Recommended safety practices include:

• Keeping communication within the platform
• Reporting unsafe behaviour immediately
• Avoiding sharing sensitive personal information

Following safety guidance helps create a trusted working environment.

Background checks and verification

100 Handy uses verification processes to support trust between users.

These may include:

• Identity verification
• Profile checks
• Background screening (where required)
• Service-related credential verification

Verification helps maintain platform quality and safety.`,
  },
  {
    id: "platform-rules",
    title: "Platform Rules",
    content: `Acceptable use and platform rules

All users must follow platform rules when using 100 Handy.

Acceptable use includes:

• Providing accurate information
• Communicating respectfully
• Using the platform only for legitimate services
• Following booking and payment procedures
• Maintaining professional behaviour

Prohibited activities include:

• Fraudulent behaviour
• Misuse of accounts
• Harassment or threatening behaviour
• Sexual misconduct, harassment, or inappropriate behaviour of any kind
• Discrimination based on gender, race, religion, nationality, disability, sexual orientation, or any protected characteristic
• Attempting to bypass platform processes
• Providing false information

Violations of these rules may lead to account action.

Client and Pro responsibilities

Both Clients and 100 Handy Pros have responsibilities when using the platform.

Client responsibilities include:

• Providing clear job descriptions
• Giving accurate location details
• Making payments as agreed
• Respecting professional conduct

100 Handy Pro responsibilities include:

• Delivering services professionally
• Communicating clearly
• Arriving on time
• Completing work as agreed
• Following safety and service guidelines

Shared responsibility helps maintain quality across the platform.

Account action and enforcement

If platform rules are broken, action may be taken to protect the platform and its users.

Possible actions include:

• Account warnings
• Temporary suspension
• Service restrictions
• Permanent account termination

Enforcement decisions are made based on the severity of the issue and user history.`,
  },
  {
    id: "country-specific-policies",
    title: "Country-Specific Policies",
    content: `UK-specific legal and tax guidance

100 Handy Pros operating in the UK may have additional responsibilities.

These may include:

• Registering as self-employed or operating as a business
• Managing tax responsibilities
• Keeping records of earnings
• Following local employment and service laws

100 Handy Pros are responsible for ensuring compliance with local tax and legal obligations.

Local service terms

Some policies may vary depending on:

• The region where services are delivered
• The type of service being offered
• Local safety or licensing requirements

Users will be informed if additional conditions apply to specific services.

Regulatory and compliance information

100 Handy operates in accordance with applicable laws and regulations.

This includes:

• Consumer protection requirements
• Data protection regulations
• Platform safety standards
• Regional service regulations

Compliance ensures the platform operates responsibly and legally.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions about policies or need assistance with safety or compliance matters, you can contact our support team directly.

For policy-related enquiries, please email:

help@100handy.com

Our team will review your message and respond with the appropriate guidance.`,
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
              <article className="max-w-3xl flex-1">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="mb-12 scroll-mt-8"
                  >
                    <h2 className="mb-4 border-b border-gray-200 pb-3 text-[28px] font-bold text-brand-dark-alt">
                      {section.title}
                    </h2>
                    <div className="whitespace-pre-line text-[16px] leading-relaxed text-brand-dark-alt/80">
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
