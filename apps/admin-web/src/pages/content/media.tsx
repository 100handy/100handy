import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Film, Loader2, Plus, Save, Search } from 'lucide-react'
import Header from '@/components/header'
import {
  useDeleteMediaAsset,
  useMediaAssets,
  useSaveMediaAsset,
  useSaveSiteSetting,
  useSiteSettings,
} from '@/lib/api/content-platform'

const emptyAsset = {
  asset_key: '',
  asset_type: 'image' as const,
  url: '',
  title: '',
  alt_text: '',
  tags: '',
  usage_scope: 'shared' as const,
  active: true,
}

export default function MediaPage() {
  const { data: media = [], isLoading } = useMediaAssets()
  const { data: settings = [] } = useSiteSettings([
    'brand.logos',
    'services.web_images',
    'app.images.brand',
    'app.images.welcome',
    'app.images.onboarding',
    'app.images.categories',
  ])
  const saveMedia = useSaveMediaAsset()
  const deleteMedia = useDeleteMediaAsset()
  const saveSetting = useSaveSiteSetting()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [assetForm, setAssetForm] = useState(emptyAsset)
  const [brandLogosJson, setBrandLogosJson] = useState('{}')
  const [serviceImagesJson, setServiceImagesJson] = useState('{}')
  const [appBrandImagesJson, setAppBrandImagesJson] = useState('{}')
  const [appWelcomeImagesJson, setAppWelcomeImagesJson] = useState('{}')
  const [appOnboardingImagesJson, setAppOnboardingImagesJson] = useState('{}')
  const [appCategoryImagesJson, setAppCategoryImagesJson] = useState('{}')

  const selected = media.find((item) => item.id === selectedId) ?? null

  useEffect(() => {
    if (!selected) {
      setAssetForm(emptyAsset)
      return
    }
    setAssetForm({
      asset_key: selected.asset_key,
      asset_type: selected.asset_type,
      url: selected.url,
      title: selected.title ?? '',
      alt_text: selected.alt_text ?? '',
      tags: (selected.tags ?? []).join(', '),
      usage_scope: selected.usage_scope,
      active: selected.active,
    })
  }, [selected])

  useEffect(() => {
    const brandLogos = settings.find((setting) => setting.setting_key === 'brand.logos')
    const serviceImages = settings.find((setting) => setting.setting_key === 'services.web_images')
    const appBrandImages = settings.find((setting) => setting.setting_key === 'app.images.brand')
    const appWelcomeImages = settings.find((setting) => setting.setting_key === 'app.images.welcome')
    const appOnboardingImages = settings.find((setting) => setting.setting_key === 'app.images.onboarding')
    const appCategoryImages = settings.find((setting) => setting.setting_key === 'app.images.categories')
    setBrandLogosJson(JSON.stringify(brandLogos?.value_json ?? {}, null, 2))
    setServiceImagesJson(JSON.stringify(serviceImages?.value_json ?? {}, null, 2))
    setAppBrandImagesJson(JSON.stringify(appBrandImages?.value_json ?? {}, null, 2))
    setAppWelcomeImagesJson(JSON.stringify(appWelcomeImages?.value_json ?? {}, null, 2))
    setAppOnboardingImagesJson(JSON.stringify(appOnboardingImages?.value_json ?? {}, null, 2))
    setAppCategoryImagesJson(JSON.stringify(appCategoryImages?.value_json ?? {}, null, 2))
  }, [settings])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return media
    return media.filter((item) =>
      [item.asset_key, item.url, item.title ?? '', item.alt_text ?? '', ...(item.tags ?? [])]
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [media, search])

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Media Library" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
              onClick={() => {
                setSelectedId(null)
                setAssetForm(emptyAsset)
              }}
            >
              <Plus className="w-4 h-4" />
              New Asset
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : filtered.map((item) => (
              <div key={item.id} className="relative group aspect-square border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800/50">
                {item.asset_type === 'image' ? (
                  <img src={item.url} alt={item.alt_text ?? item.title ?? item.asset_key} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <Film className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-2 text-xs">
                  <p className="truncate font-medium">{item.asset_key}</p>
                  <div className="mt-1 flex justify-between">
                    <button onClick={() => setSelectedId(item.id)} className="underline">Edit</button>
                    <button onClick={() => deleteMedia.mutate(item.id)} className="underline text-red-300">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Panel title={selectedId ? 'Edit Media Asset' : 'Create Media Asset'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Asset Key" value={assetForm.asset_key} onChange={(value) => setAssetForm((prev) => ({ ...prev, asset_key: value }))} />
              <Field label="URL" value={assetForm.url} onChange={(value) => setAssetForm((prev) => ({ ...prev, url: value }))} />
              <Field label="Title" value={assetForm.title} onChange={(value) => setAssetForm((prev) => ({ ...prev, title: value }))} />
              <Field label="Alt Text" value={assetForm.alt_text} onChange={(value) => setAssetForm((prev) => ({ ...prev, alt_text: value }))} />
              <Field label="Tags (comma separated)" value={assetForm.tags} onChange={(value) => setAssetForm((prev) => ({ ...prev, tags: value }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Type</label>
                <select value={assetForm.asset_type} onChange={(e) => setAssetForm((prev) => ({ ...prev, asset_type: e.target.value as typeof prev.asset_type }))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                  <option value="image">image</option>
                  <option value="video">video</option>
                  <option value="document">document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usage Scope</label>
                <select value={assetForm.usage_scope} onChange={(e) => setAssetForm((prev) => ({ ...prev, usage_scope: e.target.value as typeof prev.usage_scope }))} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg">
                  <option value="shared">shared</option>
                  <option value="web">web</option>
                  <option value="mobile">mobile</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input type="checkbox" checked={assetForm.active} onChange={(e) => setAssetForm((prev) => ({ ...prev, active: e.target.checked }))} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => saveMedia.mutate({
                  id: selected?.id,
                  asset_key: assetForm.asset_key,
                  asset_type: assetForm.asset_type,
                  url: assetForm.url,
                  title: assetForm.title,
                  alt_text: assetForm.alt_text,
                  tags: assetForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                  usage_scope: assetForm.usage_scope,
                  active: assetForm.active,
                })}
                disabled={saveMedia.isPending}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {saveMedia.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Asset
              </button>
            </div>
          </Panel>

          <Panel title="Brand Logos">
            <JsonField label="brand.logos" value={brandLogosJson} onChange={setBrandLogosJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'brand',
                setting_key: 'brand.logos',
                value_json: JSON.parse(brandLogosJson),
              })}
            />
          </Panel>

          <Panel title="Service Web Images">
            <JsonField label="services.web_images" value={serviceImagesJson} onChange={setServiceImagesJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'services',
                setting_key: 'services.web_images',
                value_json: JSON.parse(serviceImagesJson),
              })}
            />
          </Panel>

          <Panel title="App Brand Images">
            <JsonField label="app.images.brand" value={appBrandImagesJson} onChange={setAppBrandImagesJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'app_images',
                setting_key: 'app.images.brand',
                value_json: JSON.parse(appBrandImagesJson),
              })}
            />
          </Panel>

          <Panel title="App Welcome Images">
            <JsonField label="app.images.welcome" value={appWelcomeImagesJson} onChange={setAppWelcomeImagesJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'app_images',
                setting_key: 'app.images.welcome',
                value_json: JSON.parse(appWelcomeImagesJson),
              })}
            />
          </Panel>

          <Panel title="App Onboarding Images">
            <JsonField label="app.images.onboarding" value={appOnboardingImagesJson} onChange={setAppOnboardingImagesJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'app_images',
                setting_key: 'app.images.onboarding',
                value_json: JSON.parse(appOnboardingImagesJson),
              })}
            />
          </Panel>

          <Panel title="App Category Images">
            <JsonField label="app.images.categories" value={appCategoryImagesJson} onChange={setAppCategoryImagesJson} />
            <SaveSettingButton
              isPending={saveSetting.isPending}
              onClick={() => saveSetting.mutate({
                setting_group: 'app_images',
                setting_key: 'app.images.categories',
                value_json: JSON.parse(appCategoryImagesJson),
              })}
            />
          </Panel>
        </div>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      {children}
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
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={12} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg font-mono text-xs" />
    </div>
  )
}

function SaveSettingButton({ isPending, onClick }: { isPending: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button onClick={onClick} disabled={isPending} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Settings
      </button>
    </div>
  )
}
