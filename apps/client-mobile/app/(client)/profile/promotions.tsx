import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Gift, ChevronLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function PromotionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FBF4ED' }}>
      <StatusBar style="dark" />
      {/* Header */}
      <HStack
        className="px-4 py-3 items-center"
        style={{
          borderBottomColor: '#E5E7EB',
          borderBottomWidth: 1,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <ChevronLeft size={24} color="#333A31" />
          <Text className="text-lg text-[#333A31] ml-1">Profile</Text>
        </Pressable>
        <Text className="text-lg font-bold text-[#333A31] ml-8">
          Promotions
        </Text>
      </HStack>

      {/* Main Content */}
      <VStack className="flex-1 justify-center items-center px-8 space-y-6">
        <Box className="w-28 h-28 bg-white rounded-full justify-center items-center">
          <Gift size={56} color="#C1856A" />
        </Box>

        <Text
          className="text-2xl font-bold text-center"
          style={{ color: '#333A31' }}
        >
          Help your friends, Get £10
        </Text>

        <Pressable
          className="w-full py-4 rounded-full"
          style={{ backgroundColor: '#C1856A' }}
        >
          <Text className="text-white text-center font-bold text-lg">
            Refer a Friend
          </Text>
        </Pressable>
      </VStack>
    </SafeAreaView>
  );
}
