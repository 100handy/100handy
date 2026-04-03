import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100 Handy Pro Support | Help | 100 Handy",
  description:
    "The 100 Handy Pros Support section provides guidance for professionals delivering services through the 100 Handy platform. Manage bookings, communicate with clients, deliver professional service, and resolve issues.",
};

const sidebarLinks = [
  {
    name: "Receiving & Managing Job Invitations",
    href: "#receiving-managing-job-invitations",
  },
  { name: "Communicating with Clients", href: "#communicating-with-clients" },
  {
    name: "Scheduling & Completing Jobs",
    href: "#scheduling-completing-jobs",
  },
  {
    name: "Payments, Earnings & Invoicing",
    href: "#payments-earnings-invoicing",
  },
  {
    name: "Professional Standards & Client Experience",
    href: "#professional-standards-client-experience",
  },
  { name: "Issues, Disputes & Safety", href: "#issues-disputes-safety" },
  { name: "Account & Profile Settings", href: "#account-profile-settings" },
  {
    name: "Contacting 100 Handy Pro Support",
    href: "#contacting-100-handy-pro-support",
  },
];

export default function HelpProPage() {
  return (
    <HelpArticleLayout
      title="100 Handy Pro"
      breadcrumb="100 Handy Support / 100 Handy Pro"
      sidebarLinks={sidebarLinks}
    >
      <p className="mb-4">
        The <strong>100 Handy Pros Support</strong> section provides guidance
        for professionals delivering services through the 100 Handy platform. It
        is designed to support Pros throughout the full job lifecycle - from
        receiving job invitations to completing work and receiving payments.
      </p>
      <p className="mb-4">
        This section helps <strong>100 Handy Pros</strong> manage bookings,
        communicate with clients, deliver professional service, and resolve any
        issues efficiently.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Receiving & Managing Job Invitations */}
      <section id="receiving-managing-job-invitations">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Receiving & Managing Job Invitations
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          How do I receive job invitations?
        </h3>
        <p className="mb-4">
          When a client submits a job request that matches your skills and
          service area, you will receive a notification through your{" "}
          <strong>100 Handy Pro dashboard or mobile app</strong>.
        </p>
        <p className="mb-4">Each job invitation includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Job description</li>
          <li>Location details</li>
          <li>Preferred date and time</li>
          <li>Client notes and photos (if provided)</li>
          <li>Estimated service requirements</li>
        </ul>
        <p className="mb-4">
          You can review all details before deciding whether to accept the job.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Accepting or declining a job
        </h3>
        <p className="mb-4">
          As a <strong>100 Handy Pro</strong>, you decide which jobs to take.
        </p>
        <p className="mb-4">To respond to an invitation:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Review the job details carefully.</li>
          <li>Check the date, time, and location.</li>
          <li>Confirm you have the correct tools and skills.</li>
          <li>Accept or decline the job through your dashboard.</li>
        </ol>
        <p className="mb-4">
          Responding quickly improves your visibility and reliability within the
          platform.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Managing your availability
        </h3>
        <p className="mb-4">
          Keeping your availability updated ensures you only receive suitable job
          requests.
        </p>
        <p className="mb-4">You can:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Set working hours</li>
          <li>Block unavailable dates</li>
          <li>Adjust service areas</li>
          <li>Pause availability temporarily</li>
        </ul>
        <p className="mb-4">
          Accurate scheduling helps prevent cancellations and improves client
          satisfaction.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Communicating with Clients */}
      <section id="communicating-with-clients">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Communicating with Clients
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Using the secure chat system
        </h3>
        <p className="mb-4">
          All communication between <strong>100 Handy Pros</strong> and clients
          takes place through the secure in-platform chat.
        </p>
        <p className="mb-4">Use chat to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Confirm arrival times</li>
          <li>Ask clarifying questions</li>
          <li>Request additional details or photos</li>
          <li>Confirm job requirements</li>
          <li>Notify clients of delays</li>
        </ul>
        <p className="mb-4">
          Keeping communication inside the platform protects both you and the
          client.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Confirming job details before arrival
        </h3>
        <p className="mb-4">Before attending a job, confirm:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Exact service requirements</li>
          <li>Property access instructions</li>
          <li>Parking availability</li>
          <li>Required tools or materials</li>
          <li>Estimated job duration</li>
        </ul>
        <p className="mb-4">
          Clear preparation reduces misunderstandings and ensures efficient
          service delivery.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Scheduling & Completing Jobs */}
      <section id="scheduling-completing-jobs">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Scheduling & Completing Jobs
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Preparing for a job</h3>
        <p className="mb-4">Before arriving at a client location:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Review the job details carefully</li>
          <li>Bring all required tools and equipment</li>
          <li>Plan your travel time</li>
          <li>Wear appropriate work clothing</li>
          <li>Maintain professional conduct at all times</li>
        </ul>
        <p className="mb-4">
          Preparation ensures work is completed efficiently and professionally.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Marking a job as complete
        </h3>
        <p className="mb-4">Once work is finished:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Confirm the client is satisfied.</li>
          <li>Update the job status in your dashboard.</li>
          <li>Add completion notes if needed.</li>
          <li>Submit final job details.</li>
        </ol>
        <p className="mb-4">
          Marking jobs correctly ensures smooth payment processing.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Handling changes during a job
        </h3>
        <p className="mb-4">If the client requests additional work:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Discuss the changes clearly</li>
          <li>Confirm updates through the platform chat</li>
          <li>Ensure the client approves any extra time or materials</li>
          <li>Continue only after approval</li>
        </ul>
        <p className="mb-4">
          All updates should be recorded within the platform.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. Payments, Earnings & Invoicing */}
      <section id="payments-earnings-invoicing">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. Payments, Earnings & Invoicing
        </h2>

        <h3 className="text-[16px] font-bold mb-2">How payments work</h3>
        <p className="mb-4">
          Payments for completed jobs are handled securely through the 100 Handy
          platform.
        </p>
        <p className="mb-4">Typical payment process:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Client payment is authorised during booking</li>
          <li>
            Final charges are confirmed once the job is completed
          </li>
          <li>
            Funds are transferred to your account within the scheduled payout
            timeframe
          </li>
        </ul>
        <p className="mb-4">
          You can monitor earnings directly from your dashboard.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Viewing earnings and payment history
        </h3>
        <p className="mb-4">
          Your <strong>100 Handy Pro dashboard</strong> allows you to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Track completed job payments</li>
          <li>View pending payments</li>
          <li>Download payment summaries</li>
          <li>Review earnings history</li>
        </ul>
        <p className="mb-4">
          This helps you manage your business finances efficiently.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Resolving payment issues
        </h3>
        <p className="mb-4">If you experience a payment issue:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Check the job completion status</li>
          <li>Review your payout details</li>
          <li>Contact support if the issue continues</li>
        </ul>
        <p className="mb-4">
          Most payment issues are resolved within a few working days.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Professional Standards & Client Experience */}
      <section id="professional-standards-client-experience">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Professional Standards & Client Experience
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Delivering high-quality service
        </h3>
        <p className="mb-4">
          All <strong>100 Handy Pros</strong> are expected to maintain
          professional service standards.
        </p>
        <p className="mb-4">Best practices include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Arriving on time</li>
          <li>Communicating clearly</li>
          <li>Completing work to agreed standards</li>
          <li>Respecting client property</li>
          <li>Leaving the workspace clean and tidy</li>
        </ul>
        <p className="mb-4">
          Consistent service quality leads to positive reviews and repeat
          bookings.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Receiving reviews and ratings
        </h3>
        <p className="mb-4">
          After each completed job, clients may leave feedback.
        </p>
        <p className="mb-4">Reviews typically reflect:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Quality of work</li>
          <li>Communication</li>
          <li>Punctuality</li>
          <li>Professional behaviour</li>
        </ul>
        <p className="mb-4">
          Maintaining strong ratings improves your chances of receiving more job
          invitations.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Handling cancellations</h3>
        <p className="mb-4">If you need to cancel a job:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Notify the client immediately</li>
          <li>Cancel the job through the platform</li>
          <li>Provide a clear explanation if required</li>
        </ul>
        <p className="mb-4">
          Frequent cancellations may affect your visibility and reputation.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 6. Issues, Disputes & Safety */}
      <section id="issues-disputes-safety">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          6. Issues, Disputes & Safety
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          What if a problem occurs during a job?
        </h3>
        <p className="mb-4">If an issue arises:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Pause work if necessary</li>
          <li>Inform the client immediately</li>
          <li>Contact support for assistance</li>
          <li>Provide photos or documentation if needed</li>
        </ul>
        <p className="mb-4">
          Our support team will help resolve issues fairly.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Reporting safety concerns
        </h3>
        <p className="mb-4">Your safety matters.</p>
        <p className="mb-4">If you feel unsafe:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Leave the location immediately</li>
          <li>Contact support</li>
          <li>Report the situation with details</li>
        </ul>
        <p className="mb-4">
          All reports are taken seriously and reviewed promptly.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Reporting accidental damage
        </h3>
        <p className="mb-4">If damage occurs during a job:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Inform the client immediately</li>
          <li>Take photos of the issue</li>
          <li>Submit a report through support</li>
          <li>Follow instructions provided by the support team</li>
        </ul>
        <p className="mb-4">
          Honest reporting helps resolve issues quickly.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 7. Account & Profile Settings */}
      <section id="account-profile-settings">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          7. Account & Profile Settings
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Managing your 100 Handy Pro profile
        </h3>
        <p className="mb-4">
          Your profile helps clients understand your skills and experience.
        </p>
        <p className="mb-4">You can update:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Contact details</li>
          <li>Skills and services</li>
          <li>Service areas</li>
          <li>Pricing</li>
          <li>Availability</li>
          <li>Profile images</li>
        </ul>
        <p className="mb-4">
          An up-to-date profile improves booking opportunities.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Updating payment details
        </h3>
        <p className="mb-4">To receive payments without delays:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Ensure your banking details are accurate</li>
          <li>Update payment information when needed</li>
          <li>Review payout settings regularly</li>
        </ul>
        <p className="mb-4">Incorrect details may delay payments.</p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Deactivating your Pro account
        </h3>
        <p className="mb-4">If you decide to stop offering services:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Submit a request to deactivate your account</li>
          <li>Complete all outstanding jobs</li>
          <li>Download payment records if required</li>
        </ul>
        <p className="mb-4">
          Account deactivation removes access to your job history.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 8. Contacting 100 Handy Pro Support */}
      <section id="contacting-100-handy-pro-support">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          8. Contacting 100 Handy Pro Support
        </h2>

        <h3 className="text-[16px] font-bold mb-2">How to contact support</h3>
        <p className="mb-4">
          100 Handy Pros can contact support directly through the platform.
        </p>
        <p className="mb-4">Support is available via:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>In-app chat</li>
          <li>Help centre messaging</li>
          <li>Support request forms</li>
        </ul>
        <p className="mb-4">
          <strong>Support hours:</strong>
          <br />
          Monday to Saturday
          <br />
          9:00am – 5:00pm
        </p>
        <p className="mb-4">
          Outside these hours, you can leave a message and our team will respond
          as soon as possible.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Submitting a support request
        </h3>
        <p className="mb-4">To submit a request:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Open the support section</li>
          <li>
            Select the issue type:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Job issue</li>
              <li>Client communication</li>
              <li>Payment question</li>
              <li>Account support</li>
            </ul>
          </li>
          <li>Add details and attachments</li>
          <li>Submit the request</li>
        </ol>
        <p className="mb-4">
          Our support team will review your request and provide next steps.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
