import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';

export function supportsStripeNative(): boolean {
  return Platform.OS !== 'web' && !isExpoGo;
}

export function getUnsupportedNativeFeatureMessage(feature: string): string {
  return `${feature} is not available in Expo Go. Use a development build on a device or simulator to test this flow.`;
}

export async function confirmStripePayment(
  ...args: Parameters<typeof import('@stripe/stripe-react-native').confirmPayment>
): Promise<Awaited<ReturnType<typeof import('@stripe/stripe-react-native').confirmPayment>>> {
  const stripe = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');
  return stripe.confirmPayment(...args);
}

export async function confirmStripeSetupIntent(
  ...args: Parameters<typeof import('@stripe/stripe-react-native').confirmSetupIntent>
): Promise<Awaited<ReturnType<typeof import('@stripe/stripe-react-native').confirmSetupIntent>>> {
  const stripe = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');
  return stripe.confirmSetupIntent(...args);
}

export async function initStripePaymentSheet(
  ...args: Parameters<typeof import('@stripe/stripe-react-native').initPaymentSheet>
): Promise<Awaited<ReturnType<typeof import('@stripe/stripe-react-native').initPaymentSheet>>> {
  const stripe = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');
  return stripe.initPaymentSheet(...args);
}

export async function presentStripePaymentSheet(
  ...args: Parameters<typeof import('@stripe/stripe-react-native').presentPaymentSheet>
): Promise<Awaited<ReturnType<typeof import('@stripe/stripe-react-native').presentPaymentSheet>>> {
  const stripe = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');
  return stripe.presentPaymentSheet(...args);
}

export async function presentStripeIdentityVerificationSheet(
  ...args: Parameters<typeof import('@stripe/stripe-identity-react-native').presentIdentityVerificationSheet>
): Promise<Awaited<ReturnType<typeof import('@stripe/stripe-identity-react-native').presentIdentityVerificationSheet>>> {
  const stripeIdentity = require('@stripe/stripe-identity-react-native') as typeof import('@stripe/stripe-identity-react-native');
  return stripeIdentity.presentIdentityVerificationSheet(...args);
}
