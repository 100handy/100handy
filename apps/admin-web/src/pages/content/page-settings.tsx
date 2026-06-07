import { useEffect, useState } from 'react'
import { Check, Loader2, Rocket, Save } from 'lucide-react'
import Header from '@/components/header'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidUrl, safeParseJson } from '@/lib/editor-validation'
import {
  useLatestSiteSettingsDraft,
  usePublishSiteSettingsDraft,
  useRestoreSiteSettingsRevision,
  useSaveSiteSettingsDraft,
  useSiteSettings,
  useSiteSettingsRevisions,
} from '@/lib/api/content-platform'
import type { Json } from '@/lib/database.types'

export default function PageSettingsPage() {
  const SETTINGS_KEY = 'global_page_settings'
  const { hasPermission } = useAuth()
  const canManageSettings = hasPermission('content.manage') && hasPermission('seo.manage')
  const { data: settings = [], isLoading } = useSiteSettings(['seo.defaults', 'seo.organization', 'help.ui', 'help.search_index', 'booking.web_copy'])
  const saveDraft = useSaveSiteSettingsDraft()
  const publishDraft = usePublishSiteSettingsDraft()
  const restoreRevision = useRestoreSiteSettingsRevision()
  const { data: latestDraft } = useLatestSiteSettingsDraft(SETTINGS_KEY)
  const { data: revisions = [] } = useSiteSettingsRevisions(SETTINGS_KEY)

  const [defaultMetaDescription, setDefaultMetaDescription] = useState('')
  const [defaultOgImageUrl, setDefaultOgImageUrl] = useState('')
  const [canonicalBaseUrl, setCanonicalBaseUrl] = useState('')
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)
  const [organizationJson, setOrganizationJson] = useState('{}')
  const [helpUiJson, setHelpUiJson] = useState('{}')
  const [helpSearchJson, setHelpSearchJson] = useState('{}')
  const [bookingCopyJson, setBookingCopyJson] = useState('{}')
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  useEffect(() => {
    const draftSettings = (latestDraft?.settings_json ?? {}) as Record<string, Json | undefined>
    const seoDefaults = draftSettings['seo.defaults'] ?? settings.find((setting) => setting.setting_key === 'seo.defaults')?.value_json ?? {}
    const organization = draftSettings['seo.organization'] ?? settings.find((setting) => setting.setting_key === 'seo.organization')?.value_json ?? {}
    const helpUi = draftSettings['help.ui'] ?? settings.find((setting) => setting.setting_key === 'help.ui')?.value_json ?? {}
    const helpSearch = draftSettings['help.search_index'] ?? settings.find((setting) => setting.setting_key === 'help.search_index')?.value_json ?? {}
    const bookingCopy = draftSettings['booking.web_copy'] ?? settings.find((setting) => setting.setting_key === 'booking.web_copy')?.value_json ?? {}

    setDefaultMetaDescription(typeof seoDefaults.defaultMetaDescription === 'string' ? seoDefaults.defaultMetaDescription : '')
    setDefaultOgImageUrl(typeof seoDefaults.defaultOgImageUrl === 'string' ? seoDefaults.defaultOgImageUrl : '')
    setCanonicalBaseUrl(typeof seoDefaults.canonicalBaseUrl === 'string' ? seoDefaults.canonicalBaseUrl : '')
    setRobotsIndex(typeof seoDefaults.robotsIndex === 'boolean' ? seoDefaults.robotsIndex : true)
    setRobotsFollow(typeof seoDefaults.robotsFollow === 'boolean' ? seoDefaults.robotsFollow : true)
    setOrganizationJson(JSON.stringify(organization, null, 2))
    setHelpUiJson(JSON.stringify(helpUi, null, 2))
    setHelpSearchJson(JSON.stringify(helpSearch, null, 2))
    setBookingCopyJson(JSON.stringify(bookingCopy, null, 2))
  }, [settings, latestDraft])

  const organizationResult = safeParseJson<Record<string, unknown>>(organizationJson, 'Organization schema')
  const helpUiResult = safeParseJson<Record<string, unknown>>(helpUiJson, 'Help UI')
  const helpSearchResult = safeParseJson<Record<string, unknown>>(helpSearchJson, 'Help search index')
  const bookingCopyResult = safeParseJson<Record<string, unknown>>(bookingCopyJson, 'Booking web copy')

  const validationErrors = [
    organizationResult.error,
    helpUiResult.error,
    helpSearchResult.error,
    bookingCopyResult.error,
    defaultOgImageUrl.trim() && !isValidUrl(defaultOgImageUrl) ? 'Default OG image URL must be a valid absolute URL.' : null,
    canonicalBaseUrl.trim() && !isValidUrl(canonicalBaseUrl) ? 'Canonical base URL must be a valid absolute URL.' : null,
  ].filter((value): value is string => Boolean(value))

  const currentSettings = {
    'seo.defaults': {
      defaultMetaDescription,
      defaultOgImageUrl,
      canonicalBaseUrl,
      robotsIndex,
      robotsFollow,
    },
    'seo.organization': organizationResult.value ?? {},
    'help.ui': helpUiResult.value ?? {},
    'help.search_index': helpSearchResult.value ?? {},
    'booking.web_copy': bookingCopyResult.value ?? {},
  }

  const isDirty = JSON.stringify(currentSettings) !== JSON.stringify((latestDraft?.settings_json ?? {}) as Record<string, unknown>)
  useUnsavedChangesWarning(isDirty)

  const isSaving = saveDraft.isPending || publishDraft.isPending
  const canSaveDraft = canManageSettings && validationErrors.length === 0
  const canPublish = canManageSettings && validationErrors.length === 0 && !!latestDraft

  const saveAll = async () => {
    if (!canSaveDraft) return
    setActionFeedback(null)
    await saveDraft.mutateAsync({
      settingsKey: SETTINGS_KEY,
      settings: currentSettings,
    })
    setActionFeedback('Draft saved')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const publishAll = async () => {
    if (!canPublish) return
    setActionFeedback(null)
    await publishDraft.mutateAsync(SETTINGS_KEY)
    setActionFeedback('Published')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Global Settings" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto space-y-6">
          <UnsavedChangesBanner show={isDirty} />
          {!canManageSettings && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view these settings, but it cannot change live SEO and global content settings.
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {validationErrors.map((error) => <div key={error}>{error}</div>)}
            </div>
          )}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global SEO and shared website settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This page controls global defaults and shared content blocks. It does not edit individual pages.
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <SettingsSummaryCard
                  title="SEO Defaults"
                  description="Meta description, OG image, canonical base, robots defaults."
                />
                <SettingsSummaryCard
                  title="Organization Schema"
                  description="Global structured data for the website."
                />
                <SettingsSummaryCard
                  title="Help Settings"
                  description="Help UI labels and search configuration."
                />
                <SettingsSummaryCard
                  title="Booking Copy"
                  description="Shared copy used across booking confirmation surfaces."
                />
              </div>
            </div>
            {actionFeedback && <p className="mt-3 text-sm font-medium text-emerald-600">{actionFeedback}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={saveAll}
              disabled={isSaving || !canSaveDraft}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
            >
              {saveDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : actionFeedback === 'Draft saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {actionFeedback === 'Draft saved' ? 'Draft Saved' : 'Save Draft'}
            </button>
            <button
              onClick={publishAll}
              disabled={isSaving || !canPublish}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-500 flex items-center gap-2 disabled:opacity-50"
            >
              {publishDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : actionFeedback === 'Published' ? <Check className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
              {actionFeedback === 'Published' ? 'Published' : 'Publish'}
            </button>
          </div>

          <SectionCard
            title="SEO Defaults"
            description="Set the fallback metadata used across public pages when a page does not define its own SEO values."
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Default Meta Description" value={defaultMetaDescription} onChange={setDefaultMetaDescription} multiline />
                <Field label="Default OG Image URL" value={defaultOgImageUrl} onChange={setDefaultOgImageUrl} />
                <Field label="Canonical Base URL" value={canonicalBaseUrl} onChange={setCanonicalBaseUrl} />
                <div className="space-y-3 pt-6">
                  <Checkbox label="Robots Index by default" checked={robotsIndex} onChange={setRobotsIndex} />
                  <Checkbox label="Robots Follow by default" checked={robotsFollow} onChange={setRobotsFollow} />
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Organization Schema"
            description="Structured organization data used as the global SEO source of truth."
          >
            <textarea
              value={organizationJson}
              onChange={(e) => setOrganizationJson(e.target.value)}
              rows={14}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg font-mono text-xs"
            />
          </SectionCard>

          <JsonPanel
            title="Help Settings"
            description="Labels, UI, and search entries used across help pages."
            value={helpUiJson}
            onChange={setHelpUiJson}
          />

          <JsonPanel
            title="Help Search Data"
            description="Search entries and popular searches for the help experience."
            value={helpSearchJson}
            onChange={setHelpSearchJson}
          />

          <JsonPanel
            title="Booking Copy"
            description="Shared copy used by booking confirmation components on the website."
            value={bookingCopyJson}
            onChange={setBookingCopyJson}
          />

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revision History</h3>
            <div className="space-y-3">
              {revisions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No revisions yet.</p>
              ) : revisions.map((revision) => (
                <div key={revision.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">v{revision.version_number} · {revision.revision_state}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(revision.updated_at).toLocaleString()}</p>
                  </div>
                  {revision.revision_state === 'published' && (
                    <button
                      onClick={() => restoreRevision.mutate({ settingsKey: SETTINGS_KEY, revisionId: revision.id })}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Restore to Draft
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSummaryCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {children}
    </div>
  )
}

function JsonPanel({
  title,
  description,
  value,
  onChange,
}: {
  title: string
  description: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg font-mono text-xs"
      />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  return (
    <div className={multiline ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg"
        />
      )}
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}
