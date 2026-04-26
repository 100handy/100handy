import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateAuthorizationAmountCents,
  calculatePayoutAmounts,
  getCapturePolicy,
  getPayoutPolicy,
} from './payment-policy.ts';

test('authorization amount is derived from server rate and minimum hold hours', () => {
  assert.equal(
    calculateAuthorizationAmountCents({
      hourlyRateCents: 2500,
      estimatedHours: 1,
      frequency: 'once',
    }),
    5000
  );
});

test('recurring checkout is blocked until repeat-occurrence billing exists', () => {
  assert.throws(
    () =>
      calculateAuthorizationAmountCents({
        hourlyRateCents: 2500,
        estimatedHours: 2,
        frequency: 'weekly',
      }),
    /Recurring booking checkout/
  );
});

test('capture is limited to professional completion or customer cancellation fee', () => {
  assert.equal(
    getCapturePolicy({
      userId: 'pro',
      booking: {
        customer_id: 'customer',
        handy_id: 'pro',
        status: 'in_progress',
        payment_status: 'authorized',
        hourly_rate_cents: 3000,
      },
    }).allowed,
    true
  );

  assert.equal(
    getCapturePolicy({
      userId: 'pro',
      booking: {
        customer_id: 'customer',
        handy_id: 'pro',
        status: 'accepted',
        payment_status: 'authorized',
        hourly_rate_cents: 3000,
      },
    }).allowed,
    false
  );

  assert.equal(
    getCapturePolicy({
      userId: 'customer',
      amountToCapture: 3000,
      booking: {
        customer_id: 'customer',
        handy_id: 'pro',
        status: 'cancelled',
        payment_status: 'authorized',
        hourly_rate_cents: 3000,
      },
    }).allowed,
    true
  );
});

test('payout is blocked after transfer has already been recorded', () => {
  assert.equal(
    getPayoutPolicy({
      userId: 'pro',
      booking: {
        handy_id: 'pro',
        status: 'completed',
        payment_status: 'captured',
        payout_status: 'transferred',
        transfer_id: 'tr_123',
      },
    }).allowed,
    false
  );
});

test('platform fee and professional payout are rounded from captured amount', () => {
  assert.deepEqual(calculatePayoutAmounts(9999), {
    platformFee: 1500,
    professionalPayout: 8499,
  });
});
