import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, Save, ExternalLink, Upload, Loader2, Check } from 'lucide-react'
import Header from '@/components/header'
import { pageRegistry } from '@/lib/cms/page-registry'
import { usePageContent, usePageRecord, usePageSeo, useSavePageContent, useSavePageSettings, uploadContentImage } from '@/lib/api/site-content'
import { useMediaAssets } from '@/lib/api/content-platform'
import type { FieldType } from '@/lib/cms/page-registry'

export default function PageEditorPage() {
  const { pageKey } = useParams<{ pageKey: string }>()
  const pageDef = pageKey ? pageRegistry[pageKey] : undefined
  const { data: savedContent, isLoading } = usePageContent(pageKey ?? '')
  const { data: pageRecord, isLoading: isPageLoading } = usePageRecord(pageKey ?? '')
  const { data: seoRecord, isLoading: isSeoLoading } = usePageSeo(pageKey ?? '')
  const { data: mediaAssets = [] } = useMediaAssets()
  const saveContentMutation = useSavePageContent()
  const saveSettingsMutation = useSavePageSettings()

  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [pageSlug, setPageSlug] = useState('')
  const [templateKey, setTemplateKey] = useState('standard')
  const [pageStatus, setPageStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')
  const [twitterTitle, setTwitterTitle] = useState('')
  const [twitterDescription, setTwitterDescription] = useState('')
  const [twitterImageUrl, setTwitterImageUrl] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)

  useEffect(() => {
    if (!pageDef) return
    const initial: Record<string, string> = {}
    const expanded: Record<string, boolean> = {}
    for (const [sectionKey, section] of Object.entries(pageDef.sections)) {
      expanded[sectionKey] = true
      for (const fieldKey of Object.keys(section.fields)) {
        const key = `${sectionKey}.${fieldKey}`
        const placeholder = section.fields[fieldKey]?.placeholder ?? ''
        initial[key] = savedContent?.[key] ?? placeholder
      }
    }
    setFormValues(initial)
    setExpandedSections(expanded)
  }, [pageDef, savedContent])

  useEffect(() => {
    if (!pageDef || !pageKey) return

    setPageTitle(pageRecord?.title ?? pageDef.label)
    setPageSlug(pageRecord?.slug ?? pageDef.slug)
    setTemplateKey(pageRecord?.template_key ?? 'standard')
    setPageStatus(pageRecord?.status ?? 'draft')

    setMetaTitle(seoRecord?.meta_title ?? '')
    setMetaDescription(seoRecord?.meta_description ?? '')
    setOgTitle(seoRecord?.og_title ?? '')
    setOgDescription(seoRecord?.og_description ?? '')
    setOgImageUrl(seoRecord?.og_image_url ?? '')
    setTwitterTitle(seoRecord?.twitter_title ?? '')
    setTwitterDescription(seoRecord?.twitter_description ?? '')
    setTwitterImageUrl(seoRecord?.twitter_image_url ?? '')
    setCanonicalUrl(seoRecord?.canonical_url ?? '')
    setRobotsIndex(seoRecord?.robots_index ?? true)
    setRobotsFollow(seoRecord?.robots_follow ?? true)
  }, [pageDef, pageKey, pageRecord, seoRecord])

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, file: File) => {
    if (!pageKey) return
    const url = await uploadContentImage(file, pageKey, key.replace('.', '-'))
    handleFieldChange(key, url)
  }

  const handleSave = async () => {
    if (!pageKey || !pageDef) return
    setSaveSuccess(false)

    const fields: Array<{ section_key: string; field_key: string; content_type: FieldType; value: string }> = []
    for (const [sectionKey, section] of Object.entries(pageDef.sections)) {
      for (const [fieldKey, fieldDef] of Object.entries(section.fields)) {
        const value = formValues[`${sectionKey}.${fieldKey}`] ?? ''
        fields.push({
          section_key: sectionKey,
          field_key: fieldKey,
          content_type: fieldDef.type,
          value,
        })
      }
    }

    await saveSettingsMutation.mutateAsync({
      pageKey,
      page: {
        title: pageTitle || pageDef.label,
        slug: pageSlug || pageDef.slug,
        template_key: templateKey || 'standard',
        status: pageStatus,
      },
      seo: {
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image_url: ogImageUrl,
        twitter_title: twitterTitle,
        twitter_description: twitterDescription,
        twitter_image_url: twitterImageUrl,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        robots_follow: robotsFollow,
      },
    })

    await saveContentMutation.mutateAsync({ pageKey, fields })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  if (!pageKey || !pageDef) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Page Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Page &quot;{pageKey}&quot; is not in the registry.</p>
            <Link to="/content/pages" className="text-primary hover:underline">Back to Pages</Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || isPageLoading || isSeoLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title={`Edit: ${pageDef.label}`} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Edit: ${pageDef.label}`} />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/content/pages" className="text-sm text-primary hover:underline">
              &larr; Back to Pages
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={`${import.meta.env.VITE_SITE_URL || ''}${pageSlug || pageDef.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
                View Page
              </a>
              <button
                onClick={handleSave}
                disabled={saveContentMutation.isPending || saveSettingsMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {saveContentMutation.isPending || saveSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Page Settings</h3>
              </div>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Page Title">
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Slug">
                  <input
                    type="text"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Template Key">
                  <input
                    type="text"
                    value={templateKey}
                    onChange={(e) => setTemplateKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    value={pageStatus}
                    onChange={(e) => setPageStatus(e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">SEO</h3>
              </div>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Meta Title">
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Canonical URL">
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Meta Description" className="md:col-span-2">
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </FormField>
                <FormField label="Open Graph Title">
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Open Graph Image URL">
                  <input
                    type="text"
                    value={ogImageUrl}
                    onChange={(e) => setOgImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Open Graph Description" className="md:col-span-2">
                  <textarea
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </FormField>
                <FormField label="Twitter Title">
                  <input
                    type="text"
                    value={twitterTitle}
                    onChange={(e) => setTwitterTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Twitter Image URL">
                  <input
                    type="text"
                    value={twitterImageUrl}
                    onChange={(e) => setTwitterImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormField>
                <FormField label="Twitter Description" className="md:col-span-2">
                  <textarea
                    value={twitterDescription}
                    onChange={(e) => setTwitterDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </FormField>
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={robotsIndex}
                      onChange={(e) => setRobotsIndex(e.target.checked)}
                    />
                    Index page
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={robotsFollow}
                      onChange={(e) => setRobotsFollow(e.target.checked)}
                    />
                    Follow links
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {Object.entries(pageDef.sections).map(([sectionKey, section]) => (
              <div
                key={sectionKey}
                className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {section.label}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections[sectionKey] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedSections[sectionKey] && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {Object.entries(section.fields).map(([fieldKey, fieldDef]) => {
                      const compositeKey = `${sectionKey}.${fieldKey}`
                      const value = formValues[compositeKey] ?? ''

                      return (
                        <div key={compositeKey}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {fieldDef.label}
                          </label>

                          {fieldDef.type === 'image_url' ? (
                            <ImageField
                              value={value}
                              onChange={(v) => handleFieldChange(compositeKey, v)}
                              onUpload={(file) => handleImageUpload(compositeKey, file)}
                              placeholder={fieldDef.placeholder}
                              mediaAssets={mediaAssets}
                            />
                          ) : fieldDef.type === 'rich_text' ? (
                            <textarea
                              value={value}
                              onChange={(e) => handleFieldChange(compositeKey, e.target.value)}
                              placeholder={fieldDef.placeholder}
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleFieldChange(compositeKey, e.target.value)}
                              placeholder={fieldDef.placeholder}
                              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function ImageField({
  value,
  onChange,
  onUpload,
  placeholder,
  mediaAssets,
}: {
  value: string
  onChange: (v: string) => void
  onUpload: (file: File) => Promise<void>
  placeholder?: string
  mediaAssets: Array<{ id: string; asset_type: string; asset_key: string; url: string; title?: string | null; alt_text?: string | null; active: boolean }>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [search, setSearch] = useState('')

  const filteredAssets = mediaAssets.filter((asset) => {
    if (asset.asset_type !== 'image' || !asset.active) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [asset.asset_key, asset.title ?? '', asset.alt_text ?? '', asset.url]
      .some((candidate) => candidate.toLowerCase().includes(q))
  })

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="w-full max-h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Image URL or upload'}
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary((prev) => !prev)}
          className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Library
        </button>
      </div>
      {showLibrary && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search image library..."
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-lg"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onChange(asset.url)
                  setShowLibrary(false)
                }}
                className="text-left rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:shadow-sm"
              >
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  <img src={asset.url} alt={asset.alt_text ?? asset.title ?? asset.asset_key} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{asset.asset_key}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{asset.title ?? asset.alt_text ?? asset.url}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
