insert into public.site_settings (setting_group, setting_key, value_json)
values
  (
    'help',
    'help.ui',
    '{
      "searchPlaceholder": "Search",
      "searchButtonLabel": "Search",
      "popularSearchesLabel": "Popular searches:",
      "noResultsPrefix": "No results found for",
      "sectionsTitle": "Sections",
      "helpfulPrompt": "Was this article helpful?",
      "helpfulYes": "Yes",
      "helpfulNo": "No",
      "moreQuestionsPrefix": "Have more questions?",
      "moreQuestionsCta": "Submit a request",
      "contactCardTitle": "Can''t find what you need?",
      "contactCardBody": "Contact us and we''ll get back to you as soon as we can.",
      "servicesCardTitle": "Ready to book a task?",
      "servicesCardBody": "Head over to our website to see our available categories!"
    }'::jsonb
  ),
  (
    'help',
    'help.search_index',
    '{
      "popularSearches": [
        { "label": "Getting Started & Booking", "href": "/help/client#getting-started" },
        { "label": "100 Handy Pro", "href": "/help/pro" },
        { "label": "Registration", "href": "/help/registration" },
        { "label": "Account", "href": "/help/account" }
      ],
      "entries": [
        { "title": "How to book a job", "category": "Client", "href": "/help/client#getting-started", "keywords": "booking service select professional confirm step by step" },
        { "title": "What happens after I book?", "category": "Client", "href": "/help/client#getting-started", "keywords": "confirmation email chat instructions arrival" },
        { "title": "Changing or cancelling a booking", "category": "Client", "href": "/help/client#getting-started", "keywords": "reschedule cancel free charge 24 hours refund cancellation" },
        { "title": "How pricing works", "category": "Client", "href": "/help/client#payments-pricing-refunds", "keywords": "price cost rate materials extra work hidden costs transparent" },
        { "title": "How do I receive job invitations?", "category": "100 Handy Pro", "href": "/help/pro#receiving-managing-job-invitations", "keywords": "invitation notification dashboard job request skills area" },
        { "title": "How to become a 100 Handy Pro", "category": "Registration", "href": "/help/registration#getting-started", "keywords": "become pro register account services location sign up join" },
        { "title": "Updating your account details", "category": "Account", "href": "/help/account#profile-management", "keywords": "update name email phone address photo service details" },
        { "title": "Terms of Service", "category": "Policy Center", "href": "/help/policies#legal-terms", "keywords": "terms service legal agreement booking payment cancellation refund" }
      ]
    }'::jsonb
  ),
  (
    'booking',
    'booking.web_copy',
    '{
      "confirmDetailsTitle": "Confirm details",
      "paymentMethodTitle": "Payment method",
      "paymentHoldNotice": "You may see a temporary hold on your payment method in the amount of your 100 Handy Pro''s hourly rate. Don''t worry - you''re only billed when your task is complete!",
      "paymentAuthorizedBody": "Payment authorized successfully. Your card has been held.",
      "completeBooking": "Complete Booking",
      "processing": "Processing...",
      "preparingPayment": "Preparing payment...",
      "editTask": "Edit Task",
      "taskDetailsLabel": "Your Task details",
      "hourlyRateLabel": "Hourly Rate",
      "pricingIntro": "Pricing is inclusive of a",
      "trustFee": "£10.68/hr Trust & Support fee.",
      "pricingVat": "Pricing includes VAT",
      "pricingOutro": "which is billed on the Trust & Support Fee and our Service Fee.",
      "pricingBillingBody": "You will not be billed until your task is complete. Tasks have a one-hour minimum. You can cancel or reschedule anytime.",
      "pricingCancellationBody": "If you cancel your task within 24 hours of the scheduled start time, you may be billed a one-hour cancellation fee at the Pro''s hourly rate.",
      "learnMoreLabel": "Learn more",
      "learnMoreSuffix": "about our cancellation policy.",
      "confirmAndChat": "Confirm and Chat",
      "creatingBooking": "Creating booking..."
    }'::jsonb
  )
on conflict (setting_key) do update
set
  setting_group = excluded.setting_group,
  value_json = excluded.value_json,
  updated_at = now();
