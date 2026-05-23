import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Plus, Save, Search, Trash2 } from 'lucide-react'
import Header from '@/components/header'
import {
  useBlogPosts,
  useDeleteBlogPost,
  useSaveBlogPost,
  useSaveSurfaceSeo,
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
  const { data: posts = [], isLoading } = useBlogPosts()
  const savePost = useSaveBlogPost()
  const deletePost = useDeleteBlogPost()
  const saveSeo = useSaveSurfaceSeo()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyPost)
  const selectedPost = posts.find((post) => post.id === selectedId) ?? null
  const { data: seo } = useSurfaceSeo('blog_post', selectedPost?.slug ?? '')
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
    if (!selectedPost) {
      setForm(emptyPost)
      return
    }

    setForm({
      slug: selectedPost.slug,
      title: selectedPost.title,
      excerpt: selectedPost.excerpt ?? '',
      body: selectedPost.body ?? '',
      cover_image_url: selectedPost.cover_image_url ?? '',
      category: selectedPost.category ?? '',
      author_name: selectedPost.author_name ?? '',
      status: selectedPost.status,
      published_at: selectedPost.published_at ? selectedPost.published_at.slice(0, 10) : '',
    })
  }, [selectedPost])

  useEffect(() => {
    setSeoForm({
      meta_title: seo?.meta_title ?? '',
      meta_description: seo?.meta_description ?? '',
      og_title: seo?.og_title ?? '',
      og_description: seo?.og_description ?? '',
      og_image_url: seo?.og_image_url ?? '',
      twitter_title: seo?.twitter_title ?? '',
      twitter_description: seo?.twitter_description ?? '',
      twitter_image_url: seo?.twitter_image_url ?? '',
      canonical_url: seo?.canonical_url ?? '',
      robots_index: seo?.robots_index ?? true,
      robots_follow: seo?.robots_follow ?? true,
    })
  }, [seo])

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((post) =>
      [post.title, post.slug, post.category ?? '', post.author_name ?? '']
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [posts, search])

  const handleSave = async () => {
    const slug = form.slug.trim()
    if (!slug || !form.title.trim()) return

    await savePost.mutateAsync({
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
    })

    await saveSeo.mutateAsync({
      surfaceType: 'blog_post',
      surfaceKey: slug,
      values: seoForm,
    })
  }

  const handleDelete = async (id: string) => {
    await deletePost.mutateAsync(id)
    if (selectedId === id) {
      setSelectedId(null)
      setForm(emptyPost)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Blog Posts" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full space-y-8">
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
                      <button className="font-medium text-red-600 hover:underline" onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedId ? 'Edit Blog Post' : 'Create Blog Post'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
              <TextField label="Title" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
              <TextField label="Category" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
              <TextField label="Author" value={form.author_name} onChange={(value) => setForm((prev) => ({ ...prev, author_name: value }))} />
              <TextField label="Cover Image URL" value={form.cover_image_url} onChange={(value) => setForm((prev) => ({ ...prev, cover_image_url: value }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as BlogStatus }))}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">SEO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Meta Title" value={seoForm.meta_title} onChange={(value) => setSeoForm((prev) => ({ ...prev, meta_title: value }))} />
                <TextField label="Canonical URL" value={seoForm.canonical_url} onChange={(value) => setSeoForm((prev) => ({ ...prev, canonical_url: value }))} />
                <TextAreaField label="Meta Description" value={seoForm.meta_description} onChange={(value) => setSeoForm((prev) => ({ ...prev, meta_description: value }))} className="md:col-span-2" />
                <TextField label="Open Graph Title" value={seoForm.og_title} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_title: value }))} />
                <TextField label="Open Graph Image URL" value={seoForm.og_image_url} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_image_url: value }))} />
                <TextAreaField label="Open Graph Description" value={seoForm.og_description} onChange={(value) => setSeoForm((prev) => ({ ...prev, og_description: value }))} className="md:col-span-2" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={savePost.isPending || saveSeo.isPending}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {savePost.isPending || saveSeo.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Post
              </button>
            </div>
          </div>
        </div>
      </div>
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
