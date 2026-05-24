import { useEffect, useMemo, useState } from 'react'
import { Check, Loader2, Rocket, Save } from 'lucide-react'
import Header from '@/components/header'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidHref, isValidUrl } from '@/lib/editor-validation'
import {
  useAppContentEntries,
  useAppContentScreenRevisions,
  useLatestAppContentScreenDraft,
  usePublishAppContentScreenDraft,
  useRestoreAppContentScreenRevision,
  useSaveAppContentScreenDraft,
  type AppContentInput,
} from '@/lib/api/content-platform'

type PlatformKey = AppContentInput['platform']

type AppFieldDefinition = {
  section_key: string
  field_key: string
  label: string
  multiline?: boolean
  rows?: number
  defaultValue: string
}

type AppScreenDefinition = {
  key: string
  label: string
  description: string
  fields: AppFieldDefinition[]
}

const SCREEN_DEFINITIONS: AppScreenDefinition[] = [
  {
    key: 'client_home',
    label: 'Client Home',
    description: 'Client home hero and search prompt.',
    fields: [
      { section_key: 'hero', field_key: 'title', label: 'Hero title', defaultValue: 'What task do you need done?' },
      { section_key: 'search', field_key: 'placeholder', label: 'Search placeholder', defaultValue: 'Try: painting, moving, repairs' },
      { section_key: 'location', field_key: 'fallback_line_1', label: 'Location fallback line 1', defaultValue: 'Set your location' },
      { section_key: 'location', field_key: 'fallback_line_2', label: 'Location fallback line 2', defaultValue: '' },
    ],
  },
  {
    key: 'auth_welcome',
    label: 'Auth Welcome',
    description: 'First branded welcome screen before account choices.',
    fields: [
      { section_key: 'hero', field_key: 'title', label: 'Welcome title', defaultValue: 'Welcome' },
      { section_key: 'footer', field_key: 'cta', label: 'Footer CTA', defaultValue: 'Get started' },
    ],
  },
  {
    key: 'auth_client_start',
    label: 'Client Start',
    description: 'Client account choice screen after Get started.',
    fields: [
      { section_key: 'header', field_key: 'not_now', label: 'Not now', defaultValue: 'Not now' },
      { section_key: 'hero', field_key: 'title', label: 'Hero title', defaultValue: 'Welcome to 100Handy' },
      { section_key: 'actions', field_key: 'create_account', label: 'Create account button', defaultValue: 'Create Account' },
      { section_key: 'actions', field_key: 'sign_in', label: 'Sign in button', defaultValue: 'Sign in' },
      { section_key: 'legal', field_key: 'prefix', label: 'Legal text prefix', defaultValue: 'I agree to the' },
      { section_key: 'legal', field_key: 'terms_label', label: 'Terms label', defaultValue: 'Terms of Service' },
      { section_key: 'legal', field_key: 'middle', label: 'Legal middle text', defaultValue: 'and have reviewed the' },
      { section_key: 'legal', field_key: 'privacy_label', label: 'Privacy label', defaultValue: 'Privacy Policy' },
      { section_key: 'legal', field_key: 'suffix', label: 'Legal suffix', defaultValue: '.' },
      { section_key: 'links', field_key: 'offer_services', label: 'Offer services link text', defaultValue: 'Looking to offer services on 100Handy' },
    ],
  },
  {
    key: 'auth_professional_start',
    label: 'Professional Start',
    description: 'Professional auth entry screen.',
    fields: [
      { section_key: 'hero', field_key: 'title', label: 'Hero title', defaultValue: 'Offer services on 100Handy' },
      { section_key: 'actions', field_key: 'create_account', label: 'Create account button', defaultValue: 'Create Account' },
      { section_key: 'actions', field_key: 'sign_in', label: 'Sign in button', defaultValue: 'Sign in' },
      { section_key: 'legal', field_key: 'prefix', label: 'Legal text prefix', defaultValue: 'I agree to the' },
      { section_key: 'legal', field_key: 'terms_label', label: 'Terms label', defaultValue: 'Terms of Service' },
      { section_key: 'legal', field_key: 'middle', label: 'Legal middle text', defaultValue: 'and have reviewed the' },
      { section_key: 'legal', field_key: 'privacy_label', label: 'Privacy label', defaultValue: 'Privacy Policy' },
      { section_key: 'legal', field_key: 'suffix', label: 'Legal suffix', defaultValue: '.' },
    ],
  },
  {
    key: 'auth_sign_in',
    label: 'Sign In',
    description: 'Shared sign-in form copy used by client and professional screens.',
    fields: [
      { section_key: 'fields', field_key: 'email_placeholder', label: 'Email placeholder', defaultValue: 'Email' },
      { section_key: 'fields', field_key: 'password_placeholder', label: 'Password placeholder', defaultValue: 'Password' },
      { section_key: 'actions', field_key: 'submit', label: 'Submit button', defaultValue: 'Log in' },
      { section_key: 'actions', field_key: 'submitting', label: 'Submit loading state', defaultValue: 'Logging in...' },
      { section_key: 'links', field_key: 'forgot_prefix', label: 'Forgot password prefix', defaultValue: 'Forgot your password?' },
      { section_key: 'links', field_key: 'forgot_cta', label: 'Forgot password CTA', defaultValue: 'Reset it' },
      { section_key: 'oauth', field_key: 'divider', label: 'OAuth divider', defaultValue: 'Or continue with' },
      { section_key: 'oauth', field_key: 'google_label', label: 'Google label', defaultValue: 'Google' },
      { section_key: 'oauth', field_key: 'google_loading', label: 'Google loading state', defaultValue: 'Connecting...' },
      { section_key: 'oauth', field_key: 'apple_label', label: 'Apple label', defaultValue: 'Apple' },
    ],
  },
  {
    key: 'auth_forgot_password',
    label: 'Forgot Password',
    description: 'Reset password email/OTP flow copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Reset Password' },
      {
        section_key: 'body',
        field_key: 'description',
        label: 'Description',
        multiline: true,
        rows: 3,
        defaultValue: "Enter your email address and we'll send you a verification code to reset your password.",
      },
      { section_key: 'fields', field_key: 'email_placeholder', label: 'Email placeholder', defaultValue: 'Email' },
      { section_key: 'actions', field_key: 'submit', label: 'Submit button', defaultValue: 'Send verification code' },
      { section_key: 'actions', field_key: 'submitting', label: 'Submit loading state', defaultValue: 'Sending...' },
      { section_key: 'links', field_key: 'remember_prefix', label: 'Remember password prefix', defaultValue: 'Remember your password?' },
      { section_key: 'links', field_key: 'remember_cta', label: 'Remember password CTA', defaultValue: 'Sign in' },
      { section_key: 'feedback', field_key: 'success_title', label: 'Success toast title', defaultValue: 'Code sent!' },
      { section_key: 'feedback', field_key: 'success_body', label: 'Success toast body', defaultValue: 'Check your email for the verification code' },
      { section_key: 'feedback', field_key: 'error_title', label: 'Error toast title', defaultValue: 'Failed to send code' },
      { section_key: 'feedback', field_key: 'error_body', label: 'Fallback error body', defaultValue: 'Please try again' },
    ],
  },
  {
    key: 'auth_client_onboarding',
    label: 'Client Onboarding',
    description: 'Client onboarding carousel and CTA copy.',
    fields: [
      { section_key: 'slide_1', field_key: 'description', label: 'Slide 1 description', multiline: true, rows: 3, defaultValue: 'Help with everyday\nLife at your fingertips.' },
      { section_key: 'slide_2', field_key: 'description', label: 'Slide 2 description', multiline: true, rows: 4, defaultValue: 'See reviews prices\nof 140,000+\nbackground\nchecked Taskers.' },
      { section_key: 'slide_3', field_key: 'description', label: 'Slide 3 description', multiline: true, rows: 3, defaultValue: 'Chat with your 100Handy Pro to schedule\nThe job and get it done.' },
      { section_key: 'slide_4', field_key: 'description', label: 'Slide 4 description', multiline: true, rows: 3, defaultValue: 'Manage your tasks and build your\nInner circle of taskers.' },
      { section_key: 'actions', field_key: 'skip', label: 'Skip button', defaultValue: 'Skip' },
      { section_key: 'actions', field_key: 'next', label: 'Next button', defaultValue: 'Got it' },
      { section_key: 'actions', field_key: 'complete', label: 'Complete button', defaultValue: 'Get started' },
    ],
  },
  {
    key: 'client_tasks',
    label: 'Client Tasks',
    description: 'Client tasks tabs, empty states, and auth/loading copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Tasks' },
      { section_key: 'tabs', field_key: 'upcoming', label: 'Upcoming tab', defaultValue: 'Upcoming' },
      { section_key: 'tabs', field_key: 'completed', label: 'Completed tab', defaultValue: 'Completed' },
      { section_key: 'auth', field_key: 'title', label: 'Signed-out title', defaultValue: 'Please sign in' },
      { section_key: 'auth', field_key: 'body', label: 'Signed-out body', defaultValue: 'You need to be signed in to view your tasks.' },
      { section_key: 'auth', field_key: 'cta', label: 'Signed-out CTA', defaultValue: 'Sign In' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading tasks...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Error loading tasks' },
      { section_key: 'error', field_key: 'body', label: 'Error body', defaultValue: 'Something went wrong. Please try again.' },
      { section_key: 'error', field_key: 'retry', label: 'Retry CTA', defaultValue: 'Retry' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No Current Tasks' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Let us help you get the job done.\nBook a task and see it here.' },
      { section_key: 'footer', field_key: 'hint', label: 'Footer hint', defaultValue: 'Tap to view booking details' },
    ],
  },
  {
    key: 'client_taskers',
    label: 'Client Taskers',
    description: 'Client pros tabs, empty states, and auth/loading copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Pros' },
      { section_key: 'tabs', field_key: 'favourite', label: 'Favourite tab', defaultValue: 'Favourite Pros' },
      { section_key: 'tabs', field_key: 'past', label: 'Past tab', defaultValue: 'Past Pros' },
      { section_key: 'auth', field_key: 'title', label: 'Signed-out title', defaultValue: 'Please sign in' },
      { section_key: 'auth', field_key: 'body', label: 'Signed-out body', defaultValue: 'You need to be signed in to view your pros.' },
      { section_key: 'auth', field_key: 'cta', label: 'Signed-out CTA', defaultValue: 'Sign In' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading pros...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Error loading pros' },
      { section_key: 'error', field_key: 'body', label: 'Error body', defaultValue: 'Something went wrong. Please try again.' },
      { section_key: 'error', field_key: 'retry', label: 'Retry CTA', defaultValue: 'Retry' },
      { section_key: 'empty_favourite', field_key: 'title', label: 'Empty favourite title', defaultValue: 'No Favourite Pros' },
      { section_key: 'empty_favourite', field_key: 'body', label: 'Empty favourite body', defaultValue: 'Browse and book pros to add them\nto your favourites.' },
      { section_key: 'empty_past', field_key: 'title', label: 'Empty past title', defaultValue: 'No Past Pros' },
      { section_key: 'empty_past', field_key: 'body', label: 'Empty past body', defaultValue: 'Your previously booked pros\nwill appear here.' },
    ],
  },
  {
    key: 'client_task_form',
    label: 'Client Task Form',
    description: 'Task form validation and fallback copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Task Form' },
      { section_key: 'error', field_key: 'invalid_title', label: 'Invalid category title', defaultValue: 'Invalid category' },
      { section_key: 'error', field_key: 'invalid_body', label: 'Invalid category body', defaultValue: 'The task category could not be determined. Please go back and try again.' },
      { section_key: 'error', field_key: 'back_cta', label: 'Go back CTA', defaultValue: 'Go Back' },
    ],
  },
  {
    key: 'client_task_details',
    label: 'Client Task Details',
    description: 'Task details screen and add-notes copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Task details' },
      { section_key: 'notes', field_key: 'title', label: 'Notes title', defaultValue: 'Anything else? (optional)' },
      { section_key: 'notes', field_key: 'subtitle', label: 'Notes subtitle', defaultValue: 'Start the conversation' },
      { section_key: 'notes', field_key: 'placeholder', label: 'Notes placeholder', defaultValue: 'For example, what supplies are needed, where to park, or timing restrictions.' },
      { section_key: 'actions', field_key: 'submit', label: 'Submit CTA', defaultValue: 'Review task' },
    ],
  },
  {
    key: 'client_select_tasker',
    label: 'Client Select Tasker',
    description: 'Tasker selection header, sorting, loading, and empty/error states.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Select a Tasker' },
      { section_key: 'sort', field_key: 'prefix', label: 'Sorted by prefix', defaultValue: 'Sorted by:' },
      { section_key: 'sort', field_key: 'modal_title', label: 'Sort modal title', defaultValue: 'Sort by' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading taskers...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Error loading taskers' },
      { section_key: 'error', field_key: 'body', label: 'Error body', defaultValue: 'Please try again later' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No pros found' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Try adjusting your filters or search in a different category' },
    ],
  },
  {
    key: 'client_confirm_booking',
    label: 'Client Confirm Booking',
    description: 'Booking review, payment notice, and confirm CTA copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Review and confirm' },
      { section_key: 'sections', field_key: 'tasker', label: 'Tasker section title', defaultValue: 'Your 100Handy Pro' },
      { section_key: 'sections', field_key: 'details', label: 'Task details title', defaultValue: 'Task Details' },
      { section_key: 'sections', field_key: 'repeat', label: 'Repeat service title', defaultValue: 'Repeat service' },
      { section_key: 'sections', field_key: 'payment', label: 'Payment title', defaultValue: 'Payment' },
      { section_key: 'sections', field_key: 'hourly_rate', label: 'Hourly rate title', defaultValue: 'Hourly Rate' },
      { section_key: 'repeat', field_key: 'enabled_body', label: 'Repeat enabled body', defaultValue: 'Turn this on to view repeat booking options.' },
      { section_key: 'repeat', field_key: 'disabled_body', label: 'Repeat disabled body', defaultValue: 'Recurring booking is not available for this service.' },
      { section_key: 'payment', field_key: 'fallback_method', label: 'Fallback payment method', defaultValue: 'Apple Pay or card' },
      { section_key: 'pricing', field_key: 'savings_template', label: 'Savings template', defaultValue: "You're saving {discount}% with your recurring booking!" },
      { section_key: 'pricing', field_key: 'hold_notice', label: 'Payment hold notice', defaultValue: "You may see a temporary hold on your payment method of £{amount}. Don't worry -- you're only billed when your task is complete!" },
      { section_key: 'pricing', field_key: 'fee_notice', label: 'Fee notice', defaultValue: "Pricing is inclusive of a £7.46/hr Trust and Support fee, as well as VAT, which is billed on 100Handy's fees." },
      { section_key: 'pricing', field_key: 'billing_notice', label: 'Billing notice', defaultValue: 'You will not be billed until the task is complete and can cancel at any time. Tasks cancelled less than 24 hours before the start time may be billed a cancellation fee of one hour. Tasks have a one-hour minimum.' },
      { section_key: 'pricing', field_key: 'assurance', label: 'Billing assurance', defaultValue: "You won't be billed until your task is complete." },
      { section_key: 'actions', field_key: 'confirm', label: 'Confirm CTA', defaultValue: 'Confirm and chat' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading...' },
    ],
  },
  {
    key: 'client_booking_success',
    label: 'Client Booking Success',
    description: 'Booking success confirmation and actions.',
    fields: [
      { section_key: 'hero', field_key: 'title', label: 'Success title', defaultValue: 'Booking Confirmed!' },
      { section_key: 'hero', field_key: 'body', label: 'Success body', defaultValue: 'Your task has been booked successfully' },
      { section_key: 'summary', field_key: 'tasker_label', label: 'Tasker label', defaultValue: 'Your 100Handy Pro' },
      { section_key: 'summary', field_key: 'service_label', label: 'Service label', defaultValue: 'Service' },
      { section_key: 'summary', field_key: 'scheduled_label', label: 'Scheduled label', defaultValue: 'Scheduled' },
      { section_key: 'actions', field_key: 'chat_template', label: 'Chat CTA template', defaultValue: 'Chat with {name}' },
      { section_key: 'actions', field_key: 'view_bookings', label: 'View bookings CTA', defaultValue: 'View My Bookings' },
      { section_key: 'actions', field_key: 'go_home', label: 'Go home CTA', defaultValue: 'Go to Home' },
    ],
  },
  {
    key: 'client_support',
    label: 'Client Support',
    description: 'Client support hub menu and delete-account guidance.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Support' },
      { section_key: 'menu', field_key: 'message_support', label: 'Message support label', defaultValue: 'Message Support' },
      { section_key: 'menu', field_key: 'view_tickets', label: 'View tickets label', defaultValue: 'View My Tickets' },
      { section_key: 'menu', field_key: 'support_center', label: 'Support center label', defaultValue: 'Support Center' },
      { section_key: 'menu', field_key: 'support_center_url', label: 'Support center URL', defaultValue: 'https://100handy.com/support' },
      { section_key: 'menu', field_key: 'cancellation_policy', label: 'Cancellation policy label', defaultValue: 'Cancellation Policy' },
      { section_key: 'policy', field_key: 'title', label: 'Cancellation policy title', defaultValue: 'Cancellation Policy' },
      {
        section_key: 'policy',
        field_key: 'body',
        label: 'Cancellation policy body',
        multiline: true,
        rows: 6,
        defaultValue:
          'Free cancellation up to 24 hours before your booking start time.\n\nCancellations made less than 24 hours before the booking will incur a 50% cancellation fee.\n\nNo-shows will be charged the full booking amount.',
      },
      { section_key: 'menu', field_key: 'delete_account', label: 'Delete account label', defaultValue: 'Delete Account' },
      { section_key: 'delete', field_key: 'title', label: 'Delete modal title', defaultValue: 'Delete Account' },
      {
        section_key: 'delete',
        field_key: 'warning',
        label: 'Delete warning body',
        multiline: true,
        rows: 3,
        defaultValue: 'This action cannot be undone. All your data, bookings, and reviews will be permanently deleted.',
      },
      { section_key: 'delete', field_key: 'prompt', label: 'Delete password prompt', defaultValue: 'Enter your password to confirm.' },
      { section_key: 'delete', field_key: 'password_placeholder', label: 'Delete password placeholder', defaultValue: 'Password' },
      { section_key: 'delete', field_key: 'confirm_cta', label: 'Delete confirm CTA', defaultValue: 'Delete My Account' },
      { section_key: 'delete', field_key: 'cancel_cta', label: 'Delete cancel CTA', defaultValue: 'Cancel' },
      { section_key: 'delete', field_key: 'success_title', label: 'Delete success title', defaultValue: 'Success' },
      { section_key: 'delete', field_key: 'success_body', label: 'Delete success body', defaultValue: 'Your account has been deleted' },
      { section_key: 'delete', field_key: 'error_title', label: 'Delete error title', defaultValue: 'Error' },
      { section_key: 'delete', field_key: 'wrong_password', label: 'Wrong password message', defaultValue: 'Incorrect password. Please try again.' },
      { section_key: 'delete', field_key: 'generic_error', label: 'Generic delete error', defaultValue: 'Failed to delete account. Please try again or contact support.' },
      { section_key: 'support_center', field_key: 'error_title', label: 'Support center error title', defaultValue: 'Error' },
      { section_key: 'support_center', field_key: 'error_body', label: 'Support center error body', defaultValue: 'Unable to open support center' },
    ],
  },
  {
    key: 'client_support_chat',
    label: 'Support Chat',
    description: 'Support chat loading, header, and composer copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: '100Handy Support' },
      { section_key: 'header', field_key: 'subtitle', label: 'Header subtitle', defaultValue: "We're here to help" },
      { section_key: 'loading', field_key: 'creating_ticket', label: 'Creating ticket loading text', defaultValue: 'Creating support ticket...' },
      { section_key: 'loading', field_key: 'generic', label: 'Generic loading text', defaultValue: 'Loading...' },
      { section_key: 'messages', field_key: 'empty', label: 'Empty conversation text', defaultValue: 'No messages yet. Start the conversation!' },
      { section_key: 'input', field_key: 'active_placeholder', label: 'Active input placeholder', defaultValue: 'Type a message' },
      { section_key: 'input', field_key: 'new_placeholder', label: 'New input placeholder', defaultValue: 'Start a conversation with support' },
      { section_key: 'errors', field_key: 'init_title', label: 'Init error title', defaultValue: 'Error' },
      { section_key: 'errors', field_key: 'init_body', label: 'Init error body', defaultValue: 'Failed to load support chat. Please try again.' },
      { section_key: 'errors', field_key: 'send_title', label: 'Send error title', defaultValue: 'Error' },
      { section_key: 'errors', field_key: 'send_prefix', label: 'Send error prefix', defaultValue: 'Failed to send message:' },
    ],
  },
  {
    key: 'client_support_tickets',
    label: 'Support Tickets',
    description: 'Ticket list and empty/error states.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'My Tickets' },
      { section_key: 'actions', field_key: 'create', label: 'Create ticket button', defaultValue: 'Create New Ticket' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading tickets...' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No Support Tickets' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: "You haven't created any support tickets yet" },
      { section_key: 'sections', field_key: 'active_prefix', label: 'Active section prefix', defaultValue: 'Active' },
      { section_key: 'sections', field_key: 'closed_prefix', label: 'Closed section prefix', defaultValue: 'Closed' },
      { section_key: 'delete', field_key: 'title', label: 'Delete confirm title', defaultValue: 'Delete Ticket' },
      { section_key: 'delete', field_key: 'body_template', label: 'Delete confirm body template', defaultValue: 'Are you sure you want to delete "{subject}"? This action cannot be undone.' },
      { section_key: 'delete', field_key: 'cancel_cta', label: 'Delete cancel CTA', defaultValue: 'Cancel' },
      { section_key: 'delete', field_key: 'confirm_cta', label: 'Delete confirm CTA', defaultValue: 'Delete' },
      { section_key: 'delete', field_key: 'success_title', label: 'Delete success title', defaultValue: 'Success' },
      { section_key: 'delete', field_key: 'success_body', label: 'Delete success body', defaultValue: 'Ticket deleted successfully' },
      { section_key: 'delete', field_key: 'error_title', label: 'Delete error title', defaultValue: 'Error' },
      { section_key: 'delete', field_key: 'error_body', label: 'Delete error body', defaultValue: 'Failed to delete ticket. Please try again.' },
    ],
  },
  {
    key: 'client_messages',
    label: 'Messages',
    description: 'Messages tab sign-in, loading, error, and empty-state copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Messages' },
      { section_key: 'auth', field_key: 'title', label: 'Signed-out title', defaultValue: 'Please sign in' },
      { section_key: 'auth', field_key: 'body', label: 'Signed-out body', defaultValue: 'You need to be signed in to view your messages.' },
      { section_key: 'auth', field_key: 'cta', label: 'Signed-out CTA', defaultValue: 'Sign In' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading conversations...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Unable to load messages' },
      { section_key: 'error', field_key: 'body', label: 'Error body', defaultValue: 'Please check your connection and try again' },
      { section_key: 'error', field_key: 'cta', label: 'Error CTA', defaultValue: 'Try Again' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No messages yet' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Start a conversation with your 100Handy Pro after booking' },
    ],
  },
  {
    key: 'client_search_services',
    label: 'Search Services',
    description: 'Search services loading and empty/error copy.',
    fields: [
      { section_key: 'search', field_key: 'placeholder', label: 'Search placeholder', defaultValue: 'Search for services...' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading categories...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Error loading categories' },
      { section_key: 'error', field_key: 'body', label: 'Error body', defaultValue: 'Please try again later' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No services found' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Try searching with different keywords' },
    ],
  },
  {
    key: 'client_profile',
    label: 'Client Profile',
    description: 'Client profile sign-in, loading, referral, and modal copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Profile' },
      { section_key: 'auth', field_key: 'title', label: 'Signed-out title', defaultValue: 'Please sign in' },
      { section_key: 'auth', field_key: 'body', label: 'Signed-out body', defaultValue: 'You need to be signed in to view your profile.' },
      { section_key: 'auth', field_key: 'cta', label: 'Signed-out CTA', defaultValue: 'Sign In' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading profile...' },
      { section_key: 'error', field_key: 'retry', label: 'Retry CTA', defaultValue: 'Retry' },
      { section_key: 'referral', field_key: 'cta', label: 'Referral banner CTA', defaultValue: 'Help your friends, Get £10' },
      { section_key: 'actions', field_key: 'offer_services', label: 'Offer services CTA', defaultValue: 'Offer services with 100Handy' },
      { section_key: 'actions', field_key: 'logging_out', label: 'Logging out error title', defaultValue: 'Error' },
      { section_key: 'actions', field_key: 'logging_out_body', label: 'Logging out error body', defaultValue: 'Failed to sign out. Please try again.' },
      { section_key: 'actions', field_key: 'logout', label: 'Log out CTA', defaultValue: 'Log out' },
      { section_key: 'privacy', field_key: 'title', label: 'Privacy modal title', defaultValue: 'Privacy Notice' },
      { section_key: 'privacy', field_key: 'body', label: 'Privacy modal body', multiline: true, rows: 3, defaultValue: 'By selecting "Accept All", you agree to the app storing information to enhance device navigation, analyze usage, and assist in our marketing efforts' },
      { section_key: 'privacy', field_key: 'accept_cta', label: 'Privacy accept CTA', defaultValue: 'Accept All Cookies' },
      { section_key: 'privacy', field_key: 'settings_cta', label: 'Privacy settings CTA', defaultValue: 'Cookies Settings' },
      { section_key: 'verify', field_key: 'title', label: 'Verify modal title', defaultValue: 'Verify Identity' },
      { section_key: 'verify', field_key: 'body', label: 'Verify modal body', defaultValue: 'Enter your password to access this section.' },
      { section_key: 'verify', field_key: 'password_placeholder', label: 'Verify password placeholder', defaultValue: 'Password' },
      { section_key: 'verify', field_key: 'cta', label: 'Verify CTA', defaultValue: 'Verify & Continue' },
      { section_key: 'switch', field_key: 'error_title', label: 'Role switch error title', defaultValue: 'Switch failed' },
    ],
  },
  {
    key: 'client_notifications',
    label: 'Client Notifications',
    description: 'Client notifications empty-state copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Notifications' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No notifications yet' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: "You'll see booking updates and messages here." },
    ],
  },
  {
    key: 'client_promotions',
    label: 'Client Promotions',
    description: 'Promotions and referral CTA copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Promotions' },
      { section_key: 'card', field_key: 'title', label: 'Card title', defaultValue: 'Help Your Friends, Get £10' },
      { section_key: 'card', field_key: 'subtitle', label: 'Card subtitle', defaultValue: 'Refer a Friend' },
    ],
  },
  {
    key: 'professional_announcements',
    label: 'Professional Announcements',
    description: 'Professional announcements screen copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Announcements' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No new announcements' },
    ],
  },
  {
    key: 'professional_dashboard',
    label: 'Professional Dashboard',
    description: 'Professional onboarding progress and verification copy.',
    fields: [
      { section_key: 'header', field_key: 'greeting_prefix', label: 'Greeting prefix', defaultValue: 'Hello,' },
      { section_key: 'progress', field_key: 'label_prefix', label: 'Progress label prefix', defaultValue: 'Onboarding progress' },
      { section_key: 'progress', field_key: 'loading', label: 'Progress loading text', defaultValue: 'Loading your progress...' },
      { section_key: 'tasks', field_key: 'verify_identity', label: 'Task: verify identity', defaultValue: 'Verify your identity' },
      { section_key: 'tasks', field_key: 'name_price', label: 'Task: name your price', defaultValue: 'Name your price' },
      { section_key: 'tasks', field_key: 'direct_deposit', label: 'Task: direct deposit', defaultValue: 'Set up direct deposit' },
      { section_key: 'tasks', field_key: 'profile_photo', label: 'Task: profile photo', defaultValue: 'Upload a profile photo' },
      { section_key: 'tasks', field_key: 'availability', label: 'Task: availability', defaultValue: 'Set availability' },
      { section_key: 'tasks', field_key: 'work_area', label: 'Task: work area', defaultValue: 'Set work area' },
      { section_key: 'alerts', field_key: 'verification_in_progress_title', label: 'Verification in progress title', defaultValue: 'Verification In Progress' },
      { section_key: 'alerts', field_key: 'verification_in_progress_body', label: 'Verification in progress body', defaultValue: 'Your identity verification is already being reviewed. Please wait.' },
      { section_key: 'alerts', field_key: 'verification_received_title', label: 'Verification received title', defaultValue: 'Verification received' },
      { section_key: 'alerts', field_key: 'verification_received_body', label: 'Verification received body', defaultValue: 'Stripe finished the verification flow. Your status will update after the backend confirms the result.' },
      { section_key: 'alerts', field_key: 'verification_failed_title', label: 'Verification failed title', defaultValue: 'Verification Failed' },
      { section_key: 'alerts', field_key: 'verification_failed_body', label: 'Verification failed body', defaultValue: 'Please try again.' },
      { section_key: 'alerts', field_key: 'verification_error_title', label: 'Verification error title', defaultValue: 'Error' },
      { section_key: 'alerts', field_key: 'verification_error_body', label: 'Verification error body', defaultValue: 'Failed to start verification. Please try again.' },
      { section_key: 'banner', field_key: 'verified_title', label: 'Verified banner title', defaultValue: 'Account Verified' },
      { section_key: 'banner', field_key: 'verified_body', label: 'Verified banner body', defaultValue: 'Your identity has been verified. You can now receive bookings.' },
      { section_key: 'banner', field_key: 'submitted_title', label: 'Submitted banner title', defaultValue: 'Verification In Progress' },
      { section_key: 'banner', field_key: 'submitted_body', label: 'Submitted banner body', defaultValue: 'Your identity verification is being reviewed. This usually takes a few minutes.' },
      { section_key: 'banner', field_key: 'rejected_title', label: 'Rejected banner title', defaultValue: 'Verification Failed' },
      { section_key: 'banner', field_key: 'rejected_body', label: 'Rejected banner body', defaultValue: 'Tap here to try again with clear photos of your ID.' },
      { section_key: 'banner', field_key: 'default_title', label: 'Default banner title', defaultValue: "Your account isn't live yet!" },
      { section_key: 'banner', field_key: 'default_body', label: 'Default banner body', defaultValue: 'Tap here to verify your identity and activate your account.' },
      { section_key: 'banner', field_key: 'starting', label: 'Starting verification text', defaultValue: 'Starting verification...' },
      { section_key: 'misc', field_key: 'professional_fallback_name', label: 'Fallback professional name', defaultValue: 'Professional' },
    ],
  },
  {
    key: 'professional_notifications',
    label: 'Professional Notifications',
    description: 'Professional notifications empty-state copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Notifications' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No notifications yet' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: "You'll see job requests and messages here." },
    ],
  },
  {
    key: 'professional_profile',
    label: 'Professional Profile',
    description: 'Professional profile header, menu, and photo flow copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Profile' },
      { section_key: 'photo', field_key: 'add', label: 'Add photo label', defaultValue: 'Add Photo' },
      { section_key: 'photo', field_key: 'change', label: 'Change photo label', defaultValue: 'Change Photo' },
      { section_key: 'photo', field_key: 'permission_title', label: 'Photo permission title', defaultValue: 'Permission Required' },
      { section_key: 'photo', field_key: 'library_permission_body', label: 'Library permission body', defaultValue: 'Sorry, we need camera roll permissions to upload a photo.' },
      { section_key: 'photo', field_key: 'camera_permission_body', label: 'Camera permission body', defaultValue: 'Sorry, we need camera permissions to take a photo.' },
      { section_key: 'photo', field_key: 'success_title', label: 'Photo success title', defaultValue: 'Success' },
      { section_key: 'photo', field_key: 'success_body', label: 'Photo success body', defaultValue: 'Profile photo updated successfully!' },
      { section_key: 'photo', field_key: 'error_title', label: 'Photo error title', defaultValue: 'Error' },
      { section_key: 'photo', field_key: 'error_body', label: 'Photo error body', defaultValue: 'Failed to upload photo. Please try again.' },
      { section_key: 'misc', field_key: 'fallback_name', label: 'Fallback name', defaultValue: 'Professional' },
      { section_key: 'menu', field_key: 'account_detail', label: 'Menu: account detail', defaultValue: 'Account detail' },
      { section_key: 'menu', field_key: 'pro_profile', label: 'Menu: pro profile', defaultValue: 'Pro profile' },
      { section_key: 'menu', field_key: 'performance', label: 'Menu: performance', defaultValue: 'Performance' },
      { section_key: 'menu', field_key: 'sync_calendar', label: 'Menu: sync calendar', defaultValue: 'Sync calendar' },
      { section_key: 'menu', field_key: 'chat_templates', label: 'Menu: chat templates', defaultValue: 'Chat templates' },
      { section_key: 'menu', field_key: 'promote_yourself', label: 'Menu: promote yourself', defaultValue: 'Promote yourself' },
      { section_key: 'menu', field_key: 'payments', label: 'Menu: payments', defaultValue: 'Payments' },
      { section_key: 'menu', field_key: 'notifications', label: 'Menu: notifications', defaultValue: 'Notifications' },
      { section_key: 'menu', field_key: 'support', label: 'Menu: support', defaultValue: 'Support' },
      { section_key: 'menu', field_key: 'account_security', label: 'Menu: account security', defaultValue: 'Account security' },
      { section_key: 'menu', field_key: 'about', label: 'Menu: about', defaultValue: 'About' },
      { section_key: 'menu', field_key: 'password', label: 'Menu: password', defaultValue: 'Password' },
      { section_key: 'menu', field_key: 'switch_to_client', label: 'Menu: switch to client', defaultValue: 'Go 100Handy' },
      { section_key: 'menu', field_key: 'logout', label: 'Menu: logout', defaultValue: 'Log out' },
      { section_key: 'switch', field_key: 'error_title', label: 'Switch error title', defaultValue: 'Switch failed' },
      { section_key: 'switch', field_key: 'error_body', label: 'Switch error body', defaultValue: 'Could not switch to client mode. Please try again.' },
      { section_key: 'switch', field_key: 'generic_error_body', label: 'Switch generic error body', defaultValue: 'An error occurred while switching roles. Please try again.' },
    ],
  },
  {
    key: 'client_payments',
    label: 'Client Payments',
    description: 'Client payment hub labels and payment notices.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Payment' },
      { section_key: 'menu', field_key: 'redemptions', label: 'Redemptions label', defaultValue: 'Redemptions' },
      { section_key: 'section', field_key: 'add_payment_method', label: 'Section label', defaultValue: 'ADD PAYMENT METHOD' },
      { section_key: 'menu', field_key: 'credit_card', label: 'Credit card label', defaultValue: 'Credit Card' },
      { section_key: 'menu', field_key: 'apple_pay', label: 'Apple Pay label', defaultValue: 'Apple Pay' },
      { section_key: 'menu', field_key: 'google_pay', label: 'Google Pay label', defaultValue: 'Google Pay' },
      { section_key: 'loading', field_key: 'wallet', label: 'Wallet loading label', defaultValue: 'Loading wallet...' },
      { section_key: 'toasts', field_key: 'wallet_unavailable_title', label: 'Wallet unavailable title', defaultValue: 'Unavailable in Expo Go' },
      { section_key: 'toasts', field_key: 'init_failed_title', label: 'Init failed title', defaultValue: 'Error' },
      { section_key: 'toasts', field_key: 'init_failed_body', label: 'Init failed body', defaultValue: 'Failed to initialize payment. Please try again.' },
      { section_key: 'toasts', field_key: 'success_title', label: 'Success title', defaultValue: 'Success' },
      { section_key: 'toasts', field_key: 'success_body', label: 'Success body', defaultValue: 'Payment method added successfully!' },
      { section_key: 'toasts', field_key: 'generic_error_body', label: 'Generic error body', defaultValue: 'Something went wrong. Please try again.' },
      { section_key: 'footer', field_key: 'note', label: 'Footer note', defaultValue: 'Payment method will update for all tasks, including the ones currently open.' },
    ],
  },
  {
    key: 'client_payment_methods',
    label: 'Client Payment Methods',
    description: 'Client payment methods management copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Payment Methods' },
      { section_key: 'body', field_key: 'description', label: 'Description', defaultValue: 'Manage your payment methods for bookings and purchases' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading payment methods...' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No payment methods yet' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Add a payment method to quickly book services' },
      { section_key: 'badges', field_key: 'default', label: 'Default badge', defaultValue: 'DEFAULT' },
      { section_key: 'labels', field_key: 'expires', label: 'Expires label', defaultValue: 'Expires' },
      { section_key: 'alerts', field_key: 'delete_title', label: 'Delete alert title', defaultValue: 'Delete Payment Method' },
      { section_key: 'alerts', field_key: 'delete_body', label: 'Delete alert body', defaultValue: 'Are you sure you want to delete this payment method?' },
      { section_key: 'actions', field_key: 'cancel', label: 'Cancel CTA', defaultValue: 'Cancel' },
      { section_key: 'actions', field_key: 'delete', label: 'Delete CTA', defaultValue: 'Delete' },
      { section_key: 'actions', field_key: 'add', label: 'Add payment method CTA', defaultValue: 'Add Payment Method' },
      { section_key: 'toasts', field_key: 'deleted_title', label: 'Deleted title', defaultValue: 'Deleted' },
      { section_key: 'toasts', field_key: 'deleted_body', label: 'Deleted body', defaultValue: 'Payment method removed.' },
      { section_key: 'toasts', field_key: 'delete_failed_title', label: 'Delete failed title', defaultValue: 'Error' },
      { section_key: 'toasts', field_key: 'delete_failed_body', label: 'Delete failed body', defaultValue: 'Failed to delete payment method. Please try again.' },
      { section_key: 'toasts', field_key: 'updated_title', label: 'Updated title', defaultValue: 'Updated' },
      { section_key: 'toasts', field_key: 'updated_body', label: 'Updated body', defaultValue: 'Default payment method changed.' },
      { section_key: 'toasts', field_key: 'update_failed_title', label: 'Update failed title', defaultValue: 'Error' },
      { section_key: 'toasts', field_key: 'update_failed_body', label: 'Update failed body', defaultValue: 'Failed to set default payment method. Please try again.' },
    ],
  },
  {
    key: 'client_payment_history',
    label: 'Client Payment History',
    description: 'Client payment history titles, empty states, and status labels.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Payment History' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading payment history...' },
      { section_key: 'empty', field_key: 'title', label: 'Empty title', defaultValue: 'No payments yet' },
      { section_key: 'empty', field_key: 'body', label: 'Empty body', defaultValue: 'Your payment history will appear here after you complete a booking.' },
      { section_key: 'errors', field_key: 'missing_booking', label: 'Missing booking title', defaultValue: 'Booking not found' },
      { section_key: 'status', field_key: 'authorized', label: 'Authorized label', defaultValue: 'Held' },
      { section_key: 'status', field_key: 'captured', label: 'Captured label', defaultValue: 'Paid' },
      { section_key: 'status', field_key: 'pending', label: 'Pending label', defaultValue: 'Pending' },
      { section_key: 'status', field_key: 'cancelled', label: 'Cancelled label', defaultValue: 'Cancelled' },
      { section_key: 'status', field_key: 'refunded', label: 'Refunded label', defaultValue: 'Refunded' },
      { section_key: 'status', field_key: 'failed', label: 'Failed label', defaultValue: 'Failed' },
    ],
  },
  {
    key: 'client_privacy_settings',
    label: 'Client Privacy Settings',
    description: 'Client privacy settings screen copy and toggle labels.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Privacy Settings' },
      { section_key: 'hero', field_key: 'title', label: 'Hero title', defaultValue: 'Privacy Settings' },
      { section_key: 'hero', field_key: 'body', label: 'Hero body', defaultValue: 'Manage how your information is shared and used' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading settings...' },
      { section_key: 'error', field_key: 'title', label: 'Error title', defaultValue: 'Failed to load privacy settings' },
      { section_key: 'error', field_key: 'retry', label: 'Retry CTA', defaultValue: 'Retry' },
      { section_key: 'toasts', field_key: 'success_title', label: 'Success title', defaultValue: 'Success' },
      { section_key: 'toasts', field_key: 'success_body', label: 'Success body', defaultValue: 'Privacy settings updated' },
      { section_key: 'toasts', field_key: 'error_title', label: 'Error title', defaultValue: 'Error' },
      { section_key: 'toasts', field_key: 'error_body', label: 'Error body', defaultValue: 'Failed to update privacy settings' },
      { section_key: 'toggle_location', field_key: 'title', label: 'Location title', defaultValue: 'Location Sharing' },
      { section_key: 'toggle_location', field_key: 'body', label: 'Location body', defaultValue: 'Allow us to access your location for task matching' },
      { section_key: 'toggle_profile', field_key: 'title', label: 'Profile visibility title', defaultValue: 'Profile Visibility' },
      { section_key: 'toggle_profile', field_key: 'body', label: 'Profile visibility body', defaultValue: 'Let taskers see your profile and review history' },
      { section_key: 'toggle_activity', field_key: 'title', label: 'Activity status title', defaultValue: 'Activity Status' },
      { section_key: 'toggle_activity', field_key: 'body', label: 'Activity status body', defaultValue: "Show when you're active on the platform" },
      { section_key: 'toggle_data', field_key: 'title', label: 'Data collection title', defaultValue: 'Data Collection' },
      { section_key: 'toggle_data', field_key: 'body', label: 'Data collection body', defaultValue: 'Allow us to collect analytics to improve your experience' },
      { section_key: 'footer', field_key: 'policy_notice', label: 'Footer policy notice', defaultValue: 'We respect your privacy. Your data is protected and will never be sold to third parties. For more information, read our Privacy Policy.' },
    ],
  },
  {
    key: 'client_account_security',
    label: 'Client Account Security',
    description: 'Client account security and delete-account flow copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Account Security' },
      { section_key: 'enabled', field_key: 'badge_title', label: '2FA enabled badge title', defaultValue: 'Two-Factor Authentication Enabled' },
      { section_key: 'enabled', field_key: 'badge_body', label: '2FA enabled badge body', defaultValue: 'Your account is protected with 2FA' },
      { section_key: 'enabled', field_key: 'hero_title', label: '2FA enabled hero title', defaultValue: 'Account Security' },
      { section_key: 'enabled', field_key: 'body_1', label: '2FA enabled body 1', defaultValue: 'Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your email when signing in.' },
      { section_key: 'enabled', field_key: 'body_2', label: '2FA enabled body 2', defaultValue: 'You can disable two-factor authentication if you no longer want to use it, but this will make your account less secure.' },
      { section_key: 'disabled', field_key: 'hero_title', label: '2FA disabled hero title', defaultValue: 'Two-factor authentication' },
      { section_key: 'disabled', field_key: 'body_1', label: '2FA disabled body 1', defaultValue: 'To keep your account secure, set up two-factor authentication.' },
      { section_key: 'disabled', field_key: 'body_2', label: '2FA disabled body 2', defaultValue: "We'll send a verification code to your email address to activate two-factor authentication." },
      { section_key: 'email', field_key: 'enabled_label', label: 'Enabled email label', defaultValue: 'Verification codes sent to' },
      { section_key: 'email', field_key: 'disabled_label', label: 'Disabled email label', defaultValue: 'Verification code will be sent to' },
      { section_key: 'actions', field_key: 'disable_2fa', label: 'Disable 2FA CTA', defaultValue: 'Disable Two-Factor Authentication' },
      { section_key: 'actions', field_key: 'enable_2fa', label: 'Enable 2FA CTA', defaultValue: 'Enable Two-Factor Authentication' },
      { section_key: 'actions', field_key: 'processing', label: 'Processing CTA', defaultValue: 'Processing...' },
      { section_key: 'actions', field_key: 'sending', label: 'Sending CTA', defaultValue: 'Sending...' },
      { section_key: 'actions', field_key: 'delete_account', label: 'Delete account CTA', defaultValue: 'Delete Account' },
      { section_key: 'delete_modal', field_key: 'title', label: 'Delete modal title', defaultValue: 'Delete Account' },
      { section_key: 'delete_modal', field_key: 'body', label: 'Delete modal body', defaultValue: 'This action cannot be undone. Your account and related data will be permanently deleted.' },
      { section_key: 'delete_modal', field_key: 'prompt', label: 'Delete modal prompt', defaultValue: 'Enter your password to confirm.' },
      { section_key: 'delete_modal', field_key: 'password_placeholder', label: 'Password placeholder', defaultValue: 'Password' },
      { section_key: 'delete_modal', field_key: 'confirm', label: 'Delete modal confirm', defaultValue: 'Delete My Account' },
      { section_key: 'delete_modal', field_key: 'cancel', label: 'Delete modal cancel', defaultValue: 'Cancel' },
      { section_key: 'alerts', field_key: 'disable_title', label: 'Disable alert title', defaultValue: 'Disable Two-Factor Authentication' },
      { section_key: 'alerts', field_key: 'disable_body', label: 'Disable alert body', defaultValue: 'Are you sure you want to disable two-factor authentication? This will make your account less secure.' },
      { section_key: 'alerts', field_key: 'cancel', label: 'Alert cancel', defaultValue: 'Cancel' },
      { section_key: 'alerts', field_key: 'disable_confirm', label: 'Alert disable confirm', defaultValue: 'Disable' },
      { section_key: 'alerts', field_key: 'success_title', label: 'Success alert title', defaultValue: 'Success' },
      { section_key: 'alerts', field_key: 'success_body', label: 'Success alert body', defaultValue: 'Two-factor authentication has been disabled.' },
      { section_key: 'alerts', field_key: 'error_title', label: 'Error alert title', defaultValue: 'Error' },
      { section_key: 'alerts', field_key: 'disable_error_body', label: 'Disable error body', defaultValue: 'Failed to disable two-factor authentication. Please try again.' },
      { section_key: 'alerts', field_key: 'send_error_body', label: 'Send code error body', defaultValue: 'Failed to send verification code. Please try again.' },
      { section_key: 'toasts', field_key: 'delete_success_title', label: 'Delete success title', defaultValue: 'Success' },
      { section_key: 'toasts', field_key: 'delete_success_body', label: 'Delete success body', defaultValue: 'Your account has been deleted' },
      { section_key: 'toasts', field_key: 'delete_error_title', label: 'Delete error title', defaultValue: 'Error' },
      { section_key: 'toasts', field_key: 'delete_error_body', label: 'Delete error body', defaultValue: 'Failed to delete account. Please try again.' },
      { section_key: 'toasts', field_key: 'delete_password_error_body', label: 'Delete password error body', defaultValue: 'Incorrect password. Please try again.' },
    ],
  },
  {
    key: 'client_review',
    label: 'Client Review',
    description: 'Client-to-pro review flow copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Leave a Review' },
      { section_key: 'errors', field_key: 'cannot_review_title', label: 'Cannot review title', defaultValue: 'Cannot Review' },
      { section_key: 'errors', field_key: 'cannot_review_body', label: 'Cannot review body', defaultValue: 'Reviews can only be submitted for completed bookings.' },
      { section_key: 'errors', field_key: 'missing_booking', label: 'Missing booking title', defaultValue: 'Booking not found' },
      { section_key: 'status', field_key: 'already_title', label: 'Already reviewed title', defaultValue: 'Already reviewed' },
      { section_key: 'status', field_key: 'already_body', label: 'Already reviewed body', defaultValue: "You've already left a review for this booking." },
      { section_key: 'rating', field_key: 'prompt', label: 'Rating prompt', defaultValue: 'How was your experience?' },
      { section_key: 'rating', field_key: 'tap', label: 'Tap to rate label', defaultValue: 'Tap to rate' },
      { section_key: 'rating', field_key: 'poor', label: '1-star label', defaultValue: 'Poor' },
      { section_key: 'rating', field_key: 'fair', label: '2-star label', defaultValue: 'Fair' },
      { section_key: 'rating', field_key: 'good', label: '3-star label', defaultValue: 'Good' },
      { section_key: 'rating', field_key: 'very_good', label: '4-star label', defaultValue: 'Very Good' },
      { section_key: 'rating', field_key: 'excellent', label: '5-star label', defaultValue: 'Excellent' },
      { section_key: 'review', field_key: 'title', label: 'Review title', defaultValue: 'Write a review (optional)' },
      { section_key: 'review', field_key: 'placeholder', label: 'Review placeholder', defaultValue: 'Share your experience with this pro...' },
      { section_key: 'review', field_key: 'footer', label: 'Review footer', defaultValue: "Your review will be visible on the pro's profile" },
      { section_key: 'actions', field_key: 'skip', label: 'Skip CTA', defaultValue: 'Maybe later' },
      { section_key: 'actions', field_key: 'submit', label: 'Submit CTA', defaultValue: 'Submit Review' },
      { section_key: 'toasts', field_key: 'missing_rating', label: 'Missing rating toast', defaultValue: 'Please select a rating' },
      { section_key: 'toasts', field_key: 'success', label: 'Success toast', defaultValue: 'Review submitted!' },
      { section_key: 'toasts', field_key: 'failed', label: 'Failed toast', defaultValue: 'Failed to submit review' },
      { section_key: 'toasts', field_key: 'generic_error', label: 'Generic error toast', defaultValue: 'Something went wrong' },
    ],
  },
  {
    key: 'professional_review',
    label: 'Professional Review',
    description: 'Professional client-rating flow copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Rate Client' },
      { section_key: 'errors', field_key: 'cannot_review_title', label: 'Cannot review title', defaultValue: 'Cannot Review' },
      { section_key: 'errors', field_key: 'cannot_review_body', label: 'Cannot review body', defaultValue: 'You can only review completed bookings.' },
      { section_key: 'errors', field_key: 'missing_booking', label: 'Missing booking title', defaultValue: 'Booking not found' },
      { section_key: 'status', field_key: 'already_title', label: 'Already reviewed title', defaultValue: 'Already reviewed' },
      { section_key: 'status', field_key: 'already_body', label: 'Already reviewed body', defaultValue: "You've already rated this client." },
      { section_key: 'privacy', field_key: 'title', label: 'Privacy notice title', defaultValue: 'Private Rating' },
      { section_key: 'privacy', field_key: 'body', label: 'Privacy notice body', defaultValue: 'This rating is private and only visible to you. It helps you remember your experience with this client for future bookings.' },
      { section_key: 'rating', field_key: 'prompt', label: 'Rating prompt', defaultValue: 'How was this client?' },
      { section_key: 'rating', field_key: 'tap', label: 'Tap to rate label', defaultValue: 'Tap to rate' },
      { section_key: 'rating', field_key: 'one', label: '1-star label', defaultValue: 'Would not work with again' },
      { section_key: 'rating', field_key: 'two', label: '2-star label', defaultValue: 'Below average' },
      { section_key: 'rating', field_key: 'three', label: '3-star label', defaultValue: 'Average' },
      { section_key: 'rating', field_key: 'four', label: '4-star label', defaultValue: 'Good client' },
      { section_key: 'rating', field_key: 'five', label: '5-star label', defaultValue: 'Excellent client' },
      { section_key: 'notes', field_key: 'title', label: 'Notes title', defaultValue: 'Private notes (optional)' },
      { section_key: 'notes', field_key: 'placeholder', label: 'Notes placeholder', defaultValue: 'Add notes about this client for your reference...' },
      { section_key: 'notes', field_key: 'footer', label: 'Notes footer', defaultValue: 'Only you can see these notes' },
      { section_key: 'actions', field_key: 'skip', label: 'Skip CTA', defaultValue: 'Maybe later' },
      { section_key: 'actions', field_key: 'submit', label: 'Submit CTA', defaultValue: 'Save Rating' },
      { section_key: 'toasts', field_key: 'missing_rating', label: 'Missing rating toast', defaultValue: 'Please select a rating' },
      { section_key: 'toasts', field_key: 'success', label: 'Success toast', defaultValue: 'Review saved!' },
      { section_key: 'toasts', field_key: 'failed', label: 'Failed toast', defaultValue: 'Failed to save review' },
      { section_key: 'toasts', field_key: 'generic_error', label: 'Generic error toast', defaultValue: 'Something went wrong' },
    ],
  },
  {
    key: 'professional_payments',
    label: 'Professional Payments',
    description: 'Professional payments screen copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Payments' },
      { section_key: 'menu', field_key: 'direct_deposit', label: 'Direct deposit label', defaultValue: 'Direct deposit' },
    ],
  },
  {
    key: 'professional_support',
    label: 'Professional Support',
    description: 'Professional support screen labels, URLs, and notification test copy.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Support' },
      { section_key: 'menu', field_key: 'support_center', label: 'Support center label', defaultValue: '100Handy Support' },
      { section_key: 'menu', field_key: 'support_center_url', label: 'Support center URL', defaultValue: 'https://100handy.com/help' },
      { section_key: 'menu', field_key: 'test_notifications', label: 'Test notifications label', defaultValue: 'Test push notifications' },
      { section_key: 'notifications', field_key: 'disabled_title', label: 'Notifications disabled title', defaultValue: 'Notifications disabled' },
      { section_key: 'notifications', field_key: 'disabled_body', label: 'Notifications disabled body', defaultValue: 'Enable notifications to test this feature.' },
      { section_key: 'notifications', field_key: 'sent_title', label: 'Notification sent title', defaultValue: 'Test notification sent' },
      { section_key: 'notifications', field_key: 'sent_body', label: 'Notification sent body', defaultValue: 'A banner should appear immediately.' },
      { section_key: 'notifications', field_key: 'error_title', label: 'Notification error title', defaultValue: 'Notification test failed' },
      { section_key: 'notifications', field_key: 'error_body', label: 'Notification error body', defaultValue: 'Unable to trigger the test notification.' },
      { section_key: 'version', field_key: 'prefix', label: 'Version prefix', defaultValue: 'Version' },
    ],
  },
  {
    key: 'professional_add_profile_photo',
    label: 'Professional Add Profile Photo',
    description: 'Professional setup add-profile-photo copy and alerts.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Add profile photo' },
      { section_key: 'hero', field_key: 'title', label: 'Hero title', defaultValue: 'Show off your best self!' },
      { section_key: 'tips', field_key: 'intro', label: 'Tips intro', defaultValue: 'A great photo increases your chances of being hired. Some tips:' },
      { section_key: 'tips', field_key: 'item_1', label: 'Tip 1', defaultValue: 'Center yourself and smile at the camera' },
      { section_key: 'tips', field_key: 'item_2', label: 'Tip 2', defaultValue: 'Take a headshot - from the chest up.' },
      { section_key: 'tips', field_key: 'item_3', label: 'Tip 3', defaultValue: 'Make sure it&apos;s focused and well-lit.' },
      { section_key: 'actions', field_key: 'add_photo', label: 'Add photo button', defaultValue: 'Add Photo' },
      { section_key: 'sheet', field_key: 'title', label: 'Sheet title', defaultValue: 'Select a Photo' },
      { section_key: 'sheet', field_key: 'library', label: 'Library button', defaultValue: 'Library' },
      { section_key: 'sheet', field_key: 'camera', label: 'Camera button', defaultValue: 'Take a photo' },
      { section_key: 'alerts', field_key: 'permission_title', label: 'Permission title', defaultValue: 'Permission Required' },
      { section_key: 'alerts', field_key: 'library_permission_body', label: 'Library permission body', defaultValue: 'Sorry, we need camera roll permissions to upload a photo.' },
      { section_key: 'alerts', field_key: 'camera_permission_body', label: 'Camera permission body', defaultValue: 'Sorry, we need camera permissions to take a photo.' },
      { section_key: 'alerts', field_key: 'success_title', label: 'Success title', defaultValue: 'Success' },
      { section_key: 'alerts', field_key: 'success_body', label: 'Success body', defaultValue: 'Profile photo updated successfully!' },
      { section_key: 'alerts', field_key: 'error_title', label: 'Error title', defaultValue: 'Error' },
      { section_key: 'alerts', field_key: 'error_body', label: 'Error body', defaultValue: 'Failed to upload photo. Please try again.' },
    ],
  },
  {
    key: 'professional_set_availability',
    label: 'Professional Set Availability',
    description: 'Professional availability setup labels, modal copy, and toasts.',
    fields: [
      { section_key: 'header', field_key: 'title', label: 'Header title', defaultValue: 'Set Availability' },
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading availability...' },
      { section_key: 'slot', field_key: 'available', label: 'Slot available label', defaultValue: 'Available' },
      { section_key: 'slot', field_key: 'repeats_weekly', label: 'Repeats weekly label', defaultValue: 'Repeats weekly' },
      { section_key: 'slot', field_key: 'one_time', label: 'One-time label', defaultValue: 'One-time' },
      { section_key: 'preview', field_key: 'merging', label: 'Preview merging label', defaultValue: 'Merging...' },
      { section_key: 'preview', field_key: 'new_slot', label: 'Preview new slot label', defaultValue: 'New Slot' },
      { section_key: 'modal', field_key: 'title', label: 'Modal title', defaultValue: 'Add Availability' },
      { section_key: 'modal', field_key: 'to', label: 'Time separator', defaultValue: 'to' },
      { section_key: 'repeat', field_key: 'title', label: 'Repeat title', defaultValue: 'Repeat weekly' },
      { section_key: 'repeat', field_key: 'enabled_body', label: 'Repeat enabled body', defaultValue: 'This availability will repeat every week on the selected days.' },
      { section_key: 'repeat', field_key: 'disabled_body', label: 'Repeat disabled body', defaultValue: 'This availability will only be added for this date.' },
      { section_key: 'actions', field_key: 'saving', label: 'Saving label', defaultValue: 'Saving...' },
      { section_key: 'actions', field_key: 'merge', label: 'Merge CTA', defaultValue: 'Merge availability' },
      { section_key: 'actions', field_key: 'add', label: 'Add CTA', defaultValue: 'Add Availability' },
      { section_key: 'actions', field_key: 'discard', label: 'Discard CTA', defaultValue: 'Discard' },
      { section_key: 'errors', field_key: 'invalid_time_title', label: 'Invalid time title', defaultValue: 'Invalid time' },
      { section_key: 'errors', field_key: 'invalid_time_body', label: 'Invalid time body', defaultValue: 'End time must be after start time' },
      { section_key: 'errors', field_key: 'missing_days_title', label: 'Missing weekdays title', defaultValue: 'Missing weekdays' },
      { section_key: 'errors', field_key: 'missing_days_body', label: 'Missing weekdays body', defaultValue: 'Select at least one weekday' },
      { section_key: 'toasts', field_key: 'saved_title', label: 'Saved title', defaultValue: 'Saved' },
      { section_key: 'toasts', field_key: 'saved_body', label: 'Saved body', defaultValue: 'Availability updated' },
      { section_key: 'toasts', field_key: 'save_failed_title', label: 'Save failed title', defaultValue: 'Save failed' },
      { section_key: 'toasts', field_key: 'retry_body', label: 'Retry body', defaultValue: 'Please try again' },
      { section_key: 'toasts', field_key: 'resize_failed_title', label: 'Resize failed title', defaultValue: 'Resize failed' },
    ],
  },
  {
    key: 'professional_set_work_area',
    label: 'Professional Set Work Area',
    description: 'Professional work-area setup labels and toasts.',
    fields: [
      { section_key: 'loading', field_key: 'text', label: 'Loading text', defaultValue: 'Loading...' },
      { section_key: 'review', field_key: 'title', label: 'Review title', defaultValue: 'Reviewing work area' },
      { section_key: 'actions', field_key: 'drawing', label: 'Drawing state label', defaultValue: 'Draw on map' },
      { section_key: 'actions', field_key: 'draw', label: 'Draw CTA', defaultValue: 'Draw area' },
      { section_key: 'actions', field_key: 'clear', label: 'Clear CTA', defaultValue: 'Clear' },
      { section_key: 'actions', field_key: 'save', label: 'Save CTA', defaultValue: 'Save work area' },
      { section_key: 'toasts', field_key: 'saved_title', label: 'Saved title', defaultValue: 'Saved' },
      { section_key: 'toasts', field_key: 'saved_body', label: 'Saved body', defaultValue: 'Work area updated' },
      { section_key: 'toasts', field_key: 'save_failed_title', label: 'Save failed title', defaultValue: 'Save failed' },
      { section_key: 'toasts', field_key: 'retry_body', label: 'Retry body', defaultValue: 'Please try again' },
    ],
  },
]

function contentKey(sectionKey: string, fieldKey: string) {
  return `${sectionKey}.${fieldKey}`
}

export default function AppContentPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
  const [platform, setPlatform] = useState<PlatformKey>('shared')
  const [screenKey, setScreenKey] = useState<string>(SCREEN_DEFINITIONS[0].key)
  const { data: rows = [], isLoading } = useAppContentEntries(platform, screenKey)
  const { data: latestDraft } = useLatestAppContentScreenDraft(platform, screenKey)
  const { data: revisions = [] } = useAppContentScreenRevisions(platform, screenKey)
  const saveDraft = useSaveAppContentScreenDraft()
  const publishDraft = usePublishAppContentScreenDraft()
  const restoreRevision = useRestoreAppContentScreenRevision()
  const [values, setValues] = useState<Record<string, string>>({})
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const screenDefinition = SCREEN_DEFINITIONS.find((screen) => screen.key === screenKey) ?? SCREEN_DEFINITIONS[0]

  useEffect(() => {
    const nextValues: Record<string, string> = {}
    for (const field of screenDefinition.fields) {
      const row = rows.find(
        (item) =>
          item.screen_key === screenDefinition.key &&
          item.section_key === field.section_key &&
          item.field_key === field.field_key
      )
      const key = contentKey(field.section_key, field.field_key)
      nextValues[key] = latestDraft?.content_json?.[key] ?? row?.value ?? field.defaultValue
    }
    setValues(nextValues)
  }, [rows, screenDefinition, latestDraft])

  const saveAll = async () => {
    if (!canSaveDraft) return
    setActionFeedback(null)
    await saveDraft.mutateAsync({ platform, screenKey: screenDefinition.key, content: values })
    setActionFeedback('Draft saved')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const baselineValues = Object.fromEntries(
    screenDefinition.fields.map((field) => {
      const row = rows.find(
        (item) =>
          item.screen_key === screenDefinition.key &&
          item.section_key === field.section_key &&
          item.field_key === field.field_key,
      )
      const key = contentKey(field.section_key, field.field_key)
      return [key, latestDraft?.content_json?.[key] ?? row?.value ?? field.defaultValue]
    }),
  )

  const isDirty = JSON.stringify(values) !== JSON.stringify(baselineValues)
  useUnsavedChangesWarning(isDirty)

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    for (const field of screenDefinition.fields) {
      const key = contentKey(field.section_key, field.field_key)
      const value = (values[key] ?? '').trim()
      if (field.defaultValue.trim() && !value) {
        errors.push(`${field.label} is required.`)
      }
      if (field.field_key.endsWith('_url') && value) {
        const valid = field.field_key === 'support_center_url'
          ? isValidUrl(value)
          : isValidUrl(value) || isValidHref(value)
        if (!valid) {
          errors.push(`${field.label} must be a valid URL or path.`)
        }
      }
    }
    return errors
  }, [screenDefinition.fields, values])

  const canSaveDraft = canManageContent && validationErrors.length === 0
  const canPublish = canManageContent && validationErrors.length === 0 && !!latestDraft

  const publish = async () => {
    if (!canPublish) return
    setActionFeedback(null)
    await publishDraft.mutateAsync({ platform, screenKey: screenDefinition.key })
    setActionFeedback('Published')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="App Content" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto space-y-6">
          <UnsavedChangesBanner show={isDirty} />
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view app content, but it cannot change or publish it.
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {validationErrors.map((error) => <div key={error}>{error}</div>)}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_220px_1fr]">
            <SelectField
              label="Platform"
              value={platform}
              onChange={(value) => setPlatform(value as PlatformKey)}
              options={[
                { label: 'Shared', value: 'shared' },
                { label: 'iOS', value: 'ios' },
                { label: 'Android', value: 'android' },
              ]}
            />
            <SelectField
              label="Screen"
              value={screenKey}
              onChange={setScreenKey}
              options={SCREEN_DEFINITIONS.map((screen) => ({ label: screen.label, value: screen.key }))}
            />
            <div className="flex items-end justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={saveAll}
                  disabled={saveDraft.isPending || publishDraft.isPending || !canSaveDraft}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {saveDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : actionFeedback === 'Draft saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {actionFeedback === 'Draft saved' ? 'Draft Saved' : 'Save Draft'}
                </button>
                <button
                  onClick={publish}
                  disabled={publishDraft.isPending || saveDraft.isPending || !canPublish}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {publishDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : actionFeedback === 'Published' ? <Check className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                  {actionFeedback === 'Published' ? 'Published' : 'Publish'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{screenDefinition.label}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{screenDefinition.description}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
              <p>Work is saved to a draft first. Mobile apps only change after publish.</p>
              <div>
                Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
              </div>
            </div>
            {actionFeedback && <p className="mt-3 text-sm font-medium text-emerald-600">{actionFeedback}</p>}
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              screenDefinition.fields.map((field) => {
                const key = contentKey(field.section_key, field.field_key)
                const value = values[key] ?? field.defaultValue
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <p className="mb-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {field.section_key}.{field.field_key}
                    </p>
                    {field.multiline ? (
                      <textarea
                        value={value}
                        rows={field.rows ?? 4}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className={`w-full px-4 py-2 border bg-white dark:bg-gray-900 rounded-lg ${
                          validationErrors.some((error) => error.startsWith(field.label))
                            ? 'border-red-300 dark:border-red-700'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className={`w-full px-4 py-2 border bg-white dark:bg-gray-900 rounded-lg ${
                          validationErrors.some((error) => error.startsWith(field.label))
                            ? 'border-red-300 dark:border-red-700'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {revisions.length > 0 && (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revision History</h3>
              {revisions.map((revision) => (
                <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      v{revision.version_number} · {revision.revision_state}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {new Date(revision.updated_at).toLocaleString('en-GB')}
                      {revision.published_at ? ` · Published ${new Date(revision.published_at).toLocaleString('en-GB')}` : ''}
                    </p>
                  </div>
                  {revision.revision_state === 'published' ? (
                    <button
                      onClick={() => restoreRevision.mutate({ platform, screenKey, revisionId: revision.id })}
                      disabled={restoreRevision.isPending}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      Restore to Draft
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-amber-600">Current draft</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
