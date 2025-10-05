import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react-native';

interface MenuItemProps {
  title: string;
  onPress?: () => void;
}

const MenuItem = ({ title, onPress }: MenuItemProps) => (
  <Pressable
    className="py-5 px-6 border-b border-[#e5e5e5]"
    style={{ paddingVertical: 20, paddingHorizontal: 23 }}
    onPress={onPress}
  >
    <Text 
      className="text-[#30352d]" 
      style={{
        fontFamily: 'Work Sans',
        fontSize: 20,
        fontWeight: '700' as const
      }}
    >
      {title}
    </Text>
  </Pressable>
);

export default function AboutScreen() {
  const router = useRouter();

  const handleLegalNotices = () => {
    // Navigate to legal notices screen or open modal
    console.log('Legal Notices pressed');
  };

  const handleTermsAndConditions = () => {
    // Navigate to terms and conditions screen or open modal
    console.log('Terms & Conditions pressed');
  };

  const handlePrivacyPolicy = () => {
    // Navigate to privacy policy screen or open modal
    console.log('Privacy Policy pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack 
          className="items-center justify-center px-4 bg-white border-b border-[#f0f0f0]"
          style={{ height: 74, paddingHorizontal: 16 }}
        >
          <Pressable 
            onPress={() => router.back()} 
            className="flex-row items-center absolute left-6"
            style={{ left: 23 }}
          >
            <Icon 
              as={ChevronLeft} 
              size="sm" 
              className="text-[#30352d]" 
              style={{ width: 20, height: 20 }}
            />
            <Text 
              className="text-[#30352d] ml-1"
              style={{
                fontFamily: 'Work Sans',
                fontSize: 18,
                fontWeight: '400' as const,
                marginLeft: 4
              }}
            >
              Profile
            </Text>
          </Pressable>
          <Text 
            className="text-[#30352d]"
            style={{
              fontFamily: 'Work Sans',
              fontSize: 18,
              fontWeight: '700' as const,
              textAlign: 'center' as const
            }}
          >
            About
          </Text>
        </HStack>
        
        {/* Separator line */}
        <View className="h-[1px] bg-[#f0f0f0]" style={{ height: 1, backgroundColor: '#f0f0f0' }} />

        <ScrollView className="flex-1">
          <VStack className="bg-white" style={{ paddingTop: 16 }}>
            <MenuItem 
              title="Legal Notices" 
              onPress={handleLegalNotices}
            />
            <MenuItem 
              title="Terms & Conditions" 
              onPress={handleTermsAndConditions}
            />
            <MenuItem 
              title="Privacy Policy" 
              onPress={handlePrivacyPolicy}
            />
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}