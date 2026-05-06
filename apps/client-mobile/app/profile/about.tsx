import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

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
    Linking.openURL('https://www.100handy.com/terms#privacy-policy');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header title="About" onBackPress={() => router.back()} showBellIcon={false} />

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

