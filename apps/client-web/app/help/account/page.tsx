import { HelpArticleLayout } from "@/components/help/help-article-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Help | 100 Handy",
  description:
    "Manage your 100 Handy account, update your profile, resolve login issues, and learn about security and privacy settings.",
};

const sidebarLinks = [
  { name: "Profile Management", href: "#profile-management" },
  { name: "Access & Login", href: "#access-and-login" },
  { name: "Account Changes", href: "#account-changes" },
  { name: "Security & Privacy", href: "#security-and-privacy" },
  { name: "Help and Support", href: "#help-and-support" },
];

export default function HelpAccountPage() {
  return (
    <HelpArticleLayout
      title="Account"
      breadcrumb="100 Handy Support / Account"
      sidebarLinks={sidebarLinks}
    >
      {/* Intro */}
      <p className="mb-4">
        The <strong>Account</strong> section in the 100 Handy Help Centre covers
        everything related to managing your profile, account settings, and login
        access.
      </p>
      <p className="mb-4">
        This section helps both <strong>Clients and 100 Handy Pros</strong> keep
        their information up to date, resolve login issues, manage
        notifications, and understand how account changes work.
      </p>
      <p className="mb-4">
        Keeping your account details accurate helps ensure smooth bookings,
        reliable communication, and secure access to your services.
      </p>

      <hr className="my-8 border-gray-200" />

      {/* 1. Profile Management */}
      <section id="profile-management">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          1. Profile Management
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Updating your account details
        </h3>
        <p className="mb-4">
          You can update your personal details at any time through your account
          dashboard.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Address details</li>
          <li>Profile photo</li>
          <li>Service details (for 100 Handy Pros)</li>
        </ul>
        <p className="mb-4">
          Keeping your information current helps prevent booking issues and
          ensures clients and Pros can communicate effectively.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Notification preferences
        </h3>
        <p className="mb-4">
          You can control how you receive updates and alerts from 100 Handy.
        </p>
        <p className="mb-4">Notification settings allow you to manage:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Booking confirmations</li>
          <li>Messages from clients or Pros</li>
          <li>Job updates</li>
          <li>Payment notifications</li>
          <li>System alerts</li>
          <li>Promotional communications (where applicable)</li>
        </ul>
        <p className="mb-4">
          You can enable or disable notifications based on your preferences.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Changing your password
        </h3>
        <p className="mb-4">
          Updating your password regularly helps keep your account secure.
        </p>
        <p className="mb-4">To change your password:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Open your account settings.</li>
          <li>
            Select <strong>Security Settings</strong>.
          </li>
          <li>Enter your current password.</li>
          <li>Create a new secure password.</li>
          <li>Save your changes.</li>
        </ol>
        <p className="mb-4">
          Choose a password that is difficult to guess and not used on other
          platforms.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 2. Access & Login */}
      <section id="access-and-login">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          2. Access &amp; Login
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Signing in to your account
        </h3>
        <p className="mb-4">To access your 100 Handy account:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Enter your registered email address.</li>
          <li>Enter your password.</li>
          <li>
            Select <strong>Sign In</strong>.
          </li>
        </ol>
        <p className="mb-4">
          Once logged in, you will be able to view bookings, messages, payments,
          and account settings.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Trouble accessing your account
        </h3>
        <p className="mb-4">
          If you are unable to log in, check the following:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Ensure your email address is entered correctly.</li>
          <li>Check that your password is correct.</li>
          <li>Confirm that your internet connection is stable.</li>
          <li>Try resetting your password if necessary.</li>
        </ul>
        <p className="mb-4">
          If the issue continues, contact support for assistance.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Account recovery</h3>
        <p className="mb-4">
          If you have forgotten your password or cannot access your account:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            Select <strong>Forgot Password</strong> on the login page.
          </li>
          <li>Enter your registered email address.</li>
          <li>Follow the instructions sent to your email.</li>
          <li>Create a new password.</li>
        </ol>
        <p className="mb-4">
          If you no longer have access to your registered email address, contact
          support to verify your identity and recover your account.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 3. Account Changes */}
      <section id="account-changes">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          3. Account Changes
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Updating account information
        </h3>
        <p className="mb-4">
          You can correct or update your account information at any time.
        </p>
        <p className="mb-4">This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Personal details</li>
          <li>Contact information</li>
          <li>Payment details</li>
          <li>Service details (for 100 Handy Pros)</li>
          <li>Saved addresses (for Clients)</li>
        </ul>
        <p className="mb-4">
          Keeping your information accurate helps prevent service disruptions.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Managing linked details
        </h3>
        <p className="mb-4">
          Some information is connected across your account to support bookings
          and communication.
        </p>
        <p className="mb-4">Linked details may include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Contact information</li>
          <li>Payment methods</li>
          <li>Service preferences</li>
          <li>Booking history</li>
          <li>Saved locations</li>
        </ul>
        <p className="mb-4">
          Updating linked details ensures all parts of your account function
          correctly.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Closing your account</h3>
        <p className="mb-4">
          If you wish to close your 100 Handy account:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Submit an account closure request through support.</li>
          <li>Complete any active bookings before closure.</li>
          <li>Confirm your request.</li>
        </ol>
        <p className="mb-4">After closure:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>You will no longer be able to access your account.</li>
          <li>Booking history may be removed or archived.</li>
          <li>
            Certain information may be retained where legally required.
          </li>
        </ul>
        <p className="mb-4">
          Account closure is permanent and cannot always be reversed.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 4. Security & Privacy */}
      <section id="security-and-privacy">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          4. Security &amp; Privacy
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Keeping your account secure
        </h3>
        <p className="mb-4">
          Protecting your account helps prevent unauthorised access.
        </p>
        <p className="mb-4">We recommend:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Using a strong, unique password</li>
          <li>Keeping login details private</li>
          <li>Logging out when using shared devices</li>
          <li>Updating passwords regularly</li>
          <li>Monitoring your account activity</li>
        </ul>
        <p className="mb-4">
          If you suspect unauthorised activity, contact support immediately.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Privacy settings</h3>
        <p className="mb-4">Your privacy is important to us.</p>
        <p className="mb-4">
          100 Handy manages account data securely and uses information only to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Support bookings</li>
          <li>Process payments</li>
          <li>Enable communication</li>
          <li>Improve service quality</li>
          <li>Maintain platform security</li>
        </ul>
        <p className="mb-4">
          You can manage communication preferences within your account settings.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">Account verification</h3>
        <p className="mb-4">
          In some cases, you may be asked to verify your identity to secure your
          account.
        </p>
        <p className="mb-4">Verification may be required when:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Updating sensitive account details</li>
          <li>Changing payment information</li>
          <li>Recovering account access</li>
          <li>Completing certain registration steps</li>
        </ul>
        <p className="mb-4">
          Verification helps protect both Clients and 100 Handy Pros.
        </p>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* 5. Help and Support */}
      <section id="help-and-support">
        <h2 className="text-[22px] font-bold text-brand-dark-alt mb-4">
          5. Help and Support
        </h2>

        <h3 className="text-[16px] font-bold mb-2">
          Getting help with account issues
        </h3>
        <p className="mb-4">
          If you experience problems with your account, support is available.
        </p>
        <p className="mb-4">Common account issues include:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Login errors</li>
          <li>Password reset problems</li>
          <li>Notification issues</li>
          <li>Account update errors</li>
          <li>Verification delays</li>
        </ul>
        <p className="mb-4">
          If you are unable to resolve the issue, contact support for
          assistance.
        </p>

        <hr className="my-8 border-gray-200" />

        <h3 className="text-[16px] font-bold mb-2">
          Submit an account support request
        </h3>
        <p className="mb-4">To request help with an account issue:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Open the support section.</li>
          <li>
            Select <strong>Account Support</strong>.
          </li>
          <li>
            Choose the issue type:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Login issue</li>
              <li>Password reset</li>
              <li>Account update</li>
              <li>Security concern</li>
              <li>Account closure</li>
            </ul>
          </li>
          <li>Add details and attachments if required.</li>
          <li>Submit your request.</li>
        </ol>
        <p className="mb-4">
          Our support team will review your request and respond with the next
          steps.
        </p>
      </section>
    </HelpArticleLayout>
  );
}
