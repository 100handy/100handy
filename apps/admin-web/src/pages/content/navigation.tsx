import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Rocket, Save, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { useAuth } from '@/contexts/AuthContext'
import { isValidHref, safeParseJson } from '@/lib/editor-validation'
import {
  useDeleteNavigationItem,
  useLatestNavigationConfigDraft,
  useNavigationItems,
  useNavigationConfigRevisions,
  usePublishNavigationConfigDraft,
  useRestoreNavigationConfigRevision,
  useSaveNavigationConfigDraft,
  useSaveNavigationItem,
  useSaveSiteSetting,
  useSiteSettings,
  type NavigationItemInput,
} from '@/lib/api/content-platform'

const emptyItem = {
  nav_key: '',
  parent_id: '' as string | null,
  label: '',
  href: '',
  item_type: 'internal' as const,
  location: 'header' as const,
  audience: 'public' as const,
  sort_order: 0,
  visible: true,
}

export default function NavigationPage() {
  const CONFIG_KEY = 'global_navigation'
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
  const { data: items = [], isLoading } = useNavigationItems()
  const { data: settings = [] } = useSiteSettings(['footer.social_links', 'footer.app_downloads', 'footer.follow_text', 'header.pro_cta'])
  const saveItem = useSaveNavigationItem()
  const deleteItem = useDeleteNavigationItem()
  const saveSetting = useSaveSiteSetting()
  const saveDraft = useSaveNavigationConfigDraft()
  const publishDraft = usePublishNavigationConfigDraft()
  const restoreRevision = useRestoreNavigationConfigRevision()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyItem)
  const [draftItems, setDraftItems] = useState<NavigationItemInput[]>([])
  const [socialJson, setSocialJson] = useState('[]')
  const [appJson, setAppJson] = useState('[]')
  const [followText, setFollowText] = useState("Follow us we're friendly")
  const [proCtaJson, setProCtaJson] = useState(JSON.stringify({ href: '/become-100-handy-pro', label: 'Become a Pro' }, null, 2))
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const { data: latestDraft } = useLatestNavigationConfigDraft(CONFIG_KEY)
  const { data: revisions = [] } = useNavigationConfigRevisions(CONFIG_KEY)

  const effectiveItems = latestDraft?.items_json ?? items
  const selectedItem = effectiveItems.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    setDraftItems(Array.isArray(effectiveItems) ? effectiveItems : [])
  }, [effectiveItems])

  useEffect(() => {
    if (!selectedItem && !selectedId) {
      setForm(emptyItem)
      return
    }

    setForm({
      nav_key: selectedItem.nav_key,
      parent_id: selectedItem.parent_id,
      label: selectedItem.label,
      href: selectedItem.href,
      item_type: selectedItem.item_type,
      location: selectedItem.location,
      audience: selectedItem.audience,
      sort_order: selectedItem.sort_order,
      visible: selectedItem.visible,
    })
  }, [selectedItem, selectedId])

  useEffect(() => {
    const draftSettings = (latestDraft?.settings_json ?? {}) as Record<string, any>
    const social = draftSettings['footer.social_links'] ?? settings.find((setting) => setting.setting_key === 'footer.social_links')?.value_json ?? {}
    const app = draftSettings['footer.app_downloads'] ?? settings.find((setting) => setting.setting_key === 'footer.app_downloads')?.value_json ?? {}
    const follow = draftSettings['footer.follow_text'] ?? settings.find((setting) => setting.setting_key === 'footer.follow_text')?.value_json ?? {}
    const cta = draftSettings['header.pro_cta'] ?? settings.find((setting) => setting.setting_key === 'header.pro_cta')?.value_json ?? {}
    setSocialJson(JSON.stringify(social?.items ?? [], null, 2))
    setAppJson(JSON.stringify(app?.items ?? [], null, 2))
    setFollowText(typeof follow?.text === 'string' ? String(follow.text) : "Follow us we're friendly")
    setProCtaJson(JSON.stringify(cta ?? { href: '/become-100-handy-pro', label: 'Become a Pro' }, null, 2))
  }, [settings, latestDraft])

  const socialResult = useMemo(() => safeParseJson<Array<Record<string, unknown>>>(socialJson, 'Footer social links'), [socialJson])
  const appResult = useMemo(() => safeParseJson<Array<Record<string, unknown>>>(appJson, 'Footer app downloads'), [appJson])
  const proCtaResult = useMemo(() => safeParseJson<Record<string, unknown>>(proCtaJson, 'Header Pro CTA'), [proCtaJson])

  const navigationSettings = useMemo(() => ({
    'footer.social_links': { items: socialResult.value ?? [] },
    'footer.app_downloads': { items: appResult.value ?? [] },
    'footer.follow_text': { text: followText },
    'header.pro_cta': proCtaResult.value ?? {},
  }), [socialResult.value, appResult.value, followText, proCtaResult.value])

  const isDirty = useMemo(() => {
    if (!latestDraft) return false
    return JSON.stringify(draftItems) !== JSON.stringify(latestDraft.items_json ?? [])
      || JSON.stringify(navigationSettings) !== JSON.stringify(latestDraft.settings_json ?? {})
  }, [draftItems, navigationSettings, latestDraft])

  useUnsavedChangesWarning(isDirty)
  const displayedItems = latestDraft ? draftItems : items

  const itemErrors = useMemo(() => {
    const errors: string[] = []
    const navKey = form.nav_key.trim()
    const label = form.label.trim()
    const href = form.href.trim()

    if (!navKey) errors.push('Unique key is required.')
    if (!label) errors.push('Label is required.')
    if (!href) errors.push('Href is required.')
    if (href && !isValidHref(href)) errors.push('Href must start with "/" or "http(s)://".')

    const duplicate = displayedItems.find((item) => item.nav_key === navKey && item.id !== selectedItem?.id)
    if (navKey && duplicate) errors.push('Unique key must not duplicate another navigation item.')

    return errors
  }, [form.nav_key, form.label, form.href, displayedItems, selectedItem?.id])

  const settingsErrors = useMemo(() => {
    const errors: string[] = []
    if (socialResult.error) errors.push(socialResult.error)
    if (appResult.error) errors.push(appResult.error)
    if (proCtaResult.error) errors.push(proCtaResult.error)

    const ctaValue = proCtaResult.value
    if (ctaValue && typeof ctaValue === 'object') {
      const href = typeof ctaValue.href === 'string' ? ctaValue.href : ''
      const label = typeof ctaValue.label === 'string' ? ctaValue.label : ''
      if (href && !isValidHref(href)) errors.push('Header Pro CTA href must start with "/" or "http(s)://".')
      if (href && !label.trim()) errors.push('Header Pro CTA label is required when a href is set.')
    }

    return errors
  }, [socialResult.error, appResult.error, proCtaResult.error, proCtaResult.value])

  const canSaveItem = canManageContent && itemErrors.length === 0
  const canSaveSettings = canManageContent && settingsErrors.length === 0
  const canSaveDraft = canManageContent && settingsErrors.length === 0
  const canPublish = canManageContent && settingsErrors.length === 0 && !!latestDraft

  const handleSaveItem = async () => {
    if (!canSaveItem) return
    const nextItem = {
      id: selectedItem?.id,
      nav_key: form.nav_key,
      parent_id: form.parent_id || null,
      label: form.label,
      href: form.href,
      item_type: form.item_type,
      location: form.location,
      audience: form.audience,
      sort_order: Number(form.sort_order) || 0,
      visible: form.visible,
    }

    if (latestDraft) {
      setDraftItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === selectedItem?.id || item.nav_key === nextItem.nav_key)
        if (existingIndex >= 0) {
          const next = [...prev]
          next[existingIndex] = { ...next[existingIndex], ...nextItem }
          return next
        }
        return [...prev, { ...nextItem, id: nextItem.id ?? `draft-${crypto.randomUUID()}` }]
      })
      return
    }

    await saveItem.mutateAsync(nextItem)
  }

  const handleSaveSettings = async () => {
    if (!canSaveSettings) return
    if (latestDraft) return
    await Promise.all([
      saveSetting.mutateAsync({
        setting_group: 'footer',
        setting_key: 'footer.social_links',
        value_json: { items: JSON.parse(socialJson) },
      }),
      saveSetting.mutateAsync({
        setting_group: 'footer',
        setting_key: 'footer.app_downloads',
        value_json: { items: JSON.parse(appJson) },
      }),
      saveSetting.mutateAsync({
        setting_group: 'footer',
        setting_key: 'footer.follow_text',
        value_json: { text: followText },
      }),
      saveSetting.mutateAsync({
        setting_group: 'header',
        setting_key: 'header.pro_cta',
        value_json: JSON.parse(proCtaJson),
      }),
    ])
  }

  const handleSaveDraft = async () => {
    if (!canSaveDraft) return
    setActionFeedback(null)
    await saveDraft.mutateAsync({
      configKey: CONFIG_KEY,
      items: draftItems,
      settings: navigationSettings,
    })
    setActionFeedback('Draft saved')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const handlePublish = async () => {
    if (!canPublish) return
    setActionFeedback(null)
    await publishDraft.mutateAsync(CONFIG_KEY)
    setActionFeedback('Published')
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const moveItem = async (itemId: string, direction: 'up' | 'down') => {
    const sorted = [...displayedItems].sort((a, b) => a.sort_order - b.sort_order)
    const index = sorted.findIndex((item) => item.id === itemId)
    if (index === -1) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= sorted.length) return

    const current = sorted[index]
    const target = sorted[swapIndex]

    if (latestDraft) {
      setDraftItems((prev) =>
        prev.map((item) => {
          if (item.id === current.id) return { ...item, sort_order: target.sort_order }
          if (item.id === target.id) return { ...item, sort_order: current.sort_order }
          return item
        }),
      )
      return
    }

    await Promise.all([
      saveItem.mutateAsync({ ...current, sort_order: target.sort_order }),
      saveItem.mutateAsync({ ...target, sort_order: current.sort_order }),
    ])
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Navigation Menu Editor" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto space-y-8">
          <UnsavedChangesBanner show={isDirty} />
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              You can view navigation data, but your admin role cannot change it.
            </div>
          )}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Navigation and linked header/footer settings now use a draft workflow before they go live.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Live: <span className="font-semibold text-gray-900 dark:text-white">active</span>
                {' · '}
                Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
              </div>
            </div>
            {actionFeedback && <p className="mt-3 text-sm font-medium text-emerald-600">{actionFeedback}</p>}
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Navigation Items</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Header and footer links are now stored in the database.</p>
              </div>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
                disabled={!canManageContent}
                onClick={() => {
                  setSelectedId(null)
                  setForm(emptyItem)
                }}
              >
                <Plus className="w-4 h-4" />
                New Item
              </button>
            </div>
            <div className="p-6 space-y-3">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : displayedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.location} / {item.audience} / {item.href}
                      {item.parent_id ? ' / child item' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border border-gray-200 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300"
                      onClick={() => moveItem(item.id!, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-gray-200 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300"
                      onClick={() => moveItem(item.id!, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button className="font-medium text-primary hover:underline" onClick={() => setSelectedId(item.id)}>Edit</button>
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => {
                        if (latestDraft) {
                          setDraftItems((prev) => prev.filter((row) => row.id !== item.id))
                          if (selectedId === item.id) {
                            setSelectedId(null)
                            setForm(emptyItem)
                          }
                          return
                        }
                        deleteItem.mutate(item.id)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedId ? 'Edit Navigation Item' : 'Create Navigation Item'}</h3>
            {itemErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {itemErrors.map((error) => <div key={error}>{error}</div>)}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Unique Key" value={form.nav_key} onChange={(value) => setForm((prev) => ({ ...prev, nav_key: value }))} />
              <Field label="Parent ID" value={form.parent_id ?? ''} onChange={(value) => setForm((prev) => ({ ...prev, parent_id: value || null }))} />
              <Field label="Label" value={form.label} onChange={(value) => setForm((prev) => ({ ...prev, label: value }))} />
              <Field label="Href" value={form.href} onChange={(value) => setForm((prev) => ({ ...prev, href: value }))} />
              <Field label="Sort Order" value={String(form.sort_order)} onChange={(value) => setForm((prev) => ({ ...prev, sort_order: Number(value) || 0 }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <select value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value as typeof prev.location }))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                  <option value="header">header</option>
                  <option value="footer">footer</option>
                  <option value="support">support</option>
                  <option value="account">account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audience</label>
                <select value={form.audience} onChange={(e) => setForm((prev) => ({ ...prev, audience: e.target.value as typeof prev.audience }))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                  <option value="public">public</option>
                  <option value="client">client</option>
                  <option value="professional">professional</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Type</label>
                <select value={form.item_type} onChange={(e) => setForm((prev) => ({ ...prev, item_type: e.target.value as typeof prev.item_type }))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                  <option value="internal">internal</option>
                  <option value="external">external</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Visible</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveItem} disabled={saveItem.isPending || !canSaveItem} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
                {saveItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {latestDraft ? 'Update Draft Item' : 'Save Item'}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Header/Footer Settings</h3>
            {settingsErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {settingsErrors.map((error) => <div key={error}>{error}</div>)}
              </div>
            )}
            <JsonField label="Header Pro CTA JSON" value={proCtaJson} onChange={setProCtaJson} />
            <Field label="Footer Follow Text" value={followText} onChange={setFollowText} />
            <JsonField label="Footer Social Links JSON" value={socialJson} onChange={setSocialJson} />
            <JsonField label="Footer App Downloads JSON" value={appJson} onChange={setAppJson} />
            <div className="flex justify-end">
              <button onClick={handleSaveSettings} disabled={saveSetting.isPending || !canSaveSettings} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
                {saveSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {latestDraft ? 'Settings live from draft workflow below' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleSaveDraft}
                disabled={saveDraft.isPending || publishDraft.isPending || !canSaveDraft}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saveDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : actionFeedback === 'Draft saved' ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {actionFeedback === 'Draft saved' ? 'Draft Saved' : 'Save Draft'}
              </button>
              <button
                onClick={handlePublish}
                disabled={publishDraft.isPending || saveDraft.isPending || !canPublish}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {publishDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : actionFeedback === 'Published' ? <Check className="h-4 w-4" /> : <Rocket className="h-4 w-4" />}
                {actionFeedback === 'Published' ? 'Published' : 'Publish'}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revision History</h3>
              <div className="mt-3 space-y-3">
                {revisions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No revisions yet.</p>
                ) : revisions.map((revision) => (
                  <div key={revision.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        v{revision.version_number} · {revision.revision_state}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(revision.updated_at).toLocaleString()}
                      </p>
                    </div>
                    {revision.revision_state === 'published' && (
                      <button
                        onClick={() => restoreRevision.mutate({ configKey: CONFIG_KEY, revisionId: revision.id })}
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
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg" />
    </div>
  )
}

function JsonField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={8} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg font-mono text-xs" />
    </div>
  )
}
