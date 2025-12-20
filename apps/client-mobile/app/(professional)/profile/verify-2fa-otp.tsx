import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Verify2FAScreen from '@/components/auth/Verify2FAScreen';

export default function ProfessionalVerify2FAOtpScreen() {
  const params = useLocalSearchParams<{ email: string }>();

  return <Verify2FAScreen email={params.email || ''} />;
}
