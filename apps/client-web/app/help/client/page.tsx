import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Support | Help | 100 Handy",
  description:
    "The Client Support section on the 100 Handy help centre brings together all guidance for customers booking services through our platform.",
};

const sidebarLinks = [
  { name: "Getting Started & Booking", href: "#getting-started" },
  { name: "Payments, Pricing & Refunds", href: "#payments-pricing-refunds" },
  {
    name: "Communicating with Professionals",
    href: "#communicating-with-professionals",
  },
  { name: "Issues, Disputes & Safety", href: "#issues-disputes-safety" },
  { name: "Account & Settings", href: "#account-settings" },
  {
    name: "Furniture Assembly & Specialist Services",
    href: "#furniture-assembly-specialist-services",
  },
  { name: "Contacting Support", href: "#contacting-support" },
];

export default function HelpClientPage() {
  return (
    <HelpArticleLayout
      title="Client Support"
      breadcrumb="100 Handy Support / Client Support"
      sidebarLinks={sidebarLinks}
    >
      <p className="mb-4">
        The Client Support section on the 100 Handy help centre brings together
        all guidance for customers booking services through our platform. It is
        organised into clear categories that follow the full journey - from
        creating a job to resolving issues after completion.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Getting Started & Booking */}
      <section id="getting-started">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Getting Started & Booking
        </h2>

        <h3 className="text-[16px] font-bold mb-2">How to book a job</h3>
        <p className="mb-4">
          Booking with 100 Handy is simple and designed to match you with the
          right professional quickly.
        </p>
        <p className="mb-4">
          <strong>Step-by-step:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            Select the type of service you need (e.g., gardening, cleaning,
            repairs, assembly, or outdoor maintenance).
          </li>
          <li>
            Enter your job details, including:
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Location</li>
              <li>Description of the work</li>
              <li>Preferred date and time</li>
              <li>Photos (recommended for accurate quotes)</li>
            </ul>
          </li>
          <li>
            Review available professionals:
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Ratings and customer reviews</li>
              <li>Skills and completed jobs</li>
              <li>Pricing information</li>
            </ul>
          </li>
          <li>
            Choose your preferred professional and confirm the booking.
          </li>
        </ol>
        <p className="mb-4">
          Once confirmed, your booking details are saved in your account and
          shared with your selected professional.
        </p>

        <h3 className="text-[16px] font-bold mb-2">
          What happens after I book?
        </h3>
        <p className="mb-4">After your booking is confirmed:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            You will receive a confirmation email with your job details.
          </li>
          <li>
            A secure chat will open between you and your chosen professional.
          </li>
          <li>
            You can share extra instructions, photos, or updates before the
            scheduled visit.
          </li>
          <li>
            Your professional will arrive at the agreed time with the tools
            needed to complete the task.
          </li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          Changing or cancelling a booking
        </h3>
        <p className="mb-4">
          Plans change — we understand.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            You can <strong>reschedule or cancel free of charge</strong> if done{" "}
            <strong>more than 24 hours before</strong> your scheduled time.
          </li>
          <li>
            If you cancel <strong>within 24 hours</strong>, a cancellation fee
            may apply.
          </li>
          <li>Refunds are processed automatically where applicable.</li>
          <li>Changes can be made directly from your account dashboard.</li>
        </ul>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Payments, Pricing & Refunds */}
      <section id="payments-pricing-refunds">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Payments, Pricing & Refunds
        </h2>

        <h3 className="text-[16px] font-bold mb-2">How pricing works</h3>
        <p className="mb-4">
          Pricing on 100 Handy is transparent and based on the type of work
          requested.
        </p>
        <p className="mb-4">Typical pricing includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>The professional&apos;s service rate</li>
          <li>Any materials required (if agreed in advance)</li>
          <li>Additional time if the task runs longer than expected</li>
        </ul>
        <p className="mb-4">If extra work is needed during the job:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Your professional will notify you</li>
          <li>You approve any changes before work continues</li>
        </ul>
        <p className="mb-4">
          There are <strong>no hidden costs</strong>, and all charges are clearly
          shown before confirmation.
        </p>

        <h3 className="text-[16px] font-bold mb-2">Payment methods</h3>
        <p className="mb-4">We accept secure online payments using:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Visa</li>
          <li>Mastercard</li>
          <li>American Express</li>
          <li>Other approved payment methods available in your region</li>
        </ul>
        <p className="mb-4">
          <strong>How payments are handled:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Payment details are authorised at booking.</li>
          <li>Final payment is processed once the job is completed.</li>
          <li>
            You can update payment details anytime from your account.
          </li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          Refunds & service guarantees
        </h3>
        <p className="mb-4">
          If something doesn&apos;t go as expected, we are here to help.
        </p>
        <p className="mb-4">You may qualify for a refund if:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>The work was incomplete</li>
          <li>The quality did not meet expectations</li>
          <li>The professional did not arrive</li>
        </ul>
        <p className="mb-4">To request support:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Contact us within <strong>24 hours</strong> of task completion
          </li>
          <li>Provide photos or details of the issue</li>
          <li>Our team will review and respond promptly</li>
        </ul>
        <p className="mb-4">
          Most cases are resolved within <strong>1–3 working days</strong>.
        </p>

        <h3 className="text-[16px] font-bold mb-2">Invoices & receipts</h3>
        <p className="mb-4">After your job is completed:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>A digital receipt is available in your account</li>
          <li>You can download invoices as PDFs</li>
          <li>
            Receipts include:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Professional&apos;s name</li>
              <li>Service date</li>
              <li>Duration</li>
              <li>Total charges</li>
            </ul>
          </li>
        </ul>
        <p className="mb-4">
          If you notice an error, contact support for assistance.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Communicating with Professionals */}
      <section id="communicating-with-professionals">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Communicating with Professionals
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Using the chat</h3>
        <p className="mb-4">
          All communication takes place through the secure 100 Handy chat
          system.
        </p>
        <p className="mb-4">You can use chat to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Share access details</li>
          <li>Send photos of the job</li>
          <li>Confirm arrival instructions</li>
          <li>Approve additional work</li>
          <li>Ask questions before or after the job</li>
        </ul>
        <p className="mb-4">For privacy and security:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Personal phone numbers remain hidden</li>
          <li>All communication stays within the platform</li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          What information do I see about a professional?
        </h3>
        <p className="mb-4">
          Before booking, you can review each professional&apos;s profile, which
          includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Verified profile status</li>
          <li>Skills and service categories</li>
          <li>Customer reviews and ratings</li>
          <li>Job completion history</li>
          <li>Response time</li>
          <li>Pricing information</li>
        </ul>
        <p className="mb-4">
          This helps you choose the right professional with confidence.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. Issues, Disputes & Safety */}
      <section id="issues-disputes-safety">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. Issues, Disputes & Safety
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          What if my professional is late or doesn&apos;t arrive?
        </h3>
        <p className="mb-4">If your professional is delayed:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            Wait up to <strong>15 minutes</strong> past the scheduled time.
          </li>
          <li>Contact them via chat.</li>
          <li>
            If they do not respond, contact 100 Handy support.
          </li>
        </ol>
        <p className="mb-4">We will:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Arrange a replacement professional where possible</li>
          <li>Provide a refund if the job cannot be completed</li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          Reporting damages or problems
        </h3>
        <p className="mb-4">If something goes wrong during the job:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Report the issue immediately through support</li>
          <li>Provide photos and a description</li>
          <li>Our team will investigate the situation</li>
        </ul>
        <p className="mb-4">Where appropriate, we will:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Arrange corrective work</li>
          <li>Offer compensation</li>
          <li>Provide refunds where necessary</li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">Safety guidelines</h3>
        <p className="mb-4">Your safety is important to us.</p>
        <p className="mb-4">We recommend:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Meeting professionals in well-lit areas</li>
          <li>Keeping communication within the platform</li>
          <li>Avoiding sharing personal contact details</li>
          <li>Reporting any suspicious behaviour immediately</li>
        </ul>
        <p className="mb-4">
          All professionals on 100 Handy go through verification checks before
          joining the platform.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Account & Settings */}
      <section id="account-settings">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Account & Settings
        </h2>

        <h3 className="text-[16px] font-bold mb-2">Managing your profile</h3>
        <p className="mb-4">
          You can update your account details at any time, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Email address</li>
          <li>Phone number</li>
          <li>Password</li>
          <li>Notification preferences</li>
          <li>Saved addresses</li>
        </ul>
        <p className="mb-4">
          Keeping your profile updated ensures smooth bookings.
        </p>

        <h3 className="text-[16px] font-bold mb-2">
          Deleting or deactivating your account
        </h3>
        <p className="mb-4">If you wish to close your account:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Submit a request through customer support</li>
          <li>Your booking history will no longer be accessible</li>
          <li>
            Some data may be retained for legal and operational reasons
          </li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          Promo codes & discounts
        </h3>
        <p className="mb-4">If you receive a promotional code:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Enter it during checkout</li>
          <li>Discounts apply automatically</li>
          <li>Some codes have expiry dates or usage limits</li>
        </ul>
        <p className="mb-4">
          You can view active promotions in your account dashboard.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 6. Furniture Assembly & Specialist Services */}
      <section id="furniture-assembly-specialist-services">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          6. Furniture Assembly & Specialist Services
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Booking assembly or specialist services
        </h3>
        <p className="mb-4">
          100 Handy supports a wide range of specialised services, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Furniture assembly</li>
          <li>Garden landscaping</li>
          <li>Outdoor maintenance</li>
          <li>Cleaning and repairs</li>
          <li>Seasonal services</li>
        </ul>
        <p className="mb-4">To book:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Select the relevant service category</li>
          <li>Add product or task details</li>
          <li>Upload photos if available</li>
          <li>Confirm your booking</li>
        </ol>

        <h3 className="text-[16px] font-bold mb-2">
          What&apos;s included in assembly services
        </h3>
        <p className="mb-4">Typical furniture assembly includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Unpacking items</li>
          <li>Assembly using provided instructions</li>
          <li>Basic setup</li>
          <li>Removal of packaging (if agreed)</li>
        </ul>
        <p className="mb-4">Not included unless requested:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Wall mounting</li>
          <li>Electrical connections</li>
          <li>Plumbing work</li>
        </ul>
        <p className="mb-4">These services must be booked separately.</p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 7. Contacting Support */}
      <section id="contacting-support">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          7. Contacting Support
        </h2>

        <h3 className="text-[16px] font-bold mb-2">How to contact us</h3>
        <p className="mb-4">
          If you need help, our support team is ready to assist.
        </p>
        <p className="mb-4">You can contact us via:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Live chat</li>
          <li>Email support form</li>
          <li>In-app messaging</li>
        </ul>
        <p className="mb-4">
          <strong>Typical support hours:</strong>
          <br />
          Monday to Saturday
          <br />
          9:00am – 5:00pm
        </p>
        <p className="mb-4">Response times:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Urgent issues: Same day</li>
          <li>General queries: Within 24 hours</li>
        </ul>

        <h3 className="text-[16px] font-bold mb-2">
          Submit a support request
        </h3>
        <p className="mb-4">To submit a request:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Visit the support page</li>
          <li>
            Select your issue type:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Booking problem</li>
              <li>Billing question</li>
              <li>Account help</li>
              <li>Service complaint</li>
            </ul>
          </li>
          <li>Add details and attachments</li>
          <li>Submit your request</li>
        </ol>
        <p className="mb-4">
          Our team will review your case and respond with next steps.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
