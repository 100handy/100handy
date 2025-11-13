import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function BookingsTab() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(professional)/set-availability');
  }, []);

  return <View className="flex-1 bg-white" />;
}
