import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'pro',
    '100 Handy Pro Support',
    'Read operational guidance for 100 Handy Pros on jobs, availability, communication, payments, and support.',
  )
}

export default async function HelpProPage() {
  return renderHelpArticlePage('pro')
}
