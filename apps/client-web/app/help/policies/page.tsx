import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'policies',
    'Policy Center',
    'Review the booking, payment, conduct, and dispute policies that govern the 100 Handy platform.',
  )
}

export default async function HelpPoliciesPage() {
  return renderHelpArticlePage('policies')
}
