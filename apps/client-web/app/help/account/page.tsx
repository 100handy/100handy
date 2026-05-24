import type { Metadata } from 'next'
import { buildHelpArticleMetadata, renderHelpArticlePage } from '@/components/help/help-article-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHelpArticleMetadata(
    'account',
    'Account',
    'Manage your 100 Handy account, update your profile, resolve login issues, and understand security and privacy settings.',
  )
}

export default async function HelpAccountPage() {
  return renderHelpArticlePage('account')
}
