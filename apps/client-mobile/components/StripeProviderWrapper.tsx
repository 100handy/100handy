// Platform-aware Stripe Provider wrapper
import React from 'react';
import { Platform } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

interface Props {
  children: React.ReactElement;
}

export function StripeProviderWrapper({ children }: Props) {
  // Skip Stripe on web platform (Metro returns empty module for web)
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
      {children}
    </StripeProvider>
  );
}
