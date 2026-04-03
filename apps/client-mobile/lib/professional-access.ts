export type ProfessionalVerificationStatus =
  | 'pending'
  | 'submitted'
  | 'verified'
  | 'rejected'
  | null;

export const RESTRICTED_PROFESSIONAL_TABS = ['jobs'] as const;

export function isProfessionalTabRestrictedBeforeVerification(tabName: string): boolean {
  return RESTRICTED_PROFESSIONAL_TABS.includes(
    tabName as (typeof RESTRICTED_PROFESSIONAL_TABS)[number]
  );
}

export function canAccessProfessionalTab(
  tabName: string,
  verificationStatus: ProfessionalVerificationStatus
): boolean {
  if (!isProfessionalTabRestrictedBeforeVerification(tabName)) {
    return true;
  }

  return verificationStatus === 'verified';
}
