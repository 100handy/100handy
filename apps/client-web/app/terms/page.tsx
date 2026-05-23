import { Header, Footer } from "@/components/layout";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('terms', {
    title: "Terms & Privacy | 100 Handy",
    description: "Terms of service, privacy policy, and platform rules for 100 Handy.",
    canonicalUrl: "/terms",
  })
}

export default async function TermsPage() {
  const c = await getPageContent("terms");

  const sections = [
    {
      id: "terms-of-service",
      title: c("terms_of_service.title", "Terms of Service"),
      content: c(
        "terms_of_service.content",
        `The Terms of Service explain the legal agreement between 100 Handy and its users.

This includes:

• How the 100 Handy platform can be used
• How service agreements are formed between Clients and 100 Handy Pros
• Rules for booking services
• Payment and fee policies
• Cancellation and refund conditions
• Responsibilities of both Clients and Pros
• Platform rights and limitations

All users must agree to the Terms of Service before using the platform.`,
      ),
    },
    {
      id: "privacy-policy",
      title: c("privacy_policy.title", "Privacy Policy"),
      content: c(
        "privacy_policy.content",
        `The Privacy Policy explains how 100Handy collects, uses, stores, processes, shares, and protects personal information when users access or use the 100Handy platform, website, or mobile application.

This includes:

• Personal information provided during account registration, including names, email addresses, phone numbers, addresses, date of birth, and profile information
• Information related to bookings, payments, transactions, messages, reviews, uploaded images, customer support enquiries, and service activity
• Identity verification information, including identification documents, verification checks, profile verification, background screening, and service-related credentials where required
• Device and technical information, including IP addresses, browser type, operating system, device identifiers, advertising identifiers, cookies, app usage data, analytics data, crash reports, and log information
• Approximate or precise location data where location services are enabled, permitted, or required for services and platform functionality
• Payment and payout information processed securely through third-party payment providers including Stripe
• Analytics and usage information collected through services including Google Analytics and Microsoft Clarity to help improve platform performance, analyse usage trends, monitor interactions, prevent fraud, maintain security, and improve user experience

How information may be used includes:

• Creating, maintaining, and managing user accounts
• Processing bookings, payments, cancellations, refunds, payouts, and service-related activity
• Facilitating communication between Clients and 100Handy Pros
• Providing platform functionality, customer support, and service-related assistance
• Improving platform performance, reliability, functionality, safety, and user experience
• Preventing fraud, misuse, suspicious activity, unsafe conduct, unauthorised access, and violations of platform rules
• Carrying out verification, trust, safety, moderation, and compliance procedures
• Sending service-related notifications, updates, security alerts, verification requests, and important platform communications
• Monitoring analytics, usage trends, performance data, and operational activity
• Complying with legal obligations, tax requirements, law enforcement requests, dispute resolution procedures, and regulatory obligations
• Protecting the rights, safety, property, systems, users, and operations of 100Handy and its users

100Handy processes personal information under lawful bases permitted under applicable data protection laws, including contractual necessity, legitimate interests, legal obligations, fraud prevention, platform security, safety monitoring, dispute resolution, and user consent where required.

100Handy may share information with trusted third-party providers where reasonably necessary to operate the platform, provide services, maintain infrastructure, process transactions, monitor analytics, support security procedures, or comply with legal obligations.

These providers may include payment processors, analytics providers, verification services, cloud hosting providers, behavioural analytics providers, customer support systems, communication providers, infrastructure providers, operating system services, app distribution platforms, and fraud prevention services including:

• Stripe for payment processing, payouts, refunds, transaction-related services, identity verification, fraud prevention, compliance procedures, and financial verification services
• Google Analytics for analytics, usage monitoring, device information, performance reporting, and platform improvement services
• Microsoft Clarity for behavioural analytics, interaction monitoring, website usage analysis, and user experience improvement
• Apple for App Store distribution, app-related services, security, and platform functionality
• Android and Google services for Android platform functionality, app distribution, device services, notifications, security, and operational support

These third-party providers may process, store, transfer, analyse, or access certain personal information where reasonably necessary to provide services, maintain platform functionality, process transactions, improve user experience, monitor performance, support analytics, maintain security, prevent fraud, comply with legal obligations, or support operational infrastructure.

100Handy takes reasonable steps designed to ensure that third-party providers handling personal information maintain appropriate security, confidentiality, and data protection measures in accordance with applicable laws and contractual obligations.

Personal information may also be shared where reasonably necessary to comply with legal obligations, court orders, law enforcement requests, regulatory requirements, fraud investigations, safety concerns, dispute resolution procedures, insurance matters, or protection of platform rights, property, systems, and users.

Some third-party providers and infrastructure services may process or store information outside the United Kingdom. Where international transfers occur, 100Handy takes reasonable steps designed to ensure that appropriate safeguards and protections are in place in accordance with applicable data protection laws.

Cookies, analytics technologies, device identifiers, tracking technologies, and similar technologies may be used to improve platform functionality, analyse platform usage, monitor interactions, maintain security, personalise experiences, improve performance, and support operational functionality. Users may be able to control certain cookie and tracking preferences through their browser, device, or operating system settings; however, disabling certain technologies may affect platform functionality and user experience.

Personal information is retained only for as long as reasonably necessary to provide services, operate the platform, comply with legal obligations, resolve disputes, maintain records, prevent fraud, enforce agreements, maintain security procedures, and protect platform integrity. Certain financial, tax, verification, fraud prevention, analytics, payment, and transaction records may be retained for longer periods where required under applicable legal, regulatory, tax, insurance, accounting, or compliance obligations.

Users have rights under applicable data protection laws, including the right to:

• Request access to personal information
• Request correction of inaccurate or incomplete information
• Request deletion of personal information
• Request restriction of processing
• Object to certain processing activities
• Withdraw consent where processing relies on consent
• Request transfer of personal information where applicable
• Lodge complaints with the Information Commissioner's Office (ICO)

Users may request account updates, data access, or account deletion by contacting:

help@100handy.com

Where account deletion is requested, 100Handy may retain certain information where reasonably necessary for fraud prevention, dispute resolution, legal compliance, tax obligations, insurance matters, payment disputes, enforcement of agreements, safety investigations, platform security, or protection of platform integrity.

100Handy uses reasonable technical and organisational measures designed to help protect personal information, including secure systems, restricted access controls, monitoring procedures, encryption practices where appropriate, secure third-party payment processing, verification procedures, fraud prevention systems, and security monitoring designed to support platform safety and integrity.

100Handy may use verification procedures, profile reviews, moderation systems, fraud detection systems, behavioural monitoring technologies, automated security systems, and safety-related monitoring processes to help protect users, maintain platform integrity, prevent abuse, and enforce platform policies. Certain accounts, activities, content, or transactions may be reviewed, restricted, suspended, removed, or investigated where safety, fraud, legal, regulatory, or policy concerns arise.

While 100Handy may use verification, moderation, and safety procedures, no verification process, identity review, background check, screening process, moderation activity, or monitoring system can guarantee user identity, behaviour, legitimacy, conduct, safety, service quality, or compliance. Users remain responsible for exercising their own judgment, caution, and safety practices when arranging, providing, or receiving services through the platform.

100Handy is not intended for use by individuals under the age of 18. Users must be at least 18 years old and legally capable of entering into binding agreements in their jurisdiction to use the platform, create accounts, book services, or provide services through 100Handy.

By using 100Handy, users acknowledge and agree that certain information may be processed, stored, analysed, monitored, or transferred through trusted third-party providers and infrastructure services where reasonably necessary for platform functionality, operations, analytics, fraud prevention, compliance, safety, communication, payment processing, service delivery, and platform improvement.`,
      ),
    },
    {
      id: "service-protection",
      title: c(
        "service_protection.title",
        "Service Protection Terms & Conditions",
      ),
      content: c(
        "service_protection.content",
        `100 Handy may offer service protection measures designed to support Clients and Pros when issues occur.

This section explains:

• What types of issues may be covered
• How to submit a claim
• How claims are reviewed
• What users must agree to before compensation is issued
• Conditions that may limit coverage

Protection policies help ensure fairness when unexpected issues arise.`,
      ),
    },
    {
      id: "trust-and-safety",
      title: c("trust_and_safety.title", "Trust & Safety"),
      content: c(
        "trust_and_safety.content",
        `Keeping your account secure

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
      ),
    },
    {
      id: "platform-rules",
      title: c("platform_rules.title", "Platform Rules"),
      content: c(
        "platform_rules.content",
        `Acceptable use and platform rules

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
      ),
    },
    {
      id: "country-specific-policies",
      title: c("country_specific.title", "Country-Specific Policies"),
      content: c(
        "country_specific.content",
        `UK-specific legal and tax guidance

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
      ),
    },
    {
      id: "contact",
      title: c("contact_section.title", "Contact Us"),
      content: c(
        "contact_section.content",
        `If you have questions about policies or need assistance with safety or compliance matters, you can contact our support team directly.

For policy-related enquiries, please email:

help@100handy.com

Our team will review your message and respond with the appropriate guidance.`,
      ),
    },
  ];
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="bg-brand-dark py-12">
          <div className="mx-auto max-w-[1920px] px-8">
            <h1 className="text-[42px] font-bold text-white">
              {c("hero.title", "Terms & Privacy")}
            </h1>
            <p className="mt-3 text-[18px] text-white/80">
              {c("hero.last_updated", "Last updated: 13 May 2026")}
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
