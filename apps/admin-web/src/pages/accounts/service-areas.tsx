import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, Loader2, MapPinned, Plus, UserPlus } from 'lucide-react'
import Header from '@/components/header'
import {
  useAssignProviderToServiceArea,
  useBulkImportLocationAreas,
  useLocationAreas,
  useProviderCandidates,
  useRemoveProviderFromServiceArea,
  useSaveLocationArea,
  useSaveServiceArea,
  useServiceAreaAssignments,
  useServiceAreaHealthWarnings,
  useServiceAreaOverlapCheck,
  useServiceAreas,
  useToggleLocationArea,
  type LocationAreaNode,
} from '@/lib/api/locations'

export default function ServiceAreasPage() {
  const [activePanel, setActivePanel] = useState<'uk_areas' | 'service_areas'>('service_areas')
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedLocationAreaId, setSelectedLocationAreaId] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [postcodePrefix, setPostcodePrefix] = useState('')
  const [notes, setNotes] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [locationName, setLocationName] = useState('')
  const [locationSlug, setLocationSlug] = useState('')
  const [locationNotes, setLocationNotes] = useState('')
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [locationAreaType, setLocationAreaType] = useState<LocationAreaNode['areaType']>('city')
  const [locationParentId, setLocationParentId] = useState<string | null>(null)
  const [locationSortOrder, setLocationSortOrder] = useState(0)
  const [bulkImportParentId, setBulkImportParentId] = useState<string>('')
  const [bulkImportAreaType, setBulkImportAreaType] = useState<LocationAreaNode['areaType']>('postcode_district')
  const [bulkImportText, setBulkImportText] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [locationTypeFilter, setLocationTypeFilter] = useState<'all' | LocationAreaNode['areaType']>('all')
  const [locationStatusFilter, setLocationStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [serviceAreaCityScope, setServiceAreaCityScope] = useState<string>('all')
  const [serviceAreaBoroughScope, setServiceAreaBoroughScope] = useState<string>('all')
  const [serviceAreaSearch, setServiceAreaSearch] = useState('')
  const [serviceAreaStatusFilter, setServiceAreaStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const { data: areas = [], isLoading, error } = useServiceAreas()
  const { data: locationAreas = [], isLoading: locationAreasLoading, error: locationAreasError } = useLocationAreas()
  const { data: healthWarnings = [] } = useServiceAreaHealthWarnings()
  const { data: assignments = [], isLoading: assignmentsLoading } = useServiceAreaAssignments(selectedAreaId)
  const { data: candidates = [] } = useProviderCandidates(selectedAreaId)
  const { data: overlapWarnings = [] } = useServiceAreaOverlapCheck(postcodePrefix, selectedAreaId)
  const saveArea = useSaveServiceArea()
  const saveLocationArea = useSaveLocationArea()
  const bulkImportLocationAreas = useBulkImportLocationAreas()
  const toggleLocationArea = useToggleLocationArea()
  const assignProvider = useAssignProviderToServiceArea()
  const removeProvider = useRemoveProviderFromServiceArea()

  const selectedArea = useMemo(() => areas.find((area) => area.id === selectedAreaId) || null, [areas, selectedAreaId])
  const selectedLocationArea = useMemo(
    () => locationAreas.find((area) => area.id === selectedLocationAreaId) || null,
    [locationAreas, selectedLocationAreaId],
  )
  const locationOptions = useMemo(
    () => locationAreas.map((area) => ({ id: area.id, label: `${area.name} (${area.areaType})` })),
    [locationAreas],
  )
  const importParentOptions = useMemo(
    () =>
      locationAreas
        .filter((area) => area.areaType === 'nation' || area.areaType === 'region' || area.areaType === 'city' || area.areaType === 'borough' || area.areaType === 'postcode_area')
        .map((area) => ({ id: area.id, label: `${area.name} (${area.areaType})`, areaType: area.areaType })),
    [locationAreas],
  )
  const locationTree = useMemo(() => buildLocationTree(locationAreas), [locationAreas])
  const locationAreaMap = useMemo(() => new Map(locationAreas.map((area) => [area.id, area])), [locationAreas])
  const londonBoroughs = useMemo(
    () =>
      locationAreas
        .filter((area) => area.areaType === 'borough' && area.parentId === 'loc_london_city')
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [locationAreas],
  )
  const filteredLocationTree = useMemo(
    () => filterLocationTree(locationTree, locationSearch, locationTypeFilter, locationStatusFilter),
    [locationTree, locationSearch, locationTypeFilter, locationStatusFilter],
  )
  const filteredServiceAreas = useMemo(() => {
    const query = serviceAreaSearch.trim().toLowerCase()
    return areas.filter((area) => {
      const matchesCity = serviceAreaCityScope === 'all' || area.city === serviceAreaCityScope
      const matchesBorough =
        serviceAreaBoroughScope === 'all' ||
        !area.locationAreaId
          ? serviceAreaBoroughScope === 'all'
          : isWithinLocationArea(area.locationAreaId, serviceAreaBoroughScope, locationAreaMap)
      const matchesSearch =
        !query ||
        area.city.toLowerCase().includes(query) ||
        area.postcodePrefix.toLowerCase().includes(query)
      const matchesStatus =
        serviceAreaStatusFilter === 'all' ||
        (serviceAreaStatusFilter === 'enabled' ? area.enabled : !area.enabled)
      return matchesCity && matchesBorough && matchesSearch && matchesStatus
    })
  }, [areas, locationAreaMap, serviceAreaBoroughScope, serviceAreaCityScope, serviceAreaSearch, serviceAreaStatusFilter])
  const currentScopedBorough = useMemo(
    () => londonBoroughs.find((borough) => borough.id === serviceAreaBoroughScope) || null,
    [londonBoroughs, serviceAreaBoroughScope],
  )
  const serviceAreaCities = useMemo(
    () => Array.from(new Set(areas.map((area) => area.city))).sort((a, b) => a.localeCompare(b)),
    [areas],
  )
  const scopedHealthWarnings = useMemo(() => {
    let warnings = healthWarnings
    if (serviceAreaCityScope !== 'all') {
      warnings = warnings.filter((warning) => warning.city === serviceAreaCityScope)
    }
    if (serviceAreaBoroughScope !== 'all') {
      const serviceAreaMap = new Map(areas.map((area) => [area.id, area]))
      warnings = warnings.filter((warning) => {
        const serviceArea = serviceAreaMap.get(warning.serviceAreaId)
        if (!serviceArea?.locationAreaId) return false
        return isWithinLocationArea(serviceArea.locationAreaId, serviceAreaBoroughScope, locationAreaMap)
      })
    }
    return warnings
  }, [areas, healthWarnings, locationAreaMap, serviceAreaBoroughScope, serviceAreaCityScope])
  const locationOverview = useMemo(() => {
    const enabledLocationAreas = locationAreas.filter((area) => area.enabled).length
    const enabledServiceAreas = areas.filter((area) => area.enabled).length
    const activeAssignments = areas.reduce((sum, area) => sum + area.activeAssignedProviders, 0)
    return {
      locationAreas: locationAreas.length,
      enabledLocationAreas,
      serviceAreas: areas.length,
      enabledServiceAreas,
      activeAssignments,
      warnings: healthWarnings.length,
    }
  }, [areas, healthWarnings.length, locationAreas])

  useEffect(() => {
    if (serviceAreaCities.length === 0) return

    if (serviceAreaCityScope !== 'all' && serviceAreaCities.includes(serviceAreaCityScope)) return

    if (serviceAreaCities.includes('London')) {
      setServiceAreaCityScope('London')
      return
    }

    setServiceAreaCityScope(serviceAreaCities[0])
  }, [serviceAreaCities, serviceAreaCityScope])

  useEffect(() => {
    if (serviceAreaCityScope !== 'London') {
      if (serviceAreaBoroughScope !== 'all') {
        setServiceAreaBoroughScope('all')
      }
      return
    }

    if (
      serviceAreaBoroughScope !== 'all' &&
      londonBoroughs.some((borough) => borough.id === serviceAreaBoroughScope)
    ) {
      return
    }

    setServiceAreaBoroughScope('all')
  }, [londonBoroughs, serviceAreaBoroughScope, serviceAreaCityScope])

  function startCreate() {
    setSelectedAreaId(null)
    setCity(serviceAreaCityScope === 'all' ? '' : serviceAreaCityScope)
    setPostcodePrefix('')
    setNotes('')
    setEnabled(true)
    setSelectedLocationAreaId(serviceAreaCityScope === 'London' && serviceAreaBoroughScope !== 'all' ? serviceAreaBoroughScope : null)
  }

  function startCreateLocationArea(parentId?: string | null) {
    setSelectedLocationAreaId(null)
    setLocationName('')
    setLocationSlug('')
    setLocationNotes('')
    setLocationEnabled(true)
    setLocationAreaType('city')
    setLocationParentId(parentId ?? null)
    setLocationSortOrder(0)
  }

  function editArea(id: string) {
    const area = areas.find((item) => item.id === id)
    if (!area) return
    setSelectedAreaId(area.id)
    setCity(area.city)
    setPostcodePrefix(area.postcodePrefix)
    setNotes(area.notes || '')
    setEnabled(area.enabled)
    setSelectedLocationAreaId(area.locationAreaId || null)
  }

  function editLocationArea(id: string) {
    const area = locationAreas.find((item) => item.id === id)
    if (!area) return
    setSelectedLocationAreaId(area.id)
    setLocationName(area.name)
    setLocationSlug(area.slug)
    setLocationNotes(area.notes || '')
    setLocationEnabled(area.enabled)
    setLocationAreaType(area.areaType)
    setLocationParentId(area.parentId)
    setLocationSortOrder(area.sortOrder)
  }

  async function handleSave() {
    if (!city.trim() || !postcodePrefix.trim()) return
    try {
      const id = await saveArea.mutateAsync({
        id: selectedAreaId || undefined,
        city: city.trim(),
        postcodePrefix: postcodePrefix.trim(),
        enabled,
        notes,
        locationAreaId: selectedLocationAreaId,
      })
      setSelectedAreaId(id)
      setActionFeedback({ tone: 'success', message: `Saved service area ${city.trim()} (${postcodePrefix.trim()}).` })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to save service area.',
      })
    }
  }

  async function handleSaveLocationArea() {
    if (!locationName.trim() || !locationSlug.trim()) return
    try {
      const id = await saveLocationArea.mutateAsync({
        id: selectedLocationAreaId || undefined,
        name: locationName,
        slug: locationSlug,
        areaType: locationAreaType,
        parentId: locationParentId,
        enabled: locationEnabled,
        sortOrder: locationSortOrder,
        notes: locationNotes,
      })
      setSelectedLocationAreaId(id)
      setActionFeedback({ tone: 'success', message: `Saved location area ${locationName.trim()}.` })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to save location area.',
      })
    }
  }

  async function handleBulkImport() {
    if (!bulkImportParentId || !bulkImportText.trim()) return

    const rows = bulkImportText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [namePart, slugPart, notesPart] = line.split(',').map((part) => part.trim())
        const name = namePart || ''
        const slug = (slugPart || namePart || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return {
          name,
          slug,
          notes: notesPart || null,
        }
      })

    try {
      await bulkImportLocationAreas.mutateAsync({
        parentId: bulkImportParentId,
        areaType: bulkImportAreaType,
        rows,
      })
      setBulkImportText('')
      setActionFeedback({
        tone: 'success',
        message: `Imported ${rows.length} location area${rows.length === 1 ? '' : 's'} successfully.`,
      })
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to bulk import location areas.',
      })
    }
  }

  const selectedImportParent = useMemo(
    () => locationAreas.find((area) => area.id === bulkImportParentId) || null,
    [bulkImportParentId, locationAreas],
  )

  const allowedBulkImportTypes = useMemo(() => {
    switch (selectedImportParent?.areaType) {
      case 'nation':
        return ['region', 'city', 'postcode_area'] as Array<LocationAreaNode['areaType']>
      case 'region':
        return ['city', 'postcode_area'] as Array<LocationAreaNode['areaType']>
      case 'city':
        return ['borough', 'postcode_area', 'postcode_district'] as Array<LocationAreaNode['areaType']>
      case 'borough':
        return ['postcode_area', 'postcode_district'] as Array<LocationAreaNode['areaType']>
      case 'postcode_area':
        return ['postcode_district'] as Array<LocationAreaNode['areaType']>
      default:
        return ['postcode_district'] as Array<LocationAreaNode['areaType']>
    }
  }, [selectedImportParent])

  const bulkImportPreviewCount = useMemo(
    () => bulkImportText.split('\n').map((line) => line.trim()).filter(Boolean).length,
    [bulkImportText],
  )

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Locations & Service Areas" />

      <main className="grid flex-1 gap-6 p-6 xl:grid-cols-[1.1fr,1fr]">
        <section className="space-y-6">
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
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Location overview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Quick view of the areas you are actively managing right now.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activePanel === 'service_areas' ? (
                <>
                  <CoverageStat label="Service areas" value={String(locationOverview.serviceAreas)} />
                  <CoverageStat label="Live service areas" value={String(locationOverview.enabledServiceAreas)} />
                  <CoverageStat label="Assigned providers" value={String(locationOverview.activeAssignments)} />
                  <CoverageStat label="Needs attention" value={String(locationOverview.warnings)} />
                </>
              ) : (
                <>
                  <CoverageStat label="UK areas" value={String(locationOverview.locationAreas)} />
                  <CoverageStat label="Live UK areas" value={String(locationOverview.enabledLocationAreas)} />
                  <CoverageStat label="Service areas linked" value={String(locationOverview.serviceAreas)} />
                  <CoverageStat label="Needs attention" value={String(locationOverview.warnings)} />
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Needs attention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enabled areas without active providers, or disabled areas still carrying assignments.</p>
            </div>

                {scopedHealthWarnings.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-4 py-6 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300">
                    {serviceAreaCityScope === 'all' ? 'No location coverage warnings right now.' : `No warnings for ${serviceAreaCityScope} right now.`}
                  </div>
                ) : (
                  <div className="space-y-3">
                {scopedHealthWarnings.map((warning) => (
                  <button
                    key={`${warning.type}-${warning.serviceAreaId}`}
                    type="button"
                    onClick={() => editArea(warning.serviceAreaId)}
                    className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left dark:border-amber-900/60 dark:bg-amber-950/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-amber-900 dark:text-amber-200">
                          {warning.city} ({warning.postcodePrefix})
                        </div>
                        <div className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                          {warning.type === 'enabled_without_active_providers'
                            ? `Enabled area with no active assigned providers. ${warning.assignedProviders} total assignment${warning.assignedProviders === 1 ? '' : 's'}, ${warning.activeAssignedProviders} active.`
                            : `Disabled area still has ${warning.assignedProviders} assigned provider${warning.assignedProviders === 1 ? '' : 's'}.`}
                        </div>
                      </div>
                      <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-slate-950/50 dark:text-amber-300">
                        Review
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActivePanel('service_areas')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activePanel === 'service_areas'
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                Service areas
              </button>
              <button
                type="button"
                onClick={() => setActivePanel('uk_areas')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activePanel === 'uk_areas'
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                UK areas
              </button>
            </div>

            {activePanel === 'uk_areas' ? (
              <>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">UK areas</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Turn coverage on or off and maintain the location hierarchy.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startCreateLocationArea('loc_uk')}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                    New area
                  </button>
                </div>

                {locationAreasError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                    {locationAreasError instanceof Error ? locationAreasError.message : 'Failed to load UK location hierarchy.'}
                  </div>
                )}

                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <input
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search area or slug"
                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                  />
                  <div className="relative">
                    <select
                      value={locationTypeFilter}
                      onChange={(e) => setLocationTypeFilter(e.target.value as 'all' | LocationAreaNode['areaType'])}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="all">All area types</option>
                      <option value="country">Country</option>
                      <option value="nation">Nation</option>
                      <option value="region">Region</option>
                      <option value="city">City</option>
                      <option value="borough">Borough</option>
                      <option value="postcode_area">Postcode area</option>
                      <option value="postcode_district">Postcode district</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={locationStatusFilter}
                      onChange={(e) => setLocationStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled')}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="all">All statuses</option>
                      <option value="enabled">Enabled only</option>
                      <option value="disabled">Disabled only</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  {locationAreasLoading ? (
                    <div className="py-10 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredLocationTree.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      No UK areas match the current filters.
                    </div>
                  ) : (
                    filteredLocationTree.map((node) => (
                      <LocationAreaTreeRow
                        key={node.id}
                        node={node}
                        level={0}
                        onEdit={editLocationArea}
                        onCreateChild={(parentId, nextType) => {
                          startCreateLocationArea(parentId)
                          setLocationAreaType(nextType)
                        }}
                        onToggle={(id, nextEnabled) =>
                          toggleLocationArea.mutate(
                            { id, enabled: nextEnabled },
                            {
                              onSuccess: () =>
                                setActionFeedback({
                                  tone: 'success',
                                  message: `Location area turned ${nextEnabled ? 'on' : 'off'} successfully.`,
                                }),
                              onError: (error) =>
                                setActionFeedback({
                                  tone: 'error',
                                  message: error instanceof Error ? error.message : 'Failed to update location area state.',
                                }),
                            },
                          )
                        }
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Service areas</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Start with one city, then manage its postcode prefixes and provider coverage.</p>
                    {serviceAreaCityScope === 'London' && currentScopedBorough ? (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                        Currently scoped to <span className="font-medium text-slate-900 dark:text-white">{currentScopedBorough.name}</span> only.
                        This does not automatically include neighbouring boroughs.
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={startCreate}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                    New area
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                    {error instanceof Error ? error.message : 'Failed to load service areas.'}
                  </div>
                )}

                <div className="mb-4 grid gap-3 md:grid-cols-4">
                  <div className="relative">
                    <select
                      value={serviceAreaCityScope}
                      onChange={(e) => setServiceAreaCityScope(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="all">All launch cities</option>
                      {serviceAreaCities.map((cityOption) => (
                        <option key={cityOption} value={cityOption}>
                          {cityOption}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  {serviceAreaCityScope === 'London' ? (
                    <div className="relative">
                      <select
                        value={serviceAreaBoroughScope}
                        onChange={(e) => setServiceAreaBoroughScope(e.target.value)}
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="all">All London boroughs</option>
                        {londonBoroughs.map((borough) => (
                          <option key={borough.id} value={borough.id}>
                            {borough.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  ) : null}
                  <input
                    value={serviceAreaSearch}
                    onChange={(e) => setServiceAreaSearch(e.target.value)}
                    placeholder="Search city or postcode prefix"
                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                  />
                  <div className="relative">
                    <select
                      value={serviceAreaStatusFilter}
                      onChange={(e) => setServiceAreaStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled')}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="all">All statuses</option>
                      <option value="enabled">Enabled only</option>
                      <option value="disabled">Disabled only</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                      <tr>
                        <th className="px-5 py-3">City</th>
                        <th className="px-5 py-3">Borough</th>
                        <th className="px-5 py-3">Postcode</th>
                        <th className="px-5 py-3">Linked area</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Providers</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                          </td>
                        </tr>
                      ) : areas.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                            No service areas configured yet.
                          </td>
                        </tr>
                      ) : filteredServiceAreas.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                            No service areas match the current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredServiceAreas.map((area) => (
                          <tr key={area.id} className="border-t border-slate-200 dark:border-slate-800">
                            <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{area.city}</td>
                            <td className="px-5 py-4">
                              {area.locationAreaId
                                ? findNearestBoroughName(area.locationAreaId, locationAreaMap)
                                : <span className="text-slate-500 dark:text-slate-400">Not set</span>}
                            </td>
                            <td className="px-5 py-4">{area.postcodePrefix}</td>
                            <td className="px-5 py-4">
                              {area.locationAreaName ? (
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white">{area.locationAreaName}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {area.locationAreaEnabled === false ? 'Linked UK area is off' : 'Linked UK area is on'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-500 dark:text-slate-400">Not linked</span>
                              )}
                            </td>
                            <td className="px-5 py-4">{area.enabled ? 'Enabled' : 'Disabled'}</td>
                            <td className="px-5 py-4">
                              <div className="font-medium text-slate-900 dark:text-white">{area.activeAssignedProviders} active</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{area.assignedProviders} assigned total</div>
                              {area.enabled && area.activeAssignedProviders === 0 ? (
                                <div className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">No active provider coverage</div>
                              ) : null}
                              {!area.enabled && area.assignedProviders > 0 ? (
                                <div className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">Assignments remain on disabled area</div>
                              ) : null}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => editArea(area.id)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-primary hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {activePanel === 'uk_areas' ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="mb-4 flex items-center gap-3">
                  <MapPinned className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedLocationArea ? `Edit ${selectedLocationArea.name}` : 'Create location area'}
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name">
                    <input value={locationName} onChange={(e) => setLocationName(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  </Field>
                  <Field label="Slug">
                    <input value={locationSlug} onChange={(e) => setLocationSlug(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Area type">
                    <div className="relative">
                      <select value={locationAreaType} onChange={(e) => setLocationAreaType(e.target.value as LocationAreaNode['areaType'])} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900">
                        <option value="country">Country</option>
                        <option value="nation">Nation</option>
                        <option value="region">Region</option>
                        <option value="city">City</option>
                        <option value="borough">Borough</option>
                        <option value="postcode_area">Postcode area</option>
                        <option value="postcode_district">Postcode district</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                  <Field label="Parent area">
                    <div className="relative">
                      <select value={locationParentId || ''} onChange={(e) => setLocationParentId(e.target.value || null)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900">
                        <option value="">No parent</option>
                        {locationOptions.map((option) => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                  <Field label="Sort order">
                    <input value={locationSortOrder} onChange={(e) => setLocationSortOrder(Number(e.target.value) || 0)} type="number" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  </Field>
                </div>
                <Field label="Notes">
                  <textarea value={locationNotes} onChange={(e) => setLocationNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
                </Field>
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={locationEnabled} onChange={(e) => setLocationEnabled(e.target.checked)} />
                  Enabled
                </label>
                <button
                  type="button"
                  onClick={handleSaveLocationArea}
                  disabled={saveLocationArea.isPending || !locationName.trim() || !locationSlug.trim()}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  Save location area
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bulk import location areas</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add child areas in bulk. Use one row per line: <span className="font-medium">Name, slug, optional notes</span>.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Parent area">
                    <div className="relative">
                      <select
                        value={bulkImportParentId}
                        onChange={(e) => {
                          const nextParentId = e.target.value
                          setBulkImportParentId(nextParentId)
                          const nextParent = locationAreas.find((area) => area.id === nextParentId)
                          if (nextParent?.areaType === 'postcode_area') {
                            setBulkImportAreaType('postcode_district')
                          } else if (nextParent?.areaType === 'borough') {
                            setBulkImportAreaType('postcode_area')
                          } else if (nextParent?.areaType === 'city') {
                            setBulkImportAreaType('borough')
                          } else if (nextParent?.areaType === 'region') {
                            setBulkImportAreaType('city')
                          } else if (nextParent?.areaType === 'nation') {
                            setBulkImportAreaType('region')
                          }
                        }}
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="">Select parent area</option>
                        {importParentOptions.map((option) => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                  <Field label="Import type">
                    <div className="relative">
                      <select
                        value={bulkImportAreaType}
                        onChange={(e) => setBulkImportAreaType(e.target.value as LocationAreaNode['areaType'])}
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        {allowedBulkImportTypes.map((areaType) => (
                          <option key={areaType} value={areaType}>
                            {formatAreaType(areaType)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </Field>
                </div>

                <Field label="Rows">
                  <textarea
                    value={bulkImportText}
                    onChange={(e) => setBulkImportText(e.target.value)}
                    rows={10}
                    placeholder={'SW1, sw1, Westminster core district\nSW3, sw3, Chelsea district\nM1, m1, Central Manchester'}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
                  />
                </Field>

                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                  {bulkImportPreviewCount} row{bulkImportPreviewCount === 1 ? '' : 's'} ready to import
                  {selectedImportParent ? ` under ${selectedImportParent.name}` : ''}
                </div>

                <button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={bulkImportLocationAreas.isPending || !bulkImportParentId || !bulkImportText.trim()}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  Import rows
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
              <div className="mb-4 flex items-center gap-3">
                <MapPinned className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedArea ? `Edit ${selectedArea.city}` : 'Create service area'}
                </h3>
              </div>
              {serviceAreaCityScope === 'London' && currentScopedBorough ? (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                  New London service areas will default to <span className="font-medium text-slate-900 dark:text-white">{currentScopedBorough.name}</span> only. Nearby boroughs are not included unless you add them separately.
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="City">
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                </Field>
                <Field label="Postcode prefix">
                  <input value={postcodePrefix} onChange={(e) => setPostcodePrefix(e.target.value.toUpperCase())} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="E1" />
                </Field>
              </div>
              <Field label="Linked UK area">
                <div className="relative">
                  <select value={selectedLocationAreaId || ''} onChange={(e) => setSelectedLocationAreaId(e.target.value || null)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option value="">No linked area</option>
                    {locationOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </Field>
              <Field label="Notes">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </Field>
              {overlapWarnings.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300">
                  <div className="font-medium">Overlap warnings</div>
                  <ul className="mt-2 space-y-1">
                    {overlapWarnings.map((warning) => (
                      <li key={warning.id}>
                        <span className="font-medium">{warning.city}</span> ({warning.postcodePrefix}){warning.enabled ? '' : ' [disabled]'}: {warning.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                Enabled
              </label>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveArea.isPending || !city.trim() || !postcodePrefix.trim()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Save area
              </button>
            </div>
          )}
        </section>

        {activePanel === 'service_areas' ? (
          <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned providers</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manually control which providers serve the selected area.</p>

            {!selectedArea ? (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Select or create a service area to manage assignments.
              </div>
            ) : assignmentsLoading ? (
              <div className="mt-6 flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {assignments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No providers assigned yet.
                  </div>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{assignment.providerName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {assignment.postcode || 'No postcode'} • {assignment.hasWorkArea ? 'Polygon work area set' : 'No polygon work area'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeProvider.mutate(
                            { assignmentId: assignment.id, serviceAreaId: selectedArea.id, providerId: assignment.providerId },
                            {
                              onSuccess: () =>
                                setActionFeedback({
                                  tone: 'success',
                                  message: `Removed ${assignment.providerName} from ${selectedArea.city}.`,
                                }),
                              onError: (error) =>
                                setActionFeedback({
                                  tone: 'error',
                                  message: error instanceof Error ? error.message : 'Failed to remove provider from service area.',
                                }),
                            },
                          )
                        }
                        disabled={removeProvider.isPending}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-900/60"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedArea && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
              <div className="mb-4 flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Candidate providers</h3>
              </div>
              <div className="space-y-3">
                {candidates.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    No additional active providers match this postcode prefix.
                  </div>
                ) : (
                  candidates.map((candidate) => (
                    <div key={candidate.providerId} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{candidate.providerName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {candidate.postcode || 'No postcode'} • {candidate.hasWorkArea ? 'Polygon work area set' : 'No polygon work area'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          assignProvider.mutate(
                            { serviceAreaId: selectedArea.id, providerId: candidate.providerId },
                            {
                              onSuccess: () =>
                                setActionFeedback({
                                  tone: 'success',
                                  message: `Assigned ${candidate.providerName} to ${selectedArea.city}.`,
                                }),
                              onError: (error) =>
                                setActionFeedback({
                                  tone: 'error',
                                  message: error instanceof Error ? error.message : 'Failed to assign provider to service area.',
                                }),
                            },
                          )
                        }
                        disabled={assignProvider.isPending}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-gray-900/50 dark:text-slate-400">
              Provider assignments are managed from the <span className="font-medium text-slate-900 dark:text-white">Service areas</span> view.
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</div>
      {children}
    </div>
  )
}

function CoverageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/60 bg-white/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

type LocationAreaTreeItem = LocationAreaNode & { children: LocationAreaTreeItem[] }

function buildLocationTree(areas: LocationAreaNode[]): LocationAreaTreeItem[] {
  const byId = new Map<string, LocationAreaTreeItem>()
  for (const area of areas) {
    byId.set(area.id, { ...area, children: [] })
  }
  const roots: LocationAreaTreeItem[] = []
  for (const area of byId.values()) {
    if (area.parentId && byId.has(area.parentId)) {
      byId.get(area.parentId)!.children.push(area)
    } else {
      roots.push(area)
    }
  }
  const sortItems = (items: LocationAreaTreeItem[]) => {
    items.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    items.forEach((child) => sortItems(child.children))
  }
  sortItems(roots)
  return roots
}

function filterLocationTree(
  nodes: LocationAreaTreeItem[],
  search: string,
  areaType: 'all' | LocationAreaNode['areaType'],
  status: 'all' | 'enabled' | 'disabled',
): LocationAreaTreeItem[] {
  const query = search.trim().toLowerCase()

  const matchesNode = (node: LocationAreaTreeItem) => {
    const matchesSearch =
      !query ||
      node.name.toLowerCase().includes(query) ||
      node.slug.toLowerCase().includes(query)
    const matchesType = areaType === 'all' || node.areaType === areaType
    const matchesStatus =
      status === 'all' ||
      (status === 'enabled' ? node.enabled : !node.enabled)
    return matchesSearch && matchesType && matchesStatus
  }

  const visit = (node: LocationAreaTreeItem): LocationAreaTreeItem | null => {
    const filteredChildren = node.children
      .map((child) => visit(child))
      .filter(Boolean) as LocationAreaTreeItem[]

    if (matchesNode(node) || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      }
    }

    return null
  }

  return nodes
    .map((node) => visit(node))
    .filter(Boolean) as LocationAreaTreeItem[]
}

function getNextAreaType(areaType: LocationAreaNode['areaType']): LocationAreaNode['areaType'] {
  switch (areaType) {
    case 'country':
      return 'nation'
    case 'nation':
      return 'region'
    case 'region':
      return 'city'
    case 'city':
      return 'borough'
    case 'borough':
      return 'postcode_area'
    case 'postcode_area':
      return 'postcode_district'
    default:
      return 'postcode_district'
  }
}

function formatAreaType(areaType: LocationAreaNode['areaType']) {
  return areaType.replace('_', ' ')
}

function isWithinLocationArea(
  candidateId: string,
  targetId: string,
  areaMap: Map<string, LocationAreaNode>,
) {
  let currentId: string | null = candidateId
  while (currentId) {
    if (currentId === targetId) return true
    currentId = areaMap.get(currentId)?.parentId ?? null
  }
  return false
}

function findNearestBoroughName(
  locationAreaId: string,
  areaMap: Map<string, LocationAreaNode>,
) {
  let currentId: string | null = locationAreaId
  while (currentId) {
    const area = areaMap.get(currentId)
    if (!area) return null
    if (area.areaType === 'borough') return area.name
    currentId = area.parentId
  }
  return null
}

function LocationAreaTreeRow({
  node,
  level,
  onEdit,
  onCreateChild,
  onToggle,
}: {
  node: LocationAreaTreeItem
  level: number
  onEdit: (id: string) => void
  onCreateChild: (parentId: string, nextType: LocationAreaNode['areaType']) => void
  onToggle: (id: string, nextEnabled: boolean) => void
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
        style={{ marginLeft: `${level * 18}px` }}
      >
        <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {node.name}
            <span className="ml-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{node.areaType}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {node.childCount} child areas • {node.linkedServiceAreas} linked service areas
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(node.id, !node.enabled)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${node.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            {node.enabled ? 'On' : 'Off'}
          </button>
          <button type="button" onClick={() => onEdit(node.id)} className="text-sm font-medium text-primary hover:underline">
            Edit
          </button>
          <button type="button" onClick={() => onCreateChild(node.id, getNextAreaType(node.areaType))} className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300">
            Add child
          </button>
        </div>
      </div>
      {node.children.map((child) => (
        <div key={child.id} className="mt-2">
          <LocationAreaTreeRow node={child} level={level + 1} onEdit={onEdit} onCreateChild={onCreateChild} onToggle={onToggle} />
        </div>
      ))}
    </div>
  )
}
