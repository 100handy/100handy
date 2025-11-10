import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function WorkAreaTab() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(professional)/set-work-area');
  }, []);

  return <View className="flex-1 bg-white" />;
}
