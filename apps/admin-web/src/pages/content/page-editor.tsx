import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, Save, ExternalLink, Upload, Loader2, Check } from 'lucide-react'
import Header from '@/components/header'
import { pageRegistry } from '@/lib/cms/page-registry'
import { usePageContent, useSavePageContent, uploadContentImage } from '@/lib/api/site-content'
import type { FieldType } from '@/lib/cms/page-registry'

export default function PageEditorPage() {
  const { pageKey } = useParams<{ pageKey: string }>()
  const pageDef = pageKey ? pageRegistry[pageKey] : undefined
  const { data: savedContent, isLoading } = usePageContent(pageKey ?? '')
  const saveContentMutation = useSavePageContent()

  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  if (isLoading) {
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
                href={`${import.meta.env.VITE_SITE_URL || ''}${pageDef.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
                View Page
              </a>
              <button
                onClick={handleSave}
                disabled={saveContentMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {saveContentMutation.isPending ? (
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

function ImageField({
  value,
  onChange,
  onUpload,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onUpload: (file: File) => Promise<void>
  placeholder?: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      </div>
    </div>
  )
}
