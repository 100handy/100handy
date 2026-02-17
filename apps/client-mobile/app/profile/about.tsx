import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
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
        fontWeight: '700' as const,
      }}
    >
      {title}
    </Text>
  </Pressable>
);

export default function AboutScreen() {
  const router = useRouter();

  const handleLegalNotices = () => {
    Linking.openURL('https://100handy.com/legal');
  };

  const handleTermsAndConditions = () => {
    Linking.openURL('https://100handy.com/terms');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://100handy.com/privacy');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View
          className="flex-row items-center justify-center px-4 bg-white border-b border-[#f0f0f0]"
          style={{ height: 74, paddingHorizontal: 16 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center absolute left-6"
            style={{ left: 23 }}
          >
            <ChevronLeft size={20} color="#30352d" />
            <Text
              className="text-[#30352d] ml-1"
              style={{
                fontFamily: 'Work Sans',
                fontSize: 18,
                fontWeight: '400' as const,
                marginLeft: 4,
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
              textAlign: 'center' as const,
            }}
          >
            About
          </Text>
        </View>

        {/* Separator line */}
        <View className="h-[1px] bg-[#f0f0f0]" style={{ height: 1, backgroundColor: '#f0f0f0' }} />

        <ScrollView className="flex-1">
          <View className="flex-col bg-white" style={{ paddingTop: 16 }}>
            <MenuItem title="Legal Notices" onPress={handleLegalNotices} />
            <MenuItem title="Terms & Conditions" onPress={handleTermsAndConditions} />
            <MenuItem title="Privacy Policy" onPress={handlePrivacyPolicy} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


