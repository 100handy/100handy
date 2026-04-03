export function getVerificationSessionCreatedPatch() {
  return {
    verification_status: 'pending' as const,
  };
}

export function getVerificationSubmittedPatch(submittedAt: string) {
  return {
    verification_status: 'submitted' as const,
    verification_submitted_at: submittedAt,
  };
}
