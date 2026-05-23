import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Header from '@/components/header'
import { useSaveSiteSetting, useSiteSettings } from '@/lib/api/content-platform'

export default function PageSettingsPage() {
  const { data: settings = [], isLoading } = useSiteSettings(['seo.defaults', 'seo.organization'])
  const saveSetting = useSaveSiteSetting()

  const [defaultMetaDescription, setDefaultMetaDescription] = useState('')
  const [defaultOgImageUrl, setDefaultOgImageUrl] = useState('')
  const [canonicalBaseUrl, setCanonicalBaseUrl] = useState('')
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)
  const [organizationJson, setOrganizationJson] = useState('{}')

  useEffect(() => {
    const seoDefaults = settings.find((setting) => setting.setting_key === 'seo.defaults')?.value_json ?? {}
    const organization = settings.find((setting) => setting.setting_key === 'seo.organization')?.value_json ?? {}

    setDefaultMetaDescription(typeof seoDefaults.defaultMetaDescription === 'string' ? seoDefaults.defaultMetaDescription : '')
    setDefaultOgImageUrl(typeof seoDefaults.defaultOgImageUrl === 'string' ? seoDefaults.defaultOgImageUrl : '')
    setCanonicalBaseUrl(typeof seoDefaults.canonicalBaseUrl === 'string' ? seoDefaults.canonicalBaseUrl : '')
    setRobotsIndex(typeof seoDefaults.robotsIndex === 'boolean' ? seoDefaults.robotsIndex : true)
    setRobotsFollow(typeof seoDefaults.robotsFollow === 'boolean' ? seoDefaults.robotsFollow : true)
    setOrganizationJson(JSON.stringify(organization, null, 2))
  }, [settings])

  const isSaving = saveSetting.isPending

  const saveAll = async () => {
    await saveSetting.mutateAsync({
      setting_group: 'seo',
      setting_key: 'seo.defaults',
      value_json: {
        defaultMetaDescription,
        defaultOgImageUrl,
        canonicalBaseUrl,
        robotsIndex,
        robotsFollow,
      },
    })

    await saveSetting.mutateAsync({
      setting_group: 'seo',
      setting_key: 'seo.organization',
      value_json: JSON.parse(organizationJson),
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Page Settings" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-end">
            <button
              onClick={saveAll}
              disabled={isSaving}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global SEO Defaults</h3>

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
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Organization Schema</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Structured organization data used as the global SEO/source-of-truth block.
            </p>
            <textarea
              value={organizationJson}
              onChange={(e) => setOrganizationJson(e.target.value)}
              rows={14}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg font-mono text-xs"
            />
          </div>
        </div>
      </div>
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
