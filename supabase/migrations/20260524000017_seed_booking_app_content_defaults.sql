insert into public.app_content (platform, screen_key, section_key, field_key, value, status)
values
  ('shared', 'client_task_form', 'header', 'title', 'Task Form', 'published'),
  ('shared', 'client_task_form', 'error', 'invalid_title', 'Invalid category', 'published'),
  ('shared', 'client_task_form', 'error', 'invalid_body', 'The task category could not be determined. Please go back and try again.', 'published'),
  ('shared', 'client_task_form', 'error', 'back_cta', 'Go Back', 'published'),

  ('shared', 'client_task_details', 'header', 'title', 'Task details', 'published'),
  ('shared', 'client_task_details', 'notes', 'title', 'Anything else? (optional)', 'published'),
  ('shared', 'client_task_details', 'notes', 'subtitle', 'Start the conversation', 'published'),
  ('shared', 'client_task_details', 'notes', 'placeholder', 'For example, what supplies are needed, where to park, or timing restrictions.', 'published'),
  ('shared', 'client_task_details', 'actions', 'submit', 'Review task', 'published'),

  ('shared', 'client_select_tasker', 'header', 'title', 'Select a Tasker', 'published'),
  ('shared', 'client_select_tasker', 'sort', 'prefix', 'Sorted by:', 'published'),
  ('shared', 'client_select_tasker', 'sort', 'modal_title', 'Sort by', 'published'),
  ('shared', 'client_select_tasker', 'loading', 'text', 'Loading taskers...', 'published'),
  ('shared', 'client_select_tasker', 'error', 'title', 'Error loading taskers', 'published'),
  ('shared', 'client_select_tasker', 'error', 'body', 'Please try again later', 'published'),
  ('shared', 'client_select_tasker', 'empty', 'title', 'No pros found', 'published'),
  ('shared', 'client_select_tasker', 'empty', 'body', 'Try adjusting your filters or search in a different category', 'published'),

  ('shared', 'client_confirm_booking', 'header', 'title', 'Review and confirm', 'published'),
  ('shared', 'client_confirm_booking', 'sections', 'tasker', 'Your 100Handy Pro', 'published'),
  ('shared', 'client_confirm_booking', 'sections', 'details', 'Task Details', 'published'),
  ('shared', 'client_confirm_booking', 'sections', 'repeat', 'Repeat service', 'published'),
  ('shared', 'client_confirm_booking', 'sections', 'payment', 'Payment', 'published'),
  ('shared', 'client_confirm_booking', 'sections', 'hourly_rate', 'Hourly Rate', 'published'),
  ('shared', 'client_confirm_booking', 'repeat', 'enabled_body', 'Turn this on to view repeat booking options.', 'published'),
  ('shared', 'client_confirm_booking', 'repeat', 'disabled_body', 'Recurring booking is not available for this service.', 'published'),
  ('shared', 'client_confirm_booking', 'payment', 'fallback_method', 'Apple Pay or card', 'published'),
  ('shared', 'client_confirm_booking', 'pricing', 'savings_template', 'You''re saving {discount}% with your recurring booking!', 'published'),
  ('shared', 'client_confirm_booking', 'pricing', 'hold_notice', 'You may see a temporary hold on your payment method of £{amount}. Don''t worry -- you''re only billed when your task is complete!', 'published'),
  ('shared', 'client_confirm_booking', 'pricing', 'fee_notice', 'Pricing is inclusive of a £7.46/hr Trust and Support fee, as well as VAT, which is billed on 100Handy''s fees.', 'published'),
  ('shared', 'client_confirm_booking', 'pricing', 'billing_notice', 'You will not be billed until the task is complete and can cancel at any time. Tasks cancelled less than 24 hours before the start time may be billed a cancellation fee of one hour. Tasks have a one-hour minimum.', 'published'),
  ('shared', 'client_confirm_booking', 'pricing', 'assurance', 'You won''t be billed until your task is complete.', 'published'),
  ('shared', 'client_confirm_booking', 'actions', 'confirm', 'Confirm and chat', 'published'),
  ('shared', 'client_confirm_booking', 'loading', 'text', 'Loading...', 'published'),

  ('shared', 'client_booking_success', 'hero', 'title', 'Booking Confirmed!', 'published'),
  ('shared', 'client_booking_success', 'hero', 'body', 'Your task has been booked successfully', 'published'),
  ('shared', 'client_booking_success', 'summary', 'tasker_label', 'Your 100Handy Pro', 'published'),
  ('shared', 'client_booking_success', 'summary', 'service_label', 'Service', 'published'),
  ('shared', 'client_booking_success', 'summary', 'scheduled_label', 'Scheduled', 'published'),
  ('shared', 'client_booking_success', 'actions', 'chat_template', 'Chat with {name}', 'published'),
  ('shared', 'client_booking_success', 'actions', 'view_bookings', 'View My Bookings', 'published'),
  ('shared', 'client_booking_success', 'actions', 'go_home', 'Go to Home', 'published')
on conflict (platform, screen_key, section_key, field_key) do update
set
  value = excluded.value,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
