import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy Center | Help | 100 Handy",
  description:
    "Key legal, safety, and trust-related resources that govern how the 100 Handy platform operates.",
};

const sidebarLinks = [
  { name: "Legal Terms", href: "#legal-terms" },
  { name: "Trust & Safety", href: "#trust-and-safety" },
  { name: "Platform Rules", href: "#platform-rules" },
  { name: "Country-Specific Policies", href: "#country-specific-policies" },
  { name: "Help and Resources", href: "#help-and-resources" },
];

export default function HelpPoliciesPage() {
  return (
    <HelpArticleLayout
      title="Policy Center"
      breadcrumb="100 Handy Support / Policy Center"
      sidebarLinks={sidebarLinks}
    >
      {/* Intro */}
      <p className="mb-4">
        The <strong>Policy Center</strong> in the 100 Handy Help Centre brings
        together the key legal, safety, and trust-related resources that govern
        how the platform operates.
      </p>
      <p className="mb-4">
        This section outlines the core policies, platform rules, and protections
        that help both <strong>Clients and 100 Handy Pros</strong> understand
        their rights, responsibilities, and how 100 Handy handles safety,
        privacy, and dispute-related matters.
      </p>
      <p className="mb-4">
        These policies are designed to create a safe, fair, and transparent
        environment for everyone using the 100 Handy platform.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Legal Terms */}
      <section id="legal-terms">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Legal Terms
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Terms of Service</h3>
        <p className="mb-4">
          The <strong>Terms of Service</strong> explain the legal agreement
          between 100 Handy and its users.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>How the 100 Handy platform can be used</li>
          <li>
            How service agreements are formed between Clients and 100 Handy Pros
          </li>
          <li>Rules for booking services</li>
          <li>Payment and fee policies</li>
          <li>Cancellation and refund conditions</li>
          <li>Responsibilities of both Clients and Pros</li>
          <li>Platform rights and limitations</li>
        </ul>
        <p className="mb-4">
          All users must agree to the Terms of Service before using the
          platform.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Privacy Policy</h3>
        <p className="mb-4">
          The <strong>Privacy Policy</strong> explains how 100 Handy collects,
          uses, stores, and protects personal information.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>What personal data is collected</li>
          <li>How your information is used</li>
          <li>How data is stored securely</li>
          <li>When information may be shared</li>
          <li>Your rights regarding personal data</li>
          <li>How to request updates or deletion of your data</li>
        </ul>
        <p className="mb-4">
          100 Handy is committed to protecting user privacy and handling
          information responsibly.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Service Protection Terms & Conditions
        </h3>
        <p className="mb-4">
          100 Handy may offer service protection measures designed to support
          Clients and Pros when issues occur.
        </p>
        <p className="mb-4">This section explains:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>What types of issues may be covered</li>
          <li>How to submit a claim</li>
          <li>How claims are reviewed</li>
          <li>
            What users must agree to before compensation is issued
          </li>
          <li>Conditions that may limit coverage</li>
        </ul>
        <p className="mb-4">
          Protection policies help ensure fairness when unexpected issues arise.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Trust & Safety */}
      <section id="trust-and-safety">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Trust & Safety
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Keeping your account secure
        </h3>
        <p className="mb-4">
          Protecting your account helps prevent unauthorised access.
        </p>
        <p className="mb-4">We recommend:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Using strong passwords</li>
          <li>Keeping login details private</li>
          <li>Updating passwords regularly</li>
          <li>Logging out on shared devices</li>
          <li>Reporting suspicious activity immediately</li>
        </ul>
        <p className="mb-4">
          If unusual activity is detected, security checks may be applied to
          protect your account.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">User safety guidance</h3>
        <p className="mb-4">
          Safety is a priority for everyone using 100 Handy.
        </p>
        <p className="mb-4">Recommended safety practices include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Keeping communication within the platform</li>
          <li>Reporting unsafe behaviour immediately</li>
          <li>Avoiding sharing sensitive personal information</li>
        </ul>
        <p className="mb-4">
          Following safety guidance helps create a trusted working environment.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Background checks and verification
        </h3>
        <p className="mb-4">
          100 Handy uses verification processes to support trust between users.
        </p>
        <p className="mb-4">These may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Identity verification</li>
          <li>Profile checks</li>
          <li>Background screening (where required)</li>
          <li>Service-related credential verification</li>
        </ul>
        <p className="mb-4">
          Verification helps maintain platform quality and safety.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Platform Rules */}
      <section id="platform-rules">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Platform Rules
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Acceptable use and platform rules
        </h3>
        <p className="mb-4">
          All users must follow platform rules when using 100 Handy.
        </p>
        <p className="mb-4">Acceptable use includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Providing accurate information</li>
          <li>Communicating respectfully</li>
          <li>Using the platform only for legitimate services</li>
          <li>Following booking and payment procedures</li>
          <li>Maintaining professional behaviour</li>
        </ul>
        <p className="mb-4">Prohibited activities include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Fraudulent behaviour</li>
          <li>Misuse of accounts</li>
          <li>Harassment or threatening behaviour</li>
          <li>
            <strong>
              Sexual misconduct, harassment, or inappropriate behaviour of any
              kind
            </strong>
          </li>
          <li>
            Discrimination based on gender, race, religion, nationality,
            disability, sexual orientation, or any protected characteristic
          </li>
          <li>Attempting to bypass platform processes</li>
          <li>Providing false information</li>
        </ul>
        <p className="mb-4">
          Violations of these rules may lead to account action.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Client and Pro responsibilities
        </h3>
        <p className="mb-4">
          Both Clients and <strong>100 Handy Pros</strong> have responsibilities
          when using the platform.
        </p>
        <p className="mb-4">
          <strong>Client responsibilities include:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Providing clear job descriptions</li>
          <li>Giving accurate location details</li>
          <li>Making payments as agreed</li>
          <li>Respecting professional conduct</li>
        </ul>
        <p className="mb-4">
          <strong>100 Handy Pro responsibilities include:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Delivering services professionally</li>
          <li>Communicating clearly</li>
          <li>Arriving on time</li>
          <li>Completing work as agreed</li>
          <li>Following safety and service guidelines</li>
        </ul>
        <p className="mb-4">
          Shared responsibility helps maintain quality across the platform.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Account action and enforcement
        </h3>
        <p className="mb-4">
          If platform rules are broken, action may be taken to protect the
          platform and its users.
        </p>
        <p className="mb-4">Possible actions include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Account warnings</li>
          <li>Temporary suspension</li>
          <li>Service restrictions</li>
          <li>Permanent account termination</li>
        </ul>
        <p className="mb-4">
          Enforcement decisions are made based on the severity of the issue and
          user history.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. Country-Specific Policies */}
      <section id="country-specific-policies">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. Country-Specific Policies
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          UK-specific legal and tax guidance
        </h3>
        <p className="mb-4">
          100 Handy Pros operating in the UK may have additional
          responsibilities.
        </p>
        <p className="mb-4">These may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Registering as self-employed or operating as a business</li>
          <li>Managing tax responsibilities</li>
          <li>Keeping records of earnings</li>
          <li>Following local employment and service laws</li>
        </ul>
        <p className="mb-4">
          100 Handy Pros are responsible for ensuring compliance with local tax
          and legal obligations.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Local service terms</h3>
        <p className="mb-4">Some policies may vary depending on:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>The region where services are delivered</li>
          <li>The type of service being offered</li>
          <li>Local safety or licensing requirements</li>
        </ul>
        <p className="mb-4">
          Users will be informed if additional conditions apply to specific
          services.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Regulatory and compliance information
        </h3>
        <p className="mb-4">
          100 Handy operates in accordance with applicable laws and regulations.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Consumer protection requirements</li>
          <li>Data protection regulations</li>
          <li>Platform safety standards</li>
          <li>Regional service regulations</li>
        </ul>
        <p className="mb-4">
          Compliance ensures the platform operates responsibly and legally.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Help and Resources */}
      <section id="help-and-resources">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Help and Resources
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Policy-related support</h3>
        <p className="mb-4">
          If you have questions about policies or need assistance with safety or
          compliance matters, you can contact our support team directly.
        </p>
        <p className="mb-4">For policy-related enquiries, please email:</p>
        <p className="mb-4">
          <strong>help@100handy.com</strong>
        </p>
        <p className="mb-4">
          Our team will review your message and respond with the appropriate
          guidance.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
