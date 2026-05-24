import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'client',
    'Client Support',
    'Read guidance for clients booking services through 100 Handy, including payments, communication, and support.',
  )
}

export default async function HelpClientPage() {
  return renderHelpArticlePage('client')
}
