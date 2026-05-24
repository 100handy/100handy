import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HelpArticleLayout } from '@/components/help/help-article-layout'
import { getHelpArticleMetadata, getPublishedHelpArticle } from '@/lib/help-articles'

export async function buildHelpArticleMetadata(
  slug: string,
  fallbackTitle: string,
  fallbackDescription: string,
): Promise<Metadata> {
  return getHelpArticleMetadata(slug, fallbackTitle, fallbackDescription)
}

export async function renderHelpArticlePage(slug: string) {
  const article = await getPublishedHelpArticle(slug)

  if (!article) {
    notFound()
  }

  const sidebarLinks = (article.sidebar_links_json ?? [])
    .map((item) => ({
      name: typeof item.name === 'string' ? item.name : '',
      href: typeof item.href === 'string' ? item.href : '#',
    }))
    .filter((item) => item.name && item.href)

  const relatedLinks = (article.related_links_json ?? [])
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label : '',
      href: typeof item.href === 'string' ? item.href : '#',
    }))
    .filter((item) => item.label && item.href)

  return (
    <HelpArticleLayout
      title={article.title}
      breadcrumb={article.breadcrumb}
      sidebarLinks={sidebarLinks}
      relatedLinks={relatedLinks}
    >
      <div
        className="space-y-8"
        dangerouslySetInnerHTML={{ __html: article.body_html }}
      />
    </HelpArticleLayout>
  )
}
