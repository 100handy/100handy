export const MINIMUM_AUTHORIZATION_HOURS = 2;
export const PLATFORM_FEE_PERCENT = 0.15;

export type BookingFrequency = 'once' | 'weekly' | 'biweekly' | 'monthly';

export interface AuthorizationAmountInput {
  hourlyRateCents: number;
  estimatedHours: number;
  frequency?: string | null;
}

export interface CapturePolicyBooking {
  customer_id: string;
  handy_id: string;
  status: string;
  payment_status: string | null;
  hourly_rate_cents: number;
}

export interface PayoutPolicyBooking {
  handy_id: string;
  status: string;
  payment_status: string | null;
  payout_status: string | null;
  transfer_id: string | null;
}

export interface PolicyResult {
  allowed: boolean;
  reason?: string;
}

export function parsePositiveNumber(value: unknown, fieldName: string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return parsed;
}

export function normalizeFrequency(frequency?: string | null): BookingFrequency {
  if (!frequency || frequency === 'once') return 'once';
  if (frequency === 'weekly' || frequency === 'biweekly' || frequency === 'monthly') {
    return frequency;
  }
  throw new Error('Invalid booking frequency');
}

export function assertOneTimeCheckout(frequency?: string | null): void {
  if (normalizeFrequency(frequency) !== 'once') {
    throw new Error('Recurring booking checkout is temporarily unavailable');
  }
}

export function calculateAuthorizationAmountCents(input: AuthorizationAmountInput): number {
  assertOneTimeCheckout(input.frequency);

  const hourlyRateCents = parsePositiveNumber(input.hourlyRateCents, 'hourlyRateCents');
  const estimatedHours = parsePositiveNumber(input.estimatedHours, 'estimatedHours');
  const holdHours = Math.max(MINIMUM_AUTHORIZATION_HOURS, estimatedHours);

  return Math.round(hourlyRateCents * holdHours);
}

export function calculatePayoutAmounts(capturedAmount: number): {
  platformFee: number;
  professionalPayout: number;
} {
  const amount = parsePositiveNumber(capturedAmount, 'capturedAmount');
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT);
  return {
    platformFee,
    professionalPayout: amount - platformFee,
  };
}

export function getCapturePolicy(input: {
  userId: string;
  booking: CapturePolicyBooking;
  amountToCapture?: number;
}): PolicyResult {
  const { userId, booking, amountToCapture } = input;

  if (booking.payment_status !== 'authorized') {
    return { allowed: false, reason: `Payment status must be authorized, got ${booking.payment_status}` };
  }

  if (userId === booking.handy_id && (booking.status === 'in_progress' || booking.status === 'completed')) {
    return { allowed: true };
  }

  const isCustomerCancellationFee =
    userId === booking.customer_id &&
    booking.status === 'cancelled' &&
    typeof amountToCapture === 'number' &&
    amountToCapture > 0 &&
    amountToCapture <= booking.hourly_rate_cents;

  if (isCustomerCancellationFee) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'Capture is only allowed for job completion or a capped cancellation fee' };
}

export function getPayoutPolicy(input: {
  userId: string;
  booking: PayoutPolicyBooking;
}): PolicyResult {
  const { userId, booking } = input;

  if (userId !== booking.handy_id) {
    return { allowed: false, reason: 'Only the assigned professional can request payout' };
  }

  if (booking.status !== 'completed') {
    return { allowed: false, reason: `Booking must be completed, got ${booking.status}` };
  }

  if (booking.payment_status !== 'captured') {
    return { allowed: false, reason: `Payment must be captured, got ${booking.payment_status}` };
  }

  if (booking.transfer_id || booking.payout_status === 'transferred') {
    return { allowed: false, reason: 'Payout has already been transferred' };
  }

  return { allowed: true };
}
