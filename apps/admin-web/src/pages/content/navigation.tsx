import { useEffect, useState } from 'react'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useDeleteNavigationItem,
  useNavigationItems,
  useSaveNavigationItem,
  useSaveSiteSetting,
  useSiteSettings,
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
  const { data: items = [], isLoading } = useNavigationItems()
  const { data: settings = [] } = useSiteSettings(['footer.social_links', 'footer.app_downloads', 'footer.follow_text', 'header.pro_cta'])
  const saveItem = useSaveNavigationItem()
  const deleteItem = useDeleteNavigationItem()
  const saveSetting = useSaveSiteSetting()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyItem)
  const [socialJson, setSocialJson] = useState('[]')
  const [appJson, setAppJson] = useState('[]')
  const [followText, setFollowText] = useState("Follow us we're friendly")
  const [proCtaJson, setProCtaJson] = useState(JSON.stringify({ href: '/become-100-handy-pro', label: 'Become a Pro' }, null, 2))

  const selectedItem = items.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedItem) {
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
  }, [selectedItem])

  useEffect(() => {
    const social = settings.find((setting) => setting.setting_key === 'footer.social_links')
    const app = settings.find((setting) => setting.setting_key === 'footer.app_downloads')
    const follow = settings.find((setting) => setting.setting_key === 'footer.follow_text')
    const cta = settings.find((setting) => setting.setting_key === 'header.pro_cta')
    setSocialJson(JSON.stringify(social?.value_json?.items ?? [], null, 2))
    setAppJson(JSON.stringify(app?.value_json?.items ?? [], null, 2))
    setFollowText(typeof follow?.value_json?.text === 'string' ? String(follow.value_json.text) : "Follow us we're friendly")
    setProCtaJson(JSON.stringify(cta?.value_json ?? { href: '/become-100-handy-pro', label: 'Become a Pro' }, null, 2))
  }, [settings])

  const handleSaveItem = async () => {
    await saveItem.mutateAsync({
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
    })
  }

  const handleSaveSettings = async () => {
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

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Navigation Menu Editor" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Navigation Items</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Header and footer links are now stored in the database.</p>
              </div>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
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
              ) : items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.location} / {item.audience} / {item.href}
                      {item.parent_id ? ' / child item' : ''}
                    </p>
                  </div>
                  <div className="space-x-4">
                    <button className="font-medium text-primary hover:underline" onClick={() => setSelectedId(item.id)}>Edit</button>
                    <button className="font-medium text-red-600 hover:underline" onClick={() => deleteItem.mutate(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedId ? 'Edit Navigation Item' : 'Create Navigation Item'}</h3>
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
              <button onClick={handleSaveItem} disabled={saveItem.isPending} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
                {saveItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Item
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Header/Footer Settings</h3>
            <JsonField label="Header Pro CTA JSON" value={proCtaJson} onChange={setProCtaJson} />
            <Field label="Footer Follow Text" value={followText} onChange={setFollowText} />
            <JsonField label="Footer Social Links JSON" value={socialJson} onChange={setSocialJson} />
            <JsonField label="Footer App Downloads JSON" value={appJson} onChange={setAppJson} />
            <div className="flex justify-end">
              <button onClick={handleSaveSettings} disabled={saveSetting.isPending} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
                {saveSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
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
