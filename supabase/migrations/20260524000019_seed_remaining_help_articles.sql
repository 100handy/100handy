insert into public.help_articles (
  article_key,
  slug,
  title,
  breadcrumb,
  summary,
  sidebar_links_json,
  body_html,
  related_links_json,
  status
)
values
  (
    'account',
    'account',
    'Account',
    '100 Handy Support / Account',
    'Manage your 100 Handy account, update your profile, resolve login issues, and understand security controls.',
    '[
      {"name":"Profile Management","href":"#profile-management"},
      {"name":"Access & Login","href":"#access-and-login"},
      {"name":"Account Changes","href":"#account-changes"},
      {"name":"Security & Privacy","href":"#security-and-privacy"},
      {"name":"Help and Support","href":"#help-and-support"}
    ]'::jsonb,
    '<p>The Account section explains how clients and Pros manage profile details, access settings, and secure their 100 Handy account.</p>
    <section id="profile-management" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Profile Management</h2>
      <p>Keep your full name, phone number, addresses, payment details, and profile photo up to date to avoid booking and communication issues.</p>
      <p>Notification preferences can be adjusted so you only receive the booking, payment, system, and promotional messages you want.</p>
      <p>You can also change your password from security settings at any time.</p>
    </section>
    <section id="access-and-login" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Access & Login</h2>
      <p>Sign in with your registered email and password to access bookings, messages, payments, and account settings.</p>
      <p>If you cannot log in, first confirm your email, password, and internet connection, then use the password reset flow if needed.</p>
      <p>If you lose access to your registered email address, contact support to verify your identity and recover the account.</p>
    </section>
    <section id="account-changes" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Account Changes</h2>
      <p>You can update personal details, contact information, service details, and saved locations at any time.</p>
      <p>If you need to close your account, make sure active bookings are completed or cancelled first and review any retained data requirements.</p>
    </section>
    <section id="security-and-privacy" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. Security & Privacy</h2>
      <p>Use a strong password, review notifications, and only share sensitive information through trusted 100 Handy channels.</p>
      <p>For privacy questions, refer to the platform privacy documentation and contact support if you need help with account data requests.</p>
    </section>
    <section id="help-and-support" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Help and Support</h2>
      <p>If an account issue affects bookings, payments, or access, use support chat or submit a request so the team can investigate quickly.</p>
    </section>'::text,
    '[
      {"label":"Registration","href":"/help/registration"},
      {"label":"Policy Center","href":"/help/policies"},
      {"label":"Contact support","href":"/contact"}
    ]'::jsonb,
    'published'
  ),
  (
    'client',
    'client',
    'Client Support',
    '100 Handy Support / Client Support',
    'Guidance for clients booking services, managing payments, communicating with Pros, and resolving issues.',
    '[
      {"name":"Getting Started & Booking","href":"#getting-started"},
      {"name":"Payments, Pricing & Refunds","href":"#payments-pricing-refunds"},
      {"name":"Communicating with Professionals","href":"#communicating-with-professionals"},
      {"name":"Issues, Disputes & Safety","href":"#issues-disputes-safety"},
      {"name":"Account & Settings","href":"#account-settings"},
      {"name":"Contacting Support","href":"#contacting-support"}
    ]'::jsonb,
    '<p>The Client Support section follows the full customer journey, from booking a task to resolving issues after completion.</p>
    <section id="getting-started" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Getting Started & Booking</h2>
      <p>Choose a service, add location and task details, review available Pros, then confirm the booking through the platform.</p>
      <p>After booking, you receive confirmation, a secure message thread with your Pro, and a saved task record inside your account.</p>
      <p>You can reschedule or cancel free of charge more than 24 hours before the scheduled start time. Short-notice cancellation fees may apply.</p>
    </section>
    <section id="payments-pricing-refunds" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Payments, Pricing & Refunds</h2>
      <p>Pricing is shown clearly before confirmation. If extra work is needed, the Pro should confirm it with you before continuing.</p>
      <p>Cards are authorised securely online and the final charge is processed after the task is completed.</p>
      <p>If a task is incomplete, poor quality, or unattended, contact support within 24 hours with details or photos so the team can review the case.</p>
    </section>
    <section id="communicating-with-professionals" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Communicating with Professionals</h2>
      <p>Use the in-platform chat to confirm arrival details, share access notes, parking instructions, or photos, and keep a clear record of job changes.</p>
    </section>
    <section id="issues-disputes-safety" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. Issues, Disputes & Safety</h2>
      <p>If something goes wrong during or after the job, report it promptly with as much context as possible so support can review and mediate.</p>
    </section>
    <section id="account-settings" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Account & Settings</h2>
      <p>Clients can manage saved addresses, payment methods, promos, support tickets, and notifications directly inside their account settings.</p>
    </section>
    <section id="contacting-support" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">6. Contacting Support</h2>
      <p>Use in-app support chat, the ticket view, or the contact page when you need help with bookings, billing, account issues, or disputes.</p>
    </section>'::text,
    '[
      {"label":"Account","href":"/help/account"},
      {"label":"Policy Center","href":"/help/policies"},
      {"label":"Contact support","href":"/contact"}
    ]'::jsonb,
    'published'
  ),
  (
    'pro',
    'pro',
    '100 Handy Pro Support',
    '100 Handy Support / 100 Handy Pro Support',
    'Operational guidance for Pros on registration, job management, communication, availability, and payments.',
    '[
      {"name":"Receiving and Managing Jobs","href":"#receiving-and-managing-jobs"},
      {"name":"Communicating with Clients","href":"#communicating-with-clients"},
      {"name":"Scheduling & Completing Jobs","href":"#scheduling-completing-jobs"},
      {"name":"Payments & Earnings","href":"#payments-earnings"},
      {"name":"Account & Performance","href":"#account-performance"},
      {"name":"Support & Policies","href":"#support-policies"}
    ]'::jsonb,
    '<p>The 100 Handy Pro support area explains how Pros receive work, deliver services, and manage account performance on the platform.</p>
    <section id="receiving-and-managing-jobs" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Receiving and Managing Jobs</h2>
      <p>When a request matches your service area and skills, you receive job details through the dashboard or mobile app.</p>
      <p>Review the date, location, service requirements, and materials before deciding whether to accept the task.</p>
      <p>Keep your availability and service area accurate so you only receive suitable invitations.</p>
    </section>
    <section id="communicating-with-clients" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Communicating with Clients</h2>
      <p>Use secure platform chat to confirm access instructions, timing, parking, and any clarifying details before arrival.</p>
    </section>
    <section id="scheduling-completing-jobs" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Scheduling & Completing Jobs</h2>
      <p>Prepare the right tools, arrive on time, and mark the booking complete only after the client confirms the job is finished.</p>
      <p>If scope changes mid-job, confirm those changes with the client before continuing.</p>
    </section>
    <section id="payments-earnings" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. Payments & Earnings</h2>
      <p>Keep payout details current, review completed bookings, and monitor earnings from the dashboard. Payment timing depends on platform settlement rules.</p>
    </section>
    <section id="account-performance" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Account & Performance</h2>
      <p>Reviews, completion rate, response speed, and accurate availability all affect visibility and reliability on the platform.</p>
    </section>
    <section id="support-policies" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">6. Support & Policies</h2>
      <p>Use support when you need help with bookings, disputes, payouts, or account issues, and review platform policy updates regularly.</p>
    </section>'::text,
    '[
      {"label":"Registration","href":"/help/registration"},
      {"label":"Trust and Safety","href":"/help/trust-safety"},
      {"label":"Contact support","href":"/contact"}
    ]'::jsonb,
    'published'
  ),
  (
    'registration',
    'registration',
    'Registration',
    '100 Handy Support / Registration',
    'How Pros register, complete verification, and prepare their account to receive jobs.',
    '[
      {"name":"Getting Started","href":"#getting-started"},
      {"name":"Eligibility & Requirements","href":"#eligibility-requirements"},
      {"name":"Identity Verification","href":"#identity-verification"},
      {"name":"Account Setup","href":"#account-setup"},
      {"name":"Completing Registration","href":"#completing-registration"},
      {"name":"Support During Registration","href":"#support-during-registration"}
    ]'::jsonb,
    '<p>The Registration section helps new 100 Handy Pros create an account, verify identity, and complete the steps required to start receiving work.</p>
    <section id="getting-started" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Getting Started</h2>
      <p>Create your Pro account, choose the services you want to offer, set your location and service area, and begin completing your professional profile.</p>
    </section>
    <section id="eligibility-requirements" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Eligibility & Requirements</h2>
      <p>Pros operate as independent service providers. You must be legally able to work, meet age requirements, and provide valid identity information.</p>
    </section>
    <section id="identity-verification" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Identity Verification</h2>
      <p>Upload identification, confirm personal details, and complete any required screening checks so the platform can maintain trust and safety.</p>
    </section>
    <section id="account-setup" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. Account Setup</h2>
      <p>Add your profile photo, bio, service categories, pricing, payout details, and availability to make the account job-ready.</p>
    </section>
    <section id="completing-registration" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Completing Registration</h2>
      <p>Once verification and profile setup are complete, your account can move into review and activation so you can begin receiving matched work.</p>
    </section>
    <section id="support-during-registration" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">6. Support During Registration</h2>
      <p>If documents fail, details do not match, or you get stuck during setup, contact support and provide screenshots or exact error details.</p>
    </section>'::text,
    '[
      {"label":"100 Handy Pro Support","href":"/help/pro"},
      {"label":"Trust and Safety","href":"/help/trust-safety"},
      {"label":"Contact support","href":"/contact"}
    ]'::jsonb,
    'published'
  ),
  (
    'policies',
    'policies',
    'Policy Center',
    '100 Handy Support / Policy Center',
    'Core policy guidance covering bookings, cancellations, conduct, disputes, and trust expectations.',
    '[
      {"name":"Booking & Cancellation Policies","href":"#booking-cancellation"},
      {"name":"Payments & Fees","href":"#payments-fees"},
      {"name":"Platform Conduct","href":"#platform-conduct"},
      {"name":"Disputes & Resolutions","href":"#disputes-resolutions"},
      {"name":"Help and Resources","href":"#help-and-resources"}
    ]'::jsonb,
    '<p>The Policy Center brings together the core rules that keep bookings, payments, and interactions consistent across the platform.</p>
    <section id="booking-cancellation" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Booking & Cancellation Policies</h2>
      <p>Clients and Pros are expected to honour confirmed bookings. Short-notice cancellations may incur fees depending on timing and circumstances.</p>
    </section>
    <section id="payments-fees" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Payments & Fees</h2>
      <p>Payment authorisation, final billing, platform fees, VAT where applicable, and payout timing should all be reviewed before using the service.</p>
    </section>
    <section id="platform-conduct" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Platform Conduct</h2>
      <p>Users should communicate respectfully, provide accurate information, and avoid off-platform behaviour that undermines trust or safety.</p>
    </section>
    <section id="disputes-resolutions" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. Disputes & Resolutions</h2>
      <p>Where a job, payment, or quality dispute arises, support may request evidence such as messages, timestamps, photos, and receipts.</p>
    </section>
    <section id="help-and-resources" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Help and Resources</h2>
      <p>Use the help centre, policy pages, and support channels together when you need clarity on expectations or platform enforcement.</p>
    </section>'::text,
    '[
      {"label":"Terms & Privacy","href":"/terms"},
      {"label":"Trust and Safety","href":"/help/trust-safety"},
      {"label":"Contact support","href":"/contact"}
    ]'::jsonb,
    'published'
  ),
  (
    'partnerships',
    'partnerships',
    'Partnerships',
    '100 Handy Support / Partnerships',
    'How retailers, brands, and other businesses can work with 100 Handy through integrations and collaboration.',
    '[
      {"name":"Retail Partnerships","href":"#retail-partnerships"},
      {"name":"Business Integrations","href":"#business-integrations"},
      {"name":"Marketing and Brand Collaborations","href":"#marketing-and-brand-collaborations"},
      {"name":"100 Handy Pro Partnerships","href":"#pro-partnerships"},
      {"name":"Getting in Touch","href":"#getting-in-touch"}
    ]'::jsonb,
    '<p>The Partnerships section explains how businesses, retailers, and brands can work with 100 Handy to support customers or extend service reach.</p>
    <section id="retail-partnerships" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">1. Retail Partnerships</h2>
      <p>Retailers can pair product purchases with installation, assembly, or home-service support to improve the customer experience after checkout.</p>
    </section>
    <section id="business-integrations" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">2. Business Integrations</h2>
      <p>Operational partners can explore booking flows, service availability, and workflow integrations that connect business demand to vetted Pros.</p>
    </section>
    <section id="marketing-and-brand-collaborations" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">3. Marketing and Brand Collaborations</h2>
      <p>Brands can collaborate on campaigns, audience education, or co-branded experiences where local services complement their offer.</p>
    </section>
    <section id="pro-partnerships" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">4. 100 Handy Pro Partnerships</h2>
      <p>Service partners and Pro communities can work with the platform to focus on preferred categories, better onboarding, and service delivery support.</p>
    </section>
    <section id="getting-in-touch" class="space-y-3">
      <h2 class="text-[22px] font-bold text-brand-dark-alt">5. Getting in Touch</h2>
      <p>If your organisation wants to explore partnership options, contact the 100 Handy team with your goals, geography, and service model.</p>
    </section>'::text,
    '[
      {"label":"Contact 100 Handy","href":"/contact"},
      {"label":"100 Handy Pro Support","href":"/help/pro"},
      {"label":"About Us","href":"/about-us"}
    ]'::jsonb,
    'published'
  )
on conflict (article_key) do update
set
  slug = excluded.slug,
  title = excluded.title,
  breadcrumb = excluded.breadcrumb,
  summary = excluded.summary,
  sidebar_links_json = excluded.sidebar_links_json,
  body_html = excluded.body_html,
  related_links_json = excluded.related_links_json,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
