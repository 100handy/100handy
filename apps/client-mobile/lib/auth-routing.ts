export type AuthRouteTarget =
  | string
  | {
      pathname: string;
      params?: Record<string, string>;
    };

interface ResolveAuthenticatedRouteOptions {
  isEmailVerified: boolean;
  userRole: 'customer' | 'handy' | null;
  hasCompletedOnboarding: boolean;
  userEmail?: string | null;
  userId?: string | null;
  getLocalClientOnboardingCompleted: (userId: string) => Promise<boolean>;
  getProfessionalOnboardingCompleted: () => Promise<boolean | null>;
  getPendingBookingRoute: () => AuthRouteTarget | null;
}

interface PendingBookingRouteOptions {
  hasRestorablePendingBooking: () => boolean;
  getPendingBooking: () => {
    location: any;
    tasker: { id: string };
    categoryId: string;
    categoryName: string;
    selectedDate: string;
    selectedTime: string;
    formResponses: unknown;
    frequency?: string | null;
  } | null;
  markPendingBookingRestored: () => void;
  setLocation: (location: any) => void;
}

export function buildPendingBookingRoute({
  hasRestorablePendingBooking,
  getPendingBooking,
  markPendingBookingRestored,
  setLocation,
}: PendingBookingRouteOptions): AuthRouteTarget | null {
  if (!hasRestorablePendingBooking()) {
    return null;
  }

  const pendingBooking = getPendingBooking();
  if (!pendingBooking) {
    return null;
  }

  setLocation(pendingBooking.location);
  markPendingBookingRestored();

  return {
    pathname: '/(client)/confirm-booking',
    params: {
      taskerId: pendingBooking.tasker.id,
      categoryId: pendingBooking.categoryId,
      categoryName: pendingBooking.categoryName,
      selectedDate: pendingBooking.selectedDate,
      selectedTime: pendingBooking.selectedTime,
      formResponses: JSON.stringify(pendingBooking.formResponses),
      selectedFrequency: pendingBooking.frequency ?? 'once',
    },
  };
}

export async function resolveAuthenticatedRoute({
  isEmailVerified,
  userRole,
  hasCompletedOnboarding,
  userEmail,
  userId,
  getLocalClientOnboardingCompleted,
  getProfessionalOnboardingCompleted,
  getPendingBookingRoute,
}: ResolveAuthenticatedRouteOptions): Promise<AuthRouteTarget> {
  if (!isEmailVerified) {
    return {
      pathname: '/(auth)/verify-email',
      params: { email: userEmail ?? '' },
    };
  }

  if (userRole === 'handy') {
    try {
      const onboardingComplete = await getProfessionalOnboardingCompleted();
      if (onboardingComplete === null) {
        return '/(professional)/(tabs)/dashboard';
      }
      return onboardingComplete
        ? '/(professional)/(tabs)/dashboard'
        : '/(auth)/(professional)/verify-info';
    } catch {
      return '/(professional)/(tabs)/dashboard';
    }
  }

  if (userRole === 'customer') {
    const localOnboardingCompleted =
      userId ? await getLocalClientOnboardingCompleted(userId) : false;

    if (!hasCompletedOnboarding && !localOnboardingCompleted) {
      return '/(auth)/(client)/onboarding';
    }

    return getPendingBookingRoute() ?? '/(client)/(tabs)/home';
  }

  return '/(auth)/welcome';
}
