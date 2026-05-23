import { useEffect, useMemo, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Header from '@/components/header'
import { useAppContentEntries, useSaveAppContentEntry, type AppContentInput } from '@/lib/api/content-platform'

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
]

function contentKey(sectionKey: string, fieldKey: string) {
  return `${sectionKey}.${fieldKey}`
}

export default function AppContentPage() {
  const [platform, setPlatform] = useState<PlatformKey>('shared')
  const [screenKey, setScreenKey] = useState<string>(SCREEN_DEFINITIONS[0].key)
  const { data: rows = [], isLoading } = useAppContentEntries(platform, screenKey)
  const saveEntry = useSaveAppContentEntry()
  const [values, setValues] = useState<Record<string, string>>({})

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
      nextValues[contentKey(field.section_key, field.field_key)] = row?.value ?? field.defaultValue
    }
    setValues(nextValues)
  }, [rows, screenDefinition])

  const saveAll = async () => {
    for (const field of screenDefinition.fields) {
      await saveEntry.mutateAsync({
        platform,
        screen_key: screenDefinition.key,
        section_key: field.section_key,
        field_key: field.field_key,
        value: values[contentKey(field.section_key, field.field_key)] ?? field.defaultValue,
        status: 'published',
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="App Content" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto space-y-6">
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
              <button
                onClick={saveAll}
                disabled={saveEntry.isPending}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {saveEntry.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Screen Content
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{screenDefinition.label}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{screenDefinition.description}</p>
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
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
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
