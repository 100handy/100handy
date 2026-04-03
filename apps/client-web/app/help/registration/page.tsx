import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration | Help | 100 Handy",
  description:
    "Everything you need to know about joining 100 Handy as a Pro, from creating an account to verifying identity, setting up a professional profile, and becoming ready to receive jobs.",
};

const sidebarLinks = [
  { name: "Getting Started", href: "#getting-started" },
  { name: "Eligibility & Requirements", href: "#eligibility-requirements" },
  { name: "Identity Verification", href: "#identity-verification" },
  { name: "Account Setup", href: "#account-setup" },
  { name: "Completing Registration", href: "#completing-registration" },
  {
    name: "Support During Registration",
    href: "#support-during-registration",
  },
];

export default function HelpRegistrationPage() {
  return (
    <HelpArticleLayout
      title="Registration"
      breadcrumb="100 Handy Support / Registration"
      sidebarLinks={sidebarLinks}
    >
      <p className="mb-4">
        The <strong>Registration</strong> section for{" "}
        <strong>100 Handy Pros</strong> provides everything you need to know
        about joining the platform and starting your journey as a professional
        service provider.
      </p>
      <p className="mb-4">
        This section guides new Pros through the full registration process - from
        creating an account to verifying identity, setting up a professional
        profile, and becoming ready to receive jobs.
      </p>
      <p className="mb-4">
        Whether you are offering gardening, repairs, cleaning, assembly, or
        specialist services, this section helps ensure your registration is
        completed smoothly and efficiently.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Getting Started */}
      <section id="getting-started">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Getting Started
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          How to become a 100 Handy Pro
        </h3>
        <p className="mb-4">
          Becoming a <strong>100 Handy Pro</strong> begins with creating your
          account and selecting the services you want to offer.
        </p>
        <p className="mb-4">To get started:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Create your 100 Handy Pro account.</li>
          <li>
            Choose the services you provide (for example: gardening, repairs,
            cleaning, assembly, landscaping, or outdoor maintenance).
          </li>
          <li>
            Enter your basic details, including your contact information and
            location.
          </li>
          <li>Select your preferred service area.</li>
          <li>
            Continue through the registration steps to verify your identity and
            complete your profile.
          </li>
        </ol>
        <p className="mb-4">
          Once these steps are complete, your account will move to the
          verification stage.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          What you need before you start
        </h3>
        <p className="mb-4">
          Preparing your information in advance makes the registration process
          faster and smoother.
        </p>
        <p className="mb-4">You may need:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>A valid form of identification</li>
          <li>Proof of address</li>
          <li>A recent profile photo</li>
          <li>Contact details (email and phone number)</li>
          <li>Details of your skills and services</li>
          <li>Information about your service area</li>
          <li>Bank account details for receiving payments</li>
        </ul>
        <p className="mb-4">
          Having these ready will help avoid delays during verification.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Eligibility & Requirements */}
      <section id="eligibility-requirements">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Eligibility & Requirements
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Are 100 Handy Pros employees?
        </h3>
        <p className="mb-4">
          <strong>
            100 Handy Pros operate as independent service providers
          </strong>
          , not employees.
        </p>
        <p className="mb-4">This means:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>You choose which jobs to accept</li>
          <li>You set your availability</li>
          <li>You manage your own tools and materials</li>
          <li>You operate as a self-employed professional or business</li>
        </ul>
        <p className="mb-4">
          100 Handy provides the platform that connects Pros with clients, but
          each Pro is responsible for delivering services professionally and
          safely.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Eligibility requirements
        </h3>
        <p className="mb-4">
          Before registering as a <strong>100 Handy Pro</strong>, you must meet
          certain eligibility criteria.
        </p>
        <p className="mb-4">Typical requirements include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Being legally allowed to work in your country</li>
          <li>Providing valid identification</li>
          <li>Passing identity verification checks</li>
          <li>Operating within supported service areas</li>
          <li>Being at least 18 years old</li>
          <li>Demonstrating relevant skills or experience</li>
        </ul>
        <p className="mb-4">
          Additional checks may apply depending on the services you offer.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Identity Verification */}
      <section id="identity-verification">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Identity Verification
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Verifying your identity
        </h3>
        <p className="mb-4">
          Identity verification helps ensure trust and safety across the
          platform.
        </p>
        <p className="mb-4">During registration, you will be asked to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Upload identification documents</li>
          <li>Confirm your personal details</li>
          <li>Submit a clear photo for verification</li>
          <li>Complete required background checks (where applicable)</li>
        </ul>
        <p className="mb-4">
          Verification protects both clients and Pros.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Identity verification process
        </h3>
        <p className="mb-4">
          The verification process typically includes:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Uploading your identification document.</li>
          <li>Confirming your details match your documents.</li>
          <li>Completing any required checks.</li>
          <li>Waiting for review and approval.</li>
        </ol>
        <p className="mb-4">
          Most identity checks are completed within a few working days.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Background checks (where applicable)
        </h3>
        <p className="mb-4">
          Depending on your location and service category, background checks may
          be required.
        </p>
        <p className="mb-4">These checks help:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Maintain trust on the platform</li>
          <li>Protect clients and professionals</li>
          <li>Ensure safe working environments</li>
        </ul>
        <p className="mb-4">
          You will be notified if additional screening is required as part of
          your registration.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. Account Setup */}
      <section id="account-setup">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. Account Setup
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Create your 100 Handy Pro profile
        </h3>
        <p className="mb-4">
          Your profile is how clients learn about your services.
        </p>
        <p className="mb-4">During setup, you will:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Add the services you provide</li>
          <li>Upload a professional profile photo</li>
          <li>Write a short description about your experience</li>
          <li>List your skills and specialisations</li>
          <li>Set your pricing (where applicable)</li>
        </ul>
        <p className="mb-4">
          A strong profile increases your chances of receiving job invitations.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Set your schedule and work area
        </h3>
        <p className="mb-4">You can choose when and where you work.</p>
        <p className="mb-4">You will be able to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Set working hours</li>
          <li>Select service locations</li>
          <li>Adjust availability</li>
          <li>Block unavailable days</li>
          <li>Update your schedule anytime</li>
        </ul>
        <p className="mb-4">
          Keeping your availability accurate helps prevent scheduling conflicts.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Updating or upgrading your account
        </h3>
        <p className="mb-4">
          As your business grows, you may want to update your account.
        </p>
        <p className="mb-4">You can:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Add new services</li>
          <li>Expand your service area</li>
          <li>Update pricing</li>
          <li>Modify profile details</li>
          <li>Change business information</li>
        </ul>
        <p className="mb-4">
          Keeping your profile current improves your visibility to clients.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Completing Registration */}
      <section id="completing-registration">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Completing Registration
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Finish registration</h3>
        <p className="mb-4">
          Before you begin receiving jobs, you must complete all registration
          steps.
        </p>
        <p className="mb-4">Final steps typically include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Completing identity verification</li>
          <li>Uploading required documents</li>
          <li>Finalising your profile details</li>
          <li>Confirming service areas</li>
          <li>Setting your availability</li>
        </ul>
        <p className="mb-4">
          Once completed, your account will be reviewed by the 100 Handy team.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Start receiving jobs</h3>
        <p className="mb-4">After your account is approved:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Your profile becomes visible to clients</li>
          <li>You begin receiving job invitations</li>
          <li>You can review and accept available work</li>
          <li>
            You can start building your reputation through completed jobs and
            client reviews
          </li>
        </ul>
        <p className="mb-4">
          Strong early performance helps increase booking opportunities.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 6. Support During Registration */}
      <section id="support-during-registration">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          6. Support During Registration
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Help with registration issues
        </h3>
        <p className="mb-4">
          If you experience difficulties during registration, support is
          available to help you continue.
        </p>
        <p className="mb-4">Common issues include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Uploading documents</li>
          <li>Identity verification delays</li>
          <li>Profile setup questions</li>
          <li>Technical problems</li>
          <li>Missing information errors</li>
        </ul>
        <p className="mb-4">
          If you get stuck, contact support for assistance.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Submit a registration support request
        </h3>
        <p className="mb-4">To request help:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Open the support section.</li>
          <li>
            Select <strong>Registration Support</strong>.
          </li>
          <li>
            Choose the type of issue:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Identity verification</li>
              <li>Document upload</li>
              <li>Profile setup</li>
              <li>Eligibility questions</li>
            </ul>
          </li>
          <li>Add details and attachments if needed.</li>
          <li>Submit your request.</li>
        </ol>
        <p className="mb-4">
          Our support team will review your request and respond with next steps.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
