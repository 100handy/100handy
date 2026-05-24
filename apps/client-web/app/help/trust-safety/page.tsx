import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'trust-safety',
    'Overview of Trust and Safety',
    'Read 100 Handy trust and safety guidance, background check information, and dispute support details.',
  )
}

export default async function TrustSafetyPage() {
  return renderHelpArticlePage('trust-safety')
}
