import { Header, Footer } from "@/components/layout";
import { getPageContent } from "@/lib/cms";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Privacy | 100 Handy",
  description:
    "Terms of service, privacy policy, and platform rules for 100 Handy.",
};

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
        `100 Handy ("100 Handy", "we", "us", "our") operates an online marketplace that connects Clients with home-service Professionals ("Pros") through our mobile and web applications. This Privacy Policy explains what personal data we collect, why we collect it, who we share it with, and your rights. It applies to users in the United Kingdom, European Union/EEA, the United States, and other regions where 100 Handy is available.

1. Who is responsible for your data

100 Handy is the data controller for the personal information described in this policy. You can contact our privacy team at privacy@100handy.com.

2. Information we collect

Account and profile information:
• Name, email address, phone number, and password
• Profile photo, address, and service area
• For Pros: business information, qualifications, and tax details

Identity and verification:
• Government-issued ID and selfie (processed via Stripe Identity) for Pro verification
• Background-check information where required

Payments:
• Payment card details and billing address (processed and stored by Stripe; 100 Handy retains only the last four digits and card brand)
• Payout bank account information for Pros (processed by Stripe Connect)
• Transaction history

Location:
• Precise location, when you grant permission, to match jobs near you, define your work area, and improve service matching
• Approximate location derived from IP address

Photos, files and media:
• Photos you upload (profile, business, job photos) via your camera or photo library
• Documents you upload (qualifications, identity documents)

Bookings and communications:
• Service requests, in-app messages between Clients and Pros, ratings, and reviews
• Customer support communications

Device and technical information:
• Device or Other IDs — including Advertising ID, Android ID, device model, operating system, and IP address
• Push-notification tokens (via Firebase Cloud Messaging on Android and Apple Push Notification service on iOS)
• Crash reports, performance data, and basic usage information
• App version and language settings

Cookies and similar technologies:
• Session cookies on our website to keep you signed in
• Functional cookies for preferences

3. Why we use your data and our legal basis

To provide the service (legal basis: contract):
• Create and manage your account, match Clients with Pros, process bookings and payments, deliver messages and notifications.

To verify identity and prevent fraud (legal basis: legitimate interests, legal obligation):
• Verify Pro identity through Stripe Identity, screen for fraud, enforce platform rules, detect abuse.

To improve and secure the service (legal basis: legitimate interests):
• Monitor crashes and performance, debug issues, improve features.

To communicate with you (legal basis: contract, legitimate interests):
• Send transactional emails, push notifications about your bookings, customer support replies.

For marketing (legal basis: consent or legitimate interests, depending on jurisdiction):
• Send promotional emails or push notifications. You can opt out at any time.

To meet legal obligations (legal basis: legal obligation):
• Tax records, dispute resolution, response to lawful requests.

4. Who we share your data with

Service providers (acting as our processors):
• Stripe, Inc. — payment processing, payouts, identity verification, and fraud prevention. Stripe may collect device identifiers, IP address, and behavioural signals for fraud scoring.
• Supabase Inc. — our hosting provider for the database, file storage, and authentication.
• Google LLC — Firebase Cloud Messaging for Android push notifications, Google Maps for map display, and Google Play Services. Google may collect Android device identifiers.
• Apple Inc. — Apple Push Notification service and Sign in with Apple.
• Expo (650 Industries, Inc.) — over-the-air updates and push-notification routing.
• Email and SMS providers for transactional messaging.
• Customer support tools.

Other users (where you choose to share):
• Pros see Client name, address, photos and job details for accepted bookings.
• Clients see Pro name, profile photo, rating, and business information.
• Ratings and reviews you post may be visible publicly on profiles.

Legal and safety:
• Law enforcement, regulators, or courts when required by law or to protect rights, property or safety.
• Professional advisers and auditors.

Business transfers:
• If 100 Handy is acquired, merged, or reorganised, your data may be transferred to the acquirer subject to this policy.

We do not sell your personal information. We do not use your data for cross-context behavioural advertising.

5. International transfers

Some of our service providers (notably Stripe, Google, Apple, and Supabase) are located outside the UK and EEA. When we transfer your data outside the UK/EEA, we rely on Standard Contractual Clauses, adequacy decisions, or other lawful safeguards.

6. How long we keep your data

• Active account data: for as long as your account is active.
• Booking and payment records: at least 7 years, to meet tax, accounting and legal requirements.
• Identity verification documents: as required by anti-money-laundering and platform-safety obligations.
• Marketing preferences: until you withdraw consent.
• Deleted accounts: we retain a minimal record of the deletion (account ID, deletion date) for fraud prevention; identifying personal data is removed within 30 days of deletion, except where law requires longer retention.

7. Your rights

UK and EU (UK GDPR / GDPR):
• Access — request a copy of the personal data we hold about you.
• Rectification — ask us to correct inaccurate information.
• Erasure — ask us to delete your data (subject to legal retention obligations).
• Restriction — ask us to pause processing in certain cases.
• Portability — receive your data in a portable format.
• Object — object to processing based on legitimate interests, including direct marketing.
• Withdraw consent — at any time, where processing is based on consent.
• Lodge a complaint with your local supervisory authority (in the UK, the Information Commissioner's Office at ico.org.uk).

California (CCPA / CPRA):
• Right to know what personal information we collect and how it is used and shared.
• Right to delete your personal information.
• Right to correct inaccurate personal information.
• Right to opt out of sale or sharing of your personal information (we do not sell or share for cross-context behavioural advertising).
• Right to limit the use of sensitive personal information.
• Right to non-discrimination for exercising these rights.

Other US states (e.g. Virginia, Colorado, Connecticut, Utah, Texas, Oregon): equivalent rights apply where available under applicable state privacy laws.

How to exercise your rights:
• In-app: open the 100Handy app, go to Profile → Privacy Settings → Delete Account to delete your account directly.
• By email: privacy@100handy.com — include the email address associated with your account so we can verify your identity.

We respond within 30 days for UK/EU requests and 45 days for CCPA requests.

8. Account deletion

You can delete your account at any time:
• In the 100Handy mobile app: Profile → Privacy Settings → Delete Account.
• By email: privacy@100handy.com.

Once you confirm deletion, your identifying personal data is removed within 30 days, except information we are legally required to retain (such as transaction records for tax and accounting). Deletion is permanent and cannot be undone.

9. Security

We use technical and organisational measures to protect your data, including encryption in transit (TLS), encryption of identity documents and payment data at rest, role-based access controls, and ongoing security monitoring. No system is 100% secure; please use a strong unique password and notify us promptly of any suspected unauthorised access.

10. Children

100 Handy is not intended for children under 18. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, contact privacy@100handy.com and we will delete it.

11. Changes to this policy

We may update this policy from time to time. The "Last updated" date at the top of the page shows when changes took effect. Material changes will be notified in-app or by email.

12. Contact

100 Handy Privacy Team
Email: privacy@100handy.com
General support: help@100handy.com`,
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
