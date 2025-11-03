import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';

export default function BookingsTab() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(professional)/set-availability');
  }, []);

  return <Box className="flex-1 bg-white" />;
}
