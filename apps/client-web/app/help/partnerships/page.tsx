import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'partnerships',
    'Partnerships',
    'Learn how businesses, brands, and retailers can partner with 100 Handy through integrations and collaboration.',
  )
}

export default async function HelpPartnershipsPage() {
  return renderHelpArticlePage('partnerships')
}
