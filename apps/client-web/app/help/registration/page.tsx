import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'registration',
    'Registration',
    'Everything Pros need to know about joining 100 Handy, from account creation to verification and activation.',
  )
}

export default async function HelpRegistrationPage() {
  return renderHelpArticlePage('registration')
}
