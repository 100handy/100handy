// Platform-aware Stripe Provider wrapper
import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

interface Props {
  children: React.ReactElement;
}

export function StripeProviderWrapper({ children }: Props) {
  const executionEnvironment = Constants.executionEnvironment;
  const shouldSkipStripe =
    Platform.OS === 'web' || executionEnvironment === 'storeClient';

  // Skip Stripe on web and Expo Go. Stripe native modules are not fully supported there.
  if (shouldSkipStripe) {
    return <>{children}</>;
  }

  const { StripeProvider } = require('@stripe/stripe-react-native') as typeof import('@stripe/stripe-react-native');

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
      merchantIdentifier="merchant.com.oxdpr.handy"
    >
      {children}
    </StripeProvider>
  );
}
