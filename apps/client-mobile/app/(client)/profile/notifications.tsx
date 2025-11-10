import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-sm font-semibold text-[#666666] uppercase mt-8 mb-6">
    {title}
  </Text>
);

interface NotificationToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const NotificationToggle = ({
  title,
  description,
  isEnabled,
  onToggle,
}: NotificationToggleProps) => (
  <View className="flex-row items-start justify-between py-1 mb-6">
    <View className="flex-col flex-1 mr-4">
      <Text className="text-lg font-medium text-[#333333] mb-1">{title}</Text>
      <Text className="text-base text-[#666666] leading-6">{description}</Text>
    </View>
    <View className="mt-2">
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#C1856A' }}
        thumbColor="#ffffff"
      />
    </View>
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushOffers, setPushOffers] = useState(true);
  const [textUpdates, setTextUpdates] = useState(true);
  const [emailOffers, setEmailOffers] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-6 bg-white" style={{ height: 100 }}>
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <ChevronLeft size={24} color="#333333" />
            <Text className="text-lg text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-semibold text-[#333333]">Notifications</Text>
          </View>
        </View>
        
        {/* Separator line */}
        <View className="h-[1px] bg-[#E0E0E0]" />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="flex-col px-6">
            {/* Push Notifications */}
            <View>
              <SectionHeader title="Push Notifications" />
              <NotificationToggle
                title="Task Ideas and Offers"
                description="Task recommendations and promotional offers"
                isEnabled={pushOffers}
                onToggle={setPushOffers}
              />
              <Text className="text-base text-[#666666] mb-6 leading-6">
                You'll always receive push notification updates for{"\n"}your tasks and account activity
              </Text>
            </View>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />

            {/* Text Messages */}
            <View>
              <SectionHeader title="Text Messages" />
              <NotificationToggle
                title="Task Updates"
                description="Updates from HQ or your 100 Handy"
                isEnabled={textUpdates}
                onToggle={setTextUpdates}
              />
            </View>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />

            {/* Email Notification */}
            <View>
              <SectionHeader title="Email Notification" />
              <NotificationToggle
                title="Task Ideas and Offers"
                description="Task recommendations and promotional offers"
                isEnabled={emailOffers}
                onToggle={setEmailOffers}
              />
              <Text className="text-base text-[#666666] mb-6 leading-6">
                You'll always receive push notification updates for{"\n"}your tasks and account activity
              </Text>
            </View>

            {/* Separator line */}
            <View className="h-[1px] bg-[#E0E0E0] mb-2" />
            
            {/* Test Push Notifications */}
            <View>
              <SectionHeader title="Test Push Notifications" />
              <Pressable
                className="bg-[#C1856A] rounded-full py-4 items-center mt-4"
                onPress={() => console.log('Test Push Notifications')}
              >
                <Text className="text-white text-lg font-semibold">Test Push Notifications</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
