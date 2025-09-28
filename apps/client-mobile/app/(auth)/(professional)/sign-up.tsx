import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Briefcase } from 'lucide-react-native';

export default function ProfessionalSignUp() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary">
      <Box className="flex-1 justify-center items-center p-6">
        <VStack className="items-center space-y-4">
          <Box className="w-16 h-16 bg-clay-orange rounded-2xl items-center justify-center shadow-lg">
            <Briefcase color="white" size={32} />
          </Box>
          <Text className="text-2xl font-worksans-bold text-text-primary">Professional Sign Up</Text>
          <Text className="text-center text-text-secondary">Coming soon...</Text>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
