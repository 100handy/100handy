with payload as (
  select
    'shared'::text as platform,
    'client_payments'::text as screen_key,
    $$[
      {"section_key":"header","field_key":"title","value":"Payment"},
      {"section_key":"menu","field_key":"redemptions","value":"Redemptions"},
      {"section_key":"section","field_key":"add_payment_method","value":"ADD PAYMENT METHOD"},
      {"section_key":"menu","field_key":"credit_card","value":"Credit Card"},
      {"section_key":"menu","field_key":"apple_pay","value":"Apple Pay"},
      {"section_key":"menu","field_key":"google_pay","value":"Google Pay"},
      {"section_key":"loading","field_key":"wallet","value":"Loading wallet..."},
      {"section_key":"toasts","field_key":"wallet_unavailable_title","value":"Unavailable in Expo Go"},
      {"section_key":"toasts","field_key":"init_failed_title","value":"Error"},
      {"section_key":"toasts","field_key":"init_failed_body","value":"Failed to initialize payment. Please try again."},
      {"section_key":"toasts","field_key":"success_title","value":"Success"},
      {"section_key":"toasts","field_key":"success_body","value":"Payment method added successfully!"},
      {"section_key":"toasts","field_key":"generic_error_body","value":"Something went wrong. Please try again."},
      {"section_key":"footer","field_key":"note","value":"Payment method will update for all tasks, including the ones currently open."}
    ]$$::jsonb as items

  union all

  select
    'shared',
    'client_payment_methods',
    $$[
      {"section_key":"header","field_key":"title","value":"Payment Methods"},
      {"section_key":"body","field_key":"description","value":"Manage your payment methods for bookings and purchases"},
      {"section_key":"loading","field_key":"text","value":"Loading payment methods..."},
      {"section_key":"empty","field_key":"title","value":"No payment methods yet"},
      {"section_key":"empty","field_key":"body","value":"Add a payment method to quickly book services"},
      {"section_key":"badges","field_key":"default","value":"DEFAULT"},
      {"section_key":"labels","field_key":"expires","value":"Expires"},
      {"section_key":"alerts","field_key":"delete_title","value":"Delete Payment Method"},
      {"section_key":"alerts","field_key":"delete_body","value":"Are you sure you want to delete this payment method?"},
      {"section_key":"actions","field_key":"cancel","value":"Cancel"},
      {"section_key":"actions","field_key":"delete","value":"Delete"},
      {"section_key":"actions","field_key":"add","value":"Add Payment Method"},
      {"section_key":"toasts","field_key":"deleted_title","value":"Deleted"},
      {"section_key":"toasts","field_key":"deleted_body","value":"Payment method removed."},
      {"section_key":"toasts","field_key":"delete_failed_title","value":"Error"},
      {"section_key":"toasts","field_key":"delete_failed_body","value":"Failed to delete payment method. Please try again."},
      {"section_key":"toasts","field_key":"updated_title","value":"Updated"},
      {"section_key":"toasts","field_key":"updated_body","value":"Default payment method changed."},
      {"section_key":"toasts","field_key":"update_failed_title","value":"Error"},
      {"section_key":"toasts","field_key":"update_failed_body","value":"Failed to set default payment method. Please try again."}
    ]$$::jsonb

  union all

  select
    'shared',
    'client_payment_history',
    $$[
      {"section_key":"header","field_key":"title","value":"Payment History"},
      {"section_key":"loading","field_key":"text","value":"Loading payment history..."},
      {"section_key":"empty","field_key":"title","value":"No payments yet"},
      {"section_key":"empty","field_key":"body","value":"Your payment history will appear here after you complete a booking."},
      {"section_key":"errors","field_key":"missing_booking","value":"Booking not found"},
      {"section_key":"status","field_key":"authorized","value":"Held"},
      {"section_key":"status","field_key":"captured","value":"Paid"},
      {"section_key":"status","field_key":"pending","value":"Pending"},
      {"section_key":"status","field_key":"cancelled","value":"Cancelled"},
      {"section_key":"status","field_key":"refunded","value":"Refunded"},
      {"section_key":"status","field_key":"failed","value":"Failed"}
    ]$$::jsonb

  union all

  select
    'shared',
    'client_privacy_settings',
    $$[
      {"section_key":"header","field_key":"title","value":"Privacy Settings"},
      {"section_key":"hero","field_key":"title","value":"Privacy Settings"},
      {"section_key":"hero","field_key":"body","value":"Manage how your information is shared and used"},
      {"section_key":"loading","field_key":"text","value":"Loading settings..."},
      {"section_key":"error","field_key":"title","value":"Failed to load privacy settings"},
      {"section_key":"error","field_key":"retry","value":"Retry"},
      {"section_key":"toasts","field_key":"success_title","value":"Success"},
      {"section_key":"toasts","field_key":"success_body","value":"Privacy settings updated"},
      {"section_key":"toasts","field_key":"error_title","value":"Error"},
      {"section_key":"toasts","field_key":"error_body","value":"Failed to update privacy settings"},
      {"section_key":"toggle_location","field_key":"title","value":"Location Sharing"},
      {"section_key":"toggle_location","field_key":"body","value":"Allow us to access your location for task matching"},
      {"section_key":"toggle_profile","field_key":"title","value":"Profile Visibility"},
      {"section_key":"toggle_profile","field_key":"body","value":"Let taskers see your profile and review history"},
      {"section_key":"toggle_activity","field_key":"title","value":"Activity Status"},
      {"section_key":"toggle_activity","field_key":"body","value":"Show when you're active on the platform"},
      {"section_key":"toggle_data","field_key":"title","value":"Data Collection"},
      {"section_key":"toggle_data","field_key":"body","value":"Allow us to collect analytics to improve your experience"},
      {"section_key":"footer","field_key":"policy_notice","value":"We respect your privacy. Your data is protected and will never be sold to third parties. For more information, read our Privacy Policy."}
    ]$$::jsonb

  union all

  select
    'shared',
    'client_account_security',
    $$[
      {"section_key":"header","field_key":"title","value":"Account Security"},
      {"section_key":"enabled","field_key":"badge_title","value":"Two-Factor Authentication Enabled"},
      {"section_key":"enabled","field_key":"badge_body","value":"Your account is protected with 2FA"},
      {"section_key":"enabled","field_key":"hero_title","value":"Account Security"},
      {"section_key":"enabled","field_key":"body_1","value":"Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your email when signing in."},
      {"section_key":"enabled","field_key":"body_2","value":"You can disable two-factor authentication if you no longer want to use it, but this will make your account less secure."},
      {"section_key":"disabled","field_key":"hero_title","value":"Two-factor authentication"},
      {"section_key":"disabled","field_key":"body_1","value":"To keep your account secure, set up two-factor authentication."},
      {"section_key":"disabled","field_key":"body_2","value":"We'll send a verification code to your email address to activate two-factor authentication."},
      {"section_key":"email","field_key":"enabled_label","value":"Verification codes sent to"},
      {"section_key":"email","field_key":"disabled_label","value":"Verification code will be sent to"},
      {"section_key":"actions","field_key":"disable_2fa","value":"Disable Two-Factor Authentication"},
      {"section_key":"actions","field_key":"enable_2fa","value":"Enable Two-Factor Authentication"},
      {"section_key":"actions","field_key":"processing","value":"Processing..."},
      {"section_key":"actions","field_key":"sending","value":"Sending..."},
      {"section_key":"actions","field_key":"delete_account","value":"Delete Account"},
      {"section_key":"delete_modal","field_key":"title","value":"Delete Account"},
      {"section_key":"delete_modal","field_key":"body","value":"This action cannot be undone. Your account and related data will be permanently deleted."},
      {"section_key":"delete_modal","field_key":"prompt","value":"Enter your password to confirm."},
      {"section_key":"delete_modal","field_key":"password_placeholder","value":"Password"},
      {"section_key":"delete_modal","field_key":"confirm","value":"Delete My Account"},
      {"section_key":"delete_modal","field_key":"cancel","value":"Cancel"},
      {"section_key":"alerts","field_key":"disable_title","value":"Disable Two-Factor Authentication"},
      {"section_key":"alerts","field_key":"disable_body","value":"Are you sure you want to disable two-factor authentication? This will make your account less secure."},
      {"section_key":"alerts","field_key":"cancel","value":"Cancel"},
      {"section_key":"alerts","field_key":"disable_confirm","value":"Disable"},
      {"section_key":"alerts","field_key":"success_title","value":"Success"},
      {"section_key":"alerts","field_key":"success_body","value":"Two-factor authentication has been disabled."},
      {"section_key":"alerts","field_key":"error_title","value":"Error"},
      {"section_key":"alerts","field_key":"disable_error_body","value":"Failed to disable two-factor authentication. Please try again."},
      {"section_key":"alerts","field_key":"send_error_body","value":"Failed to send verification code. Please try again."},
      {"section_key":"toasts","field_key":"delete_success_title","value":"Success"},
      {"section_key":"toasts","field_key":"delete_success_body","value":"Your account has been deleted"},
      {"section_key":"toasts","field_key":"delete_error_title","value":"Error"},
      {"section_key":"toasts","field_key":"delete_error_body","value":"Failed to delete account. Please try again."},
      {"section_key":"toasts","field_key":"delete_password_error_body","value":"Incorrect password. Please try again."}
    ]$$::jsonb

  union all

  select
    'shared',
    'client_review',
    $$[
      {"section_key":"header","field_key":"title","value":"Leave a Review"},
      {"section_key":"errors","field_key":"cannot_review_title","value":"Cannot Review"},
      {"section_key":"errors","field_key":"cannot_review_body","value":"Reviews can only be submitted for completed bookings."},
      {"section_key":"errors","field_key":"missing_booking","value":"Booking not found"},
      {"section_key":"status","field_key":"already_title","value":"Already reviewed"},
      {"section_key":"status","field_key":"already_body","value":"You've already left a review for this booking."},
      {"section_key":"rating","field_key":"prompt","value":"How was your experience?"},
      {"section_key":"rating","field_key":"tap","value":"Tap to rate"},
      {"section_key":"rating","field_key":"poor","value":"Poor"},
      {"section_key":"rating","field_key":"fair","value":"Fair"},
      {"section_key":"rating","field_key":"good","value":"Good"},
      {"section_key":"rating","field_key":"very_good","value":"Very Good"},
      {"section_key":"rating","field_key":"excellent","value":"Excellent"},
      {"section_key":"review","field_key":"title","value":"Write a review (optional)"},
      {"section_key":"review","field_key":"placeholder","value":"Share your experience with this pro..."},
      {"section_key":"review","field_key":"footer","value":"Your review will be visible on the pro's profile"},
      {"section_key":"actions","field_key":"skip","value":"Maybe later"},
      {"section_key":"actions","field_key":"submit","value":"Submit Review"},
      {"section_key":"toasts","field_key":"missing_rating","value":"Please select a rating"},
      {"section_key":"toasts","field_key":"success","value":"Review submitted!"},
      {"section_key":"toasts","field_key":"failed","value":"Failed to submit review"},
      {"section_key":"toasts","field_key":"generic_error","value":"Something went wrong"}
    ]$$::jsonb

  union all

  select
    'shared',
    'professional_review',
    $$[
      {"section_key":"header","field_key":"title","value":"Rate Client"},
      {"section_key":"errors","field_key":"cannot_review_title","value":"Cannot Review"},
      {"section_key":"errors","field_key":"cannot_review_body","value":"You can only review completed bookings."},
      {"section_key":"errors","field_key":"missing_booking","value":"Booking not found"},
      {"section_key":"status","field_key":"already_title","value":"Already reviewed"},
      {"section_key":"status","field_key":"already_body","value":"You've already rated this client."},
      {"section_key":"privacy","field_key":"title","value":"Private Rating"},
      {"section_key":"privacy","field_key":"body","value":"This rating is private and only visible to you. It helps you remember your experience with this client for future bookings."},
      {"section_key":"rating","field_key":"prompt","value":"How was this client?"},
      {"section_key":"rating","field_key":"tap","value":"Tap to rate"},
      {"section_key":"rating","field_key":"one","value":"Would not work with again"},
      {"section_key":"rating","field_key":"two","value":"Below average"},
      {"section_key":"rating","field_key":"three","value":"Average"},
      {"section_key":"rating","field_key":"four","value":"Good client"},
      {"section_key":"rating","field_key":"five","value":"Excellent client"},
      {"section_key":"notes","field_key":"title","value":"Private notes (optional)"},
      {"section_key":"notes","field_key":"placeholder","value":"Add notes about this client for your reference..."},
      {"section_key":"notes","field_key":"footer","value":"Only you can see these notes"},
      {"section_key":"actions","field_key":"skip","value":"Maybe later"},
      {"section_key":"actions","field_key":"submit","value":"Save Rating"},
      {"section_key":"toasts","field_key":"missing_rating","value":"Please select a rating"},
      {"section_key":"toasts","field_key":"success","value":"Review saved!"},
      {"section_key":"toasts","field_key":"failed","value":"Failed to save review"},
      {"section_key":"toasts","field_key":"generic_error","value":"Something went wrong"}
    ]$$::jsonb

  union all

  select
    'shared',
    'professional_payments',
    $$[
      {"section_key":"header","field_key":"title","value":"Payments"},
      {"section_key":"menu","field_key":"direct_deposit","value":"Direct deposit"}
    ]$$::jsonb
),
expanded as (
  select
    platform,
    screen_key,
    item ->> 'section_key' as section_key,
    item ->> 'field_key' as field_key,
    item ->> 'value' as value,
    'published'::text as status
  from payload,
  lateral jsonb_array_elements(items) as item
)
insert into public.app_content (
  platform,
  screen_key,
  section_key,
  field_key,
  value,
  status
)
select
  platform,
  screen_key,
  section_key,
  field_key,
  value,
  status
from expanded
on conflict (platform, screen_key, section_key, field_key)
do update set
  value = excluded.value,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
