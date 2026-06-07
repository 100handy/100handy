import { useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Loader2, Plus, Rocket, Save, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidSlug, safeParseJson } from '@/lib/editor-validation'
import {
  useDeleteHelpArticle,
  useHelpArticles,
  useHelpArticleRevisions,
  useLatestHelpArticleDraft,
  usePublishHelpArticleDraft,
  useRestoreHelpArticleRevision,
  useSaveHelpArticleDraft,
  type HelpArticleInput,
} from '@/lib/api/content-platform'

const EMPTY_ARTICLE: HelpArticleInput = {
  article_key: '',
  slug: '',
  title: '',
  breadcrumb: '',
  summary: '',
  sidebar_links_json: [],
  body_html: '',
  related_links_json: [],
  status: 'draft',
}

export default function HelpArticlesPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
  const { data: articles, isLoading } = useHelpArticles()
  const saveDraft = useSaveHelpArticleDraft()
  const publishDraft = usePublishHelpArticleDraft()
  const restoreRevision = useRestoreHelpArticleRevision()
  const deleteArticle = useDeleteHelpArticle()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<HelpArticleInput>(EMPTY_ARTICLE)
  const [sidebarJson, setSidebarJson] = useState('[]')
  const [relatedJson, setRelatedJson] = useState('[]')
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const selected = useMemo(
    () => articles?.find((article) => article.id === selectedId) ?? null,
    [articles, selectedId],
  )
  const effectiveArticleKey = selected?.article_key ?? draft.article_key.trim()
  const { data: latestDraft } = useLatestHelpArticleDraft(effectiveArticleKey)
  const { data: revisions = [] } = useHelpArticleRevisions(effectiveArticleKey)

  useEffect(() => {
    if (!selected && !latestDraft) return
    const draftArticle = latestDraft?.article_json as Record<string, unknown> | undefined
    setDraft({
      id: selected?.id,
      article_key: (draftArticle?.article_key as string | undefined) ?? selected?.article_key ?? '',
      slug: (draftArticle?.slug as string | undefined) ?? selected?.slug ?? '',
      title: (draftArticle?.title as string | undefined) ?? selected?.title ?? '',
      breadcrumb: (draftArticle?.breadcrumb as string | undefined) ?? selected?.breadcrumb ?? '',
      summary: (draftArticle?.summary as string | undefined) ?? selected?.summary ?? '',
      sidebar_links_json: Array.isArray(draftArticle?.sidebar_links_json) ? draftArticle?.sidebar_links_json as Array<Record<string, unknown>> : Array.isArray(selected?.sidebar_links_json) ? selected.sidebar_links_json : [],
      body_html: (draftArticle?.body_html as string | undefined) ?? selected?.body_html ?? '',
      related_links_json: Array.isArray(draftArticle?.related_links_json) ? draftArticle?.related_links_json as Array<Record<string, unknown>> : Array.isArray(selected?.related_links_json) ? selected.related_links_json : [],
      status: (draftArticle?.status as HelpArticleInput['status'] | undefined) ?? selected?.status ?? 'draft',
    })
    setSidebarJson(JSON.stringify(
      Array.isArray(draftArticle?.sidebar_links_json)
        ? draftArticle.sidebar_links_json
        : selected?.sidebar_links_json ?? [],
      null,
      2,
    ))
    setRelatedJson(JSON.stringify(
      Array.isArray(draftArticle?.related_links_json)
        ? draftArticle.related_links_json
        : selected?.related_links_json ?? [],
      null,
      2,
    ))
  }, [selected, latestDraft])

  const createNew = () => {
    setSelectedId(null)
    setDraft(EMPTY_ARTICLE)
    setSidebarJson('[]')
    setRelatedJson('[]')
  }

  const isDirty = useMemo(() => {
    const draftArticle = latestDraft?.article_json as Record<string, unknown> | undefined
    return JSON.stringify(draft) !== JSON.stringify({
      id: selected?.id,
      article_key: (draftArticle?.article_key as string | undefined) ?? selected?.article_key ?? '',
      slug: (draftArticle?.slug as string | undefined) ?? selected?.slug ?? '',
      title: (draftArticle?.title as string | undefined) ?? selected?.title ?? '',
      breadcrumb: (draftArticle?.breadcrumb as string | undefined) ?? selected?.breadcrumb ?? '',
      summary: (draftArticle?.summary as string | undefined) ?? selected?.summary ?? '',
      sidebar_links_json: Array.isArray(draftArticle?.sidebar_links_json) ? draftArticle.sidebar_links_json : selected?.sidebar_links_json ?? [],
      body_html: (draftArticle?.body_html as string | undefined) ?? selected?.body_html ?? '',
      related_links_json: Array.isArray(draftArticle?.related_links_json) ? draftArticle.related_links_json : selected?.related_links_json ?? [],
      status: (draftArticle?.status as HelpArticleInput['status'] | undefined) ?? selected?.status ?? 'draft',
    }) || sidebarJson !== JSON.stringify(
      Array.isArray(draftArticle?.sidebar_links_json) ? draftArticle.sidebar_links_json : selected?.sidebar_links_json ?? [],
      null,
      2,
    ) || relatedJson !== JSON.stringify(
      Array.isArray(draftArticle?.related_links_json) ? draftArticle.related_links_json : selected?.related_links_json ?? [],
      null,
      2,
    )
  }, [draft, sidebarJson, relatedJson, latestDraft, selected])

  useUnsavedChangesWarning(isDirty)

  const sidebarResult = useMemo(() => safeParseJson<Array<Record<string, unknown>>>(sidebarJson, 'Sidebar links'), [sidebarJson])
  const relatedResult = useMemo(() => safeParseJson<Array<Record<string, unknown>>>(relatedJson, 'Related links'), [relatedJson])
  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!draft.article_key.trim()) errors.push('Article key is required.')
    if (!draft.slug.trim()) errors.push('Slug is required.')
    else if (!isValidSlug(draft.slug.trim())) errors.push('Slug must use lowercase letters, numbers, and hyphens only.')
    if (!draft.title.trim()) errors.push('Title is required.')
    if (!draft.body_html.trim()) errors.push('Body HTML is required.')
    if (sidebarResult.error) errors.push(sidebarResult.error)
    if (relatedResult.error) errors.push(relatedResult.error)
    return errors
  }, [draft.article_key, draft.slug, draft.title, draft.body_html, sidebarResult.error, relatedResult.error])

  const canSaveDraft = canManageContent && validationErrors.length === 0
  const canPublish = canManageContent && validationErrors.length === 0 && !!latestDraft
  const draftSaved = actionFeedback?.tone === 'success' && actionFeedback.message === 'Draft saved.'
  const articlePublished = actionFeedback?.tone === 'success' && actionFeedback.message === 'Published.'

  const handleSaveDraft = async () => {
    if (!canSaveDraft) return
    const payload: HelpArticleInput = {
      ...draft,
      sidebar_links_json: sidebarResult.value ?? [],
      related_links_json: relatedResult.value ?? [],
    }
    setActionFeedback(null)
    try {
      await saveDraft.mutateAsync(payload)
      setActionFeedback({ tone: 'success', message: 'Draft saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save draft.' })
    }
  }

  const handlePublish = async () => {
    if (!effectiveArticleKey || !canPublish) return
    setActionFeedback(null)
    try {
      await publishDraft.mutateAsync(effectiveArticleKey)
      setActionFeedback({ tone: 'success', message: 'Published.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to publish article.' })
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Help Articles" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
          {!canManageContent && (
            <div className="xl:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view help articles, but it cannot change or publish them.
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Articles</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Long-form help centre content</p>
              </div>
              <button
                onClick={createNew}
                disabled={!canManageContent}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                (articles ?? []).map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedId(article.id)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition ${
                      selectedId === article.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">/{article.slug}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <UnsavedChangesBanner show={isDirty} />
            {validationErrors.length > 0 && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {validationErrors.map((error) => <div key={error}>{error}</div>)}
              </div>
            )}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editor</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage article metadata, navigation, and HTML body content.
                  </p>
                </div>
                <div className="flex gap-3">
                  {draft.id && (
                    <button
                    onClick={() => setDeleteTargetId(draft.id ?? null)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSaveDraft}
                  disabled={saveDraft.isPending || publishDraft.isPending || !canSaveDraft}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saveDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : draftSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {draftSaved ? 'Draft Saved' : 'Save Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishDraft.isPending || saveDraft.isPending || !canPublish}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {publishDraft.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : articlePublished ? <Check className="h-4 w-4" /> : <Rocket className="h-4 w-4" />}
                  {articlePublished ? 'Published' : 'Publish'}
                </button>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Work is saved to a draft first. Nothing changes on the public help centre until you publish.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Live status: <span className="font-semibold text-gray-900 dark:text-white">{selected?.status ?? 'draft'}</span>
                  {' · '}
                  Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
                </div>
              </div>
              {actionFeedback && (
                <p className={`mt-3 text-sm font-medium ${actionFeedback.tone === 'success' ? 'text-emerald-600' : 'text-red-600 dark:text-red-300'}`}>
                  {actionFeedback.message}
                </p>
              )}
            </div>

            <div className="mb-4 flex justify-end">
              <a
                href={`${import.meta.env.VITE_SITE_URL || ''}/help/${draft.slug.trim() || effectiveArticleKey || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Help Article
              </a>
            </div>

            {(draft.slug.trim() || effectiveArticleKey) && (
              <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                  Preview
                </div>
                <iframe
                  title="Help article preview"
                  src={`${import.meta.env.VITE_SITE_URL || ''}/help/${draft.slug.trim() || effectiveArticleKey || ''}`}
                  className="h-[520px] w-full bg-white"
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Article Key" value={draft.article_key} onChange={(value) => setDraft((prev) => ({ ...prev, article_key: value }))} />
              <FieldErrorText error={!draft.article_key.trim() ? 'Article key is required.' : null} />
              <Field label="Slug" value={draft.slug} onChange={(value) => setDraft((prev) => ({ ...prev, slug: value }))} />
              <FieldErrorText error={!draft.slug.trim() ? 'Slug is required.' : !isValidSlug(draft.slug.trim()) ? 'Use lowercase letters, numbers, and hyphens only.' : null} />
              <Field label="Title" value={draft.title} onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))} />
              <FieldErrorText error={!draft.title.trim() ? 'Title is required.' : null} />
              <Field label="Breadcrumb" value={draft.breadcrumb} onChange={(value) => setDraft((prev) => ({ ...prev, breadcrumb: value }))} />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as HelpArticleInput['status'] }))}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
              <textarea
                value={draft.summary}
                onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <JsonEditor label="Sidebar links JSON" value={sidebarJson} onChange={setSidebarJson} />
            <JsonEditor label="Related links JSON" value={relatedJson} onChange={setRelatedJson} />

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Body HTML</label>
              <textarea
                value={draft.body_html}
                onChange={(event) => setDraft((prev) => ({ ...prev, body_html: event.target.value }))}
                rows={22}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <FieldErrorText error={!draft.body_html.trim() ? 'Body HTML is required.' : null} />
            </div>

            {revisions.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revision History</h3>
                {revisions.map((revision) => (
                  <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        v{revision.version_number} · {revision.revision_state}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Updated {new Date(revision.updated_at).toLocaleString('en-GB')}
                        {revision.published_at ? ` · Published ${new Date(revision.published_at).toLocaleString('en-GB')}` : ''}
                      </p>
                    </div>
                    {revision.revision_state === 'published' ? (
                      <button
                        onClick={async () => {
                          setActionFeedback(null)
                          try {
                            await restoreRevision.mutateAsync({ articleKey: effectiveArticleKey, revisionId: revision.id })
                            setActionFeedback({ tone: 'success', message: 'Revision restored to draft.' })
                          } catch (error) {
                            setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to restore revision.' })
                          }
                        }}
                        disabled={restoreRevision.isPending}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50"
                      >
                        Restore to Draft
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-amber-600">Current draft</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete help article</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the selected help article.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setActionFeedback(null)
                  try {
                    await deleteArticle.mutateAsync(deleteTargetId)
                    if (selectedId === deleteTargetId) {
                      setSelectedId(null)
                      setDraft(EMPTY_ARTICLE)
                      setSidebarJson('[]')
                      setRelatedJson('[]')
                    }
                    setDeleteTargetId(null)
                    setActionFeedback({ tone: 'success', message: 'Help article deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete help article.' })
                  }
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
    </div>
  )
}

function JsonEditor({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
      />
    </div>
  )
}
