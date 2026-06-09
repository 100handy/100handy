import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Check, ExternalLink, Loader2, Plus, Rocket, Save, Search } from 'lucide-react'
import Header from '@/components/header'
import { FieldErrorText } from '@/components/editor/FieldErrorText'
import { UnsavedChangesBanner } from '@/components/editor/UnsavedChangesBanner'
import { useAuth } from '@/contexts/AuthContext'
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning'
import { isValidHref, isValidSlug, isValidUrl } from '@/lib/editor-validation'
import {
  useBlogPostRevisions,
  useBlogPosts,
  useDeleteBlogPost,
  useLatestBlogPostDraft,
  usePublishBlogPostDraft,
  useRestoreBlogPostRevision,
  useSaveBlogPostDraft,
  useSurfaceSeo,
} from '@/lib/api/content-platform'

type BlogStatus = 'draft' | 'published' | 'archived'

const emptyPost = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  cover_image_url: '',
  category: '',
  author_name: '',
  status: 'draft' as BlogStatus,
  published_at: '',
}

export default function BlogsPage() {
  const { hasPermission } = useAuth()
  const canManageContent = hasPermission('content.manage')
  const { data: posts = [], isLoading } = useBlogPosts()
  const deletePost = useDeleteBlogPost()
  const saveDraft = useSaveBlogPostDraft()
  const publishDraft = usePublishBlogPostDraft()
  const restoreRevision = useRestoreBlogPostRevision()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyPost)
  const [actionFeedback, setActionFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editorTab, setEditorTab] = useState<'content' | 'details' | 'seo' | 'history'>('content')
  const selectedPost = posts.find((post) => post.id === selectedId) ?? null
  const effectiveSlug = selectedPost?.slug ?? form.slug.trim()
  const { data: seo } = useSurfaceSeo('blog_post', effectiveSlug)
  const { data: latestDraft } = useLatestBlogPostDraft(effectiveSlug)
  const { data: revisions = [] } = useBlogPostRevisions(effectiveSlug)
  const [seoForm, setSeoForm] = useState({
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image_url: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
  })

  useEffect(() => {
    if (!selectedPost && !latestDraft) {
      setForm(emptyPost)
      return
    }

    const draftPost = latestDraft?.post_json as Record<string, unknown> | undefined

    setForm({
      slug: (draftPost?.slug as string | undefined) ?? selectedPost?.slug ?? '',
      title: (draftPost?.title as string | undefined) ?? selectedPost?.title ?? '',
      excerpt: (draftPost?.excerpt as string | undefined) ?? selectedPost?.excerpt ?? '',
      body: (draftPost?.body as string | undefined) ?? selectedPost?.body ?? '',
      cover_image_url: (draftPost?.cover_image_url as string | undefined) ?? selectedPost?.cover_image_url ?? '',
      category: (draftPost?.category as string | undefined) ?? selectedPost?.category ?? '',
      author_name: (draftPost?.author_name as string | undefined) ?? selectedPost?.author_name ?? '',
      status: (draftPost?.status as BlogStatus | undefined) ?? selectedPost?.status ?? 'draft',
      published_at: (draftPost?.published_at as string | undefined)
        ? String(draftPost?.published_at).slice(0, 10)
        : selectedPost?.published_at
          ? selectedPost.published_at.slice(0, 10)
          : '',
    })
  }, [selectedPost, latestDraft])

  useEffect(() => {
    const draftSeo = latestDraft?.seo_json as Record<string, unknown> | undefined
    setSeoForm({
      meta_title: (draftSeo?.meta_title as string | undefined) ?? seo?.meta_title ?? '',
      meta_description: (draftSeo?.meta_description as string | undefined) ?? seo?.meta_description ?? '',
      og_title: (draftSeo?.og_title as string | undefined) ?? seo?.og_title ?? '',
      og_description: (draftSeo?.og_description as string | undefined) ?? seo?.og_description ?? '',
      og_image_url: (draftSeo?.og_image_url as string | undefined) ?? seo?.og_image_url ?? '',
      twitter_title: (draftSeo?.twitter_title as string | undefined) ?? seo?.twitter_title ?? '',
      twitter_description: (draftSeo?.twitter_description as string | undefined) ?? seo?.twitter_description ?? '',
      twitter_image_url: (draftSeo?.twitter_image_url as string | undefined) ?? seo?.twitter_image_url ?? '',
      canonical_url: (draftSeo?.canonical_url as string | undefined) ?? seo?.canonical_url ?? '',
      robots_index: (draftSeo?.robots_index as boolean | undefined) ?? seo?.robots_index ?? true,
      robots_follow: (draftSeo?.robots_follow as boolean | undefined) ?? seo?.robots_follow ?? true,
    })
  }, [seo, latestDraft])

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((post) =>
      [post.title, post.slug, post.category ?? '', post.author_name ?? '']
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [posts, search])

  const isDirty = useMemo(() => {
    const draftPost = latestDraft?.post_json as Record<string, unknown> | undefined
    const draftSeo = latestDraft?.seo_json as Record<string, unknown> | undefined
    return JSON.stringify(form) !== JSON.stringify({
      slug: (draftPost?.slug as string | undefined) ?? selectedPost?.slug ?? '',
      title: (draftPost?.title as string | undefined) ?? selectedPost?.title ?? '',
      excerpt: (draftPost?.excerpt as string | undefined) ?? selectedPost?.excerpt ?? '',
      body: (draftPost?.body as string | undefined) ?? selectedPost?.body ?? '',
      cover_image_url: (draftPost?.cover_image_url as string | undefined) ?? selectedPost?.cover_image_url ?? '',
      category: (draftPost?.category as string | undefined) ?? selectedPost?.category ?? '',
      author_name: (draftPost?.author_name as string | undefined) ?? selectedPost?.author_name ?? '',
      status: (draftPost?.status as BlogStatus | undefined) ?? selectedPost?.status ?? 'draft',
      published_at: (draftPost?.published_at as string | undefined) ? String(draftPost?.published_at).slice(0, 10) : selectedPost?.published_at ? selectedPost.published_at.slice(0, 10) : '',
    }) || JSON.stringify(seoForm) !== JSON.stringify({
      meta_title: (draftSeo?.meta_title as string | undefined) ?? seo?.meta_title ?? '',
      meta_description: (draftSeo?.meta_description as string | undefined) ?? seo?.meta_description ?? '',
      og_title: (draftSeo?.og_title as string | undefined) ?? seo?.og_title ?? '',
      og_description: (draftSeo?.og_description as string | undefined) ?? seo?.og_description ?? '',
      og_image_url: (draftSeo?.og_image_url as string | undefined) ?? seo?.og_image_url ?? '',
      twitter_title: (draftSeo?.twitter_title as string | undefined) ?? seo?.twitter_title ?? '',
      twitter_description: (draftSeo?.twitter_description as string | undefined) ?? seo?.twitter_description ?? '',
      twitter_image_url: (draftSeo?.twitter_image_url as string | undefined) ?? seo?.twitter_image_url ?? '',
      canonical_url: (draftSeo?.canonical_url as string | undefined) ?? seo?.canonical_url ?? '',
      robots_index: (draftSeo?.robots_index as boolean | undefined) ?? seo?.robots_index ?? true,
      robots_follow: (draftSeo?.robots_follow as boolean | undefined) ?? seo?.robots_follow ?? true,
    })
  }, [form, seoForm, latestDraft, selectedPost, seo])

  useUnsavedChangesWarning(isDirty)

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!form.slug.trim()) errors.push('Slug is required.')
    else if (!isValidSlug(form.slug.trim())) errors.push('Slug must use lowercase letters, numbers, and hyphens only.')
    if (!form.title.trim()) errors.push('Title is required.')
    if (form.cover_image_url.trim() && !isValidUrl(form.cover_image_url)) errors.push('Cover image URL must be a valid absolute URL.')
    if (seoForm.og_image_url.trim() && !isValidUrl(seoForm.og_image_url)) errors.push('Open Graph image URL must be a valid absolute URL.')
    if (seoForm.twitter_image_url.trim() && !isValidUrl(seoForm.twitter_image_url)) errors.push('Twitter image URL must be a valid absolute URL.')
    if (seoForm.canonical_url.trim() && !isValidHref(seoForm.canonical_url) && !isValidUrl(seoForm.canonical_url)) {
      errors.push('Canonical URL must be a site path or a valid absolute URL.')
    }
    return errors
  }, [form.slug, form.title, form.cover_image_url, seoForm.og_image_url, seoForm.twitter_image_url, seoForm.canonical_url])

  const canSaveDraft = canManageContent && validationErrors.length === 0
  const canPublish = canManageContent && validationErrors.length === 0 && !!latestDraft
  const draftSaved = actionFeedback?.tone === 'success' && actionFeedback.message === 'Draft saved.'
  const blogPublished = actionFeedback?.tone === 'success' && actionFeedback.message === 'Published.'
  const fieldErrors = {
    slug: !form.slug.trim()
      ? 'Slug is required.'
      : !isValidSlug(form.slug.trim())
        ? 'Use lowercase letters, numbers, and hyphens only.'
        : null,
    title: !form.title.trim() ? 'Title is required.' : null,
    cover_image_url: form.cover_image_url.trim() && !isValidUrl(form.cover_image_url) ? 'Enter a valid absolute URL.' : null,
    canonical_url: seoForm.canonical_url.trim() && !isValidHref(seoForm.canonical_url) && !isValidUrl(seoForm.canonical_url)
      ? 'Use a site path or a valid absolute URL.'
      : null,
    og_image_url: seoForm.og_image_url.trim() && !isValidUrl(seoForm.og_image_url) ? 'Enter a valid absolute URL.' : null,
    twitter_image_url: seoForm.twitter_image_url.trim() && !isValidUrl(seoForm.twitter_image_url) ? 'Enter a valid absolute URL.' : null,
  }

  const handleSaveDraft = async () => {
    const slug = form.slug.trim()
    if (!canSaveDraft) return

    setActionFeedback(null)
    try {
      await saveDraft.mutateAsync({
        post: {
          id: selectedPost?.id,
          slug,
          title: form.title,
          excerpt: form.excerpt,
          body: form.body,
          cover_image_url: form.cover_image_url,
          category: form.category,
          author_name: form.author_name,
          status: form.status,
          published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        },
        seo: seoForm,
      })
      setActionFeedback({ tone: 'success', message: 'Draft saved.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to save draft.' })
    }
  }

  const handlePublish = async () => {
    if (!effectiveSlug || !canPublish) return
    setActionFeedback(null)
    try {
      await publishDraft.mutateAsync(effectiveSlug)
      setActionFeedback({ tone: 'success', message: 'Published.' })
    } catch (error) {
      setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to publish blog post.' })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Blog Posts" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full space-y-8">
          <UnsavedChangesBanner show={isDirty} />
          {!canManageContent && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Your admin role can view blog content, but it cannot change or publish it.
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage editorial blog posts, SEO metadata, and publish state for the public site.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => {
                setSelectedId(null)
                setForm(emptyPost)
              }}
              disabled={!canManageContent}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Modified</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8"><Loader2 className="w-5 h-5 animate-spin" /></td></tr>
                ) : filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50 ${selectedId === post.id ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800/50'}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{post.title}</td>
                    <td className="px-6 py-4">{post.category ?? '-'}</td>
                    <td className="px-6 py-4">{post.status}</td>
                    <td className="px-6 py-4">{format(new Date(post.updated_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button className="font-medium text-primary hover:underline" onClick={() => setSelectedId(post.id)}>
                        Edit
                      </button>
                      <button className="font-medium text-red-600 hover:underline" onClick={() => setDeleteTargetId(post.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            {validationErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {validationErrors.map((error) => <div key={error}>{error}</div>)}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedId ? 'Edit Blog Post' : 'Create Blog Post'}
            </h3>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Work is saved to a draft first. Nothing changes on the live blog until you publish.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Live status: <span className="font-semibold text-gray-900 dark:text-white">{selectedPost?.status ?? 'draft'}</span>
                  {' · '}
                  Draft: <span className="font-semibold text-gray-900 dark:text-white">{latestDraft ? `v${latestDraft.version_number}` : 'none'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
              {[
                { id: 'content', label: 'Post content' },
                { id: 'details', label: 'Post details' },
                { id: 'seo', label: 'SEO' },
                { id: 'history', label: 'History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorTab(tab.id as typeof editorTab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    editorTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {editorTab === 'content' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">Post content</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Write the headline, excerpt, and main article body here.
                      </p>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_SITE_URL || ''}/blog/${effectiveSlug || form.slug.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open live page
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                      rows={16}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {editorTab === 'details' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Post details</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Basic page details. Most editors only need the title, slug, author, and cover image.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextField label="Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
                    <FieldErrorText error={fieldErrors.slug} />
                  </div>
                  <div>
                    <TextField label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
                    <FieldErrorText error={fieldErrors.title} />
                  </div>
                  <TextField label="Category" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
                  <TextField label="Author" value={form.author_name} onChange={(value) => setForm((prev) => ({ ...prev, author_name: value }))} />
                  <div>
                    <TextField label="Cover Image URL" value={form.cover_image_url} onChange={(value) => setForm((prev) => ({ ...prev, cover_image_url: value }))} />
                    <FieldErrorText error={fieldErrors.cover_image_url} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as BlogStatus }))}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish date</label>
                    <input
                      type="date"
                      value={form.published_at}
                      onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {editorTab === 'seo' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">SEO</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search and social sharing settings for the published blog page.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Meta Title" value={seoForm.meta_title} onChange={(value) => setSeoForm((prev) => ({ ...prev, meta_title: value }))} />
                  <div>
                    <TextField label="Canonical URL" value={seoForm.canonical_url} onChange={(value) => setSeoForm((prev) => ({ ...prev, canonical_url: value }))} />
                    <FieldErrorText error={fieldErrors.canonical_url} />
                  </div>
                  <TextAreaField label="Meta Description" value={seoForm.meta_description} onChange={(value) => setSeoForm((prev) => ({ ...prev, meta_description: value }))} className="md:col-span-2" />
                  <TextField label="Open Graph Title" value={seoForm.og_title} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_title: value }))} />
                  <div>
                    <TextField label="Open Graph Image URL" value={seoForm.og_image_url} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_image_url: value }))} />
                    <FieldErrorText error={fieldErrors.og_image_url} />
                  </div>
                  <TextAreaField label="Open Graph Description" value={seoForm.og_description} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_description: value }))} className="md:col-span-2" />
                  <TextField label="Twitter Title" value={seoForm.twitter_title} onChange={(value) => setSeoForm((prev) => ({ ...prev, twitter_title: value }))} />
                  <div>
                    <TextField label="Twitter Image URL" value={seoForm.twitter_image_url} onChange={(value) => setSeoForm((prev) => ({ ...prev, twitter_image_url: value }))} />
                    <FieldErrorText error={fieldErrors.twitter_image_url} />
                  </div>
                </div>
              </div>
            )}

            {editorTab === 'history' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Revision history</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review published versions and restore one back into draft.
                  </p>
                </div>
                {revisions.length > 0 ? (
                  <div className="space-y-3">
                    {revisions.map((revision) => (
                      <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            v{revision.version_number} · {revision.revision_state}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {format(new Date(revision.updated_at), 'MMM d, yyyy HH:mm')}
                            {revision.published_at ? ` · Published ${format(new Date(revision.published_at), 'MMM d, yyyy HH:mm')}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {revision.revision_state === 'published' ? (
                            <button
                              onClick={async () => {
                                setActionFeedback(null)
                                try {
                                  await restoreRevision.mutateAsync({ slug: effectiveSlug, revisionId: revision.id })
                                  setActionFeedback({ tone: 'success', message: 'Revision restored to draft.' })
                                } catch (error) {
                                  setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to restore revision.' })
                                }
                              }}
                              disabled={restoreRevision.isPending}
                              className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                              Restore to Draft
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-amber-600">Current draft</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    No revision history yet.
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              {actionFeedback && (
                <span className={`self-center text-sm font-medium ${actionFeedback.tone === 'success' ? 'text-emerald-600' : 'text-red-600 dark:text-red-300'}`}>
                  {actionFeedback.message}
                </span>
              )}
              <button
                onClick={handleSaveDraft}
                disabled={saveDraft.isPending || publishDraft.isPending || !canSaveDraft}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {saveDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : draftSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {draftSaved ? 'Draft Saved' : 'Save Draft'}
              </button>
              <button
                onClick={handlePublish}
                disabled={publishDraft.isPending || saveDraft.isPending || !canPublish}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
              >
                {publishDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : blogPublished ? <Check className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                {blogPublished ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteTargetId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete blog post</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the selected blog post and its admin-managed content entry.
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
                    await deletePost.mutateAsync(deleteTargetId)
                    if (selectedId === deleteTargetId) {
                      setSelectedId(null)
                      setForm(emptyPost)
                    }
                    setDeleteTargetId(null)
                    setActionFeedback({ tone: 'success', message: 'Blog post deleted.' })
                  } catch (error) {
                    setActionFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Failed to delete blog post.' })
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

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
