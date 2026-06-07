import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ExternalLink, Film, Loader2, Plus, Save, Search } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { useAuth } from '@/contexts/AuthContext'
import { isValidUrl } from '@/lib/editor-validation'
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

const webMainCategoryKeys = [
  'Assembly',
  'Mounting',
  'Home Repairs',
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Moving',
  'Outdoor Help',
]

const webCategoryHeroKeys = [
  'furniture-assembly',
  'tv-wall-mounting',
  'home-repairs',
  'plumbing',
  'electrical',
  'cleaning',
  'packing-moving',
  'outdoor',
  'handyman',
]

const appCategoryImageKeys = [
  'assembly',
  'mounting',
  'home_repairs',
  'plumbing',
  'electrical',
  'cleaning',
  'moving',
  'outdoor_help',
]

type MediaAssetRecord = {
  id: string
  asset_key: string
  asset_type: 'image' | 'video' | 'document'
  url: string
  title: string | null
  alt_text: string | null
  tags: string[] | null
  usage_scope: 'shared' | 'web' | 'mobile' | 'admin'
  active: boolean
}

type BrandLogosState = {
  dark: string
  cream: string
  mobile_green: string
  mobile_cream: string
}

type ServiceImagesState = {
  hero: string
  mainCategoryImages: Record<string, string>
  categoryHeroImages: Record<string, string>
}

type AppBrandState = {
  greenLogo: string
  creamLogo: string
}

type AppWelcomeState = {
  logo: string
  backgroundImage: string
}

type AppOnboardingState = {
  avatarLukas: string
  avatarJana: string
}

type AppCategoryState = Record<string, string>

const defaultBrandLogos: BrandLogosState = {
  dark: '',
  cream: '',
  mobile_green: '',
  mobile_cream: '',
}

const defaultServiceImages: ServiceImagesState = {
  hero: '',
  mainCategoryImages: Object.fromEntries(webMainCategoryKeys.map((key) => [key, ''])),
  categoryHeroImages: Object.fromEntries(webCategoryHeroKeys.map((key) => [key, ''])),
}

const defaultAppBrand: AppBrandState = {
  greenLogo: '',
  creamLogo: '',
}

const defaultAppWelcome: AppWelcomeState = {
  logo: '',
  backgroundImage: '',
}

const defaultAppOnboarding: AppOnboardingState = {
  avatarLukas: '',
  avatarJana: '',
}

const defaultAppCategories: AppCategoryState = Object.fromEntries(appCategoryImageKeys.map((key) => [key, '']))

export default function MediaPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
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

  const [brandLogos, setBrandLogos] = useState<BrandLogosState>(defaultBrandLogos)
  const [serviceImages, setServiceImages] = useState<ServiceImagesState>(defaultServiceImages)
  const [appBrandImages, setAppBrandImages] = useState<AppBrandState>(defaultAppBrand)
  const [appWelcomeImages, setAppWelcomeImages] = useState<AppWelcomeState>(defaultAppWelcome)
  const [appOnboardingImages, setAppOnboardingImages] = useState<AppOnboardingState>(defaultAppOnboarding)
  const [appCategoryImages, setAppCategoryImages] = useState<AppCategoryState>(defaultAppCategories)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

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
    const readSetting = (key: string) => settings.find((setting) => setting.setting_key === key)?.value_json ?? {}

    const brand = readSetting('brand.logos') as Partial<BrandLogosState>
    setBrandLogos({
      ...defaultBrandLogos,
      ...coerceStringRecord(brand),
    })

    const services = readSetting('services.web_images') as Partial<ServiceImagesState>
    setServiceImages({
      hero: typeof services.hero === 'string' ? services.hero : '',
      mainCategoryImages: {
        ...defaultServiceImages.mainCategoryImages,
        ...coerceNestedStringRecord(services.mainCategoryImages),
      },
      categoryHeroImages: {
        ...defaultServiceImages.categoryHeroImages,
        ...coerceNestedStringRecord(services.categoryHeroImages),
      },
    })

    const appBrand = readSetting('app.images.brand') as Partial<AppBrandState>
    setAppBrandImages({
      ...defaultAppBrand,
      ...coerceStringRecord(appBrand),
    })

    const welcome = readSetting('app.images.welcome') as Partial<AppWelcomeState>
    setAppWelcomeImages({
      ...defaultAppWelcome,
      ...coerceStringRecord(welcome),
    })

    const onboarding = readSetting('app.images.onboarding') as Partial<AppOnboardingState>
    setAppOnboardingImages({
      ...defaultAppOnboarding,
      ...coerceStringRecord(onboarding),
    })

    const appCategories = readSetting('app.images.categories') as Record<string, unknown>
    setAppCategoryImages({
      ...defaultAppCategories,
      ...coerceStringRecord(appCategories),
    })
  }, [settings])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return media
    return media.filter((item) =>
      [item.asset_key, item.url, item.title ?? '', item.alt_text ?? '', ...(item.tags ?? [])]
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [media, search])

  const imageAssets = useMemo(
    () => filtered.filter((item): item is MediaAssetRecord => item.asset_type === 'image'),
    [filtered]
  )
  const assetErrors = {
    asset_key: !assetForm.asset_key.trim() ? 'Asset key is required.' : null,
    url: !assetForm.url.trim()
      ? 'Asset URL is required.'
      : !isValidUrl(assetForm.url.trim())
        ? 'Asset URL must be a valid absolute URL.'
        : null,
  }
  const canSaveAsset = canManageContent && !assetErrors.asset_key && !assetErrors.url

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Media Library" />
      <div className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl space-y-8">
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view media and image mappings, but it cannot change them.
            </div>
          )}
          {actionFeedback && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                actionFeedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
              }`}
            >
              {actionFeedback.message}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search media..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <button
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
              disabled={!canManageContent}
              onClick={() => {
                setSelectedId(null)
                setAssetForm(emptyAsset)
              }}
            >
              <Plus className="h-4 w-4" />
              New Asset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50">
                  {item.asset_type === 'image' ? (
                    <img src={item.url} alt={item.alt_text ?? item.title ?? item.asset_key} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <Film className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-xs text-white">
                    <p className="truncate font-medium">{item.asset_key}</p>
                    <div className="mt-1 flex justify-between">
                      <button onClick={() => setSelectedId(item.id)} className="underline">
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          deleteMedia.mutate(item.id, {
                            onSuccess: () =>
                              setActionFeedback({
                                tone: 'success',
                                message: `Deleted media asset "${item.asset_key}".`,
                              }),
                            onError: (error) =>
                              setActionFeedback({
                                tone: 'error',
                                message: error instanceof Error ? error.message : 'Failed to delete media asset.',
                              }),
                          })
                        }
                        className="text-red-300 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Panel title={selectedId ? 'Edit Media Asset' : 'Create Media Asset'}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Asset Key" value={assetForm.asset_key} onChange={(value) => setAssetForm((prev) => ({ ...prev, asset_key: value }))} />
              <FieldErrorText error={assetErrors.asset_key} />
              <Field label="URL" value={assetForm.url} onChange={(value) => setAssetForm((prev) => ({ ...prev, url: value }))} />
              <FieldErrorText error={assetErrors.url} />
              <Field label="Title" value={assetForm.title} onChange={(value) => setAssetForm((prev) => ({ ...prev, title: value }))} />
              <Field label="Alt Text" value={assetForm.alt_text} onChange={(value) => setAssetForm((prev) => ({ ...prev, alt_text: value }))} />
              <Field label="Tags (comma separated)" value={assetForm.tags} onChange={(value) => setAssetForm((prev) => ({ ...prev, tags: value }))} />
              <SelectField
                label="Asset Type"
                value={assetForm.asset_type}
                onChange={(value) => setAssetForm((prev) => ({ ...prev, asset_type: value as typeof prev.asset_type }))}
                options={['image', 'video', 'document']}
              />
              <SelectField
                label="Usage Scope"
                value={assetForm.usage_scope}
                onChange={(value) => setAssetForm((prev) => ({ ...prev, usage_scope: value as typeof prev.usage_scope }))}
                options={['shared', 'web', 'mobile', 'admin']}
              />
              <ToggleField label="Active" checked={assetForm.active} onChange={(checked) => setAssetForm((prev) => ({ ...prev, active: checked }))} />
            </div>
            <div className="flex justify-end pt-4">
              {assetForm.url && isValidUrl(assetForm.url) && (
                <a
                  href={assetForm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview Asset
                </a>
              )}
              <button
                onClick={() =>
                  saveMedia.mutate(
                    {
                      id: selected?.id,
                      asset_key: assetForm.asset_key,
                      asset_type: assetForm.asset_type,
                      url: assetForm.url,
                      title: assetForm.title,
                      alt_text: assetForm.alt_text,
                      tags: assetForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                      usage_scope: assetForm.usage_scope,
                      active: assetForm.active,
                    },
                    {
                      onSuccess: () =>
                        setActionFeedback({
                          tone: 'success',
                          message: selected ? `Updated media asset "${assetForm.asset_key}".` : `Created media asset "${assetForm.asset_key}".`,
                        }),
                      onError: (error) =>
                        setActionFeedback({
                          tone: 'error',
                          message: error instanceof Error ? error.message : 'Failed to save media asset.',
                        }),
                    },
                  )
                }
                disabled={saveMedia.isPending || !canSaveAsset}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {saveMedia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Asset
              </button>
            </div>
          </Panel>

          <Panel title="Web Brand Logos">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AssetPickerField label="Dark Logo" value={brandLogos.dark} assets={imageAssets} onChange={(value) => setBrandLogos((prev) => ({ ...prev, dark: value }))} />
              <AssetPickerField label="Cream Logo" value={brandLogos.cream} assets={imageAssets} onChange={(value) => setBrandLogos((prev) => ({ ...prev, cream: value }))} />
              <AssetPickerField label="Mobile Green Logo" value={brandLogos.mobile_green} assets={imageAssets} onChange={(value) => setBrandLogos((prev) => ({ ...prev, mobile_green: value }))} />
              <AssetPickerField label="Mobile Cream Logo" value={brandLogos.mobile_cream} assets={imageAssets} onChange={(value) => setBrandLogos((prev) => ({ ...prev, mobile_cream: value }))} />
            </div>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'brand',
                    setting_key: 'brand.logos',
                    value_json: brandLogos,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved brand logo settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save brand logo settings.',
                      }),
                  },
                )
              }
            />
          </Panel>

          <Panel title="Web Service Images">
            <div className="space-y-6">
              <AssetPickerField label="Services Hero Image" value={serviceImages.hero} assets={imageAssets} onChange={(value) => setServiceImages((prev) => ({ ...prev, hero: value }))} />

              <MappingEditor
                title="Main Category Card Images"
                mapping={serviceImages.mainCategoryImages}
                assets={imageAssets}
                onChange={(key, value) =>
                  setServiceImages((prev) => ({
                    ...prev,
                    mainCategoryImages: { ...prev.mainCategoryImages, [key]: value },
                  }))
                }
              />

              <MappingEditor
                title="Category Hero Images"
                mapping={serviceImages.categoryHeroImages}
                assets={imageAssets}
                onChange={(key, value) =>
                  setServiceImages((prev) => ({
                    ...prev,
                    categoryHeroImages: { ...prev.categoryHeroImages, [key]: value },
                  }))
                }
              />
            </div>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'services',
                    setting_key: 'services.web_images',
                    value_json: serviceImages,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved web service image settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save web service image settings.',
                      }),
                  },
                )
              }
            />
          </Panel>

          <Panel title="App Brand Images">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AssetPickerField label="Green Auth Logo" value={appBrandImages.greenLogo} assets={imageAssets} onChange={(value) => setAppBrandImages((prev) => ({ ...prev, greenLogo: value }))} />
              <AssetPickerField label="Cream Auth Logo" value={appBrandImages.creamLogo} assets={imageAssets} onChange={(value) => setAppBrandImages((prev) => ({ ...prev, creamLogo: value }))} />
            </div>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'app_images',
                    setting_key: 'app.images.brand',
                    value_json: appBrandImages,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved app brand image settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save app brand image settings.',
                      }),
                  },
                )
              }
            />
          </Panel>

          <Panel title="App Welcome Images">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AssetPickerField label="Welcome Logo" value={appWelcomeImages.logo} assets={imageAssets} onChange={(value) => setAppWelcomeImages((prev) => ({ ...prev, logo: value }))} />
              <AssetPickerField label="Welcome Background" value={appWelcomeImages.backgroundImage} assets={imageAssets} onChange={(value) => setAppWelcomeImages((prev) => ({ ...prev, backgroundImage: value }))} />
            </div>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'app_images',
                    setting_key: 'app.images.welcome',
                    value_json: appWelcomeImages,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved app welcome image settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save app welcome image settings.',
                      }),
                  },
                )
              }
            />
          </Panel>

          <Panel title="App Onboarding Images">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AssetPickerField label="Lukas Avatar" value={appOnboardingImages.avatarLukas} assets={imageAssets} onChange={(value) => setAppOnboardingImages((prev) => ({ ...prev, avatarLukas: value }))} />
              <AssetPickerField label="Jana Avatar" value={appOnboardingImages.avatarJana} assets={imageAssets} onChange={(value) => setAppOnboardingImages((prev) => ({ ...prev, avatarJana: value }))} />
            </div>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'app_images',
                    setting_key: 'app.images.onboarding',
                    value_json: appOnboardingImages,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved app onboarding image settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save app onboarding image settings.',
                      }),
                  },
                )
              }
            />
          </Panel>

          <Panel title="App Category Images">
            <MappingEditor
              title="Mobile Category Image Map"
              mapping={appCategoryImages}
              assets={imageAssets}
              onChange={(key, value) => setAppCategoryImages((prev) => ({ ...prev, [key]: value }))}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These are stored separately for the app and do not affect the website. Client home and service discovery screens read this mapping for mobile category imagery.
            </p>
            <SaveButton
              isPending={saveSetting.isPending}
              disabled={!canManageContent}
              onClick={() =>
                saveSetting.mutate(
                  {
                    setting_group: 'app_images',
                    setting_key: 'app.images.categories',
                    value_json: appCategoryImages,
                  },
                  {
                    onSuccess: () => setActionFeedback({ tone: 'success', message: 'Saved app category image settings.' }),
                    onError: (error) =>
                      setActionFeedback({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Failed to save app category image settings.',
                      }),
                  },
                )
              }
            />
          </Panel>
        </div>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/50">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900" />
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
  options: string[]
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 pt-8 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

function AssetPickerField({
  label,
  value,
  assets,
  onChange,
}: {
  label: string
  value: string
  assets: MediaAssetRecord[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        <option value="">No override</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.url}>
            {asset.asset_key}
          </option>
        ))}
      </select>
      {value ? <AssetPreview src={value} /> : <p className="text-xs text-gray-400">No image selected.</p>}
    </div>
  )
}

function MappingEditor({
  title,
  mapping,
  assets,
  onChange,
}: {
  title: string
  mapping: Record<string, string>
  assets: MediaAssetRecord[]
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(mapping).map(([key, value]) => (
          <AssetPickerField key={key} label={key} value={value} assets={assets} onChange={(next) => onChange(key, next)} />
        ))}
      </div>
    </div>
  )
}

function AssetPreview({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <img src={src} alt="" className="h-28 w-full object-cover" />
    </div>
  )
}

function SaveButton({ isPending, disabled = false, onClick }: { isPending: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button onClick={onClick} disabled={isPending || disabled} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Settings
      </button>
    </div>
  )
}

function coerceStringRecord(value: Record<string, unknown> | null | undefined) {
  const entries = Object.entries(value ?? {}).filter(([, entryValue]) => typeof entryValue === 'string')
  return Object.fromEntries(entries) as Record<string, string>
}

function coerceNestedStringRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return coerceStringRecord(value as Record<string, unknown>)
}
