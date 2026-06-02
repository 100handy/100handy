import { useMemo, useState, type ReactNode } from 'react'
import { Loader2, MapPinned, Plus, UserPlus } from 'lucide-react'
import Header from '@/components/header'
import {
  useAssignProviderToServiceArea,
  useProviderCandidates,
  useRemoveProviderFromServiceArea,
  useSaveServiceArea,
  useServiceAreaAssignments,
  useServiceAreas,
} from '@/lib/api/locations'

export default function ServiceAreasPage() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [postcodePrefix, setPostcodePrefix] = useState('')
  const [notes, setNotes] = useState('')
  const [enabled, setEnabled] = useState(true)

  const { data: areas = [], isLoading, error } = useServiceAreas()
  const { data: assignments = [], isLoading: assignmentsLoading } = useServiceAreaAssignments(selectedAreaId)
  const { data: candidates = [] } = useProviderCandidates(selectedAreaId)
  const saveArea = useSaveServiceArea()
  const assignProvider = useAssignProviderToServiceArea()
  const removeProvider = useRemoveProviderFromServiceArea()

  const selectedArea = useMemo(() => areas.find((area) => area.id === selectedAreaId) || null, [areas, selectedAreaId])

  function startCreate() {
    setSelectedAreaId(null)
    setCity('')
    setPostcodePrefix('')
    setNotes('')
    setEnabled(true)
  }

  function editArea(id: string) {
    const area = areas.find((item) => item.id === id)
    if (!area) return
    setSelectedAreaId(area.id)
    setCity(area.city)
    setPostcodePrefix(area.postcodePrefix)
    setNotes(area.notes || '')
    setEnabled(area.enabled)
  }

  async function handleSave() {
    if (!city.trim() || !postcodePrefix.trim()) return
    const id = await saveArea.mutateAsync({
      id: selectedAreaId || undefined,
      city: city.trim(),
      postcodePrefix: postcodePrefix.trim(),
      enabled,
      notes,
    })
    setSelectedAreaId(id)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Service Areas" />

      <main className="grid flex-1 gap-6 p-6 xl:grid-cols-[1.1fr,1fr]">
        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Coverage list</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage enabled cities and postcode prefixes.</p>
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3">City</th>
                    <th className="px-5 py-3">Postcode</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Providers</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : areas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        No service areas configured yet.
                      </td>
                    </tr>
                  ) : (
                    areas.map((area) => (
                      <tr key={area.id} className="border-t border-slate-200 dark:border-slate-800">
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{area.city}</td>
                        <td className="px-5 py-4">{area.postcodePrefix}</td>
                        <td className="px-5 py-4">{area.enabled ? 'Enabled' : 'Disabled'}</td>
                        <td className="px-5 py-4">{area.assignedProviders}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => editArea(area.id)}
                            className="text-sm font-medium text-primary hover:underline"
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
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedArea ? `Edit ${selectedArea.city}` : 'Create service area'}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="City">
                <input value={city} onChange={(e) => setCity(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </Field>
              <Field label="Postcode prefix">
                <input value={postcodePrefix} onChange={(e) => setPostcodePrefix(e.target.value.toUpperCase())} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="E1" />
              </Field>
            </div>
            <Field label="Notes">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
            </Field>
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
        </section>

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
                        onClick={() => removeProvider.mutate({ assignmentId: assignment.id, serviceAreaId: selectedArea.id, providerId: assignment.providerId })}
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
                        onClick={() => assignProvider.mutate({ serviceAreaId: selectedArea.id, providerId: candidate.providerId })}
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
